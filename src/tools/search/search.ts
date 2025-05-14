/* eslint-disable no-console */
import axios from 'axios';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import type * as t from './types';
import { FirecrawlScraper } from './firecrawl';
import { BaseReranker } from './rerankers';
import { getAttribution } from './utils';

const chunker = {
  cleanText: (text: string): string => {
    if (!text) return '';

    /** Normalized all line endings to '\n' */
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    /** Handle multiple backslashes followed by newlines
     * This replaces patterns like '\\\\\\n' with a single newline */
    const fixedBackslashes = normalizedText.replace(/\\+\n/g, '\n');

    /** Cleaned up consecutive newlines, tabs, and spaces around newlines */
    const cleanedNewlines = fixedBackslashes.replace(/[\t ]*\n[\t \n]*/g, '\n');

    /** Cleaned up excessive spaces and tabs */
    const cleanedSpaces = cleanedNewlines.replace(/[ \t]+/g, ' ');

    return cleanedSpaces.trim();
  },
  splitText: async (
    text: string,
    options?: {
      chunkSize?: number;
      chunkOverlap?: number;
      separators?: string[];
    }
  ): Promise<string[]> => {
    const chunkSize = options?.chunkSize ?? 150;
    const chunkOverlap = options?.chunkOverlap ?? 50;
    const separators = options?.separators || ['\n\n', '\n'];

    const splitter = new RecursiveCharacterTextSplitter({
      separators,
      chunkSize,
      chunkOverlap,
    });

    return await splitter.splitText(text);
  },

  splitTexts: async (
    texts: string[],
    options?: {
      chunkSize?: number;
      chunkOverlap?: number;
      separators?: string[];
    }
  ): Promise<string[][]> => {
    // Split multiple texts
    const promises = texts.map((text) =>
      chunker.splitText(text, options).catch((error) => {
        console.error('Error splitting text:', error);
        return [text];
      })
    );
    return Promise.all(promises);
  },
};

const createSourceUpdateCallback = (sourceMap: Map<string, t.ValidSource>) => {
  return (link: string, update?: Partial<t.ValidSource>): void => {
    const source = sourceMap.get(link);
    if (source) {
      sourceMap.set(link, {
        ...source,
        ...update,
      });
    }
  };
};

const getHighlights = async ({
  query,
  content,
  reranker,
  topResults = 5,
}: {
  content: string;
  query: string;
  reranker?: BaseReranker;
  topResults?: number;
}): Promise<t.Highlight[] | undefined> => {
  if (!content) {
    console.warn('No content provided for highlights');
    return;
  }
  if (!reranker) {
    console.warn('No reranker provided for highlights');
    return;
  }

  try {
    const documents = await chunker.splitText(content);
    if (Array.isArray(documents)) {
      return await reranker.rerank(query, documents, topResults);
    } else {
      console.error(
        'Expected documents to be an array, got:',
        typeof documents
      );
      return;
    }
  } catch (error) {
    console.error('Error in content processing:', error);
    return;
  }
};

const createSerperAPI = (
  apiKey?: string
): {
  getSources: (
    query: string,
    numResults?: number,
    storedLocation?: string
  ) => Promise<t.SearchResult>;
} => {
  const config = {
    apiKey: apiKey ?? process.env.SERPER_API_KEY,
    apiUrl: 'https://google.serper.dev/search',
    defaultLocation: 'us',
    timeout: 10000,
  };

  if (config.apiKey == null || config.apiKey === '') {
    throw new Error('SERPER_API_KEY is required for SerperAPI');
  }

  const getSources = async (
    query: string,
    numResults: number = 8,
    storedLocation?: string
  ): Promise<t.SearchResult> => {
    if (!query.trim()) {
      return { success: false, error: 'Query cannot be empty' };
    }

    try {
      const searchLocation = (
        storedLocation ?? config.defaultLocation
      ).toLowerCase();

      const payload = {
        q: query,
        num: Math.min(Math.max(1, numResults), 10),
        gl: searchLocation,
      };

      const response = await axios.post(config.apiUrl, payload, {
        headers: {
          'X-API-KEY': config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: config.timeout,
      });

      const data = response.data;
      const results: t.SearchResultData = {
        organic: data.organic,
        images: data.images ?? [],
        topStories: data.topStories ?? [],
        knowledgeGraph: data.knowledgeGraph as t.KnowledgeGraphResult,
        answerBox: data.answerBox as t.AnswerBoxResult,
        peopleAlsoAsk: data.peopleAlsoAsk as t.PeopleAlsoAskResult[],
        relatedSearches: data.relatedSearches as string[],
      };

      return { success: true, data: results };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: `API request failed: ${errorMessage}` };
    }
  };

  return { getSources };
};

