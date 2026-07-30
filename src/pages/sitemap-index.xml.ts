import type { APIRoute } from 'astro';

export const prerender = true;

const SITE = 'https://mkylzpu1.github.io';
const BASE = '/hotel-grand-toya/';
const LOCALES = ['ja', 'en', 'zh', 'ko'];

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

function buildUrl(lang: string, path: string) {
  return `${SITE}${BASE}${lang}/${path ? `${path}/` : ''}`;
}

export const GET: APIRoute = async () => {
  const urlBlocks = STATIC_PATHS.flatMap((path) =>
    LOCALES.map((lang) => {
      const alternates = LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${buildUrl(l, path)}" />`,
      ).join('\n');
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
