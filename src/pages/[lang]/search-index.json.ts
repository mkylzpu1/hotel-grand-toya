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
  const onsenMetaEntry = findByLang(await getCollection('onsen-page-meta'), lang);
  if (onsenMetaEntry) {
    const page = onsenMetaEntry.data;
    const qualityEntry = findByLang(await getCollection('onsen-quality'), lang);
    const facilitiesEntry = findByLang(await getCollection('onsen-facilities'), lang);
    const stayEntry = findByLang(await getCollection('onsen-usage-stay'), lang);
    const dayUseEntry = findByLang(await getCollection('onsen-usage-dayuse'), lang);

    if (qualityEntry && facilitiesEntry && stayEntry && dayUseEntry) {
      const quality = qualityEntry.data;
      const facilities = facilitiesEntry.data;
      const stay = stayEntry.data;
      const dayUse = dayUseEntry.data;
      entries.push({
        title: page.pageTitle,
        excerpt: excerpt(quality.heading + ' ' + facilities.heading),
        url: `/${lang}/onsen/`,
        category: page.pageTitle,
      });
      // 温泉施設(大浴場・露天風呂など)
      for (const item of facilities.items) {
        entries.push({
          title: item.name,
          excerpt: excerpt(item.description),
          url: `/${lang}/onsen/#facilities`,
          category: page.pageTitle,
        });
      }
      // 泉質・効能
      for (const item of [
        quality.waterQuality,
        quality.benefits,
        quality.characteristics,
        quality.sourceInfo,
      ]) {
        entries.push({
          title: item.label,
          excerpt: excerpt(item.value),
          url: `/${lang}/onsen/#quality`,
          category: page.pageTitle,
        });
      }
      // 宿泊のお客様(アメニティ、利用時間、注意事項)
      for (const item of [stay.hours, stay.amenities, stay.usageNotes]) {
        entries.push({
          title: item.label,
          excerpt: excerpt(item.value),
          url: `/${lang}/onsen/#${stay.id}`,
          category: page.pageTitle,
        });
      }
      // 日帰り入浴のお客様(料金、時間、注意事項)
      for (const item of [
        dayUse.fee,
        dayUse.receptionHours,
        dayUse.usageHours,
        dayUse.usageNotes,
      ].filter(Boolean)) {
        entries.push({
          title: item.label,
          excerpt: excerpt(item.value),
          url: `/${lang}/onsen/#${dayUse.id}`,
          category: page.pageTitle,
        });
      }
      // 日帰り入浴:貸出品(タオル等)
      for (const item of dayUse.rentals ?? []) {
        entries.push({
          title: item.label,
          excerpt: excerpt(item.value),
          url: `/${lang}/onsen/#${dayUse.id}`,
          category: page.pageTitle,
        });
      }
      // 日帰り入浴:備考(シャンプー・リンス等の完備情報はここに入っている)
      for (const note of dayUse.notes ?? []) {
        entries.push({
          title: dayUse.heading,
          excerpt: excerpt(note),
          url: `/${lang}/onsen/#${dayUse.id}`,
          category: page.pageTitle,
        });
      }
    }
  }

  // --- お料理ページ ---
  const cuisineMetaEntry = findByLang(await getCollection('cuisine-page-meta'), lang);
  if (cuisineMetaEntry) {
    const page = cuisineMetaEntry.data;
    const dinnerEntry = findByLang(await getCollection('cuisine-dinner'), lang);
    const breakfastEntry = findByLang(await getCollection('cuisine-breakfast'), lang);
    const venuesEntry = findByLang(await getCollection('cuisine-venues'), lang);
    const considerationsEntry = findByLang(
      await getCollection('cuisine-guest-considerations'),
      lang,
    );

    if (dinnerEntry && breakfastEntry && venuesEntry && considerationsEntry) {
      const dinner = dinnerEntry.data;
      const breakfast = breakfastEntry.data;
      const diningVenues = venuesEntry.data;
      const guestConsiderations = considerationsEntry.data.items;

      for (const plan of dinner.plans) {
        entries.push({
          title: plan.name,
          excerpt: excerpt(plan.description),
          url: plan.id ? `/${lang}/cuisine/#${plan.id}` : `/${lang}/cuisine/`,
          category: page.pageTitle,
        });
      }
      entries.push({
        title: breakfast.plan.name,
        excerpt: excerpt(breakfast.plan.description),
        url: `/${lang}/cuisine/`,
        category: page.pageTitle,
      });
      // 食事会場(部屋食・大広間など)
      entries.push({
        title: diningVenues.inRoom.heading,
        excerpt: excerpt(diningVenues.inRoom.description),
        url: `/${lang}/cuisine/`,
        category: page.pageTitle,
      });
      entries.push({
        title: diningVenues.hall.heading,
        excerpt: excerpt(diningVenues.hall.description),
        url: `/${lang}/cuisine/`,
        category: page.pageTitle,
      });
      // アレルギー等、食事に関する配慮事項
      for (const item of guestConsiderations) {
        entries.push({
          title: item.heading,
          excerpt: excerpt(item.description),
          url: `/${lang}/cuisine/`,
          category: page.pageTitle,
        });
      }
    }
  }

  // --- 館内施設ページ ---
  const facilitiesMetaEntry = findByLang(await getCollection('facilities-page-meta'), lang);
  const facilitiesSectionEntry = findByLang(await getCollection('facilities-section'), lang);
  const servicesSectionEntry = findByLang(await getCollection('facilities-services'), lang);
  const activitiesSectionEntry = findByLang(await getCollection('facilities-activities'), lang);
  const usageNoticeEntry = findByLang(await getCollection('facilities-usage-notice'), lang);
  const legacyFacilitiesContentEntry = findByLang(await getCollection('facilities-content'), lang);
  if (facilitiesMetaEntry) {
    const page = facilitiesMetaEntry.data;
    const facilitiesSection =
      facilitiesSectionEntry?.data ?? legacyFacilitiesContentEntry?.data?.facilitiesSection;
    const servicesSection =
      servicesSectionEntry?.data ?? legacyFacilitiesContentEntry?.data?.servicesSection;
    const activitiesSection =
      activitiesSectionEntry?.data ?? legacyFacilitiesContentEntry?.data?.activitiesSection;
    const usageNotice = usageNoticeEntry?.data ?? legacyFacilitiesContentEntry?.data?.usageNotice;
    const groups = [
      facilitiesSection?.items ?? [],
      servicesSection?.items ?? [],
      activitiesSection?.items ?? [],
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
    for (const note of usageNotice?.items ?? []) {
      entries.push({
        title: usageNotice?.heading ?? '',
        excerpt: excerpt(note),
        url: `/${lang}/facilities/`,
        category: page.pageTitle,
      });
    }
  }

  // --- アクセスページ ---
  const accessMetaEntry = findByLang(await getCollection('access-page-meta'), lang);
  const accessContentEntry = findByLang(await getCollection('access-content'), lang);
  if (accessMetaEntry && accessContentEntry) {
    const page = accessMetaEntry.data;
    const content = accessContentEntry.data;
    entries.push({
      title: page.pageTitle,
      excerpt: excerpt(content.byTrain.heading + ' ' + content.byCar.heading),
      url: `/${lang}/access/`,
      category: page.pageTitle,
    });
    // 電車での経路(洞爺駅までの区間 → ホテルまでの手段)
    for (const dep of content.byTrain.departures) {
      entries.push({
        title: `${dep.from} → ${content.byTrain.nearestStation}`,
        excerpt: excerpt(`${dep.trainName} ${dep.duration}`),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    for (const opt of content.byTrain.toHotelOptions) {
      entries.push({
        title: opt.method,
        excerpt: excerpt(opt.note ?? `${opt.duration}`),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 車での経路
    for (const dep of content.byCar.departures) {
      entries.push({
        title: `${dep.from} → ${dep.ic}`,
        excerpt: excerpt(dep.duration),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 駐車場の注意事項
    for (const note of content.parking.notes) {
      entries.push({
        title: content.parking.heading,
        excerpt: excerpt(note),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
    // 周辺観光地までの所要時間
    for (const item of content.surroundings.items) {
      entries.push({
        title: item.label,
        excerpt: excerpt(item.duration),
        url: `/${lang}/access/`,
        category: page.pageTitle,
      });
    }
  }

  // --- FAQページ ---
  const faqMetaEntry = findByLang(await getCollection('faq-page-meta'), lang);
  const faqCategoriesEntry = findByLang(await getCollection('faq-categories'), lang);
  if (faqMetaEntry && faqCategoriesEntry) {
    const page = faqMetaEntry.data;
    const categories = faqCategoriesEntry.data.categories;
    for (const category of categories) {
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
  const newsPageEntry = findByLang(await getCollection('news-page-meta'), lang);
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