const createSearXNGAPI = (
  instanceUrl?: string,
  apiKey?: string
): {
  getSources: (
    query: string,
    numResults?: number,
    storedLocation?: string
  ) => Promise<t.SearchResult>;
} => {
  const config = {
    instanceUrl: instanceUrl ?? process.env.SEARXNG_INSTANCE_URL,
    apiKey: apiKey ?? process.env.SEARXNG_API_KEY,
    defaultLocation: 'all',
    timeout: 10000,
  };

  if (config.instanceUrl == null || config.instanceUrl === '') {
    throw new Error('SEARXNG_INSTANCE_URL is required for SearXNG API');
  }

  const getSources = async (
    query: string,
    numResults: number = 8,
    storedLocation?: string
  ): Promise<t.SearchResult> => {
    if (!query.trim()) {
      return { success: false, error: 'Query cannot be empty' };
    }

    try {
      // Ensure the instance URL ends with /search
      if (config.instanceUrl == null || config.instanceUrl === '') {
        return { success: false, error: 'Instance URL is not defined' };
      }

      let searchUrl = config.instanceUrl;
      if (!searchUrl.endsWith('/search')) {
        searchUrl = searchUrl.replace(/\/$/, '') + '/search';
      }

      // Prepare parameters for SearXNG
      const params: Record<string, string | number> = {
        q: query,
        format: 'json',
        pageno: 1,
        categories: 'general',
        language: 'all',
        safesearch: 0,
        engines: 'google,bing,duckduckgo',
        max_results: Math.min(Math.max(1, numResults), 20),
      };

      if (storedLocation != null && storedLocation !== 'all') {
        params.language = storedLocation;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (config.apiKey != null && config.apiKey !== '') {
        headers['X-API-Key'] = config.apiKey;
      }

      const response = await axios.get(searchUrl, {
        headers,
        params,
        timeout: config.timeout,
      });

      const data = response.data;

      // Transform SearXNG results to match SerperAPI format
      const organicResults = (data.results ?? [])
        .slice(0, numResults)
        .map((result: t.SearXNGResult) => ({
          title: result.title ?? '',
          link: result.url ?? '',
          snippet: result.content ?? '',
          date: result.publishedDate ?? '',
        }));

      // Extract image results if available
      const imageResults = (data.results ?? [])
        .filter((result: t.SearXNGResult) => result.img_src)
        .slice(0, 6)
        .map((result: t.SearXNGResult) => ({
          title: result.title ?? '',
          imageUrl: result.img_src ?? '',
        }));

      // Format results to match SerperAPI structure
      const results: t.SearchResultData = {
        organic: organicResults,
        images: imageResults,
        topStories: [],
        // Use undefined instead of null for optional properties
        relatedSearches: data.suggestions ?? [],
      };

      return { success: true, data: results };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `SearXNG API request failed: ${errorMessage}`,
      };
    }
  };

  return { getSources };
};

export const createSearchAPI = (
  config: t.SearchConfig
): {
  getSources: (
    query: string,
    numResults?: number,
    storedLocation?: string
  ) => Promise<t.SearchResult>;
} => {
  const {
    searchProvider = 'serper',
    serperApiKey,
    searxngInstanceUrl,
    searxngApiKey,
  } = config;

  if (searchProvider.toLowerCase() === 'serper') {
    return createSerperAPI(serperApiKey);
  } else if (searchProvider.toLowerCase() === 'searxng') {
    return createSearXNGAPI(searxngInstanceUrl, searxngApiKey);
  } else {
    throw new Error(
      `Invalid search provider: ${searchProvider}. Must be 'serper' or 'searxng'`
    );
  }
};

