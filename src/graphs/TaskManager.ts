// src/graphs/TaskManager.ts
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { END, StateGraphArgs, START, StateGraph, MemorySaver } from "@langchain/langgraph";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import type { StructuredTool } from "@langchain/core/tools";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { JsonOutputToolsParser } from "langchain/output_parsers";
import { Providers } from '@/common';
import { getChatModelClass } from '@/llm/providers';
import { Graph } from './Graph';
import type * as t from '@/types';
import { taskManagerPrompt, taskManagerFunctionDescription, taskManagerFunctionParameters } from "@/prompts/taskmanager";

export interface TaskManagerStateChannels {
  messages: BaseMessage[];
  tasks: Task[];
  completedTasks: string[];
  next: string;
}

export interface Task {
  member: string;
  description: string;
  tool?: string;
}

export interface TaskMember {
  name: string;
  systemPrompt: string;
  tools: StructuredTool[];
  llmConfig: t.LLMConfig;
}

interface SupervisorConfig {
  systemPrompt?: string;
  llmConfig: t.LLMConfig;
}

export class TaskManager extends Graph<TaskManagerStateChannels, string> {
  private graph: t.CompiledWorkflow<TaskManagerStateChannels, Partial<TaskManagerStateChannels>, string> | null = null;
  private members: TaskMember[];
  private supervisorConfig: SupervisorConfig;
  private supervisorChain: Runnable | null = null;

  constructor(members: TaskMember[], supervisorConfig: SupervisorConfig) {
    super();
    this.members = members;
    this.supervisorConfig = supervisorConfig;
  }

  async initialize(): Promise<void> {
    const memberNames = this.members.map(member => member.name);
    const systemPrompt = this.supervisorConfig.systemPrompt || taskManagerPrompt;
    this.supervisorChain = await this.createSupervisorChain(systemPrompt, memberNames);
  }

  createGraphState(): StateGraphArgs<TaskManagerStateChannels>['channels'] {
    return {
      messages: {
        value: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
        default: () => [],
      },
      tasks: {
        value: (x?: Task[], y?: Task[]) => y ?? x ?? [],
        default: () => [],
      },
      completedTasks: {
        value: (x?: string[], y?: string[]) => [...new Set([...(x ?? []), ...(y ?? [])])],
        default: () => [],
      },
      next: {
        value: (x?: string, y?: string) => y ?? x ?? END,
        default: () => END,
      },
    };
  }

  private async createAgent(
    llmConfig: t.LLMConfig,
    tools: StructuredTool[],
    systemPrompt: string
  ): Promise<AgentExecutor> {
    const { provider, ...clientOptions } = llmConfig;
    const LLMClass = getChatModelClass(provider);
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    const llm = new LLMClass(clientOptions);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);
    const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
    return new AgentExecutor({ agent, tools });
  }

  createWorkflow(
    graphState: StateGraphArgs<TaskManagerStateChannels>['channels'],
    callModel?: any,
  ): t.CompiledWorkflow<TaskManagerStateChannels, Partial<TaskManagerStateChannels>, string> {
    if (!this.supervisorChain) {
      throw new Error("TaskManager not initialized. Call initialize() first.");
    }

    const workflow = new StateGraph<TaskManagerStateChannels, Partial<TaskManagerStateChannels>, string>({
      channels: graphState,
    });

    const supervisorNode = async (
      state: TaskManagerStateChannels,
      config?: RunnableConfig,
    ) => {
      const result = await this.supervisorChain?.invoke(state, config) as { action: string, tasks?: Task[] };
      console.log("Supervisor Node Output:", result);

      if (result.action === "end") {
        return { next: END };
      }

      const newTasks = (result.tasks || []).filter(task => 
        !state.completedTasks.includes(`${task.member}:${task.description}`)
      );

      return {
        tasks: newTasks,
        next: newTasks.length > 0 ? "execute_tasks" : END,
      };
    };

    const executeTasksNode = async (
      state: TaskManagerStateChannels,
      config?: RunnableConfig,
    ) => {
      const results: BaseMessage[] = [];
      const completedTasks: string[] = [];

      for (const task of state.tasks) {
        const member = this.members.find(m => m.name === task.member);
        if (!member) {
          throw new Error(`TaskMember ${task.member} not found`);
        }

        const agent = await this.createAgent(member.llmConfig, member.tools, member.systemPrompt);
        const taskMessage = new HumanMessage(`Task: ${task.description}${task.tool ? ` Use the ${task.tool} tool.` : ''}`);
        const result = await agent.invoke({
          input: taskMessage.content,
          chat_history: state.messages,
        }, config);

        results.push(new AIMessage({ content: result.output, name: task.member }));
        completedTasks.push(`${task.member}:${task.description}`);
      }

      return {
        messages: state.messages.concat(results),
        completedTasks: state.completedTasks.concat(completedTasks),
        tasks: [],
        next: "supervisor",
      };
    };

    workflow.addNode("supervisor", supervisorNode);
    workflow.addNode("execute_tasks", executeTasksNode);

    workflow.addEdge(START, "supervisor");
    workflow.addConditionalEdges(
      "supervisor",
      (x: TaskManagerStateChannels) => x.next,
    );
    workflow.addEdge("execute_tasks", "supervisor");

    const memory = new MemorySaver();
    this.graph = workflow.compile({ checkpointer: memory });
    return this.graph;
  }

  private async createSupervisorChain(systemPrompt: string, memberNames: string[]): Promise<Runnable> {
    const functionDef = {
      name: "assign_tasks",
      description: taskManagerFunctionDescription,
      parameters: taskManagerFunctionParameters,
    };

    const toolDef = {
      type: "function",
      function: functionDef,
    } as const;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
      new MessagesPlaceholder("completedTasks"),
      [
        "human",
        "Based on the conversation above and the completed tasks, specify 'tasks' to assign new tasks or 'end' if the user's request is fulfilled. Assign only the most essential tasks to minimize the number of turns. Do not repeat tasks that have already been completed.",
      ],
    ]);

    const formattedPrompt = await prompt.partial({
      members: memberNames.join(", "),
    });

    const { provider, ...clientOptions } = this.supervisorConfig.llmConfig;
    const LLMClass = getChatModelClass(provider);
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider for supervisor: ${provider}`);
    }
    const llm = new LLMClass(clientOptions);

    return formattedPrompt
      .pipe(llm.bindTools([toolDef]))
      .pipe(new JsonOutputToolsParser())
      .pipe((x: any) => x[0].args);
  }
}
