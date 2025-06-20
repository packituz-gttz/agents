import { AzureOpenAI as AzureOpenAIClient } from 'openai';
import { ChatXAI as OriginalChatXAI } from '@langchain/xai';
import { ChatDeepSeek as OriginalChatDeepSeek } from '@langchain/deepseek';
import {
  getEndpoint,
  OpenAIClient,
  formatToOpenAITool,
  ChatOpenAI as OriginalChatOpenAI,
  AzureChatOpenAI as OriginalAzureChatOpenAI,
} from '@langchain/openai';
import { isLangChainTool } from '@langchain/core/utils/function_calling';
import type { BindToolsInput } from '@langchain/core/language_models/chat_models';
import type { OpenAIEndpointConfig } from '@langchain/openai/dist/utils/azure';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { Runnable } from '@langchain/core/runnables';
import type * as t from '@langchain/openai';
import {
  isOpenAITool,
  ToolDefinition,
  BaseLanguageModelInput,
} from '@langchain/core/language_models/base';

type ResponsesCreateParams = Parameters<OpenAIClient.Responses['create']>[0];
type ResponsesTool = Exclude<ResponsesCreateParams['tools'], undefined>[number];

type ChatOpenAIToolType =
  | BindToolsInput
  | OpenAIClient.ChatCompletionTool
  | ResponsesTool;

type HeaderValue = string | undefined | null;
export type HeadersLike =
  | Headers
  | readonly HeaderValue[][]
  | Record<string, HeaderValue | readonly HeaderValue[]>
  | undefined
  | null
  // NullableHeaders
  | { values: Headers; [key: string]: unknown };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const iife = <T>(fn: () => T) => fn();

export function isHeaders(headers: unknown): headers is Headers {
  return (
    typeof Headers !== 'undefined' &&
    headers !== null &&
    typeof headers === 'object' &&
    Object.prototype.toString.call(headers) === '[object Headers]'
  );
}

export function normalizeHeaders(
  headers: HeadersLike
): Record<string, HeaderValue | readonly HeaderValue[]> {
  const output = iife(() => {
    // If headers is a Headers instance
    if (isHeaders(headers)) {
      return headers;
    }
    // If headers is an array of [key, value] pairs
    else if (Array.isArray(headers)) {
      return new Headers(headers);
    }
    // If headers is a NullableHeaders-like object (has 'values' property that is a Headers)
    else if (
      typeof headers === 'object' &&
      headers !== null &&
      'values' in headers &&
      isHeaders(headers.values)
    ) {
      return headers.values;
    }
    // If headers is a plain object
    else if (typeof headers === 'object' && headers !== null) {
      const entries: [string, string][] = Object.entries(headers)
        .filter(([, v]) => typeof v === 'string')
        .map(([k, v]) => [k, v as string]);
      return new Headers(entries);
    }
    return new Headers();
  });

  return Object.fromEntries(output.entries());
}

type OpenAICoreRequestOptions = OpenAIClient.RequestOptions;

function createAbortHandler(controller: AbortController): () => void {
  return function (): void {
    controller.abort();
  };
}
/**
 * Formats a tool in either OpenAI format, or LangChain structured tool format
 * into an OpenAI tool format. If the tool is already in OpenAI format, return without
 * any changes. If it is in LangChain structured tool format, convert it to OpenAI tool format
 * using OpenAI's `zodFunction` util, falling back to `convertToOpenAIFunction` if the parameters
 * returned from the `zodFunction` util are not defined.
 *
 * @param {BindToolsInput} tool The tool to convert to an OpenAI tool.
 * @param {Object} [fields] Additional fields to add to the OpenAI tool.
 * @returns {ToolDefinition} The inputted tool in OpenAI tool format.
 */
export function _convertToOpenAITool(
  tool: BindToolsInput,
  fields?: {
    /**
     * If `true`, model output is guaranteed to exactly match the JSON Schema
     * provided in the function definition.
     */
    strict?: boolean;
  }
): OpenAIClient.ChatCompletionTool {
  let toolDef: OpenAIClient.ChatCompletionTool | undefined;

  if (isLangChainTool(tool)) {
    toolDef = formatToOpenAITool(tool);
  } else {
    toolDef = tool as ToolDefinition;
  }

  if (fields?.strict !== undefined) {
    toolDef.function.strict = fields.strict;
  }

  return toolDef;
}

