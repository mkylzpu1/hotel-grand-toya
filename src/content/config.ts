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

// 客室ページ（客室タイプ一覧＋各客室の詳細情報。比較検討〜予約導線を担う）
const roomAmenity = z.object({
  key: z.string(),
  label: z.string(),
  note: z.string().optional(),
});

const roomGalleryItem = z.object({
  label: z.string(),
  src: z.string().optional(),
  alt: z.string().optional(),
});

const roomsPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    intro: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      description: z.array(z.string()),
    }),
    // ページ内アンカーナビ。「和室」「洋室」の2リンクのみ。
    quickNav: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      })
    ),
    basicInfoLabels: z.object({
      size: z.string(),
      capacity: z.string(),
      view: z.string(),
      bedding: z.string(),
      smoking: z.string(),
      // 階数は該当タイプ（1階客室など）にのみ表示するため任意ラベル扱い
      floor: z.string(),
    }),
    amenitiesIcon: z.string(),
    amenitiesEyebrow: z.string(),
    amenitiesHeading: z.string(),
    detailCtaText: z.string(),
    // 客室タイプを問わず共通の標準設備。和室・洋室それぞれのセクション末尾に1回だけ表示する。
    commonAmenities: z.array(roomAmenity),
    // 1階客室共通の注意書き。isFirstFloor: true の客室にだけ表示する。
    firstFloorNotice: z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
    // 和室セクション・洋室セクション。ページ内の大枠はこの2つのみ。
    sections: z.array(
      z.object({
        id: z.string(),
        navLabel: z.string(),
        icon: z.string(),
        eyebrow: z.string(),
        heading: z.string(),
        catchcopy: z.string(),
        intro: z.array(z.string()),
        rooms: z.array(
          z.object({
            id: z.string(),
            icon: z.string(),
            eyebrow: z.string(),
            name: z.string(),
            description: z.array(z.string()),
            image: roomGalleryItem,
            size: z.string().optional(),
            capacity: z.string(),
            bedding: z.string(),
            view: z.string(),
            smoking: z.string(),
            floors: z.array(
              z.object({
                label: z.string(),
                reservationName: z.string(),
                badges: z.array(z.string()).optional(),
                images: z.array(roomGalleryItem).max(3),
                description: z.array(z.string()),
                isFirstFloor: z.boolean().optional(),
              })
            ),
          })
        ),
      })
    ),
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


// content/config.ts

const cuisinePage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    intro: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      description: z.array(z.string()),
    }),
    quickNav: z.array(
      z.object({ href: z.string(), label: z.string() })
    ),
    dinner: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      mainImage: roomGalleryItem,
      gallery: z.array(roomGalleryItem),
      menuExample: z.object({
        heading: z.string(),
        items: z.array(z.string()),
      }),
      description: z.array(z.string()),
      seasonalNote: z.string(),
    }),
    breakfast: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      mainImage: roomGalleryItem,
      gallery: z.array(roomGalleryItem),
      description: z.array(z.string()),
      seasonalNote: z.string(),
    }),
    diningVenues: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      inRoom: z.object({
        heading: z.string(),
        image: roomGalleryItem,
        description: z.array(z.string()),
        note: z.string(),
      }),
      hall: z.object({
        heading: z.string(),
        image: roomGalleryItem,
        description: z.array(z.string()),
        note: z.string(),
      }),
      planNote: z.array(z.string()),
    }),
    guestConsiderations: z.array(
      z.object({
        icon: z.string(),
        heading: z.string(),
        description: z.string(),
      })
    ),
    notices: z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
  }),
});

const facilityItem = z.object({
  id: z.string(),
  name: z.string(),
  image: roomGalleryItem.optional(),
  description: z.array(z.string()),
  hours: z.string().optional(),
  location: z.string().optional(),
  fee: z.string().optional(), // 「無料」「有料（○○円）」など
  payment: z.string().optional(),
  target: z.string().optional(),
  // 多言語対応など、他項目に当てはまらない補足
  languages: z.array(z.string()).optional(),
  staffSupport: z.string().optional(),
});

const serviceItem = z.object({
  id: z.string(),
  name: z.string(),
  image: roomGalleryItem.optional(),
  description: z.array(z.string()),
  fee: z.string().optional(),
  plans: z.array(z.string()).optional(),
  duration: z.string().optional(),
  hours: z.string().optional(),
  receptionHours: z.string().optional(),
  reservationMethod: z.string().optional(),
  location: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

const activityItem = z.object({
  id: z.string(),
  name: z.string(),
  image: roomGalleryItem.optional(),
  description: z.array(z.string()),
  location: z.string().optional(),
  accessFromHotel: z.string().optional(),
  duration: z.string().optional(),
  hours: z.string().optional(),
  closedDays: z.string().optional(),
  period: z.string().optional(),
  fee: z.string().optional(),
  rentalItems: z.string().optional(),
  planDetails: z.string().optional(),
  reservationMethod: z.string().optional(),
  targetAge: z.string().optional(),
  beginnerFriendly: z.string().optional(),
  rainyDayPolicy: z.string().optional(),
  itemsToBring: z.string().optional(),
  officialSite: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

const facilitiesPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    intro: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      description: z.array(z.string()),
    }),
    quickNav: z.array(z.object({ href: z.string(), label: z.string() })),
    facilitiesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(facilityItem),
    }),
    servicesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(serviceItem),
    }),
    activitiesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      // 「ホテル内施設ではない」ことを明示するバッジ文言
      externalBadgeLabel: z.string(),
      items: z.array(activityItem),
    }),
    usageNotice: z.object({
      heading: z.string(),
      items: z.array(z.string()),
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
  'rooms-page': roomsPage,
  'cuisine-page': cuisinePage,
  'facilities-page': facilitiesPage,
};
