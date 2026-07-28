import { useEffect, useRef, useState } from 'react';
import SearchOverlay from '../components/common/SearchOverlay';
import { asset } from './../utils/asset';

interface PrimaryNavItem {
  href: string;
  label: string;
  en: string;
  icon: string;
}
interface SecondaryNavItem {
  href: string;
  label: string;
}
interface LangLink {
  code: string;
  label: string;
  href: string;
  active: boolean;
}
interface HeaderProps {
  lang: string;
  primaryNavItems: PrimaryNavItem[];
  secondaryNavItems: SecondaryNavItem[];
  reserveCta: string;
  phoneAriaLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  siteInfoHeading: string;
  reservationUrl: string;
  tel: string;
  logoAlt: string;
  navAriaLabel: string;
  drawerNavAriaLabel: string;
  langLinks: LangLink[];
  langSwitcherLabel: string;
  searchIndexUrl: string;
  searchPlaceholder: string;
  searchOpenLabel: string;
  searchNoResultsLabel: string;
  bottomNavSearchLabel?: string;
  bottomNavTelLabel?: string;
  bottomNavReserveLabel?: string;
  bottomNavMenuLabel?: string;
}

function LanguageDropdown({ langLinks, label }: { langLinks: LangLink[]; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const active = langLinks.find((l) => l.active) ?? langLinks[0];
  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-medium tracking-[0.08em] text-white backdrop-blur-sm transition-colors hover:border-[#A24730]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/60"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 1 0 20" />
        </svg>
        {active.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[110px] rounded-[10px] border border-white/10 bg-[#1D3247] p-1.5 shadow-2xl"
        >
          {langLinks.map((lang, i) => (
            <a
              key={lang.code}
              ref={i === 0 ? firstItemRef : undefined}
              href={asset(lang.href)}
              role="option"
              aria-selected={lang.active}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-2.5 py-2 text-[12px] tracking-[0.03em] transition-colors ${
                lang.active
                  ? 'bg-white/10 text-[#E8A87C]'
                  : 'text-white/65 hover:bg-white/5 hover:text-white'
              }`}
            >
              {lang.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({
  lang,
  primaryNavItems,
  secondaryNavItems,
  reserveCta,
  phoneAriaLabel,
  menuOpenLabel,
  menuCloseLabel,
  siteInfoHeading,
  reservationUrl,
  tel,
  logoAlt,
  navAriaLabel,
  drawerNavAriaLabel,
  langLinks,
  langSwitcherLabel,
  searchIndexUrl,
  searchPlaceholder,
  searchOpenLabel,
  searchNoResultsLabel,
  bottomNavSearchLabel = '検索',
  bottomNavTelLabel = '電話',
  bottomNavReserveLabel = '予約',
  bottomNavMenuLabel = 'メニュー',
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className="absolute left-0 top-0 z-20 w-full px-8 py-7 lg:px-12 lg:py-9 lg:pr-40"
      id="site-header"
    >
      <div className="flex items-center">
        <a href={asset(`/${lang}/`)} className="flex-none">
          <img
            src={`${import.meta.env.BASE_URL}assets/photos/ttl.png`}
            alt={logoAlt}
            className="block w-[150px] lg:w-[170px]"
          />
        </a>
        <nav className="ml-16 hidden items-center gap-11 lg:flex" aria-label={navAriaLabel}>
          {primaryNavItems.map((item) => (
            <a
              key={asset(item.href)}
              href={asset(item.href)}
              className="group relative flex flex-col items-start"
            >
              <span className="text-[10px] font-medium tracking-[0.22em] text-white/50 transition-colors duration-300 group-hover:text-[#A24730]">
                {item.en}
              </span>
              <span className="mt-1 flex items-center gap-1.5 font-serif text-[15px] tracking-[0.08em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,.35)]">
                <span className="h-[3px] w-[3px] shrink-0 origin-left scale-0 rounded-full bg-[#A24730] transition-transform duration-300 group-hover:scale-100" />
                {item.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <LanguageDropdown langLinks={langLinks} label={langSwitcherLabel} />
        </div>
      </div>

      {/* PC: 固定検索ボタン。常時オレンジ、ハンバーガーのすぐ左に寄せる */}
      <button
        onClick={() => setIsSearchOpen(true)}
        aria-label={searchOpenLabel}
        className="fixed right-24 top-9 z-[999] hidden h-12 w-12 items-center justify-center rounded-full border border-[#A24730] text-[#A24730] backdrop-blur-md transition-colors hover:bg-[#A24730] hover:text-white lg:flex"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {/* ハンバーガー: PCのみ表示。スマホはボトムナビの「メニュー」に統合したため非表示 */}
      <button
        className="group fixed right-9 top-9 z-[999] hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#16283A]/70 backdrop-blur-md transition-colors hover:bg-[#16283A]/90 lg:flex"
        id="nav-toggle"
        aria-label={isOpen ? menuCloseLabel : menuOpenLabel}
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="relative flex h-4 w-[22px] flex-col items-center justify-center">
          <span
            className={`absolute h-[1.5px] w-full origin-center rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'rotate-45' : '-translate-y-[6px]'}`}
          />
          <span
            className={`absolute h-[1.5px] rounded-full bg-white transition-all duration-200 ease-out ${isOpen ? 'w-0 opacity-0' : 'w-full opacity-100'}`}
          />
          <span
            className={`absolute h-[1.5px] w-full origin-center rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? '-rotate-45' : 'translate-y-[6px]'}`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[900] bg-[#0F1A26]/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeNav}
        aria-hidden="true"
      />

      <nav
        id="site-nav"
        className={`fixed right-0 top-0 z-[950] flex h-full w-[88%] max-w-[340px] flex-col overflow-hidden bg-[#16283A] shadow-2xl transition-transform duration-500 ease-out sm:max-w-[400px] lg:max-w-[460px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={drawerNavAriaLabel}
        aria-hidden={!isOpen}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-12 font-serif text-[200px] leading-none text-white/[0.03]"
        >
          湖
        </span>
        <div className="relative flex items-center justify-between px-7 pt-7 lg:px-10 lg:pt-9">
          <span className="font-serif text-[12px] tracking-[0.14em] text-white/50">
            Hotel Grand Toya
          </span>
          <button
            onClick={closeNav}
            aria-label={menuCloseLabel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="relative block h-3 w-3">
              <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        </div>
        <div className="relative flex flex-1 flex-col overflow-y-auto px-7 pt-5 lg:px-10">
          <ul className="flex flex-col">
            {primaryNavItems.map((item, i) => (
              <li
                key={asset(item.href)}
                className="transition-[opacity,transform] duration-500"
                style={{
                  transitionDelay: isOpen ? `${i * 45 + 100}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                }}
              >
                <a
                  href={asset(item.href)}
                  onClick={closeNav}
                  className="group relative flex items-center gap-4 border-b border-white/[0.08] py-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] border-white/25 font-serif text-[13px] text-white/60 transition-all duration-300 group-hover:-rotate-3 group-hover:border-[#A24730] group-hover:text-[#A24730]">
                    {item.icon}
                  </span>
                  <span className="flex flex-1 items-baseline gap-2.5">
                    <span className="font-serif text-[17px] tracking-[0.05em] text-white transition-colors duration-300 group-hover:text-[#E8A87C]">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-medium tracking-[0.18em] text-white/35">
                      {item.en}
                    </span>
                  </span>
                  <span className="text-[12px] text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#E8A87C]">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="my-5 flex items-center gap-3">
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeNav}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#A24730] py-3 text-[12px] font-medium tracking-[0.12em] text-white transition-colors hover:bg-[#8A3B27]"
            >
              {reserveCta}
            </a>
            <a
              href={`tel:${tel}`}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-[#A24730] hover:text-[#A24730]"
              aria-label={phoneAriaLabel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
          <div className="border-t border-white/[0.08] pb-6 pt-5">
            <span className="mb-3 block text-[9px] font-medium tracking-[0.2em] text-white/30">
              {siteInfoHeading}
            </span>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {secondaryNavItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={asset(item.href)}
                    onClick={closeNav}
                    className="text-[11.5px] leading-snug tracking-[0.02em] text-white/45 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative flex items-center justify-between border-t border-white/[0.08] px-7 py-4 lg:hidden lg:px-10">
          <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.12em] text-white/60">
            {langLinks.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                {i > 0 && <span className="mx-1.5 h-2.5 w-px bg-white/20" />}
                <a
                  href={asset(lang.href)}
                  className={`transition-colors ${lang.active ? 'text-[#E8A87C]' : 'hover:text-white'}`}
                >
                  {lang.label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* スマホ: 固定ボトムナビバー（検索・電話・予約・メニュー） */}
      <div
        className="fixed inset-x-0 bottom-0 z-[400] flex items-stretch justify-around border-t border-white/10 bg-[#16283A]/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label={searchOpenLabel}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-white/60 transition-colors active:text-[#E8A87C]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-[9px] tracking-[0.05em]">{bottomNavSearchLabel}</span>
        </button>

        <a
          href={`tel:${tel}`}
          aria-label={phoneAriaLabel}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-white/60 transition-colors active:text-[#E8A87C]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-[9px] tracking-[0.05em]">{bottomNavTelLabel}</span>
        </a>

        <a
          href={reservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[#E8A87C]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="text-[9px] tracking-[0.05em]">{bottomNavReserveLabel}</span>
        </a>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? menuCloseLabel : menuOpenLabel}
          aria-expanded={isOpen}
          aria-controls="site-nav"
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-white/60 transition-colors active:text-[#E8A87C]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[9px] tracking-[0.05em]">{bottomNavMenuLabel}</span>
        </button>
      </div>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchIndexUrl={searchIndexUrl}
        placeholder={searchPlaceholder}
        noResultsLabel={searchNoResultsLabel}
      />
    </header>
  );
}
