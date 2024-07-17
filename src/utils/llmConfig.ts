// src/utils/llmConfig.ts
import { Providers } from '@/common';
import type * as t from '@/types';

import { config } from 'dotenv';
config();

const llmConfigs: Record<string, t.LLMConfig> = {
  openai: {
    provider: Providers.OPENAI,
    model: 'gpt-4o',
    temperature: 0.7,
  },
  anthropic: {
    provider: Providers.ANTHROPIC,
    model: 'claude-3-5-sonnet-20240620',
  },
  mistralai: {
    provider: Providers.MISTRALAI,
    model: 'mistral-large-latest',
  },
  vertexai: {
    provider: Providers.VERTEXAI,
    modelName: 'gemini-1.5-flash-001',
    streaming: true,
  },
  aws: {
    provider: Providers.AWS,
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
    },
  },
};

export function getLLMConfig(provider: string): t.LLMConfig {
  const config = llmConfigs[provider];
  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return config;
}
