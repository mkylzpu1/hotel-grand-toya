import type { APIRoute } from 'astro';
import { locales } from '../content/config';

export const prerender = true;

const BASE = import.meta.env.BASE_URL;

const STATIC_PATHS = [
  '',
  'rooms',
  'onsen',
  'cuisine',
  'facilities',
  'access',
  'faq',
  'news',
  'privacy',
  'information',
  'recruit',
];

export const GET: APIRoute = async ({ site }) => {
  const buildUrl = (lang: string, path: string) =>
    new URL(`${BASE}${lang}/${path ? `${path}/` : ''}`, site).href;

  const urlBlocks = STATIC_PATHS.flatMap((path) =>
    locales.map((lang) => {
      const alternates = locales
        .map(
          (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${buildUrl(l, path)}" />`,
        )
        .join('\n');
      const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${buildUrl('en', path)}" />`;

      return `  <url>
    <loc>${buildUrl(lang, path)}</loc>
${alternates}
${xdefault}
  </url>`;
    }),
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
