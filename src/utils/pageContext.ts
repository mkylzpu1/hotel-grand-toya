// src/utils/pageContext.ts
import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';
import { locales, localeFromId, type Locale } from '../content/config';
import { getRelatedLinksData } from './relatedLinks';

const LANG_LABELS: Record<Locale, string> = {
  ja: 'JP',
  en: 'EN',
  zh: 'CH',
  ko: 'KR',
};

/**
 * 各ページ共通の getStaticPaths。
 * 指定したコレクションにエントリが存在する言語のみビルドする。
 */
export async function getLocalizedStaticPaths(collectionName: CollectionKey) {
  const entries = await getCollection(collectionName);
  return entries.map((entry) => ({ params: { lang: localeFromId(entry.id) } }));
}

/**
 * ページ共通の基本コンテキスト（site / navigation / 該当ページ / 関連リンク / 言語切替リンク）をまとめて取得する。
 */
export async function getPageContext<C extends CollectionKey>(
  lang: Locale,
  collectionName: C,
  pathPrefix: string, // 例: 'rooms', 'faq'
) {
  const [siteEntry, navigationEntry, pageEntry] = await Promise.all([
    getEntry('site', `site.${lang}`),
    getEntry('navigation', `navigation.${lang}`),
    getEntry(collectionName, `${collectionName}.${lang}`),
  ]);

  if (!siteEntry || !navigationEntry || !pageEntry) {
    throw new Error(`Missing content for locale "${lang}" in collection "${collectionName}".`);
  }

  const { reservationUrl } = siteEntry.data;
  const relatedLinksData = await getRelatedLinksData(lang, reservationUrl);

  const availableEntries = await getCollection(collectionName);
  const availableLocales = new Set(availableEntries.map((entry) => localeFromId(entry.id)));
  const langLinks = locales
    .filter((code) => availableLocales.has(code))
    .map((code) => ({
      code,
      label: LANG_LABELS[code],
      href: `/${code}/${pathPrefix}/`,
      active: code === lang,
    }));

  return {
    siteEntry,
    navigationEntry,
    pageEntry: pageEntry as CollectionEntry<C>,
    relatedLinksData,
    langLinks,
  };
}
