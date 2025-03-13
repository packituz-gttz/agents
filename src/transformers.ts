import { Runnable, RunnableLambda } from "@langchain/core/runnables";
import type { BaseDocumentTransformer } from "@langchain/core/documents";
import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import {
  AIMessage,
  ToolMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
  AIMessageChunk,
  FunctionMessage,
  ChatMessageChunk,
  ToolMessageChunk,
  HumanMessageChunk,
  SystemMessageChunk,
  isBaseMessageChunk,
  defaultTextSplitter,
  FunctionMessageChunk,
} from "@langchain/core/messages";
import type {
  BaseMessage,
  MessageType,
  BaseMessageChunk,
  BaseMessageFields,
  MessageTypeOrClass,
  AIMessageChunkFields,
  ChatMessageFieldsWithRole,
  FunctionMessageFieldsWithName,
  ToolMessageFieldsWithToolCallId,
} from "@langchain/core/messages";

const _isMessageType = (msg: BaseMessage, types: MessageTypeOrClass[]) => {
  const typesAsStrings = [
    ...new Set<string>(
      types?.map((t) => {
        if (typeof t === "string") {
          return t;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instantiatedMsgClass = new (t as any)({});
        if (
          !("getType" in instantiatedMsgClass) ||
          typeof instantiatedMsgClass.getType !== "function"
        ) {
          throw new Error("Invalid type provided.");
        }
        return instantiatedMsgClass.getType();
      })
    ),
  ];
  const msgType = msg.getType();
  return typesAsStrings.some((t) => t === msgType);
};

// Since we can not import from `@langchain/textsplitters` we need
// to reconstruct the interface here.
interface _TextSplitterInterface extends BaseDocumentTransformer {
  splitText(text: string): Promise<string[]>;
}

export interface TrimMessagesFields {
  /**
   * @param {number} maxTokens Max token count of trimmed messages.
   */
  maxTokens: number;
  /**
   * @param {((messages: BaseMessage[]) => number) | ((messages: BaseMessage[]) => Promise<number>) | BaseLanguageModel} tokenCounter
   * Function or LLM for counting tokens in an array of `BaseMessage`s.
   * If a `BaseLanguageModel` is passed in then `BaseLanguageModel.getNumTokens()` will be used.
   */
  tokenCounter:
    | ((messages: BaseMessage[]) => number)
    | ((messages: BaseMessage[]) => Promise<number>)
    | BaseLanguageModel;
  /**
   * @param {"first" | "last"} [strategy="last"] Strategy for trimming.
   * - "first": Keep the first <= n_count tokens of the messages.
   * - "last": Keep the last <= n_count tokens of the messages.
   * @default "last"
   */
  strategy?: "first" | "last";
  /**
   * @param {boolean} [allowPartial=false] Whether to split a message if only part of the message can be included.
   * If `strategy: "last"` then the last partial contents of a message are included.
   * If `strategy: "first"` then the first partial contents of a message are included.
   * @default false
   */
  allowPartial?: boolean;
  /**
   * @param {MessageTypeOrClass | MessageTypeOrClass[]} [endOn] The message type to end on.
   * If specified then every message after the last occurrence of this type is ignored.
   * If `strategy === "last"` then this is done before we attempt to get the last `maxTokens`.
   * If `strategy === "first"` then this is done after we get the first `maxTokens`.
   * Can be specified as string names (e.g. "system", "human", "ai", ...) or as `BaseMessage` classes
   * (e.g. `SystemMessage`, `HumanMessage`, `AIMessage`, ...). Can be a single type or an array of types.
   */
  endOn?: MessageTypeOrClass | MessageTypeOrClass[];
  /**
   * @param {MessageTypeOrClass | MessageTypeOrClass[]} [startOn] The message type to start on.
   * Should only be specified if `strategy: "last"`. If specified then every message before the first occurrence
   * of this type is ignored. This is done after we trim the initial messages to the last `maxTokens`.
   * Does not apply to a `SystemMessage` at index 0 if `includeSystem: true`.
   * Can be specified as string names (e.g. "system", "human", "ai", ...) or as `BaseMessage` classes
   * (e.g. `SystemMessage`, `HumanMessage`, `AIMessage`, ...). Can be a single type or an array of types.
   */
  startOn?: MessageTypeOrClass | MessageTypeOrClass[];
  /**
   * @param {boolean} [includeSystem=false] Whether to keep the `SystemMessage` if there is one at index 0.
   * Should only be specified if `strategy: "last"`.
   * @default false
   */
  includeSystem?: boolean;
  /**
   * @param {((text: string) => string[]) | BaseDocumentTransformer} [textSplitter] Function or `BaseDocumentTransformer` for
   * splitting the string contents of a message. Only used if `allowPartial: true`.
   * If `strategy: "last"` then the last split tokens from a partial message will be included.
   * If `strategy: "first"` then the first split tokens from a partial message will be included.
   * Token splitter assumes that separators are kept, so that split contents can be directly concatenated
   * to recreate the original text. Defaults to splitting on newlines.
   */
  textSplitter?:
    | ((text: string) => string[])
    | ((text: string) => Promise<string[]>)
    | _TextSplitterInterface;
}

/**
 * Trim messages to be below a token count.
 *
 * @param {BaseMessage[]} messages Array of `BaseMessage` instances to trim.
 * @param {TrimMessagesFields} options Trimming options.
 * @returns An array of trimmed `BaseMessage`s or a `Runnable` that takes a sequence of `BaseMessage`-like objects and returns
 *     an array of trimmed `BaseMessage`s.
 * @throws {Error} If two incompatible arguments are specified or an unrecognized `strategy` is specified.
 *
 * @example
 * ```typescript
 * import { trimMessages, AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
 *
 * const messages = [
 *   new SystemMessage("This is a 4 token text. The full message is 10 tokens."),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "first",
 *   }),
 *   new AIMessage({
 *     content: [
 *       { type: "text", text: "This is the FIRST 4 token block." },
 *       { type: "text", text: "This is the SECOND 4 token block." },
 *     ],
 *     id: "second",
 *   }),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "third",
 *   }),
 *   new AIMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "fourth",
 *   }),
 * ];
 *
 * function dummyTokenCounter(messages: BaseMessage[]): number {
 *   // treat each message like it adds 3 default tokens at the beginning
 *   // of the message and at the end of the message. 3 + 4 + 3 = 10 tokens
 *   // per message.
 *
 *   const defaultContentLen = 4;
 *   const defaultMsgPrefixLen = 3;
 *   const defaultMsgSuffixLen = 3;
 *
 *   let count = 0;
 *   for (const msg of messages) {
 *     if (typeof msg.content === "string") {
 *       count += defaultMsgPrefixLen + defaultContentLen + defaultMsgSuffixLen;
 *     }
 *     if (Array.isArray(msg.content)) {
 *       count +=
 *         defaultMsgPrefixLen +
 *         msg.content.length * defaultContentLen +
 *         defaultMsgSuffixLen;
 *     }
 *   }
 *   return count;
 * }
 * ```
 *
 * First 30 tokens, not allowing partial messages:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 30,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "first",
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "first",
 *   }),
 * ]
 * ```
 *
 * First 30 tokens, allowing partial messages:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 30,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "first",
 *   allowPartial: true,
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "first",
 *   }),
 *   new AIMessage({
 *     content: [{ type: "text", text: "This is the FIRST 4 token block." }],
 *     id: "second",
 *   }),
 * ]
 * ```
 *
 * First 30 tokens, allowing partial messages, have to end on HumanMessage:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 30,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "first",
 *   allowPartial: true,
 *   endOn: "human",
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "first",
 *   }),
 * ]
 * ```
 *
 * Last 30 tokens, including system message, not allowing partial messages:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 30,
 *   includeSystem: true,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "last",
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "third",
 *   }),
 *   new AIMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "fourth",
 *   }),
 * ]
 * ```
 *
 * Last 40 tokens, including system message, allowing partial messages:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 40,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "last",
 *   allowPartial: true,
 *   includeSystem: true,
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new AIMessage({
 *     content: [{ type: "text", text: "This is the FIRST 4 token block." }],
 *     id: "second",
 *   }),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "third",
 *   }),
 *   new AIMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "fourth",
 *   }),
 * ]
 * ```
 *
 * Last 30 tokens, including system message, allowing partial messages, end on HumanMessage:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 30,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "last",
 *   endOn: "human",
 *   includeSystem: true,
 *   allowPartial: true,
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new AIMessage({
 *     content: [{ type: "text", text: "This is the FIRST 4 token block." }],
 *     id: "second",
 *   }),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "third",
 *   }),
 * ]
 * ```
 *
 * Last 40 tokens, including system message, allowing partial messages, start on HumanMessage:
 * ```typescript
 * await trimMessages(messages, {
 *   maxTokens: 40,
 *   tokenCounter: dummyTokenCounter,
 *   strategy: "last",
 *   includeSystem: true,
 *   allowPartial: true,
 *   startOn: "human",
 * });
 * ```
 *
 * Output:
 * ```typescript
 * [
 *   new SystemMessage(
 *     "This is a 4 token text. The full message is 10 tokens."
 *   ),
 *   new HumanMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "third",
 *   }),
 *   new AIMessage({
 *     content: "This is a 4 token text. The full message is 10 tokens.",
 *     id: "fourth",
 *   }),
 * ]
 * ```
 */
export function trimMessages(
  options: TrimMessagesFields
): Runnable<BaseMessage[], BaseMessage[]>;
export function trimMessages(
  messages: BaseMessage[],
  options: TrimMessagesFields
): Promise<BaseMessage[]>;
export function trimMessages(
  messagesOrOptions: BaseMessage[] | TrimMessagesFields,
  options?: TrimMessagesFields
): Promise<BaseMessage[]> | Runnable<BaseMessage[], BaseMessage[]> {
  if (Array.isArray(messagesOrOptions)) {
    const messages = messagesOrOptions;
    if (!options) {
      throw new Error("Options parameter is required when providing messages.");
    }
    return _trimMessagesHelper(messages, options);
  } else {
    const trimmerOptions = messagesOrOptions;
    return RunnableLambda.from((input: BaseMessage[]) =>
      _trimMessagesHelper(input, trimmerOptions)
    ).withConfig({
      runName: "trim_messages",
    });
  }
}

async function _trimMessagesHelper(
  messages: BaseMessage[],
  options: TrimMessagesFields
): Promise<Array<BaseMessage>> {
  const {
    maxTokens,
    tokenCounter,
    strategy = "last",
    allowPartial = false,
    endOn,
    startOn,
    includeSystem = false,
    textSplitter,
  } = options;
  if (startOn && strategy === "first") {
    throw new Error(
      "`startOn` should only be specified if `strategy` is 'last'."
    );
  }
  if (includeSystem && strategy === "first") {
    throw new Error(
      "`includeSystem` should only be specified if `strategy` is 'last'."
    );
  }

  let listTokenCounter: (msgs: BaseMessage[]) => Promise<number>;
  if ("getNumTokens" in tokenCounter) {
    listTokenCounter = async (msgs: BaseMessage[]): Promise<number> => {
      const tokenCounts = await Promise.all(
        msgs.map((msg) => tokenCounter.getNumTokens(msg.content))
      );
      return tokenCounts.reduce((sum, count) => sum + count, 0);
    };
  } else {
    listTokenCounter = async (msgs: BaseMessage[]): Promise<number> =>
      tokenCounter(msgs);
  }

  let textSplitterFunc: (text: string) => Promise<string[]> =
    defaultTextSplitter;
  if (textSplitter) {
    if ("splitText" in textSplitter) {
      textSplitterFunc = textSplitter.splitText;
    } else {
      textSplitterFunc = async (text: string): Promise<string[]> =>
        textSplitter(text);
    }
  }

  if (strategy === "first") {
    return _firstMaxTokens(messages, {
      maxTokens,
      tokenCounter: listTokenCounter,
      textSplitter: textSplitterFunc,
      partialStrategy: allowPartial ? "first" : undefined,
      endOn,
    });
  } else if (strategy === "last") {
    return _lastMaxTokens(messages, {
      maxTokens,
      tokenCounter: listTokenCounter,
      textSplitter: textSplitterFunc,
      allowPartial,
      includeSystem,
      startOn,
      endOn,
    });
  } else {
    throw new Error(
      `Unrecognized strategy: '${strategy}'. Must be one of 'first' or 'last'.`
    );
  }
}

async function _firstMaxTokens(
  messages: BaseMessage[],
  options: {
    maxTokens: number;
    tokenCounter: (messages: BaseMessage[]) => Promise<number>;
    textSplitter: (text: string) => Promise<string[]>;
    partialStrategy?: "first" | "last";
    endOn?: MessageTypeOrClass | MessageTypeOrClass[];
  }
): Promise<BaseMessage[]> {
  const { maxTokens, tokenCounter, textSplitter, partialStrategy, endOn } =
    options;
  let messagesCopy = [...messages];
  let idx = 0;
  for (let i = 0; i < messagesCopy.length; i += 1) {
    const remainingMessages = i > 0 ? messagesCopy.slice(0, -i) : messagesCopy;
    if ((await tokenCounter(remainingMessages)) <= maxTokens) {
      idx = messagesCopy.length - i;
      break;
    }
  }
  if (idx < messagesCopy.length - 1 && partialStrategy) {
    let includedPartial = false;
    if (Array.isArray(messagesCopy[idx].content)) {
      const excluded = messagesCopy[idx];
      if (typeof excluded.content === "string") {
        throw new Error("Expected content to be an array.");
      }

      const numBlock = excluded.content.length;
      const reversedContent =
        partialStrategy === "last"
          ? [...excluded.content].reverse()
          : excluded.content;
      for (let i = 1; i <= numBlock; i += 1) {
        const partialContent =
          partialStrategy === "first"
            ? reversedContent.slice(0, i)
            : reversedContent.slice(-i);
        const fields = Object.fromEntries(
          Object.entries(excluded).filter(
            ([k]) => k !== "type" && !k.startsWith("lc_")
          )
        ) as BaseMessageFields;
        const updatedMessage = _switchTypeToMessage(excluded.getType(), {
          ...fields,
          content: partialContent,
        });
        const slicedMessages = [...messagesCopy.slice(0, idx), updatedMessage];
        if ((await tokenCounter(slicedMessages)) <= maxTokens) {
          messagesCopy = slicedMessages;
          idx += 1;
          includedPartial = true;
        } else {
          break;
        }
      }
      if (includedPartial && partialStrategy === "last") {
        excluded.content = [...reversedContent].reverse();
      }
    }
    if (!includedPartial) {
      const excluded = messagesCopy[idx];
      let text: string | undefined;
      if (
        Array.isArray(excluded.content) &&
        excluded.content.some(
          (block) => typeof block === "string" || block.type === "text"
        )
      ) {
        const textBlock = excluded.content.find(
          (block) => block.type === "text" && block.text
        ) as { type: "text"; text: string } | undefined;
        text = textBlock?.text;
      } else if (typeof excluded.content === "string") {
        text = excluded.content;
      }
      if (text) {
        const splitTexts = await textSplitter(text);
        const numSplits = splitTexts.length;
        if (partialStrategy === "last") {
          splitTexts.reverse();
        }
        for (let _ = 0; _ < numSplits - 1; _ += 1) {
          splitTexts.pop();
          excluded.content = splitTexts.join("");
          if (
            (await tokenCounter([...messagesCopy.slice(0, idx), excluded])) <=
            maxTokens
          ) {
            if (partialStrategy === "last") {
              excluded.content = [...splitTexts].reverse().join("");
            }
            messagesCopy = [...messagesCopy.slice(0, idx), excluded];
            idx += 1;
            break;
          }
        }
      }
    }
  }

  if (endOn) {
    const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
    while (idx > 0 && !_isMessageType(messagesCopy[idx - 1], endOnArr)) {
      idx -= 1;
    }
  }

  return messagesCopy.slice(0, idx);
}

async function _lastMaxTokens(
  messages: BaseMessage[],
  options: {
    maxTokens: number;
    tokenCounter: (messages: BaseMessage[]) => Promise<number>;
    textSplitter: (text: string) => Promise<string[]>;
    /**
     * @default {false}
     */
    allowPartial?: boolean;
    /**
     * @default {false}
     */
    includeSystem?: boolean;
    startOn?: MessageTypeOrClass | MessageTypeOrClass[];
    endOn?: MessageTypeOrClass | MessageTypeOrClass[];
  }
): Promise<BaseMessage[]> {
  const {
    allowPartial = false,
    includeSystem = false,
    endOn,
    startOn,
    ...rest
  } = options;

  // Create a copy of messages to avoid mutation
  let messagesCopy = messages.map((message) => {
    const fields = Object.fromEntries(
      Object.entries(message).filter(
        ([k]) => k !== "type" && !k.startsWith("lc_")
      )
    ) as BaseMessageFields;
    return _switchTypeToMessage(
      message.getType(),
      fields,
      isBaseMessageChunk(message)
    );
  });

  if (endOn) {
    const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
    while (
      messagesCopy.length > 0 &&
      !_isMessageType(messagesCopy[messagesCopy.length - 1], endOnArr)
    ) {
      messagesCopy = messagesCopy.slice(0, -1);
    }
  }

  const swappedSystem =
    includeSystem && messagesCopy[0]?.getType() === "system";
  let reversed_ = swappedSystem
    ? messagesCopy.slice(0, 1).concat(messagesCopy.slice(1).reverse())
    : messagesCopy.reverse();

  reversed_ = await _firstMaxTokens(reversed_, {
    ...rest,
    partialStrategy: allowPartial ? "last" : undefined,
    endOn: startOn,
  });

  if (swappedSystem) {
    return [reversed_[0], ...reversed_.slice(1).reverse()];
  } else {
    return reversed_.reverse();
  }
}

function _switchTypeToMessage(
  messageType: MessageType,
  fields: BaseMessageFields
): BaseMessage;
function _switchTypeToMessage(
  messageType: MessageType,
  fields: BaseMessageFields,
  returnChunk: true
): BaseMessageChunk;
function _switchTypeToMessage(
  messageType: MessageType,
  fields: BaseMessageFields,
  returnChunk?: boolean
): BaseMessageChunk | BaseMessage;
function _switchTypeToMessage(
  messageType: MessageType,
  fields: BaseMessageFields,
  returnChunk?: boolean
): BaseMessageChunk | BaseMessage {
  let chunk: BaseMessageChunk | undefined;
  let msg: BaseMessage | undefined;

  switch (messageType) {
    case "human":
      if (returnChunk) {
        chunk = new HumanMessageChunk(fields);
      } else {
        msg = new HumanMessage(fields);
      }
      break;
    case "ai":
      if (returnChunk) {
        let aiChunkFields: AIMessageChunkFields = {
          ...fields,
        };
        if ("tool_calls" in aiChunkFields) {
          aiChunkFields = {
            ...aiChunkFields,
            tool_call_chunks: aiChunkFields.tool_calls?.map((tc) => ({
              ...tc,
              type: "tool_call_chunk",
              index: undefined,
              args: JSON.stringify(tc.args),
            })),
          };
        }
        chunk = new AIMessageChunk(aiChunkFields);
      } else {
        msg = new AIMessage(fields);
      }
      break;
    case "system":
      if (returnChunk) {
        chunk = new SystemMessageChunk(fields);
      } else {
        msg = new SystemMessage(fields);
      }
      break;
    case "developer":
      if (returnChunk) {
        chunk = new SystemMessageChunk({
          ...fields,
          additional_kwargs: {
            ...fields.additional_kwargs,
            __openai_role__: "developer",
          },
        });
      } else {
        msg = new SystemMessage({
          ...fields,
          additional_kwargs: {
            ...fields.additional_kwargs,
            __openai_role__: "developer",
          },
        });
      }
      break;
    case "tool":
      if ("tool_call_id" in fields) {
        if (returnChunk) {
          chunk = new ToolMessageChunk(
            fields as ToolMessageFieldsWithToolCallId
          );
        } else {
          msg = new ToolMessage(fields as ToolMessageFieldsWithToolCallId);
        }
      } else {
        throw new Error(
          "Can not convert ToolMessage to ToolMessageChunk if 'tool_call_id' field is not defined."
        );
      }
      break;
    case "function":
      if (returnChunk) {
        chunk = new FunctionMessageChunk(fields);
      } else {
        if (!fields.name) {
          throw new Error("FunctionMessage must have a 'name' field");
        }
        msg = new FunctionMessage(fields as FunctionMessageFieldsWithName);
      }
      break;
    case "generic":
      if ("role" in fields) {
        if (returnChunk) {
          chunk = new ChatMessageChunk(fields as ChatMessageFieldsWithRole);
        } else {
          msg = new ChatMessage(fields as ChatMessageFieldsWithRole);
        }
      } else {
        throw new Error(
          "Can not convert ChatMessage to ChatMessageChunk if 'role' field is not defined."
        );
      }
      break;
    default:
      throw new Error(`Unrecognized message type ${messageType}`);
  }

  if (returnChunk && chunk) {
    return chunk;
  }
  if (msg) {
    return msg;
  }
  throw new Error(`Unrecognized message type ${messageType}`);
}