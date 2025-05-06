/* eslint-disable no-console */
import { z } from 'zod';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';
import type * as t from './types';
import { createSearchAPI, createSourceProcessor } from './search';
import { createFirecrawlScraper } from './firecrawl';
import { expandHighlights } from './highlights';
import { formatResultsForLLM } from './format';
import { createReranker } from './rerankers';
import { Constants } from '@/common';

const SearchToolSchema = z.object({
  query: z
    .string()
    .describe(
      'The search query string that specifies what should be searched for.'
    ),
});

export const createSearchTool = (
  config: t.SearchToolConfig = {}
): DynamicStructuredTool<typeof SearchToolSchema> => {
  const {
    searchProvider = 'serper',
    serperApiKey,
    searxngInstanceUrl,
    searxngApiKey,
    rerankerType = 'cohere',
    topResults = 5,
    strategies = ['no_extraction'],
    filterContent = true,
    firecrawlApiKey,
    firecrawlApiUrl,
    firecrawlFormats = ['markdown', 'html'],
    jinaApiKey,
    cohereApiKey,
    onSearchResults: _onSearchResults,
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

  if (!selectedReranker) {
    console.warn('No reranker selected. Using default ranking.');
  }

  const sourceProcessor = createSourceProcessor(
    {
      reranker: selectedReranker,
      topResults,
      strategies,
      filterContent,
    },
    firecrawlScraper
  );

  const search = async ({
    query,
    proMode = true,
    maxSources = 5,
    onSearchResults,
  }: {
    query: string;
    proMode?: boolean;
    maxSources?: number;
    onSearchResults?: (sources: t.SearchResult) => void;
  }): Promise<t.SearchResultData> => {
    try {
      const sources = await searchAPI.getSources(query);
      onSearchResults?.(sources);

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

  return tool<typeof SearchToolSchema>(
    async ({ query }, runnableConfig) => {
      const searchResult = await search({
        query,
        onSearchResults: _onSearchResults
          ? (result): void => {
            _onSearchResults(result, runnableConfig);
          }
          : undefined,
      });
      const output = formatResultsForLLM(searchResult);
      return [output, { [Constants.WEB_SEARCH]: { ...searchResult } }];
    },
    {
      name: Constants.WEB_SEARCH,
      description: `
Real-time search. Results have required unique citation anchors.

Anchors:
- \\ue202turn0searchN (web), \\ue202turn0newsN (news), \\ue202turn0imageN (image)

Special Markers:
- \\ue203...\\ue204 — mark start/end of cited span
- \\ue200...\\ue201 — composite/group block (e.g. \\ue200cite\\ue202turn0search1\\ue202turn0news2\\ue201)
- \\ue206 — marks grouped/summary citation areas

**CITE EVERY NON-OBVIOUS FACT/QUOTE:**
Insert the anchor marker(s) immediately after the statement:
- "Pure functions produce same output \\ue202turn0search0."
- Multiple: "Benefits \\ue202turn0search0\\ue202turn0news0."
- Span: \\ue203Key: first-class functions\\ue204\\ue202turn0news1
- Group: "Functional languages."\\ue206 or \\ue200cite\\ue202turn0search0\\ue202turn0news1\\ue201
- Image: "See photo \\ue202turn0image0."

**NEVER use markdown links, [1], or footnotes. CITE ONLY with anchors provided.**
`.trim(),
      schema: SearchToolSchema,
      responseFormat: Constants.CONTENT_AND_ARTIFACT,
    }
  );
};
