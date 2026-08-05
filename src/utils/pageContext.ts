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
  return entries.map((entry: { id: string }) => ({ params: { lang: localeFromId(entry.id) } }));
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
  const availableLocales = new Set(
    availableEntries.map((entry: { id: string }) => localeFromId(entry.id)),
  );
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

export async function getCommonPageContext(lang: Locale) {
  const [siteEntry, navigationEntry] = await Promise.all([
    getEntry('site', `site.${lang}`),
    getEntry('navigation', `navigation.${lang}`),
  ]);

  if (!siteEntry || !navigationEntry) {
    throw new Error(`Missing common content for locale "${lang}".`);
  }

  const { reservationUrl } = siteEntry.data;
  const relatedLinksData = await getRelatedLinksData(lang, reservationUrl);

  return {
    siteEntry,
    navigationEntry,
    relatedLinksData,
  };
}

/**
 * ページごとに分割されたコンテンツ（page-meta / content / section 等）のデータを
 * 汎用的にマージするヘルパー。存在しない（undefined / null の）ソースは無視される。
 * 各ページファイルで手書きしていた `{...a.data, ...(b?.data ?? {})}` のような
 * スプレッド処理を共通化し、コレクション追加・変更時の書き漏れを防ぐ。
 * 引数の型をそのまま交差型として合成するため、後続の分割代入・プロパティアクセスは
 * すべてのソースの型を反映したものになる。
 */
type DefinedSources<Sources extends readonly unknown[]> = Sources extends [
  infer Head,
  ...infer Rest,
]
  ? [Head] extends [null | undefined]
    ? DefinedSources<Rest>
    : [NonNullable<Head>, ...DefinedSources<Rest>]
  : [];

type MergedPageData<Sources extends readonly unknown[]> =
  DefinedSources<Sources> extends [infer Head, ...infer Rest]
    ? Head & MergedPageData<Rest>
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};

export function mergePageData<Sources extends Array<Record<string, unknown> | null | undefined>>(
  ...sources: Sources
): MergedPageData<Sources> {
  return Object.assign({}, ...sources.filter(Boolean)) as MergedPageData<Sources>;
}

export async function getLangLinks<C extends CollectionKey>(
  lang: Locale,
  collectionName: C,
  pathPrefix: string,
) {
  const availableEntries = await getCollection(collectionName);
  const availableLocales = new Set(
    availableEntries.map((entry: { id: string }) => localeFromId(entry.id)),
  );

  return locales
    .filter((code) => availableLocales.has(code))
    .map((code) => ({
      code,
      label: LANG_LABELS[code],
      href: `/${code}/${pathPrefix}/`,
      active: code === lang,
    }));
}
