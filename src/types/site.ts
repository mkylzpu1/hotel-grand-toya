import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../content/config';

// 型はすべて content/config.ts の zod スキーマから導出する（手書きの二重管理をしない）
export type SiteContent = CollectionEntry<'site'>['data'];
export type NavigationContent = CollectionEntry<'navigation'>['data'];
export type RelatedLink = CollectionEntry<'related-links'>['data']['links'][number];
export type SectionData = CollectionEntry<'top-sections'>['data'];

export interface LangLink {
  code: Locale;
  label: string;
  href: string;
  active: boolean;
}