export const createSourceProcessor = (
  config: t.ProcessSourcesConfig = {},
  scraperInstance?: FirecrawlScraper
): {
  processSources: (
    result: t.SearchResult,
    numElements: number,
    query: string,
    proMode?: boolean
  ) => Promise<t.SearchResultData>;
  topResults: number;
} => {
  if (!scraperInstance) {
    throw new Error('Firecrawl scraper instance is required');
  }
  const {
    topResults = 5,
    // strategies = ['no_extraction'],
    // filterContent = true,
    reranker,
  } = config;

  const firecrawlScraper = scraperInstance;

  const webScraper = {
    scrapeMany: async ({
      query,
      links,
    }: {
      query: string;
      links: string[];
    }): Promise<Array<t.ScrapeResult>> => {
      console.log(`Scraping ${links.length} links with Firecrawl`);
      const promises: Array<Promise<t.ScrapeResult>> = [];
      try {
        for (const currentLink of links) {
          const promise: Promise<t.ScrapeResult> = firecrawlScraper
            .scrapeUrl(currentLink, {})
            .then(([url, response]) => {
              const attribution = getAttribution(url, response.data?.metadata);
              if (response.success && response.data) {
                const [content, references] =
                  firecrawlScraper.extractContent(response);
                return {
                  url,
                  references,
                  attribution,
                  content: chunker.cleanText(content),
                } as t.ScrapeResult;
              }

              return {
                url,
                attribution,
                error: true,
                content: `Failed to scrape ${url}: ${response.error ?? 'Unknown error'}`,
              } as t.ScrapeResult;
            })
            .then(async (result) => {
              try {
                if (result.error != null) {
                  console.error(
                    `Error scraping ${result.url}: ${result.content}`
                  );
                  return {
                    ...result,
                  };
                }
                const highlights = await getHighlights({
                  query,
                  reranker,
                  content: result.content,
                });
                return {
                  ...result,
                  highlights,
                };
              } catch (error) {
                console.error('Error processing scraped content:', error);
                return {
                  ...result,
                };
              }
            })
            .catch((error) => {
              console.error(`Error scraping ${currentLink}:`, error);
              return {
                url: currentLink,
                error: true,
                content: `Failed to scrape ${currentLink}: ${error.message ?? 'Unknown error'}`,
              };
            });
          promises.push(promise);
        }
        return await Promise.all(promises);
      } catch (error) {
        console.error('Error in scrapeMany:', error);
        return [];
      }
    },
  };

  const fetchContents = async ({
    links,
    query,
    target,
    onContentScraped,
  }: {
    links: string[];
    query: string;
    target: number;
    onContentScraped?: (link: string, update?: Partial<t.ValidSource>) => void;
  }): Promise<void> => {
    const initialLinks = links.slice(0, target);
    // const remainingLinks = links.slice(target).reverse();
    const results = await webScraper.scrapeMany({ query, links: initialLinks });
    for (const result of results) {
      if (result.error === true) {
        continue;
      }
      const { url, content, attribution, references, highlights } = result;
      onContentScraped?.(url, {
        content,
        attribution,
        references,
        highlights,
      });
    }
  };

  const processSources = async (
    result: t.SearchResult,
    numElements: number,
    query: string,
    proMode: boolean = false
  ): Promise<t.SearchResultData> => {
    try {
      if (!result.data) {
        return {
          organic: [],
          topStories: [],
          images: [],
          relatedSearches: [],
        };
      } else if (!result.data.organic) {
        return result.data;
      }

      if (!proMode) {
        const wikiSources = result.data.organic.filter((source) =>
          source.link.includes('wikipedia.org')
        );

        if (!wikiSources.length) {
          return result.data;
        }

        const wikiSourceMap = new Map<string, t.ValidSource>();
        wikiSourceMap.set(wikiSources[0].link, wikiSources[0]);
        const onContentScraped = createSourceUpdateCallback(wikiSourceMap);
        await fetchContents({
          query,
          target: 1,
          onContentScraped,
          links: [wikiSources[0].link],
        });

        for (let i = 0; i < result.data.organic.length; i++) {
          const source = result.data.organic[i];
          const updatedSource = wikiSourceMap.get(source.link);
          if (updatedSource) {
            result.data.organic[i] = {
              ...source,
              ...updatedSource,
            };
          }
        }

        return result.data;
      }

      const sourceMap = new Map<string, t.ValidSource>();
      const allLinks: string[] = [];

      for (const source of result.data.organic) {
        if (source.link) {
          allLinks.push(source.link);
          sourceMap.set(source.link, source);
        }
      }

      if (allLinks.length === 0) {
        return result.data;
      }

      const onContentScraped = createSourceUpdateCallback(sourceMap);
      await fetchContents({
        links: allLinks,
        query,
        onContentScraped,
        target: numElements,
      });

      for (let i = 0; i < result.data.organic.length; i++) {
        const source = result.data.organic[i];
        const updatedSource = sourceMap.get(source.link);
        if (updatedSource) {
          result.data.organic[i] = {
            ...source,
            ...updatedSource,
          };
        }
      }

      const successfulSources = result.data.organic
        .filter(
          (source) =>
            source.content != null && !source.content.startsWith('Failed')
        )
        .slice(0, numElements);

      if (successfulSources.length > 0) {
        result.data.organic = successfulSources;
      }
      return result.data;
    } catch (error) {
      console.error('Error in processSources:', error);
      return {
        organic: [],
        topStories: [],
        images: [],
        relatedSearches: [],
        ...result.data,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    processSources,
    topResults,
  };
};
