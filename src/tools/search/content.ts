import * as cheerio from 'cheerio';

interface MediaReference {
  originalUrl: string;
  title?: string;
  text?: string;
}

export function processContent(
  html: string,
  markdown: string
): {
  processedMarkdown: string;
  links: MediaReference[];
  images: MediaReference[];
  videos: MediaReference[];
} {
  const links: MediaReference[] = [];
  const images: MediaReference[] = [];
  const videos: MediaReference[] = [];

  const $ = cheerio.load(html, {
    xmlMode: false,
  });

  $('a, img, video, iframe').each((_, element) => {
    const el = $(element);
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'a') {
      const href = el.attr('href');
      if (href == null || !href) return;

      if (el.find('img, video').length === 0) {
        links.push({
          originalUrl: href,
          title: el.attr('title'),
          text: el.text().trim(),
        });
      }
    } else if (tagName === 'img') {
      const src = el.attr('src');
      if (src == null || !src) return;

      images.push({
        originalUrl: src,
        title: el.attr('alt') ?? el.attr('title'),
      });
    } else if (
      tagName === 'video' ||
      (tagName === 'iframe' &&
        (el.attr('src')?.includes('youtube') === true ||
          el.attr('src')?.includes('vimeo') === true))
    ) {
      const src = el.attr('src');
      if (src == null || !src) return;

      videos.push({
        originalUrl: src,
        title: el.attr('title'),
      });
    }
  });

  const linkMap = new Map<string, number>();
  const imageMap = new Map<string, number>();
  const videoMap = new Map<string, number>();

  links.forEach((link, index) => {
    linkMap.set(link.originalUrl, index + 1);
  });

  images.forEach((image, index) => {
    imageMap.set(image.originalUrl, index + 1);
  });

  videos.forEach((video, index) => {
    videoMap.set(video.originalUrl, index + 1);
  });

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

    if (isImage === '!' && imageMap.has(url)) {
      result += `![${text}](image#${imageMap.get(url)}${titlePart})`;
    } else if (videoMap.has(url)) {
      result += `[${text}](video#${videoMap.get(url)}${titlePart})`;
    } else if (linkMap.has(url)) {
      result += `[${text}](link#${linkMap.get(url)}${titlePart})`;
    } else {
      result += fullMatch;
    }
  }

  result += markdown.substring(lastIndex);

  return {
    processedMarkdown: result,
    links,
    images,
    videos,
  };
}
