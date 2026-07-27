import { getEntry } from 'astro:content';
import type { Locale } from '../content/config';
import type { RelatedLink } from '../types/site';

function withReservationUrl(links: RelatedLink[], reservationUrl: string): RelatedLink[] {
  return links.map((link) =>
    link.id === 'reservation' ? { ...link, href: reservationUrl } : link,
  );
}

export async function getRelatedLinksData(lang: Locale, reservationUrl: string) {
  const relatedLinksEntry = await getEntry('related-links', `related-links.${lang}`);

  if (!relatedLinksEntry) {
    throw new Error(
      `Missing related-links content for locale "${lang}". Check src/content/related-links/related-links.${lang}.json`,
    );
  }

  return {
    heading: relatedLinksEntry.data.heading,
    links: withReservationUrl(relatedLinksEntry.data.links, reservationUrl),
  };
}
