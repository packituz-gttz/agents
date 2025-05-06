/* eslint-disable no-console */
import axios from 'axios';

export interface FirecrawlScrapeOptions {
  formats?: string[];
  includeTags?: string[];
  excludeTags?: string[];
  headers?: Record<string, string>;
  waitFor?: number;
  timeout?: number;
}

interface ScrapeMetadata {
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
const getDomainName = (
  link: string,
  metadata?: ScrapeMetadata
): string | undefined => {
  try {
    const url = metadata?.sourceURL ?? metadata?.url ?? (link || '');
    const domain = new URL(url).hostname.replace(/^www\./, '');
    if (domain) {
      return domain;
    }
  } catch (e) {
    // URL parsing failed
    console.error('Error parsing URL:', e);
  }

  return;
};

export function getAttribution(
  link: string,
  metadata?: ScrapeMetadata
): string | undefined {
  if (!metadata) return getDomainName(link, metadata);

  const possibleAttributions = [
    metadata.ogSiteName,
    metadata['og:site_name'],
    metadata.title?.split('|').pop()?.trim(),
    metadata['twitter:site']?.replace(/^@/, ''),
  ];

  const attribution = possibleAttributions.find(
    (attr) => attr != null && typeof attr === 'string' && attr.trim() !== ''
  );
  if (attribution != null) {
    return attribution;
  }

  return getDomainName(link, metadata);
}

/**
 * Firecrawl scraper implementation
 * Uses the Firecrawl API to scrape web pages
 */
export class FirecrawlScraper {
  private apiKey: string;
  private apiUrl: string;
  private defaultFormats: string[];
  private timeout: number;

  constructor(config: FirecrawlScraperConfig = {}) {
    this.apiKey = config.apiKey ?? process.env.FIRECRAWL_API_KEY ?? '';

    const baseUrl =
      config.apiUrl ??
      process.env.FIRECRAWL_BASE_URL ??
      'https://api.firecrawl.dev';
    this.apiUrl = `${baseUrl.replace(/\/+$/, '')}/v1/scrape`;

    this.defaultFormats = config.formats ?? ['markdown', 'html'];
    this.timeout = config.timeout ?? 15000;

    if (!this.apiKey) {
      console.warn('FIRECRAWL_API_KEY is not set. Scraping will not work.');
    }

    console.log(`Firecrawl scraper initialized with API URL: ${this.apiUrl}`);
  }

  /**
   * Scrape a single URL
   * @param url URL to scrape
   * @param options Scrape options
   * @returns Scrape response
   */
  async scrapeUrl(
    url: string,
    options: FirecrawlScrapeOptions = {}
  ): Promise<[string, FirecrawlScrapeResponse]> {
    if (!this.apiKey) {
      return [
        url,
        {
          success: false,
          error: 'FIRECRAWL_API_KEY is not set',
        },
      ];
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          url,
          formats: options.formats || this.defaultFormats,
          includeTags: options.includeTags,
          excludeTags: options.excludeTags,
          headers: options.headers,
          waitFor: options.waitFor,
          timeout: options.timeout ?? this.timeout,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: this.timeout,
        }
      );

      return [url, response.data];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return [
        url,
        {
          success: false,
          error: `Firecrawl API request failed: ${errorMessage}`,
        },
      ];
    }
  }

  /**
   * Extract content from scrape response
   * @param response Scrape response
   * @returns Extracted content or empty string if not available
   */
  extractContent(response: FirecrawlScrapeResponse): string {
    if (!response.success || !response.data) {
      return '';
    }

    // Prefer markdown content if available
    if (response.data.markdown != null) {
      return response.data.markdown;
    }

    // Fall back to HTML content
    if (response.data.html != null) {
      return response.data.html;
    }

    // Fall back to raw HTML content
    if (response.data.rawHtml != null) {
      return response.data.rawHtml;
    }

    return '';
  }

  /**
   * Extract metadata from scrape response
   * @param response Scrape response
   * @returns Metadata object
   */
  extractMetadata(response: FirecrawlScrapeResponse): ScrapeMetadata {
    if (!response.success || !response.data || !response.data.metadata) {
      return {};
    }

    return response.data.metadata;
  }
}

/**
 * Create a Firecrawl scraper instance
 * @param config Scraper configuration
 * @returns Firecrawl scraper instance
 */
export const createFirecrawlScraper = (
  config: FirecrawlScraperConfig = {}
): FirecrawlScraper => {
  return new FirecrawlScraper(config);
};
