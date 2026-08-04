import { defineCollection, z } from 'astro:content';

const imagePath = z.string().transform((path) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
});

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
  src: imagePath,
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
    name: z.string(), // 施設名（フル）
    postalCode: z.string(),
    address: z.string(), // 郵便番号を含まない住所本体
    tel: z.string(),
    fax: z.string(),
    email: z.string(),
    businessHours: z.string(), // 電話受付時間など
    contactLabels: z.object({
      address: z.string(),
      tel: z.string(),
      fax: z.string(),
      contact: z.string(),
    }),
    reservationUrl: z.string(),
    reservationLabel: z.string().optional(),
    footer: z.object({
      guideHeading: z.string(),
      infoHeading: z.string(),
      reservationHeading: z.string(),
      reservationExternalText: z.string(),
      reservationExternalNote: z.string(),
      copyright: z.string(),
      mobileTelLabel: z.string(),
      mobileReserveLabel: z.string(),
    }),
  }),
});
const navigation = defineCollection({
  type: 'data',
  schema: z.object({
    primaryNavItems: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
        en: z.string(),
        icon: z.string(),
      }),
    ),
    secondaryNavItems: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      }),
    ),
    reserveCta: z.string(),
    reserveNoteLabel: z.string(),
    phoneAriaLabel: z.string(),
    menuOpenLabel: z.string(),
    menuCloseLabel: z.string(),
    siteInfoHeading: z.string(),
    langSwitcherLabel: z.string(),
    navAriaLabel: z.string(),
    drawerNavAriaLabel: z.string(),
    logoAlt: z.string(),
    search: z.object({
      openLabel: z.string(), // 「サイト内検索を開く」
      placeholder: z.string(), // 「客室名やキーワードで検索」
      noResultsLabel: z.string(), // 「該当する情報が見つかりませんでした」
      emptyStateLabel: z.string(), // 「客室・温泉・お料理・館内施設などを検索できます」
      navigateHintLabel: z.string(), // 「移動」
      openHintLabel: z.string(), // 「開く」
      clearButtonLabel: z.string(), // 「検索語をクリア」
    }),
    bottomNav: z.object({
      searchLabel: z.string(),
      telLabel: z.string(),
      reserveLabel: z.string(),
      menuLabel: z.string(),
    }),
  }),
});

// トップのヒーローセクション
const hero = defineCollection({
  type: 'data',
  schema: z.object({
    image: imagePath,
    imageAlt: z.string(),
    eyebrow: z.string(),
    titleLines: z.array(z.string()),
    description: z.string(),
  }),
});

// トップページの各コンテンツセクション（客室・温泉・お料理・館内 等）
const topSections = defineCollection({
  type: 'data',
  schema: z.object({
    menuLabel: z.string().optional(), // 管理画面側の表示ラベル（セクション一覧での識別用）
    order: z.number(),
    sectionId: z.string().optional(),
    icon: z.string(),
    eyebrow: z.string(),
    titleLines: z.array(z.string()).optional(),
    description: z.array(z.string()).optional(),
    priceHighlight: z.string().optional(),
    linkText: z.string().optional(),
    linkHref: z.string().optional(),
    secondaryLinkText: z.string().optional(),
    secondaryLinkHref: z.string().optional(),
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
    heroImage: imagePath,
    heroImageAlt: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    accessList: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
    note: z.string(),
    shuttleNote: z.string(),
    detailLinkText: z.string(),
    mapEmbedUrl: z.string(),
    mapTitle: z.string(),
    sceneryHeading: z.string(),
    sceneryDescription: z.string(),
    sceneryItems: z.array(
      z.object({
        img: imagePath,
        title: z.string(),
        note: z.string(),
      }),
    ),
    sceneryLinkText: z.string(),
  }),
});

// 温泉ページ（宿泊・日帰り共通の施設紹介 + 利用区分別の案内）
// 汎用の label/value ペア → 用途ごとに明示フィールド化
const labeledValue = z.object({
  label: z.string(),
  value: z.string(),
});

