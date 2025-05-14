/* eslint-disable no-console */
import type * as t from './types';

export const getDomainName = (
  link: string,
  metadata?: t.ScrapeMetadata
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
  metadata?: t.ScrapeMetadata
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
