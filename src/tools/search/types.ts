import { BaseReranker } from './rerankers';

export type SearchProvider = 'serper' | 'searxng';
export type RerankerType = 'infinity' | 'jina' | 'cohere' | 'none';

export interface OrganicResult {
  position?: number;
  title?: string;
  link: string;
  snippet?: string;
  date?: string;
}

export interface TopStoryResult {
  title?: string;
  link: string;
  source?: string;
  date?: string;
  imageUrl?: string;
}

export interface ImageResult {
  title?: string;
  imageUrl?: string;
}

export interface KnowledgeGraphResult {
  title?: string;
  type?: string;
  description?: string;
  attributes?: Record<string, string>;
  imageUrl?: string;
}

export interface AnswerBoxResult {
  title?: string;
  answer?: string;
  snippet?: string;
  date?: string;
}

export interface PeopleAlsoAskResult {
  question?: string;
  answer?: string;
}

export interface Highlight {
  score: number;
  text: string;
}

export interface ValidSource {
  link: string;
  position?: number;
  title?: string;
  snippet?: string;
  date?: string;
  content?: string;
  attribution?: string;
  highlights?: Highlight[];
}

export interface SearchResultData {
  organic?: ValidSource[];
  topStories?: ValidSource[];
  images?: ImageResult[];
  knowledgeGraph?: KnowledgeGraphResult;
  answerBox?: AnswerBoxResult;
  peopleAlsoAsk?: PeopleAlsoAskResult[];
  relatedSearches?: string[];
  suggestions?: string[];
  error?: string;
}

export interface SearchResult {
  data?: SearchResultData;
  error?: string;
  success: boolean;
}

export interface Source {
  link: string;
  html?: string;
  title?: string;
  snippet?: string;
  date?: string;
}

export interface SearchConfig {
  searchProvider?: SearchProvider;
  serperApiKey?: string;
  searxngInstanceUrl?: string;
  searxngApiKey?: string;
}

export interface ScrapeResult {
  url: string;
  error?: boolean;
  content: string;
  attribution?: string;
  highlights?: Highlight[];
}

export interface ProcessSourcesConfig {
  topResults?: number;
  strategies?: string[];
  filterContent?: boolean;
  reranker?: BaseReranker;
}

export interface FirecrawlConfig {
  firecrawlApiKey?: string;
  firecrawlApiUrl?: string;
  firecrawlFormats?: string[];
}

export interface ScraperContentResult {
  content: string;
}

export interface ScraperExtractionResult {
  no_extraction: ScraperContentResult;
}

// Define type for SearXNG result
export interface SearXNGResult {
  title?: string;
  url?: string;
  content?: string;
  publishedDate?: string;
  img_src?: string;
}

export interface JinaRerankerResult {
  index: number;
  relevance_score: number;
  document?: string | { text: string };
}

export interface JinaRerankerResponse {
  model: string;
  usage: {
    total_tokens: number;
  };
  results: JinaRerankerResult[];
}

export interface CohereRerankerResult {
  index: number;
  relevance_score: number;
}

export interface CohereRerankerResponse {
  results: CohereRerankerResult[];
  id: string;
  meta: {
    api_version: {
      version: string;
      is_experimental: boolean;
    };
    billed_units: {
      search_units: number;
    };
  };
}

export interface SearchToolConfig
  extends SearchConfig,
    ProcessSourcesConfig,
    FirecrawlConfig {
  jinaApiKey?: string;
  cohereApiKey?: string;
  rerankerType?: RerankerType;
}