// ── 04-1 基本設定 ──
const onsenPageMeta = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    usageHeading: z.string(),
    quickNav: z.array(z.object({ href: z.string(), label: z.string() })),
  }),
});

// ── 04-2 泉質・効能（4項目を明示フィールドに） ──
const onsenQuality = defineCollection({
  type: 'data',
  schema: z.object({
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    waterQuality: labeledValue, // 泉質
    benefits: labeledValue, // 効能
    characteristics: labeledValue, // 温泉の特徴
    sourceInfo: labeledValue, // 源泉情報
  }),
});

// ── 04-3 温泉施設紹介（可変長なのでlistのまま） ──
const onsenFacilities = defineCollection({
  type: 'data',
  schema: z.object({
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    hoursLabel: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        image: imagePath,
        imageAlt: z.string(),
        description: z.string(),
        hours: z.string(),
      }),
    ),
    notes: z.array(z.string()).optional(),
  }),
});

// ── 04-4 宿泊のお客様向け利用案内 ──
const onsenUsageStay = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    hours: labeledValue, // 利用時間
    amenities: labeledValue, // アメニティ
    usageNotes: labeledValue, // 利用上の注意
  }),
});

// ── 04-5 日帰り入浴のお客様向け利用案内 ──
const onsenUsageDayuse = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    fee: labeledValue.optional(), // 入浴料金
    receptionHours: labeledValue.optional(), // 受付時間
    usageHours: labeledValue.optional(), // 利用時間
    usageNotes: labeledValue.optional(), // 利用上の注意
    items: z.array(labeledValue).optional(),
    rentalsLabel: z.string().optional(),
    rentals: z.array(labeledValue).optional(),
    notes: z.array(z.string()).optional(),
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
  src: imagePath.optional(),
  alt: z.string().optional(),
});

const roomsPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    intro: z.object({
      icon: z.string(),
    }),
    priceNote: z.string().optional(),
    importantNotice: z.string().optional(),
    stayNotice: z.object({
      checkInLabel: z.string(),
      checkInValue: z.string(),
      checkOutLabel: z.string(),
      checkOutValue: z.string(),
      paymentLabel: z.string(),
      paymentValue: z.string(),
      cancellationLabel: z.string(),
      cancellationValue: z.string(),
    }),
    // ページ内アンカーナビ。「和室」「洋室」の2リンクのみ。
    quickNav: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      }),
    ),
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
  }),
});

// top-sections と同じ「1客室タイプ＝1ファイル」構成。
const roomTypeItem = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number(), // 表示順（数字が小さいほど上）
    categoryId: z.string(), // 旧 sections[].id 相当（例: "japanese" / "western"）。言語共通・アンカーIDとしても使用
    id: z.string(), // 客室タイプ固有ID（言語共通）
    icon: z.string(),
    eyebrow: z.string(),
    name: z.string(),
    description: z.array(z.string()),
    image: roomGalleryItem,
    basicInfo: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    priceLabel: z.string().optional(),
    priceFrom: z.string().optional(),
    floors: z.array(
      z.object({
        label: z.string(),
        reservationName: z.string(),
        reservationUrl: z.string().url().optional(),
        badges: z.array(z.string()).optional(),
        images: z.array(roomGalleryItem).max(3),
        description: z.array(z.string()),
        isFirstFloor: z.boolean().optional(),
      }),
    ),
  }),
});

const cuisinePlanItem = z.object({
  id: z.string().optional(), // dinner.plans では必須運用、breakfast では省略可
  name: z.string(),
  nameEn: z.string().optional(),
  image: z.object({
    src: imagePath,
    alt: z.string(),
  }),
  description: z.array(z.string()),
  recommendedFor: z.string().optional(),
  menuExample: z
    .object({
      heading: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  seasonalNote: z.string(),
  reservationHref: z.string().optional(),
});

const cuisinePageMeta = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    reservationLinkLabel: z.string(),
    intro: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      description: z.array(z.string()),
    }),
    icon: z.string(),
    quickNav: z.array(z.object({ href: z.string(), label: z.string() })),
  }),
});

