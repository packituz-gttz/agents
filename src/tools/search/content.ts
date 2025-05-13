import * as cheerio from 'cheerio';
import type { References, MediaReference } from './types';

export function processContent(
  html: string,
  markdown: string
): {
  markdown: string;
} & References {
  // 1. Only normalize if we detect problematic citation pattern
  // This avoids unnecessary regex work if there are no citations
  const hasCitations = /\[(\\+\[\d+\\+\])\]/g.test(markdown);
  const cleanedMarkdown = hasCitations
    ? normalizeMarkdownLinks(markdown)
    : markdown;

  // Use Maps for deduplication and fast access
  const linkMap = new Map<string, MediaReference>();
  const imageMap = new Map<string, MediaReference>();
  const videoMap = new Map<string, MediaReference>();

  // 2. Optimize Cheerio loading options
  const $ = cheerio.load(html, {
    xmlMode: false,
  });

  // 3. Single-pass collection to avoid multiple iterations
  $('a, img, video, iframe').each((_, element) => {
    const el = $(element);
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'a') {
      const href = el.attr('href');
      if (href == null || !href) return;

      if (el.find('img, video').length === 0 && !linkMap.has(href)) {
        linkMap.set(href, {
          originalUrl: href,
          title: el.attr('title'),
          text: el.text().trim(),
        });
      }
    } else if (tagName === 'img') {
      const src = el.attr('src');
      if (src == null || !src) return;

      if (!imageMap.has(src)) {
        imageMap.set(src, {
          originalUrl: src,
          title: el.attr('alt') ?? el.attr('title'),
        });
      }
    } else if (
      tagName === 'video' ||
      (tagName === 'iframe' &&
        (el.attr('src')?.includes('youtube') === true ||
          el.attr('src')?.includes('vimeo') === true))
    ) {
      const src = el.attr('src');
      if (src == null || !src) return;

      if (!videoMap.has(src)) {
        videoMap.set(src, {
          originalUrl: src,
          title: el.attr('title'),
        });
      }
    }
  });

  // 4. Create index maps directly with forEach to avoid extra loops
  const linkIndexMap = new Map<string, number>();
  const imageIndexMap = new Map<string, number>();
  const videoIndexMap = new Map<string, number>();

  let index = 1;
  linkMap.forEach((_, url) => {
    linkIndexMap.set(url, index++);
  });

  index = 1;
  imageMap.forEach((_, url) => {
    imageIndexMap.set(url, index++);
  });

  index = 1;
  videoMap.forEach((_, url) => {
    videoIndexMap.set(url, index++);
  });

  // 5. Process the cleaned markdown with a simple, standard regex
  let result = '';
  let lastIndex = 0;

  // 6. Enhanced regex with cache for better performance on long markdown
  const mdLinkRegex = /(!?)\[(.*?)\]\(([^\s"]+)(?:\s+"([^"]*)")?\)/g;
  let mdMatch;

  while ((mdMatch = mdLinkRegex.exec(cleanedMarkdown)) !== null) {
    const [fullMatch, isImage, text, url, title] = mdMatch;
    const titlePart = title ? ` "${title}"` : '';
    const matchStart = mdMatch.index;

    result += cleanedMarkdown.substring(lastIndex, matchStart);
    lastIndex = matchStart + fullMatch.length;

    // 7. Optimize lookup with if-else chain ordered by frequency
    if (linkIndexMap.has(url)) {
      result += `[${text}](link#${linkIndexMap.get(url)}${titlePart})`;
    } else if (isImage === '!' && imageIndexMap.has(url)) {
      result += `![${text}](image#${imageIndexMap.get(url)}${titlePart})`;
    } else if (videoIndexMap.has(url)) {
      result += `[${text}](video#${videoIndexMap.get(url)}${titlePart})`;
    } else {
      result += fullMatch;
    }
  }

  result += cleanedMarkdown.substring(lastIndex);

  // 8. Convert maps to arrays in one step
  const links = Array.from(linkMap.values());
  const images = Array.from(imageMap.values());
  const videos = Array.from(videoMap.values());

  return {
    markdown: result,
    links,
    images,
    videos,
  };
}

/**
 * Efficient normalization function that only processes citation patterns
 */
function normalizeMarkdownLinks(markdown: string): string {
  // More specific pattern to only replace citation-style links
  return markdown.replace(
    /\[(\\+\[(\d+)\\+\])\]\(([^)]+)\)/g,
    (match, bracketText, num, url) => {
      return `[note ${num}](${url})`;
    }
  );
}
