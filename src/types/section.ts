export interface SectionImage {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export interface SectionData {
  id?: string;
  icon: string;
  eyebrow: string;
  titleLines?: string[];
  description?: string[];
  linkText?: string;
  linkHref?: string;
  centerText?: boolean;
  showDivider?: boolean;
  tallImagePosition?: 'left' | 'right';
  images?: SectionImage[];
}
