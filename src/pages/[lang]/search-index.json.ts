import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
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

function excerpt(lines: string[] | string, max = 90): string {
  const text = Array.isArray(lines) ? lines.join(' ') : lines;
  return text.slice(0, max);
}

function findByLang<T extends { id: string; data: unknown }>(
  entries: T[],
  lang: Locale,
): T | undefined {
  return entries.find((e) => localeFromId(e.id) === lang);
}

// entries内のurl(先頭/付きの絶対パス)にbaseを付与する
function withBase(url: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${url}`;
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params['lang'] as Locale;
  const entries: SearchEntry[] = [];

  // --- 客室ページ ---
  const roomsPageEntry = findByLang(await getCollection('rooms-page'), lang);
  const roomTypeEntries = await getCollection('rooms', (entry) => localeFromId(entry.id) === lang);
  if (roomsPageEntry) {
    const page = roomsPageEntry.data;
    for (const room of roomTypeEntries) {
      entries.push({
        title: room.data.name,
        excerpt: excerpt(room.data.description),
        url: `/${lang}/rooms/#${room.data.id}`,
        category: page.pageTitle,
      });
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
    // 温泉施設(大浴場・露天風呂など)
    for (const item of page.facilities.items) {
      entries.push({
        title: item.name,
        excerpt: excerpt(item.description),
        url: `/${lang}/onsen/#facilities`,
        category: page.pageTitle,
      });
    }
    // 泉質・効能
    for (const item of page.quality.items) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.value),
        url: `/${lang}/onsen/#quality`,
        category: page.pageTitle,
      });
    }
    // 宿泊のお客様(アメニティ、利用時間、注意事項)
    for (const item of page.stay.items) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.value),
        url: `/${lang}/onsen/#${page.stay.id}`,
        category: page.pageTitle,
      });
    }
    // 日帰り入浴のお客様(料金、時間、注意事項)
    for (const item of page.dayUse.items) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.value),
        url: `/${lang}/onsen/#${page.dayUse.id}`,
        category: page.pageTitle,
      });
    }
    // 日帰り入浴:貸出品(タオル等)
    for (const item of page.dayUse.rentals) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.value),
        url: `/${lang}/onsen/#${page.dayUse.id}`,
        category: page.pageTitle,
      });
    }
    // 日帰り入浴:備考(シャンプー・リンス等の完備情報はここに入っている)
    if (page.dayUse.notes) {
      for (const note of page.dayUse.notes) {
        entries.push({
          title: page.dayUse.heading,
          excerpt: excerpt(note),
          url: `/${lang}/onsen/#${page.dayUse.id}`,
          category: page.pageTitle,
        });
      }
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
    // 食事会場(部屋食・大広間など)
    entries.push({
      title: page.diningVenues.inRoom.heading,
      excerpt: excerpt(page.diningVenues.inRoom.description),
      url: `/${lang}/cuisine/`,
      category: page.pageTitle,
    });
    entries.push({
      title: page.diningVenues.hall.heading,
      excerpt: excerpt(page.diningVenues.hall.description),
      url: `/${lang}/cuisine/`,
      category: page.pageTitle,
    });
    // アレルギー等、食事に関する配慮事項
    for (const item of page.guestConsiderations) {
      entries.push({
        title: item.heading,
        excerpt: excerpt(item.description),
        url: `/${lang}/cuisine/`,
        category: page.pageTitle,
      });
    }
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
    // 利用上の注意
    for (const note of page.usageNotice.items) {
      entries.push({
        title: page.usageNotice.heading,
        excerpt: excerpt(note),
        url: `/${lang}/facilities/`,
        category: page.pageTitle,
      });
    }
  }

  // --- アクセスページ ---
  const accessEntry = findByLang(await getCollection('access-page'), lang);
  if (accessEntry) {
    const page = accessEntry.data;
    entries.push({
      title: page.pageTitle,
      excerpt: excerpt(page.byTrain.heading + ' ' + page.byCar.heading),
      url: `/${lang}/access/`,
      category: page.pageTitle,
    });
    // 電車での経路(洞爺駅までの区間 → ホテルまでの手段)
    for (const dep of page.byTrain.departures) {
      entries.push({
        title: `${dep.from} → ${page.byTrain.nearestStation}`,
        excerpt: excerpt(`${dep.trainName} ${dep.duration}`),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    for (const opt of page.byTrain.toHotelOptions) {
      entries.push({
        title: opt.method,
        excerpt: excerpt(opt.note ?? `${opt.duration}`),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 車での経路
    for (const dep of page.byCar.departures) {
      entries.push({
        title: `${dep.from} → ${dep.ic}`,
        excerpt: excerpt(dep.duration),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 駐車場の注意事項
    for (const note of page.parking.notes) {
      entries.push({
        title: page.parking.heading,
        excerpt: excerpt(note),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 周辺観光地までの所要時間
    for (const item of page.surroundings.items) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.duration),
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

  // --- お知らせ ---
  const newsPageEntry = findByLang(await getCollection('news-page'), lang);
  if (newsPageEntry) {
    const page = newsPageEntry.data;
    const newsEntries = await getCollection('news', (entry) => localeFromId(entry.id) === lang);
    for (const post of newsEntries) {
      if (!post.data.title) continue;
      entries.push({
        title: post.data.title,
        excerpt: excerpt(post.data.body),
        url: `/${lang}/news/#${post.data.slug ?? post.id.split('.')[0]}`,
        category: page.pageTitle,
      });
    }
  }

  return new Response(JSON.stringify(entries.map((e) => ({ ...e, url: withBase(e.url) }))), {
    headers: { 'Content-Type': 'application/json' },
  });
};
