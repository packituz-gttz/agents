/* eslint-disable no-console */
import type * as t from './types';
import { createSearchAPI, createSourceProcessor } from './search';
import { createFirecrawlScraper } from './firecrawl';
import { expandHighlights } from './highlights';
import { createReranker } from './rerankers';

export const createOpenDeepSearchTool = (
  config: t.OpenDeepSearchToolConfig = {}
): {
  name: string;
  description: string;
  search: (
    query: string,
    maxSources?: number,
    proMode?: boolean
  ) => Promise<t.SearchResultData>;
} => {
  const {
    searchProvider = 'serper',
    serperApiKey,
    searxngInstanceUrl,
    searxngApiKey,
    rerankerType = 'none',
    topResults = 5,
    strategies = ['no_extraction'],
    filterContent = true,
    firecrawlApiKey,
    firecrawlApiUrl,
    firecrawlFormats = ['markdown', 'html'],
    jinaApiKey,
    cohereApiKey,
  } = config;

  const searchAPI = createSearchAPI({
    searchProvider,
    serperApiKey,
    searxngInstanceUrl,
    searxngApiKey,
  });

  const firecrawlScraper = createFirecrawlScraper({
    apiKey: firecrawlApiKey ?? process.env.FIRECRAWL_API_KEY,
    apiUrl: firecrawlApiUrl,
    formats: firecrawlFormats,
  });

  const selectedReranker = createReranker({
    rerankerType,
    jinaApiKey,
    cohereApiKey,
  });

  const sourceProcessor = createSourceProcessor(
    {
      reranker: selectedReranker,
      topResults,
      strategies,
      filterContent,
    },
    firecrawlScraper
  );

  const search = async (
    query: string,
    maxSources: number = 2,
    proMode: boolean = true
  ): Promise<t.SearchResultData> => {
    try {
      const sources = await searchAPI.getSources(query);
      if (!sources.success) {
        throw new Error(sources.error ?? 'Search failed');
      }

      const processedSources = await sourceProcessor.processSources(
        sources,
        maxSources,
        query,
        proMode
      );
      return expandHighlights(processedSources);
    } catch (error) {
      console.error('Error in search:', error);
      return {
        organic: [],
        topStories: [],
        images: [],
        relatedSearches: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    name: 'web_search',
    description:
      'Performs web search based on your query (think a Google search) and returns processed results.',
    search,
  };
};