function _convertChatOpenAIToolTypeToOpenAITool(
  tool: ChatOpenAIToolType,
  fields?: {
    strict?: boolean;
  }
): OpenAIClient.ChatCompletionTool {
  if (isOpenAITool(tool)) {
    if (fields?.strict !== undefined) {
      return {
        ...tool,
        function: {
          ...tool.function,
          strict: fields.strict,
        },
      };
    }

    return tool;
  }
  return _convertToOpenAITool(tool, fields);
}

export class CustomOpenAIClient extends OpenAIClient {
  abortHandler?: () => void;
  async fetchWithTimeout(
    url: RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController
  ): Promise<Response> {
    const { signal, ...options } = init || {};
    const handler = createAbortHandler(controller);
    this.abortHandler = handler;
    if (signal) signal.addEventListener('abort', handler, { once: true });

    const timeout = setTimeout(() => handler, ms);

    const fetchOptions = {
      signal: controller.signal as AbortSignal,
      ...options,
    };
    if (fetchOptions.method != null) {
      // Custom methods like 'patch' need to be uppercased
      // See https://github.com/nodejs/undici/issues/2294
      fetchOptions.method = fetchOptions.method.toUpperCase();
    }

    return (
      // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      this.fetch.call(undefined, url, fetchOptions).finally(() => {
        clearTimeout(timeout);
      })
    );
  }
}
export class CustomAzureOpenAIClient extends AzureOpenAIClient {
  abortHandler?: () => void;
  async fetchWithTimeout(
    url: RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController
  ): Promise<Response> {
    const { signal, ...options } = init || {};
    const handler = createAbortHandler(controller);
    this.abortHandler = handler;
    if (signal) signal.addEventListener('abort', handler, { once: true });

    const timeout = setTimeout(() => handler, ms);

    const fetchOptions = {
      signal: controller.signal as AbortSignal,
      ...options,
    };
    if (fetchOptions.method != null) {
      // Custom methods like 'patch' need to be uppercased
      // See https://github.com/nodejs/undici/issues/2294
      fetchOptions.method = fetchOptions.method.toUpperCase();
    }

    return (
      // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      this.fetch.call(undefined, url, fetchOptions).finally(() => {
        clearTimeout(timeout);
      })
    );
  }
}

function isBuiltInTool(tool: ChatOpenAIToolType): tool is ResponsesTool {
  return 'type' in tool && tool.type !== 'function';
}

export class ChatOpenAI extends OriginalChatOpenAI<t.ChatOpenAICallOptions> {
  public get exposedClient(): CustomOpenAIClient {
    return this.client;
  }
  override bindTools(
    tools: ChatOpenAIToolType[],
    kwargs?: Partial<t.ChatOpenAICallOptions>
  ): Runnable<BaseLanguageModelInput, AIMessageChunk, t.ChatOpenAICallOptions> {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== undefined) {
      strict = this.supportsStrictToolCalling;
    }
    return this.withConfig({
      tools: tools.map((tool) =>
        isBuiltInTool(tool)
          ? tool
          : _convertChatOpenAIToolTypeToOpenAITool(tool, { strict })
      ),
      ...kwargs,
    } as Partial<t.ChatOpenAICallOptions>);
  }
  protected _getClientOptions(
    options?: OpenAICoreRequestOptions
  ): OpenAICoreRequestOptions {
    if (!(this.client as OpenAIClient | undefined)) {
      const openAIEndpointConfig: t.OpenAIEndpointConfig = {
        baseURL: this.clientConfig.baseURL,
      };

      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = {
        ...this.clientConfig,
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0,
      };
      if (params.baseURL == null) {
        delete params.baseURL;
      }

      this.client = new CustomOpenAIClient(params);
    }
    const requestOptions = {
      ...this.clientConfig,
      ...options,
    } as OpenAICoreRequestOptions;
    return requestOptions;
  }
}

