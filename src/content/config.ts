import { defineCollection, z } from 'astro:content';

// サポートする言語。Decap CMS の i18n 設定 (public/admin/config.yml) と一致させること。
export const locales = ['ja', 'en', 'zh', 'ko'] as const;
export type Locale = (typeof locales)[number];

// 各コレクションのファイル名は Decap CMS の i18n (structure: multiple_files) により
// `{slug}.{locale}.json` の形式になる。id は拡張子を除いた `{slug}.{locale}`。
// この末尾の locale をパースして言語別に取得する。
export function localeFromId(id: string): Locale {
  const locale = id.split('.').pop();
  if (!locale || !(locales as readonly string[]).includes(locale)) {
    throw new Error(`Invalid locale suffix in content id: "${id}"`);
  }
  return locale as Locale;
}

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  className: z.string().optional(),
  caption: z.string().optional(),
});

// サイト全体の基本設定・フッター文言
const site = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    address: z.string(),
    tel: z.string(),
    reservationUrl: z.string(),
    footer: z.object({
      guideHeading: z.string(),
      infoHeading: z.string(),
      reservationHeading: z.string(),
      reservationExternalText: z.string(),
      copyright: z.string(),
      mobileTelLabel: z.string(),
      mobileReserveLabel: z.string(),
    }),
  }),
});

// ヘッダー/ドロワーのナビゲーション
const navigation = defineCollection({
  type: 'data',
  schema: z.object({
    primaryNavItems: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
        en: z.string(),
        icon: z.string(),
      })
    ),
    secondaryNavItems: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      })
    ),
    reserveCta: z.string(),
    phoneAriaLabel: z.string(),
    menuOpenLabel: z.string(),
    menuCloseLabel: z.string(),
    siteInfoHeading: z.string(),
  }),
});

// トップのヒーローセクション
const hero = defineCollection({
  type: 'data',
  schema: z.object({
    image: z.string(),
    imageAlt: z.string(),
    eyebrow: z.string(),
    titleLines: z.array(z.string()),
    description: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
});

// トップページの各コンテンツセクション（客室・温泉・お料理・館内 等）
const topSections = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number(),
    sectionId: z.string().optional(),
    icon: z.string(),
    eyebrow: z.string(),
    titleLines: z.array(z.string()).optional(),
    description: z.array(z.string()).optional(),
    linkText: z.string().optional(),
    linkHref: z.string().optional(),
    centerText: z.boolean().optional(),
    showDivider: z.boolean().optional(),
    tallImagePosition: z.enum(['left', 'right']).optional(),
    images: z.array(imageSchema).optional(),
  }),
});

// アクセス・周辺観光セクション
const access = defineCollection({
  type: 'data',
  schema: z.object({
    heroImage: z.string(),
    heroImageAlt: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    accessList: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    note: z.string(),
    detailLinkText: z.string(),
    mapEmbedUrl: z.string(),
    mapTitle: z.string(),
    sceneryHeading: z.string(),
    sceneryDescription: z.string(),
    sceneryItems: z.array(
      z.object({
        img: z.string(),
        title: z.string(),
        note: z.string(),
      })
    ),
    sceneryLinkText: z.string(),
  }),
});

// 温泉ページ（宿泊・日帰り共通の施設紹介 + 利用区分別の案内）
const labeledItem = z.object({
  label: z.string(),
  value: z.string(),
});

const onsenPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    usageNav: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      })
    ),
    quality: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(labeledItem),
    }),
    facilities: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          image: z.string(),
          imageAlt: z.string(),
          description: z.string(),
          hours: z.string(),
        })
      ),
    }),
    stay: z.object({
      id: z.string(),
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(labeledItem),
      notes: z.array(z.string()).optional(),
    }),
    dayUse: z.object({
      id: z.string(),
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(labeledItem),
      notes: z.array(z.string()).optional(),
      ctaText: z.string(),
      ctaHref: z.string(),
      rentals: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
    }),
    related: z.object({
      heading: z.string(),
      links: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          icon: z.string(),
          image: z.string(),
          imageAlt: z.string(),
        })
      ),
    }),
  }),
});

export const collections = {
  site,
  navigation,
  hero,
  access,
  'top-sections': topSections,
  'onsen-page': onsenPage,
};
