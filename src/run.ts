// src/run.ts
import type { BaseCallbackHandler, CallbackHandlerMethods } from '@langchain/core/callbacks/base';
import type { BaseMessage, MessageContentComplex } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';
import type { ClientCallbacks, SystemCallbacks } from '@/graphs/Graph';
import type * as t from '@/types';
import { GraphEvents, Providers, Callback } from '@/common';
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
  returnContent: boolean = false;

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

    this.returnContent = config.returnContent ?? false;
  }

  private createStandardGraph(config: t.StandardGraphConfig): t.CompiledWorkflow<t.IState, Partial<t.IState>, string> {
    const { runId, llmConfig, instructions, additional_instructions, tools = [] } = config;
    const { provider, ...clientOptions } = llmConfig;

    const standardGraph = new StandardGraph({
      runId,
      tools,
      provider,
      instructions,
      clientOptions,
      additional_instructions,
    });
    this.Graph = standardGraph;
    return standardGraph.createWorkflow();
  }

  static async create<T extends t.BaseGraphState>(config: t.RunConfig): Promise<Run<T>> {
    return new Run<T>(config);
  }

  getRunMessages(): BaseMessage[] | undefined {
    if (!this.Graph) {
      throw new Error('Graph not initialized. Make sure to use Run.create() to instantiate the Run.');
    }
    return this.Graph.getRunMessages();
  }

  async processStream(
    inputs: t.IState,
    config: Partial<RunnableConfig> & { version: 'v1' | 'v2' },
    clientCallbacks?: ClientCallbacks,
  ): Promise<MessageContentComplex[] | undefined> {
    if (!this.graphRunnable) {
      throw new Error('Run not initialized. Make sure to use Run.create() to instantiate the Run.');
    }
    if (!this.Graph) {
      throw new Error('Graph not initialized. Make sure to use Run.create() to instantiate the Run.');
    }

    this.Graph.resetValues();
    const provider = this.Graph.provider;
    const hasTools = this.Graph.tools ? this.Graph.tools.length > 0 : false;
    if (clientCallbacks) {
      /* TODO: conflicts with callback manager */
      const callbacks = config.callbacks as (BaseCallbackHandler | CallbackHandlerMethods)[] || [];
      config.callbacks = callbacks.concat(this.getCallbacks(clientCallbacks));
    }
    const stream = this.graphRunnable.streamEvents(inputs, config);

    for await (const event of stream) {
      const { data, name, metadata, ...info } = event;

      let eventName: t.EventName = info.event;
      const isDoubleCallProvider = provider === Providers.ANTHROPIC || provider === Providers.BEDROCK;
      if (hasTools && isDoubleCallProvider && eventName === GraphEvents.CHAT_MODEL_STREAM) {
        /* Skipping CHAT_MODEL_STREAM event for Anthropic due to double-call edge case */
        continue;
      }

      if (eventName && eventName === GraphEvents.ON_CUSTOM_EVENT) {
        eventName = name;
      }

      // console.log(`Event: ${event.event} | Executing Event: ${eventName}`);

      const handler = this.handlerRegistry.getHandler(eventName);
      if (handler) {
        handler.handle(eventName, data, metadata, this.Graph);
      }
    }

    if (this.returnContent) {
      return this.Graph.getContentParts();
    }
  }

  private createSystemCallback<K extends keyof ClientCallbacks>(
    clientCallbacks: ClientCallbacks,
    key: K
  ): SystemCallbacks[K] {
    return ((...args: unknown[]) => {
      const clientCallback = clientCallbacks[key];
      if (clientCallback && this.Graph) {
        (clientCallback as (...args: unknown[]) => void)(this.Graph, ...args);
      }
    }) as SystemCallbacks[K];
  }

  getCallbacks(clientCallbacks: ClientCallbacks): SystemCallbacks {
    return {
      [Callback.TOOL_ERROR]: this.createSystemCallback(clientCallbacks, Callback.TOOL_ERROR),
      [Callback.TOOL_START]: this.createSystemCallback(clientCallbacks, Callback.TOOL_START),
      [Callback.TOOL_END]: this.createSystemCallback(clientCallbacks, Callback.TOOL_END),
    };
  }
}