export class AzureChatOpenAI extends OriginalAzureChatOpenAI {
  override bindTools(
    tools: ChatOpenAIToolType[],
    kwargs?: Partial<t.ChatOpenAICallOptions>
  ): Runnable<BaseLanguageModelInput, AIMessageChunk, t.ChatOpenAICallOptions> {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== undefined) {
      strict = this.supportsStrictToolCalling;
    }
    return this.withConfig({
      tools: tools.map((tool) =>
        isBuiltInTool(tool)
          ? tool
          : _convertChatOpenAIToolTypeToOpenAITool(tool, { strict })
      ),
      ...kwargs,
    } as Partial<t.ChatOpenAICallOptions>);
  }
  public get exposedClient(): CustomOpenAIClient {
    return this.client;
  }
  protected _getClientOptions(
    options: OpenAICoreRequestOptions | undefined
  ): OpenAICoreRequestOptions {
    if (!(this.client as unknown as AzureOpenAIClient | undefined)) {
      const openAIEndpointConfig: OpenAIEndpointConfig = {
        azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
        azureOpenAIApiKey: this.azureOpenAIApiKey,
        azureOpenAIBasePath: this.azureOpenAIBasePath,
        azureADTokenProvider: this.azureADTokenProvider,
        baseURL: this.clientConfig.baseURL,
      };

      const endpoint = getEndpoint(openAIEndpointConfig);

      const params = {
        ...this.clientConfig,
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0,
      };

      if (!this.azureADTokenProvider) {
        params.apiKey = openAIEndpointConfig.azureOpenAIApiKey;
      }

      if (params.baseURL == null) {
        delete params.baseURL;
      }

      const defaultHeaders = normalizeHeaders(params.defaultHeaders);
      params.defaultHeaders = {
        ...params.defaultHeaders,
        'User-Agent':
          defaultHeaders['User-Agent'] != null
            ? `${defaultHeaders['User-Agent']}: langchainjs-azure-openai-v2`
            : 'langchainjs-azure-openai-v2',
      };

      this.client = new CustomAzureOpenAIClient({
        apiVersion: this.azureOpenAIApiVersion,
        azureADTokenProvider: this.azureADTokenProvider,
        ...(params as t.AzureOpenAIInput),
      }) as unknown as CustomOpenAIClient;
    }

    const requestOptions = {
      ...this.clientConfig,
      ...options,
    } as OpenAICoreRequestOptions;
    if (this.azureOpenAIApiKey != null) {
      requestOptions.headers = {
        'api-key': this.azureOpenAIApiKey,
        ...requestOptions.headers,
      };
      requestOptions.query = {
        'api-version': this.azureOpenAIApiVersion,
        ...requestOptions.query,
      };
    }
    return requestOptions;
  }
}
export class ChatDeepSeek extends OriginalChatDeepSeek {
  public get exposedClient(): CustomOpenAIClient {
    return this.client;
  }
  protected _getClientOptions(
    options?: OpenAICoreRequestOptions
  ): OpenAICoreRequestOptions {
    if (!(this.client as OpenAIClient | undefined)) {
      const openAIEndpointConfig: t.OpenAIEndpointConfig = {
        baseURL: this.clientConfig.baseURL,
      };

      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = {
        ...this.clientConfig,
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0,
      };
      if (params.baseURL == null) {
        delete params.baseURL;
      }

      this.client = new CustomOpenAIClient(params);
    }
    const requestOptions = {
      ...this.clientConfig,
      ...options,
    } as OpenAICoreRequestOptions;
    return requestOptions;
  }
}

export class ChatXAI extends OriginalChatXAI {
  public get exposedClient(): CustomOpenAIClient {
    return this.client;
  }
  protected _getClientOptions(
    options?: OpenAICoreRequestOptions
  ): OpenAICoreRequestOptions {
    if (!(this.client as OpenAIClient | undefined)) {
      const openAIEndpointConfig: t.OpenAIEndpointConfig = {
        baseURL: this.clientConfig.baseURL,
      };

      const endpoint = getEndpoint(openAIEndpointConfig);
      const params = {
        ...this.clientConfig,
        baseURL: endpoint,
        timeout: this.timeout,
        maxRetries: 0,
      };
      if (params.baseURL == null) {
        delete params.baseURL;
      }

      this.client = new CustomOpenAIClient(params);
    }
    const requestOptions = {
      ...this.clientConfig,
      ...options,
    } as OpenAICoreRequestOptions;
    return requestOptions;
  }
}
