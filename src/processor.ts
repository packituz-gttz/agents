// src/processor.ts
import { BaseMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";
import type { Providers } from '@/common';
import type * as t from '@/types';
import { TaskManager, TaskManagerStateChannels } from './graphs/TaskManager';
import { CollabGraph } from './graphs/CollabGraph';
import { StandardGraph } from './graphs/Graph';
import { HandlerRegistry } from '@/stream';

export class Processor<T extends t.IState | t.AgentStateChannels | TaskManagerStateChannels> {
  graph?: t.CompiledWorkflow<T, Partial<T>, string>;
  private collab!: CollabGraph;
  private taskManager!: TaskManager;
  private handlerRegistry: HandlerRegistry;
  provider: Providers | undefined;

  private constructor(config: t.ProcessorConfig) {
    this.handlerRegistry = new HandlerRegistry();

    if (config.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        this.handlerRegistry.register(eventType, handler);
      }
    }

    if (config.graphConfig.type === 'standard') {
      this.provider = config.graphConfig.llmConfig.provider;
      const standardGraph = new StandardGraph();
      this.graph = this.createStandardGraph(standardGraph, config.graphConfig) as any;
    } else if (config.graphConfig.type === 'collaborative') {
      this.provider = config.graphConfig.supervisorConfig.llmConfig.provider;
      this.collab = new CollabGraph(
        config.graphConfig.members,
        config.graphConfig.supervisorConfig
      );
    } else if (config.graphConfig.type === 'taskmanager') {
      this.provider = config.graphConfig.supervisorConfig.llmConfig.provider;
      this.taskManager = new TaskManager(
        config.graphConfig.members,
        config.graphConfig.supervisorConfig
      );
    }
  }

  private createStandardGraph(standardGraph: StandardGraph, config: t.StandardGraphConfig): t.CompiledWorkflow<t.IState, Partial<t.IState>, string> {
    const { llmConfig, tools = [] } = config;
    const { provider, ...clientOptions } = llmConfig;

    const graphState = standardGraph.createGraphState();
    const toolNode = standardGraph.initializeTools(tools);
    const boundModel = standardGraph.initializeModel(provider, clientOptions, tools);
    const callModel = standardGraph.createCallModel(boundModel);
    return standardGraph.createWorkflow(graphState, callModel, toolNode);
  }

  static async create<T extends t.IState | t.AgentStateChannels | TaskManagerStateChannels = t.IState>(config: t.ProcessorConfig): Promise<Processor<T>> {
    const processor = new Processor<T>(config);
    if (config.graphConfig.type === 'collaborative') {
      await processor.collab.initialize();
      const graphState = processor.collab.createGraphState();
      processor.graph = processor.collab.createWorkflow(graphState) as any;
    } else if (config.graphConfig.type === 'taskmanager') {
      await processor.taskManager.initialize();
      const graphState = processor.taskManager.createGraphState();
      processor.graph = processor.taskManager.createWorkflow(graphState) as any;
    }
    return processor;
  }

  async processStream(
    inputs: { 
      messages: BaseMessage[]; 
      instructions?: string; 
      additional_instructions?: string;
    },
    config: Partial<RunnableConfig> & { version: "v1" | "v2" },
  ) {
    if (!this.graph) {
      throw new Error("Processor not initialized. Make sure to use Processor.create() to instantiate the Processor.");
    }
    const stream = this.graph.streamEvents(inputs, config);
    for await (const event of stream) {
      const handler = this.handlerRegistry.getHandler(event.event);
      if (handler) {
        handler.handle(event.event, event.data);
      }
    }
  }
}
