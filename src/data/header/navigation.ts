export interface PrimaryNavItem {
  href: string;
  label: string;
  en: string;
  icon: string;
}

export interface SecondaryNavItem {
  href: string;
  label: string;
}

// 主要コンテンツナビ（ヘッダー常設 + ドロワー上部）
export const primaryNavItems: PrimaryNavItem[] = [
  { href: '#rooms', label: '客室', en: 'Rooms', icon: '室' },
  { href: '#onsen', label: '温泉', en: 'Onsen', icon: '湯' },
  { href: '#food', label: 'お料理', en: 'Dinner', icon: '膳' },
  { href: '#facilities', label: '館内', en: 'Facilities', icon: '館' },
  { href: '#access', label: 'アクセス', en: 'Access', icon: '道' },
];

// 利用規約・会社情報などの付随ページ（ドロワー下部のみ）
export const secondaryNavItems: SecondaryNavItem[] = [
  { href: '#', label: 'よくあるご質問' },
  { href: '#', label: 'お客様の声' },
  { href: '#', label: '採用情報' },
  { href: '#', label: '会社情報' },
  { href: '#', label: 'プライバシーポリシー' },
  { href: '#', label: '特定商取引法に基づく表記' },
  { href: '#', label: '利用規約' },
  { href: '#', label: 'Cookieポリシー' },
];

// 言語切替
export const languages = ['JP', 'EN', 'CH', 'KR'] as const;
export type Language = (typeof languages)[number];
