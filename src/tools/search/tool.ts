import { z } from 'zod';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';
import type { RunnableConfig } from '@langchain/core/runnables';
import type * as t from './types';
import { createSearchAPI, createSourceProcessor } from './search';
import { createFirecrawlScraper } from './firecrawl';
import { expandHighlights } from './highlights';
import { formatResultsForLLM } from './format';
import { createDefaultLogger } from './utils';
import { createReranker } from './rerankers';
import { Constants } from '@/common';

const DEFAULT_QUERY_DESCRIPTION = `
GUIDELINES:
- Start broad, then narrow: Begin with key concepts, then refine with specifics
- Think like sources: Use terminology experts would use in the field
- Consider perspective: Frame queries from different viewpoints for better results
- Quality over quantity: A precise 3-4 word query often beats lengthy sentences

TECHNIQUES (combine for power searches):
- EXACT PHRASES: Use quotes ("climate change report")
- EXCLUDE TERMS: Use minus to remove unwanted results (-wikipedia)
- SITE-SPECIFIC: Restrict to websites (site:edu research)
- FILETYPE: Find specific documents (filetype:pdf study)
- OR OPERATOR: Find alternatives (electric OR hybrid cars)
- DATE RANGE: Recent information (data after:2020)
- WILDCARDS: Use * for unknown terms (how to * bread)
- SPECIFIC QUESTIONS: Use who/what/when/where/why/how
- DOMAIN TERMS: Include technical terminology for specialized topics
- CONCISE TERMS: Prioritize keywords over sentences
`.trim();

const DEFAULT_COUNTRY_DESCRIPTION = `Country code to localize search results.
Use standard 2-letter country codes: "us", "uk", "ca", "de", "fr", "jp", "br", etc.
Provide this when the search should return results specific to a particular country.
Examples:
- "us" for United States (default)
- "de" for Germany
- "in" for India
`.trim();

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
    country,
    proMode = true,
    maxSources = 5,
    onSearchResults,
  }: {
    query: string;
    country?: string;
    proMode?: boolean;
    maxSources?: number;
    onSearchResults: t.SearchToolConfig['onSearchResults'];
  }): Promise<t.SearchResultData> {
    try {
      const result = await searchAPI.getSources({ query, country, safeSearch });
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
      const { query, country: _c } = params;
      const country = typeof _c === 'string' && _c ? _c : undefined;
      const searchResult = await search({
        query,
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

  const querySchema = z.string().describe(DEFAULT_QUERY_DESCRIPTION);
  const schemaObject: {
    query: z.ZodString;
    country?: z.ZodOptional<z.ZodString>;
  } = {
    query: querySchema,
  };

  if (searchProvider === 'serper') {
    schemaObject.country = z
      .string()
      .optional()
      .describe(DEFAULT_COUNTRY_DESCRIPTION);
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
