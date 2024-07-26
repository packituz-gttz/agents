// src/run.ts
import { BaseMessage } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';
import type { Providers } from '@/common';
import type * as t from '@/types';
import { GraphEvents, CommonEvents } from '@/common';
import { StandardGraph } from '@/graphs/Graph';
import { HandlerRegistry } from '@/events';

export class Run<T extends t.BaseGraphState> {
  graphRunnable?: t.CompiledWorkflow<T, Partial<T>, string>;
  // private collab!: CollabGraph;
  // private taskManager!: TaskManager;
  private handlerRegistry: HandlerRegistry;
  private Graph: StandardGraph | undefined;
  provider: Providers | undefined;
  run_id: string | undefined;

  private constructor(config: t.RunConfig) {
    const handlerRegistry = new HandlerRegistry();

    if (config.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        handlerRegistry.register(eventType, handler);
      }
    }

    this.handlerRegistry = handlerRegistry;

    if (config.graphConfig.type === 'standard' || !config.graphConfig.type) {
      this.provider = config.graphConfig.llmConfig.provider;
      this.graphRunnable = this.createStandardGraph(config.graphConfig) as unknown as t.CompiledWorkflow<T, Partial<T>, string>;
      if (this.Graph) {
        this.Graph.handlerRegistry = handlerRegistry;
      }
    }
  }

  private createStandardGraph(config: t.StandardGraphConfig): t.CompiledWorkflow<t.IState, Partial<t.IState>, string> {
    const { llmConfig, tools = [] } = config;
    const { provider, ...clientOptions } = llmConfig;

    const standardGraph = new StandardGraph(provider, clientOptions, tools);
    this.Graph = standardGraph;
    return standardGraph.createWorkflow();
  }

  static async create<T extends t.BaseGraphState>(config: t.RunConfig): Promise<Run<T>> {
    return new Run<T>(config);
  }

  async processStream(
    inputs: t.IState,
    config: Partial<RunnableConfig> & { version: 'v1' | 'v2' },
  ): Promise<BaseMessage | undefined> {
    if (!this.graphRunnable) {
      throw new Error('Run not initialized. Make sure to use Run.create() to instantiate the Run.');
    }
    if (!this.Graph) {
      throw new Error('Graph not initialized. Make sure to use Run.create() to instantiate the Run.');
    }

    this.Graph.resetValues();
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

      // console.log(`Event: ${event.event} | Executing Event: ${eventName}`);

      const handler = this.handlerRegistry.getHandler(eventName);
      if (handler) {
        handler.handle(eventName, data, metadata, this.Graph);
      }
    }

    return this.Graph.getFinalMessage();
  }
}
