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
}

export interface SiteContent {
  address: string;
  tel: string;
  reservationUrl: string;
  footer: {
    guideHeading: string;
    infoHeading: string;
    reservationHeading: string;
    reservationExternalText: string;
    copyright: string;
    mobileTelLabel: string;
    mobileReserveLabel: string;
  };
}

export interface RelatedLink {
  id: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: string;
  label: string;
}
