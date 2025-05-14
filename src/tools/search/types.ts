import type { RunnableConfig } from '@langchain/core/runnables';
import type { BaseReranker } from './rerankers';

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
  references?: UsedReferences;
}

export interface ValidSource {
  link: string;
  position?: number;
  title?: string;
  snippet?: string;
  date?: string;
  content?: string;
  attribution?: string;
  references?: References;
  highlights?: Highlight[];
}

export type ResultReference = {
  link: string;
  title?: string;
};
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
  references?: ResultReference[];
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

export type References = {
  links: MediaReference[];
  images: MediaReference[];
  videos: MediaReference[];
};
export interface ScrapeResult {
  url: string;
  error?: boolean;
  content: string;
  attribution?: string;
  references?: References;
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
  onSearchResults?: (
    results: SearchResult,
    runnableConfig?: RunnableConfig
  ) => void;
}

export interface MediaReference {
  originalUrl: string;
  title?: string;
  text?: string;
}

export type UsedReferences = {
  type: 'link' | 'image' | 'video';
  originalIndex: number;
  reference: MediaReference;
}[];

/** Firecrawl */

export interface FirecrawlScrapeOptions {
  formats?: string[];
  includeTags?: string[];
  excludeTags?: string[];
  headers?: Record<string, string>;
  waitFor?: number;
  timeout?: number;
}

export interface ScrapeMetadata {
  // Core source information
  sourceURL?: string;
  url?: string;
  scrapeId?: string;
  statusCode?: number;
  // Basic metadata
  title?: string;
  description?: string;
  language?: string;
  favicon?: string;
  viewport?: string;
  robots?: string;
  'theme-color'?: string;
  // Open Graph metadata
  'og:url'?: string;
  'og:title'?: string;
  'og:description'?: string;
  'og:type'?: string;
  'og:image'?: string;
  'og:image:width'?: string;
  'og:image:height'?: string;
  'og:site_name'?: string;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogSiteName?: string;
  // Article metadata
  'article:author'?: string;
  'article:published_time'?: string;
  'article:modified_time'?: string;
  'article:section'?: string;
  'article:tag'?: string;
  'article:publisher'?: string;
  publishedTime?: string;
  modifiedTime?: string;
  // Twitter metadata
  'twitter:site'?: string;
  'twitter:creator'?: string;
  'twitter:card'?: string;
  'twitter:image'?: string;
  'twitter:dnt'?: string;
  'twitter:app:name:iphone'?: string;
  'twitter:app:id:iphone'?: string;
  'twitter:app:url:iphone'?: string;
  'twitter:app:name:ipad'?: string;
  'twitter:app:id:ipad'?: string;
  'twitter:app:url:ipad'?: string;
  'twitter:app:name:googleplay'?: string;
  'twitter:app:id:googleplay'?: string;
  'twitter:app:url:googleplay'?: string;
  // Facebook metadata
  'fb:app_id'?: string;
  // App links
  'al:ios:url'?: string;
  'al:ios:app_name'?: string;
  'al:ios:app_store_id'?: string;
  // Allow for additional properties that might be present
  [key: string]: string | number | boolean | null | undefined;
}

export interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    screenshot?: string;
    links?: string[];
    metadata?: ScrapeMetadata;
  };
  error?: string;
}

export interface FirecrawlScraperConfig {
  apiKey?: string;
  apiUrl?: string;
  formats?: string[];
  timeout?: number;
}
