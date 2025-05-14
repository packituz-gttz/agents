import * as cheerio from 'cheerio';
import type { References, MediaReference } from './types';

export function processContent(
  html: string,
  markdown: string
): {
  markdown: string;
} & References {
  // Extract all URLs from HTML
  const linkMap = new Map<string, MediaReference>();
  const imageMap = new Map<string, MediaReference>();
  const videoMap = new Map<string, MediaReference>();

  const $ = cheerio.load(html, {
    xmlMode: false,
  });

  // Extract all media references
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href != null && href) {
      linkMap.set(href, {
        originalUrl: href,
        title: $(el).attr('title'),
        text: $(el).text().trim(),
      });
    }
  });

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src != null && src) {
      imageMap.set(src, {
        originalUrl: src,
        title: $(el).attr('alt') ?? $(el).attr('title'),
      });
    }
  });

  $('video[src], iframe[src*="youtube"], iframe[src*="vimeo"]').each(
    (_, el) => {
      const src = $(el).attr('src');
      if (src != null && src) {
        videoMap.set(src, {
          originalUrl: src,
          title: $(el).attr('title'),
        });
      }
    }
  );

  // Create lookup maps with indices
  const linkIndexMap = new Map<string, number>();
  const imageIndexMap = new Map<string, number>();
  const videoIndexMap = new Map<string, number>();

  Array.from(linkMap.keys()).forEach((url, i) => linkIndexMap.set(url, i + 1));
  Array.from(imageMap.keys()).forEach((url, i) =>
    imageIndexMap.set(url, i + 1)
  );
  Array.from(videoMap.keys()).forEach((url, i) =>
    videoIndexMap.set(url, i + 1)
  );

  // Process the markdown
  // This simple approach focuses on direct URL replacement
  // which works regardless of the markdown structure
  let result = markdown;

  // Replace each URL one by one, starting with the longest URLs first to avoid partial matches
  const allUrls = [
    ...Array.from(imageMap.keys()).map((url) => ({
      url,
      type: 'image',
      idx: imageIndexMap.get(url),
    })),
    ...Array.from(videoMap.keys()).map((url) => ({
      url,
      type: 'video',
      idx: videoIndexMap.get(url),
    })),
    ...Array.from(linkMap.keys()).map((url) => ({
      url,
      type: 'link',
      idx: linkIndexMap.get(url),
    })),
  ].sort((a, b) => b.url.length - a.url.length);

  // Create a function to escape special characters in URLs for regex
  function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Replace each URL in the markdown
  for (const { url, type, idx } of allUrls) {
    // Create a regex that captures URLs in markdown links
    // This pattern specifically looks for the URL portion within markdown link syntax
    const regex = new RegExp(`\\(${escapeRegex(url)}(?:\\s+"[^"]*")?\\)`, 'g');

    result = result.replace(regex, (match) => {
      // Keep any title attribute that might exist
      const titleMatch = match.match(/\s+"([^"]*)"/);
      const titlePart = titleMatch ? ` "${titleMatch[1]}"` : '';

      return `(${type}#${idx}${titlePart})`;
    });
  }

  return {
    markdown: result,
    links: Array.from(linkMap.values()),
    images: Array.from(imageMap.values()),
    videos: Array.from(videoMap.values()),
  };
}
