// src/processor.ts
import { BaseMessage } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';
import type { Providers } from '@/common';
import type * as t from '@/types';
import { GraphEvents, CommonEvents } from '@/common';
import { TaskManager } from '@/graphs/TaskManager';
import { CollabGraph } from '@/graphs/CollabGraph';
import { StandardGraph } from '@/graphs/Graph';
import { HandlerRegistry } from '@/stream';

export class Processor<T extends t.BaseGraphState> {
  graphRunnable?: t.CompiledWorkflow<T, Partial<T>, string>;
  private collab!: CollabGraph;
  private taskManager!: TaskManager;
  private handlerRegistry: HandlerRegistry;
  private Graph: StandardGraph | undefined;
  provider: Providers | undefined;
  run_id: string | undefined;

  private constructor(config: t.ProcessorConfig) {
    const handlerRegistry = new HandlerRegistry();

    if (config.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        handlerRegistry.register(eventType, handler);
      }
    }

    this.handlerRegistry = handlerRegistry;

    if (config.graphConfig.type === 'standard') {
      this.provider = config.graphConfig.llmConfig.provider;
      this.graphRunnable = this.createStandardGraph(config.graphConfig) as unknown as t.CompiledWorkflow<T, Partial<T>, string>;
      if (this.Graph) {
        this.Graph.handlerRegistry = handlerRegistry;
      }
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

  private createStandardGraph(config: t.StandardGraphConfig): t.CompiledWorkflow<t.IState, Partial<t.IState>, string> {
    const { llmConfig, tools = [] } = config;
    const { provider, ...clientOptions } = llmConfig;

    const standardGraph = new StandardGraph(provider, clientOptions, tools);
    this.Graph = standardGraph;
    return standardGraph.createWorkflow();
  }

  static async create<T extends t.BaseGraphState>(config: t.ProcessorConfig): Promise<Processor<T>> {
    const processor = new Processor<T>(config);
    if (config.graphConfig.type === 'collaborative') {
      await processor.collab.initialize();
      const graphState = processor.collab.createGraphState();
      processor.graphRunnable = processor.collab.createWorkflow(graphState) as unknown as t.CompiledWorkflow<T, Partial<T>, string>;
    } else if (config.graphConfig.type === 'taskmanager') {
      await processor.taskManager.initialize();
      const graphState = processor.taskManager.createGraphState();
      processor.graphRunnable = processor.taskManager.createWorkflow(graphState) as unknown as t.CompiledWorkflow<T, Partial<T>, string>;
    }
    return processor;
  }

  async processStream(
    inputs: t.IState,
    config: Partial<RunnableConfig> & { version: 'v1' | 'v2' },
  ): Promise<BaseMessage | undefined> {
    if (!this.graphRunnable) {
      throw new Error('Processor not initialized. Make sure to use Processor.create() to instantiate the Processor.');
    }
    if (!this.Graph) {
      throw new Error('Graph not initialized. Make sure to use Processor.create() to instantiate the Processor.');
    }
    const stream = this.graphRunnable.streamEvents(inputs, config);
    for await (const event of stream) {
      const { data, name, metadata, ...info } = event;

      let eventName: t.EventName = info.event;
      if (eventName && eventName === GraphEvents.ON_CUSTOM_EVENT) {
        eventName = name;
      }
      if (name === CommonEvents.LANGGRAPH && !this.run_id && info.run_id) {
        this.run_id = info.run_id;
      }

      const handler = this.handlerRegistry.getHandler(eventName);
      if (handler) {
        handler.handle(eventName, data, metadata, this.Graph);
      }
    }
    return this.Graph.getFinalMessage();
  }
}