const cuisineDinnerSection = defineCollection({
  type: 'data',
  schema: z.object({
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    description: z.array(z.string()),
    comparisonNote: z.string().optional(),
    recommendedForLabel: z.string().optional(),
    plans: z.array(cuisinePlanItem),
  }),
});

const cuisineBreakfastSection = defineCollection({
  type: 'data',
  schema: z.object({
    icon: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    description: z.array(z.string()),
    plan: cuisinePlanItem,
  }),
});

const cuisineDiningVenues = defineCollection({
  type: 'data',
  schema: z.object({
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
});

const cuisineGuestConsiderations = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        icon: z.string(),
        heading: z.string(),
        description: z.string(),
      }),
    ),
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
  isFeatured: z.boolean().optional(),
  icon: z.string().optional(), // サービス一覧ページのアイコン表示用
});
const activityItem = z.object({
  id: z.string(),
  name: z.string(),
  shopName: z.string().optional(),
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
  isPartner: z.boolean().optional(),
  partnerBadgeLabel: z.string().optional(),
  includedInPlans: z
    .array(
      z.object({
        name: z.string(),
        href: z.string(),
      }),
    )
    .optional(),
  categories: z.array(z.string()).optional(), // 複数カテゴリに属してよい
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
    icon: z.string(),
    quickNav: z.array(z.object({ href: z.string(), label: z.string() })),
    facilitiesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      hoursLabel: z.string(), // 「営業時間」
      feeLabel: z.string(), // 「料金」
      paymentLabel: z.string(), // 「支払方法」
      languagesLabel: z.string(), // 「対応言語」
      contactFallbackLabel: z.string(), // 未確定項目時のフォールバック文言
      items: z.array(facilityItem),
    }),
    servicesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      feeLabel: z.string(), // 「料金」
      plansLabel: z.string(), // 「コース」
      receptionHoursLabel: z.string(), // 「受付時間」
      reservationMethodLabel: z.string(), // 「予約方法」
      hoursLabel: z.string(), // 「利用時間」(バッジ用)
      items: z.array(serviceItem),
    }),
    activitiesSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      partnerHeading: z.string(),
      otherHeading: z.string(),
      categoryFilters: z.array(z.object({ id: z.string(), label: z.string() })),
      allCategoryLabel: z.string(), // 例: "すべて"
      partnerBadgeDefaultLabel: z.string(), // 「おすすめ」(itemごとの上書き未設定時)
      includedInPlansHeading: z.string(), // 「この体験が含まれるプラン」
      includedInPlansHeadingShort: z.string(), // 「含まれるプラン」
      officialSiteLinkLabel: z.string(), // 「公式サイトを見る」
      officialSiteLinkLabelShort: z.string(), // 「公式サイト」
      items: z.array(activityItem),
    }),
    usageNotice: z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
  }),
});

const accessPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    quickNav: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      }),
    ),
    byTrain: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      nearestStation: z.string(),
      step1Badge: z.string(),
      step2Badge: z.string(),
      step3Badge: z.string().optional(),
      toStationSuffix: z.string(), // 「まで」
      fromStationAccessSuffix: z.string(), // 「からのアクセス」
      step3Heading: z.string().optional(), // 「バス停からホテルまで」
      step3SubLabel: z.string().optional(), // 「（バスご利用の場合）」
      walkLabel: z.string().optional(), // 「徒歩」
      linkLabel: z.string().optional(), // 「路線・時刻表を見る」（各optionでも上書き可）
      officialTimetableLabel: z.string().optional(), // 「JR時刻表を見る（外部サイト）」
      departures: z.array(
        z.object({
          from: z.string(),
          boardingStation: z.string(),
          trainName: z.string(),
          duration: z.string(),
        }),
      ),
      toHotelOptions: z.array(
        z.object({
          method: z.string(),
          line: z.string().optional(),
          boarding: z.string().optional(),
          alighting: z.string().optional(),
          duration: z.string(),
          frequency: z.string().optional(),
          note: z.string().optional(),
          url: z.string().optional(),
          linkLabel: z.string().optional(), // 個別リンク文言を上書きしたい場合
        }),
      ),
      walkToHotel: z
        .object({
          duration: z.string(),
          distance: z.string().optional(),
          note: z.string().optional(),
        })
        .optional(),
      shuttleAvailable: z.string().optional(),
      officialTimetableUrl: z.string().optional(),
    }),
    byCar: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      step1Badge: z.string(),
      step2Badge: z.string(),
      step1Heading: z.string(), // 「最寄ICまで」
      step2Heading: z.string(), // 「ICからホテルまで」
      departures: z.array(
        z.object({
          from: z.string(),
          ic: z.string(),
          duration: z.string(),
        }),
      ),
      fromIc: z.array(
        z.object({
          ic: z.string(),
          duration: z.string(),
        }),
      ),
    }),
    byBus: z
      .object({
        icon: z.string(),
        eyebrow: z.string(),
        heading: z.string(),
        from: z.string(),
        to: z.string(),
        duration: z.string(),
        frequency: z.string().optional(),
        note: z.string().optional(),
        url: z.string().optional(),
        connectionLabel: z.string().optional(), // 「乗り換えなし・直行」
        timetableLabel: z.string().optional(), // 「時刻表を見る」
      })
      .optional(),
    map: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
      embedUrl: z.string(),
      openMapUrl: z.string(),
      routeUrl: z.string(),
      noMapText: z.string().optional(), // 「地図を準備中です」
      openMapLabel: z.string(), // 「Googleマップで開く」
      routeLabel: z.string(), // 「ルート案内」
    }),
    parking: z.object({
      heading: z.string(),
      notes: z.array(z.string()),
    }),
    surroundings: z.object({
      heading: z.string(),
      items: z.array(z.object({ label: z.string(), duration: z.string() })),
    }),
  }),
});

const faqPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    categories: z.array(
      z.object({
        id: z.string(), // タブ切替用のスラッグ（例: "checkin"）
        icon: z.string(), // SectionEyebrow等と同じ1〜2文字アイコン
        label: z.string(),
        items: z.array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    ),
    qaSection: z.object({
      icon: z.string(),
      eyebrow: z.string(),
      heading: z.string(),
    }),
    contact: z.object({
      leadText: z.string(), // 「ご不明な点がございましたら、お気軽にお問い合わせください」
      emailNote: z.string(), // 「メールでのお問い合わせ」
    }),
  }),
});

const relatedLinksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    heading: z.string(),
    links: z.array(
      z.object({
        id: z.string(), // ページを一意に識別するキー（rooms / onsen / reservation など）
        href: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        icon: z.string(),
        label: z.string(),
      }),
    ),
  }),
});

const newsPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    categoryFilters: z.array(z.object({ id: z.string(), label: z.string() })),
    allCategoryLabel: z.string(),
    emptyLabel: z.string(),
    importantLabel: z.string(),
  }),
});

const news = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string().optional(),
    date: z.string(),
    category: z.enum(['お知らせ', 'イベント', 'メンテナンス', 'キャンペーン']),
    isImportant: z.boolean().optional(),
    title: z.string(),
    body: z.array(z.string()),
  }),
});

/* ---------------------------------------------------------
 * 1. プライバシーポリシー
 * ------------------------------------------------------- */
const privacySection = z.object({
  id: z.string(), // 目次のアンカーID (例: "sec-1")
  heading: z.string(), // 例: "1．個人情報保護方針"
  intro: z.string().optional(), // 箇条書きの前に置く導入文
  paragraphs: z.array(z.string()).optional(), // 通常の段落
  list: z.array(z.string()).optional(), // 箇条書き
});

const privacyPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    intro: z.object({
      eyebrow: z.string(),
      heading: z.string(),
    }),
    sections: z.array(privacySection),
  }),
});

