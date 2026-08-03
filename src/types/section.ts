export interface SectionImage {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export interface SectionData {
  sectionId?: string;
  order?: number;
  icon: string;
  eyebrow: string;
  titleLines?: string[];
  description?: string[];
  priceHighlight?: string;
  linkText?: string;
  linkHref?: string;
  secondaryLinkText?: string;
  secondaryLinkHref?: string;
  centerText?: boolean;
  showDivider?: boolean;
  tallImagePosition?: 'left' | 'right';
  images?: SectionImage[];
}
