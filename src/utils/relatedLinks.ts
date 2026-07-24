// src/utils/relatedLinks.ts
import { getEntry } from 'astro:content';
import type { Locale } from '../content/config';
import type { RelatedLink } from '../components/common/RelatedLinks.astro';

function withReservationUrl(links: RelatedLink[], reservationUrl: string): RelatedLink[] {
  return links.map((link) =>
    link.id === 'reservation' ? { ...link, href: reservationUrl } : link
  );
}

/**
 * 全ページ共通の関連リンクデータを取得する。
 * 予約URLはサイト共通の値で自動的に差し替え済み。
 */
export async function getRelatedLinksData(lang: Locale, reservationUrl: string) {
  const relatedLinksEntry = await getEntry('related-links', `related-links.${lang}`);

  if (!relatedLinksEntry) {
    throw new Error(`Missing related-links content for locale "${lang}". Check src/content/related-links/related-links.${lang}.json`);
  }

  return {
    heading: relatedLinksEntry.data.heading,
    links: withReservationUrl(relatedLinksEntry.data.links, reservationUrl),
  };
}