/* ---------------------------------------------------------
 * 2. 関連情報(福利厚生)
 * ------------------------------------------------------- */
const welfareProgram = z.object({
  name: z.string(),
});

const informationPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    welfareSection: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      description: z.string(),
      items: z.array(welfareProgram),
    }),
  }),
});

/* ---------------------------------------------------------
 * 3. 採用情報
 * ------------------------------------------------------- */
const recruitJobSchema = z.object({
  status: z.enum(['open', 'closed']).default('open'), // 募集中 / 終了
  icon: z.enum(['chef-hat', 'bed-double', 'concierge-bell']), // 写真が無い場合に出すアイコンのキー
  image: z
    .object({
      src: imagePath, // 例: "/images/recruit/kitchen-staff.jpg"
      alt: z.string(),
    })
    .optional(), // 写真がある場合はこちらを優先表示
  title: z.string(), // 職種名（例: 厨房スタッフ）
  employmentType: z.string(), // 正社員 / パート 等
  recruitCount: z.number(), // 採用人数
  recruitCountLabel: z.string(), // 「採用人数 {count}名」のようなテンプレート文言。{count}が数値に置換される
  summary: z.string(), // 求職者向けのやさしい仕事紹介文
  duties: z.array(z.string()), // 主な仕事内容（箇条書き）
  salaryType: z.string(),
  salaryRoughLabel: z.string(), // ざっくり表示（例: "月給18万円台〜"）
  workingHours: z.string(), // 就業時間の要約
  holidays: z.string(), // 休日・休暇の要約
  tags: z.array(z.string()), // "未経験歓迎" 等のバッジ
});

const recruitProcessStepSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const recruitBenefitSchema = z.object({
  icon: z.enum(['shield-check', 'home', 'car', 'shirt', 'globe', 'sparkles']), // lucideアイコンキー
  label: z.string(),
});

const recruitPage = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageTitleEn: z.string(),
    icon: z.string(),
    heading: z.string(), // 改行込みの見出し
    description: z.array(z.string()),
    emailAddress: z.string(),
    tel: z.string(),
    telLabel: z.string(),
    emailLabel: z.string(),

    // --- ここから追加 ---
    workLife: z.object({
      heading: z.string(),
      description: z.string(),
      points: z.array(z.string()), // 職場の特徴を箇条書きで
      photos: z.array(
        z.object({
          src: imagePath, // 例: "/images/recruit/kitchen.jpg"
          alt: z.string(),
        }),
      ),
    }),

    positionsHeading: z.string(),
    positionsDescription: z.string(),
    positions: z.array(recruitJobSchema), // 募集職種。増減はこの配列を編集するだけ

    processHeading: z.string(),
    processDescription: z.string(),
    process: z.array(recruitProcessStepSchema), // 採用までの流れ（STEP表示）

    benefitsHeading: z.string(),
    benefits: z.array(recruitBenefitSchema),
    // --- ここまで追加 ---
  }),
});

export const collections = {
  site,
  navigation,
  hero,
  access,
  'top-sections': topSections,
  'onsen-page-meta': onsenPageMeta,
  'onsen-quality': onsenQuality,
  'onsen-facilities': onsenFacilities,
  'onsen-usage-stay': onsenUsageStay,
  'onsen-usage-dayuse': onsenUsageDayuse,
  'rooms-page': roomsPage,
  rooms: roomTypeItem,
  'cuisine-page-meta': cuisinePageMeta,
  'cuisine-dinner': cuisineDinnerSection,
  'cuisine-breakfast': cuisineBreakfastSection,
  'cuisine-venues': cuisineDiningVenues,
  'cuisine-guest-considerations': cuisineGuestConsiderations,
  'facilities-page': facilitiesPage,
  'access-page': accessPage,
  'faq-page': faqPage,
  'related-links': relatedLinksCollection,
  'news-page': newsPage,
  news,
  'privacy-page': privacyPage,
  'information-page': informationPage,
  'recruit-page': recruitPage,
};
