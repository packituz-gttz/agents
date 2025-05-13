import * as cheerio from 'cheerio';
import type { References, MediaReference } from './types';

export function processContent(
  html: string,
  markdown: string
): {
  markdown: string;
} & References {
  // Use Maps for deduplication and fast access - they maintain insertion order
  const linkMap = new Map<string, MediaReference>();
  const imageMap = new Map<string, MediaReference>();
  const videoMap = new Map<string, MediaReference>();

  const $ = cheerio.load(html, {
    xmlMode: false,
  });

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

  // Create index maps directly from the deduplicated maps
  const linkIndexMap = new Map<string, number>();
  let index = 1;
  linkMap.forEach((_, url) => {
    linkIndexMap.set(url, index++);
  });

  const imageIndexMap = new Map<string, number>();
  index = 1;
  imageMap.forEach((_, url) => {
    imageIndexMap.set(url, index++);
  });

  const videoIndexMap = new Map<string, number>();
  index = 1;
  videoMap.forEach((_, url) => {
    videoIndexMap.set(url, index++);
  });

  // Process markdown
  let result = '';
  let lastIndex = 0;
  const mdLinkRegex = /(!?)\[(.*?)\]\(([^\s"]+)(?:\s+"([^"]*)")?\)/g;
  let mdMatch;

  while ((mdMatch = mdLinkRegex.exec(markdown)) !== null) {
    const [fullMatch, isImage, text, url, title] = mdMatch;
    const titlePart = title ? ` "${title}"` : '';
    const matchStart = mdMatch.index;

    result += markdown.substring(lastIndex, matchStart);
    lastIndex = matchStart + fullMatch.length;

    if (isImage === '!' && imageIndexMap.has(url)) {
      result += `![${text}](image#${imageIndexMap.get(url)}${titlePart})`;
    } else if (videoIndexMap.has(url)) {
      result += `[${text}](video#${videoIndexMap.get(url)}${titlePart})`;
    } else if (linkIndexMap.has(url)) {
      result += `[${text}](link#${linkIndexMap.get(url)}${titlePart})`;
    } else {
      result += fullMatch;
    }
  }

  result += markdown.substring(lastIndex);

  // Convert maps to arrays for the return structure
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
