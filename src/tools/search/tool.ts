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
- \\ue202turnXsearchY (web), \\ue202turnXnewsY (news), \\ue202turnXimageY (image)
- X = turn, Y = item number

Special Markers:
- \\ue203...\\ue204 — highlight start/end of cited text (for Standalone or Group citations)
- \\ue200...\\ue201 — group block (e.g. \\ue200\\ue202turn0search1\\ue202turn0news2\\ue201)

**CITE EVERY NON-OBVIOUS FACT/QUOTE:**
Use anchor marker(s) immediately after the statement:
- Standalone: "Pure functions produce same output. \\ue202turn0search0"
- Standalone (multiple): "Today's News \\ue202turn0search0\\ue202turn0news0"
- Highlight: "\\ue203Highlight text.\\ue204\\ue202turn0news1"
- Group: "Sources. \\ue200\\ue202turn0search0\\ue202turn0news1\\ue201"
- Group Highlight: "\\ue203Highlight for group.\\ue204 \\ue200\\ue202turn0search0\\ue202turn0news1\\ue201"
- Image: "See photo \\ue202turn0image0."

**NEVER use markdown links, [1], or footnotes. CITE ONLY with anchors provided.**
`.trim(),
      schema: SearchToolSchema,
      responseFormat: Constants.CONTENT_AND_ARTIFACT,
    }
  );
};
