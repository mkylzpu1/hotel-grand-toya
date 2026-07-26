import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { locales, localeFromId, type Locale } from '../../content/config';

export const prerender = true;

export async function getStaticPaths() {
  return locales.map((lang) => ({
    params: { lang },
  }));
}

type SearchEntry = {
  title: string;
  excerpt: string;
  url: string;
  category: string;
};

function excerpt(lines: string[] | string, max = 80): string {
  const text = Array.isArray(lines) ? lines.join(' ') : lines;
  return text.slice(0, max);
}

function findByLang<T extends CollectionEntry<any>>(entries: T[], lang: Locale): T | undefined {
  return entries.find((e) => localeFromId(e.id) === lang);
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Locale;
  const entries: SearchEntry[] = [];

  // --- 客室ページ ---
  const roomsEntry = findByLang(await getCollection('rooms-page'), lang);
  if (roomsEntry) {
    const page = roomsEntry.data;
    for (const section of page.sections) {
      for (const room of section.rooms) {
        entries.push({
          title: room.name,
          excerpt: excerpt(room.description),
          url: `/${lang}/rooms/#${room.id}`,
          category: page.pageTitle,
        });
      }
    }
  }

  // --- 温泉ページ ---
  const onsenEntry = findByLang(await getCollection('onsen-page'), lang);
  if (onsenEntry) {
    const page = onsenEntry.data;
    entries.push({
      title: page.pageTitle,
      excerpt: excerpt(page.quality.heading + ' ' + page.facilities.heading),
      url: `/${lang}/onsen/`,
      category: page.pageTitle,
    });
    for (const item of page.facilities.items) {
      entries.push({
        title: item.name,
        excerpt: excerpt(item.description),
        url: `/${lang}/onsen/`,
        category: page.pageTitle,
      });
    }
  }

  // --- お料理ページ ---
  const cuisineEntry = findByLang(await getCollection('cuisine-page'), lang);
  if (cuisineEntry) {
    const page = cuisineEntry.data;
    for (const plan of page.dinner.plans) {
      entries.push({
        title: plan.name,
        excerpt: excerpt(plan.description),
        url: plan.id ? `/${lang}/cuisine/#${plan.id}` : `/${lang}/cuisine/`,
        category: page.pageTitle,
      });
    }
    entries.push({
      title: page.breakfast.plan.name,
      excerpt: excerpt(page.breakfast.plan.description),
      url: `/${lang}/cuisine/`,
      category: page.pageTitle,
    });
  }

  // --- 館内施設ページ ---
  const facilitiesEntry = findByLang(await getCollection('facilities-page'), lang);
  if (facilitiesEntry) {
    const page = facilitiesEntry.data;
    const groups = [
      page.facilitiesSection.items,
      page.servicesSection.items,
      page.activitiesSection.items,
    ];
    for (const items of groups) {
      for (const item of items) {
        entries.push({
          title: item.name,
          excerpt: excerpt(item.description),
          url: `/${lang}/facilities/#${item.id}`,
          category: page.pageTitle,
        });
      }
    }
  }

  // --- アクセスページ(FAQ部分のみ個別エントリー化) ---
  const accessEntry = findByLang(await getCollection('access-page'), lang);
  if (accessEntry) {
    const page = accessEntry.data;
    entries.push({
      title: page.pageTitle,
      excerpt: excerpt(page.byTrain.heading + ' ' + page.byCar.heading),
      url: `/${lang}/access/`,
      category: page.pageTitle,
    });
    for (const qa of page.faq.items) {
      entries.push({
        title: qa.question,
        excerpt: excerpt(qa.answer),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
  }

  // --- FAQページ ---
  const faqEntry = findByLang(await getCollection('faq-page'), lang);
  if (faqEntry) {
    const page = faqEntry.data;
    for (const category of page.categories) {
      for (const qa of category.items) {
        entries.push({
          title: qa.question,
          excerpt: excerpt(qa.answer),
          url: `/${lang}/faq/#${category.id}`,
          category: page.pageTitle,
        });
      }
    }
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
};
