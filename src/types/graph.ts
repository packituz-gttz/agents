// src/types/graph.ts
import type { StateGraphArgs, StateGraph, CompiledStateGraph } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

export interface IState {
  messages: BaseMessage[];
}

export interface EventHandler {
  handle(event: string, data: StreamEventData): void;
}

export type GraphState = StateGraphArgs<IState>["channels"];

export type Workflow<T extends IState = IState, U extends Partial<T> = Partial<T>, N extends string = string> = StateGraph<T, U, N>;

export type CompiledWorkflow<T extends IState = IState, U extends Partial<T> = Partial<T>, N extends string = string> = CompiledStateGraph<T, U, N>;

export type EventStreamCallbackHandlerInput = Parameters<CompiledWorkflow['streamEvents']>[2] extends Omit<infer T, "autoClose"> ? T : never;


/**
 * Data associated with a StreamEvent.
 */
export type StreamEventData = {
    /**
     * The input passed to the runnable that generated the event.
     * Inputs will sometimes be available at the *START* of the runnable, and
     * sometimes at the *END* of the runnable.
     * If a runnable is able to stream its inputs, then its input by definition
     * won't be known until the *END* of the runnable when it has finished streaming
     * its inputs.
     */
    input?: any;
    /**
     * The output of the runnable that generated the event.
     * Outputs will only be available at the *END* of the runnable.
     * For most runnables, this field can be inferred from the `chunk` field,
     * though there might be some exceptions for special cased runnables (e.g., like
     * chat models), which may return more information.
     */
    output?: any;
    /**
     * A streaming chunk from the output that generated the event.
     * chunks support addition in general, and adding them up should result
     * in the output of the runnable that generated the event.
     */
    chunk?: any;
};
/**
 * A streaming event.
 *
 * Schema of a streaming event which is produced from the streamEvents method.
 */
export type StreamEvent = {
    /**
     * Event names are of the format: on_[runnable_type]_(start|stream|end).
     *
     * Runnable types are one of:
     * - llm - used by non chat models
     * - chat_model - used by chat models
     * - prompt --  e.g., ChatPromptTemplate
     * - tool -- LangChain tools
     * - chain - most Runnables are of this type
     *
     * Further, the events are categorized as one of:
     * - start - when the runnable starts
     * - stream - when the runnable is streaming
     * - end - when the runnable ends
     *
     * start, stream and end are associated with slightly different `data` payload.
     *
     * Please see the documentation for `EventData` for more details.
     */
    event: string;
    /** The name of the runnable that generated the event. */
    name: string;
    /**
     * An randomly generated ID to keep track of the execution of the given runnable.
     *
     * Each child runnable that gets invoked as part of the execution of a parent runnable
     * is assigned its own unique ID.
     */
    run_id: string;
    /**
     * Tags associated with the runnable that generated this event.
     * Tags are always inherited from parent runnables.
     */
    tags?: string[];
    /** Metadata associated with the runnable that generated this event. */
    metadata: Record<string, any>;
    /**
     * Event data.
     *
     * The contents of the event data depend on the event type.
     */
    data: StreamEventData;
};