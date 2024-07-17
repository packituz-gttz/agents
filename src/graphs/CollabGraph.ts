// src/graphs/CollabGraph.ts
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { END, StateGraphArgs, START, StateGraph, MemorySaver } from '@langchain/langgraph';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import type { StructuredTool } from '@langchain/core/tools';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { JsonOutputToolsParser } from 'langchain/output_parsers';
import { Providers } from '@/common';
import { getChatModelClass } from '@/llm/providers';
import { Graph } from './Graph';
import type * as t from '@/types';
import { supervisorPrompt } from '@/prompts/collab';

export interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
  [key: string]: any;
}

export interface Member {
  name: string;
  systemPrompt: string;
  tools: any[];
  llmConfig: t.LLMConfig;
}

interface SupervisorConfig {
  systemPrompt?: string;
  llmConfig: t.LLMConfig;
}

export class CollabGraph extends Graph<AgentStateChannels, string> {
  private graph: t.CompiledWorkflow<AgentStateChannels, Partial<AgentStateChannels>, string> | null = null;
  private members: Member[];
  private supervisorConfig: SupervisorConfig;
  private supervisorChain: Runnable | null = null;

  constructor(members: Member[], supervisorConfig: SupervisorConfig) {
    super();
    this.members = members;
    this.supervisorConfig = supervisorConfig;
  }

  async initialize(): Promise<void> {
    const memberNames = this.members.map(member => member.name);
    const systemPrompt = this.supervisorConfig.systemPrompt || supervisorPrompt;
    const options = [END, ...memberNames];
    this.supervisorChain = await this.createSupervisorChain(systemPrompt, options);
  }

  createGraphState(): StateGraphArgs<AgentStateChannels>['channels'] {
    return {
      messages: {
        value: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
        default: () => [],
      },
      next: {
        value: (x?: string, y?: string) => y ?? x ?? END,
        default: () => END,
      },
    };
  }

  initializeTools(tools: StructuredTool[]): any {
    // This method is not used in the collaborative graph
    return null;
  }

  initializeModel(provider: Providers, clientOptions: Record<string, unknown>, tools: any[]) {
    const LLMClass = getChatModelClass(provider);
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    return new LLMClass(clientOptions);
  }

  createCallModel(boundModel: any) {
    // This method is not directly used in the collaborative graph
    return async (state: AgentStateChannels, config?: RunnableConfig) => {
      return { messages: [] };
    };
  }

  private async createAgent(
    llmConfig: t.LLMConfig,
    tools: any[],
    systemPrompt: string
  ): Promise<AgentExecutor> {
    const { provider, ...clientOptions } = llmConfig;
    const LLMClass = getChatModelClass(provider);
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    const llm = new LLMClass(clientOptions);

    const prompt = await ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);
    const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
    return new AgentExecutor({ agent, tools });
  }

  createWorkflow(
    graphState: StateGraphArgs<AgentStateChannels>['channels'],
    callModel?: any,
    toolNode?: any
  ): t.CompiledWorkflow<AgentStateChannels, Partial<AgentStateChannels>, string> {
    if (!this.supervisorChain) {
      throw new Error('CollabGraph not initialized. Call initialize() first.');
    }

    const workflow = new StateGraph<AgentStateChannels, Partial<AgentStateChannels>, string>({
      channels: graphState,
    });

    // Dynamically create agents and add nodes for each member
    for (const member of this.members) {
      const node = async (
        state: AgentStateChannels,
        config?: RunnableConfig,
      ) => {
        const agent = await this.createAgent(member.llmConfig, member.tools, member.systemPrompt);
        const agentPromise = agent.invoke(state, config);

        // Store the promise in the state
        await this.graph?.updateState(config ?? {}, {
          [`${member.name}Promise`]: agentPromise,
        });

        const result = await agentPromise;
        return {
          messages: [
            new HumanMessage({ content: result.output, name: member.name }),
          ],
        };
      };
      workflow.addNode(member.name, node);
      workflow.addEdge(member.name, 'supervisor');
    }

    const supervisorNode = async (
      state: AgentStateChannels,
      config?: RunnableConfig,
    ) => {
      // Get the current state
      const currentState = await this.graph?.getState(config ?? {});

      // Wait for all member promises to resolve
      const memberPromises = this.members.map(member => currentState?.[`${member.name}Promise` as keyof typeof currentState]);
      await Promise.all(memberPromises);

      // Clear the promises for the next iteration
      for (const member of this.members) {
        await this.graph?.updateState(config ?? {}, {
          [`${member.name}Promise`]: undefined,
        });
      }

      const result = await this.supervisorChain?.invoke(state, config);
      return result;
    };

    workflow.addNode('supervisor', supervisorNode);

    workflow.addConditionalEdges(
      'supervisor',
      (x: AgentStateChannels) => x.next,
    );

    workflow.addEdge(START, 'supervisor');

    const memory = new MemorySaver();
    this.graph = workflow.compile({ checkpointer: memory });
    return this.graph;
  }

  private async createSupervisorChain(systemPrompt: string, options: string[]): Promise<Runnable> {
    const functionDef = {
      name: 'route',
      description: 'Select the next role.',
      parameters: {
        title: 'routeSchema',
        type: 'object',
        properties: {
          next: {
            title: 'Next',
            anyOf: [
              { enum: options },
            ],
          },
        },
        required: ['next'],
      },
    };

    const toolDef = {
      type: 'function',
      function: functionDef,
    } as const;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('messages'),
      [
        'system',
        'Given the conversation above, who should act next?' +
        ' Or should we FINISH? Select one of: {options}',
      ],
    ]);

    const formattedPrompt = await prompt.partial({
      options: options.join(', '),
      members: this.members.map(m => m.name).join(', '),
    });

    const { provider, ...clientOptions } = this.supervisorConfig.llmConfig;
    const LLMClass = getChatModelClass(provider);
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider for supervisor: ${provider}`);
    }
    const llm = new LLMClass(clientOptions);

    return formattedPrompt
      .pipe(llm.bindTools(
        [toolDef],
        {
          tool_choice: { type: 'function', function: { name: 'route' } } as any,
        },
      ))
      .pipe(new JsonOutputToolsParser())
      .pipe((x: any) => (x[0].args));
  }
}
