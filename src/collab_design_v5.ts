// src/collab_design_v4.ts
import "dotenv/config";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { JsonOutputToolsParser } from "langchain/output_parsers";
import { HandlerRegistry } from '@/stream';
import { ChatOpenAI } from "@langchain/openai";
import { ChatBedrockConverse } from "@langchain/aws";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BedrockChat } from "@langchain/community/chat_models/bedrock/web";
import { supervisorPrompt } from "@/prompts/collab";
import { Providers } from '@/common';

export interface Member {
  name: string;
  systemPrompt: string;
  tools: any[];
  llmConfig: LLMConfig;
}

interface LLMConfig {
  provider: Providers;
  [key: string]: any;
}

interface SupervisorConfig {
  systemPrompt?: string;
  llmConfig: LLMConfig;
}

const llmProviders: Record<Providers, any> = {
  [Providers.OPENAI]: ChatOpenAI,
  [Providers.VERTEXAI]: ChatVertexAI,
  [Providers.BEDROCK]: BedrockChat,
  [Providers.MISTRALAI]: ChatMistralAI,
  [Providers.AWS]: ChatBedrockConverse,
  [Providers.ANTHROPIC]: ChatAnthropic,
};

interface State {
  messages: BaseMessage[];
  activeAgents: Set<string>;
}

interface AgentResult {
  agentName: string;
  output: string;
}

class Supervisor {
  private llm: Runnable;
  private prompt: ChatPromptTemplate;

  constructor(private config: SupervisorConfig, private agentNames: string[]) {
    const { provider, ...clientOptions } = this.config.llmConfig;
    const LLMClass = llmProviders[provider];
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider for supervisor: ${provider}`);
    }
    this.llm = new LLMClass(clientOptions);

    this.prompt = ChatPromptTemplate.fromMessages([
      ["system", this.config.systemPrompt || supervisorPrompt],
      new MessagesPlaceholder("messages"),
      [
        "system",
        "Given the conversation above, who should act next? You can select multiple agents to act in parallel, or FINISH if the task is complete. Available agents: {agents}",
      ],
    ]);
  }

  async decide(state: State): Promise<{ nextAgents: string[], isFinished: boolean }> {
    const formattedPrompt = await this.prompt.formatMessages({
      messages: state.messages,
      agents: this.agentNames.join(", "),
      members: this.agentNames.join(", "), // Add this line
    });

    const result = await this.llm.invoke(formattedPrompt);
    const content = result.content as string;
    
    if (content.toLowerCase().includes("finish")) {
      return { nextAgents: [], isFinished: true };
    }

    const nextAgents = this.agentNames.filter(name => content.toLowerCase().includes(name.toLowerCase()));
    return { nextAgents, isFinished: false };
  }
}


export class CollaborativeProcessor {
  private agents: Map<string, AgentExecutor> = new Map();
  private supervisor: Supervisor;
  private handlerRegistry: HandlerRegistry;

  constructor(
    private members: Member[],
    supervisorConfig: SupervisorConfig,
    customHandlers?: Record<string, any>
  ) {
    this.supervisor = new Supervisor(supervisorConfig, members.map(m => m.name));
    this.handlerRegistry = new HandlerRegistry();
    if (customHandlers) {
      for (const [eventType, handler] of Object.entries(customHandlers)) {
        this.handlerRegistry.register(eventType, handler);
      }
    }
  }

  async initialize(): Promise<void> {
    await Promise.all(this.members.map(async member => {
      const agent = await this.createAgent(member);
      this.agents.set(member.name, agent);
    }));
  }

  private async createAgent(member: Member): Promise<AgentExecutor> {
    const { provider, ...clientOptions } = member.llmConfig;
    const LLMClass = llmProviders[provider];
    if (!LLMClass) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    const llm = new LLMClass(clientOptions);

    const prompt = await ChatPromptTemplate.fromMessages([
      ["system", member.systemPrompt],
      new MessagesPlaceholder("messages"),
      new MessagesPlaceholder("agent_scratchpad"),
    ]);
    const agent = await createOpenAIToolsAgent({ llm, tools: member.tools, prompt });
    return new AgentExecutor({ agent, tools: member.tools });
  }

  async processParallel(inputs: { messages: BaseMessage[] }, config?: RunnableConfig): Promise<void> {
    let currentState: State = { messages: inputs.messages, activeAgents: new Set<string>() };

    while (true) {
      const { nextAgents, isFinished } = await this.supervisor.decide(currentState);

      if (isFinished) break;

      const agentPromises = nextAgents.map(agentName => 
        this.executeAgent(agentName, currentState.messages, config)
      );

      const results = await Promise.all(agentPromises);

      currentState = this.updateState(currentState, results);

      // Emit events for each agent result
      results.forEach(result => {
        this.handlerRegistry.getHandler('agentResponse')?.handle('agentResponse', {
          agentName: result.agentName,
          response: result.output
        });
      });
    }

    // Emit event for process completion
    this.handlerRegistry.getHandler('processComplete')?.handle('processComplete', {
      finalMessages: currentState.messages
    });
  }

  private async executeAgent(agentName: string, messages: BaseMessage[], config?: RunnableConfig): Promise<AgentResult> {
    const agent = this.agents.get(agentName);
    if (!agent) throw new Error(`Agent ${agentName} not found`);

    const result = await agent.invoke({ messages }, config);
    return { agentName, output: result.output };
  }

  private updateState(currentState: State, results: AgentResult[]): State {
    const newMessages = results.map(r => new HumanMessage({ content: r.output, name: r.agentName }));
    return {
      messages: [...currentState.messages, ...newMessages],
      activeAgents: new Set(results.map(r => r.agentName))
    };
  }
}
