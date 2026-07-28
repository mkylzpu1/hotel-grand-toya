import type { Locale } from '../content/config';

export interface LangLink {
  code: Locale;
  label: string;
  href: string;
  active: boolean;
}

export interface NavigationContent {
  primaryNavItems: { href: string; label: string; en: string; icon: string }[];
  secondaryNavItems: { href: string; label: string }[];
  reserveCta: string;
  phoneAriaLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  siteInfoHeading: string;
  bottomNavSearchLabel: string;
  bottomNavTelLabel: string;
  bottomNavReserveLabel: string;
  bottomNavMenuLabel: string;
}
export interface SiteContent {
  title: string;
  description: string;
  address: string;
  postalCode: string;
  tel: string;
  fax: string;
  email: string;
  reservationUrl: string;
  reservationLabel: string;
  footer: {
    guideHeading: string;
    infoHeading: string;
    reservationHeading: string;
    reservationExternalText: string;
    copyright: string;
    mobileTelLabel: string;
    mobileReserveLabel: string;
  };
  // ...既存の他フィールド
}

export interface RelatedLink {
  id: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: string;
  label: string;
}
