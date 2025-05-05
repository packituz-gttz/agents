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
  config: t.OpenDeepSearchToolConfig = {}
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

  const search = async (
    query: string,
    maxSources: number = 5,
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

  return tool<typeof SearchToolSchema>(
    async ({ query }) => {
      const searchResult = await search(query);
      const output = formatResultsForLLM(searchResult);
      return [output, undefined];
    },
    {
      name: Constants.WEB_SEARCH,
      description: `
    Initiates a real-time web search and returns results—including web pages, news articles, and images—each of which is assigned a unique citation anchor for programmatic referencing.
    
    **Citation Markers/Anchors:**
    - \ue202turn0searchN - Cites the Nth organic/web result (e.g. use \ue202turn0search0 for the first search result)
    - \ue202turn0newsN - Cites the Nth news/top story result
    - \ue202turn0imageN - Cites the Nth image result
    - \ue206 - Inserted as a group marker for a region supported by multiple sources, or for summary/grouped references. (You or the system can use this to signal a grouped citation area. E.g., after a summary paragraph supported by several sources, insert \ue206.)
    - \ue200 ... [anchors] ... \ue201 - Composite/group block delimiters. Use these to surround a block of text or a citation navlist/complex footnote, especially when citing a group of sources together. Example: \ue200cite\ue202turn0search1\ue202turn0news2\ue201
    - \ue203 ... \ue204 - Span delimiters: Mark the **start** (\ue203) and **end** (\ue204) of a specific region of text/claim you want to cite. The system will map this to a footnote or reference.
    
    **How to Use Markers in Your Output:**
    - **To cite a single source:** Put its anchor (e.g. \ue202turn0search0) immediately after the fact, claim, or quote.
        - Example: "The blackout affected millions \ue202turn0search0."
    - **To cite multiple sources for the same fact or paragraph:** Concatenate all relevant anchors together after the content.  
        - Example: "This is confirmed in several reports \ue202turn0search0\ue202turn0news1\ue206."
    - **To group sources for a summary or navlist:**  
        - Surround the block with \ue200...\ue201, and list the anchors to be grouped inside.  
          - Example: "Multiple expert analyses agree: \ue200navlist\ue202turn0search0\ue202turn0image0\ue201"
    - **For marking spans:**  
        - If you want to explicitly tie a reference to a region, bracket the start/end using \ue203 (start) and \ue204 (end):  
          - Example: \ue203Madrid suffered extensive power grid failures.\ue204\ue202turn0search0
    
    **Rules:**
    - Use *only* the provided anchors. Never invent, change, or omit anchors.
    - Do *not* use numeric/humanized placeholders like "Search 1" or "Image 2"; use the Unicode anchor exactly.
    - Always use the anchors in your answer where a citation/ref is needed, regardless of whether it's for text or images.
    
    **What each result includes:**  
    - Its anchor marker (for programmatic citation)
    - Title, snippet, date/time if present, url, source/attribution, highlights from the source if present
    `.trim(),
      schema: SearchToolSchema,
      responseFormat: Constants.CONTENT_AND_ARTIFACT,
    }
  );
};
