import { z } from 'zod';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';
import type { RunnableConfig } from '@langchain/core/runnables';
import type * as t from './types';
import { DATE_RANGE, querySchema, dateSchema, countrySchema } from './schema';
import { createSearchAPI, createSourceProcessor } from './search';
import { createFirecrawlScraper } from './firecrawl';
import { expandHighlights } from './highlights';
import { formatResultsForLLM } from './format';
import { createDefaultLogger } from './utils';
import { createReranker } from './rerankers';
import { Constants } from '@/common';

function createSearchProcessor({
  searchAPI,
  safeSearch,
  sourceProcessor,
  onGetHighlights,
  logger,
}: {
  safeSearch: t.SearchToolConfig['safeSearch'];
  searchAPI: ReturnType<typeof createSearchAPI>;
  sourceProcessor: ReturnType<typeof createSourceProcessor>;
  onGetHighlights: t.SearchToolConfig['onGetHighlights'];
  logger: t.Logger;
}) {
  return async function ({
    query,
    date,
    country,
    proMode = true,
    maxSources = 5,
    onSearchResults,
  }: {
    query: string;
    country?: string;
    date?: DATE_RANGE;
    proMode?: boolean;
    maxSources?: number;
    onSearchResults: t.SearchToolConfig['onSearchResults'];
  }): Promise<t.SearchResultData> {
    try {
      const result = await searchAPI.getSources({
        query,
        date,
        country,
        safeSearch,
      });
      onSearchResults?.(result);

      if (!result.success) {
        throw new Error(result.error ?? 'Search failed');
      }

      const processedSources = await sourceProcessor.processSources({
        query,
        result,
        proMode,
        onGetHighlights,
        numElements: maxSources,
      });
      return expandHighlights(processedSources);
    } catch (error) {
      logger.error('Error in search:', error);
      return {
        organic: [],
        topStories: [],
        images: [],
        relatedSearches: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };
}

function createOnSearchResults({
  runnableConfig,
  onSearchResults,
}: {
  runnableConfig: RunnableConfig;
  onSearchResults: t.SearchToolConfig['onSearchResults'];
}) {
  return function (results: t.SearchResult): void {
    if (!onSearchResults) {
      return;
    }
    onSearchResults(results, runnableConfig);
  };
}

function createTool({
  schema,
  search,
  onSearchResults: _onSearchResults,
}: {
  schema: t.SearchToolSchema;
  search: ReturnType<typeof createSearchProcessor>;
  onSearchResults: t.SearchToolConfig['onSearchResults'];
}): DynamicStructuredTool<typeof schema> {
  return tool<typeof schema>(
    async (params, runnableConfig) => {
      const { query, date, country: _c } = params;
      const country = typeof _c === 'string' && _c ? _c : undefined;
      const searchResult = await search({
        query,
        date,
        country,
        onSearchResults: createOnSearchResults({
          runnableConfig,
          onSearchResults: _onSearchResults,
        }),
      });
      const turn = runnableConfig.toolCall?.turn ?? 0;
      const { output, references } = formatResultsForLLM(turn, searchResult);
      const data: t.SearchResultData = { turn, ...searchResult, references };
      return [output, { [Constants.WEB_SEARCH]: data }];
    },
    {
      name: Constants.WEB_SEARCH,
      description: `Real-time search. Results have required citation anchors.

Note: Use ONCE per reply unless instructed otherwise.

Anchors:
- \\ue202turnXtypeY
- X = turn idx, type = 'search' | 'news' | 'image' | 'ref', Y = item idx

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
      schema: schema,
      responseFormat: Constants.CONTENT_AND_ARTIFACT,
    }
  );
}

/**
 * Creates a search tool with a schema that dynamically includes the country field
 * only when the searchProvider is 'serper'.
 *
 * @param config - The search tool configuration
 * @returns A DynamicStructuredTool with a schema that depends on the searchProvider
 */
export const createSearchTool = (
  config: t.SearchToolConfig = {}
): DynamicStructuredTool<typeof toolSchema> => {
  const {
    searchProvider = 'serper',
    serperApiKey,
    searxngInstanceUrl,
    searxngApiKey,
    rerankerType = 'cohere',
    topResults = 5,
    strategies = ['no_extraction'],
    filterContent = true,
    safeSearch = 1,
    firecrawlApiKey,
    firecrawlApiUrl,
    firecrawlFormats = ['markdown', 'html'],
    jinaApiKey,
    cohereApiKey,
    onSearchResults: _onSearchResults,
    onGetHighlights,
  } = config;

  const logger = config.logger || createDefaultLogger();

  const schemaObject: {
    query: z.ZodString;
    date: z.ZodOptional<z.ZodNativeEnum<typeof DATE_RANGE>>;
    country?: z.ZodOptional<z.ZodString>;
  } = {
    query: querySchema,
    date: dateSchema,
  };

  if (searchProvider === 'serper') {
    schemaObject.country = countrySchema;
  }

  const toolSchema = z.object(schemaObject);

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
    logger,
  });

  if (!selectedReranker) {
    logger.warn('No reranker selected. Using default ranking.');
  }

  const sourceProcessor = createSourceProcessor(
    {
      reranker: selectedReranker,
      topResults,
      strategies,
      filterContent,
      logger,
    },
    firecrawlScraper
  );

  const search = createSearchProcessor({
    searchAPI,
    safeSearch,
    sourceProcessor,
    onGetHighlights,
    logger,
  });

  return createTool({
    search,
    schema: toolSchema,
    onSearchResults: _onSearchResults,
  });
};
