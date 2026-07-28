import { useCallback, useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';

interface SearchEntry {
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchIndexUrl: string;
  placeholder: string;
  noResultsLabel: string;
  emptyStateLabel: string;
  navigateHintLabel: string;
  openHintLabel: string;
  clearButtonLabel: string;
}

function withHighlight(url: string, term: string): string {
  if (!term.trim()) return url;
  const hashIndex = url.indexOf('#');
  const hash = hashIndex !== -1 ? url.slice(hashIndex) : '';
  const base = hashIndex !== -1 ? url.slice(0, hashIndex) : url;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}highlight=${encodeURIComponent(term.trim())}${hash}`;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  searchIndexUrl,
  placeholder,
  noResultsLabel,
  emptyStateLabel,
  navigateHintLabel,
  openHintLabel,
  clearButtonLabel,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isOpen || fuse || !searchIndexUrl) return undefined;
    let isCancelled = false;
    async function loadIndex() {
      setIsLoading(true);
      try {
        const response = await fetch(searchIndexUrl);
        const data = (await response.json()) as SearchEntry[];
        if (isCancelled) return;
        setFuse(
          new Fuse(data, {
            keys: [
              { name: 'title', weight: 2 },
              { name: 'excerpt', weight: 1 },
              { name: 'category', weight: 0.5 },
            ],
            threshold: 0.35,
          }),
        );
      } catch {
        // 検索できない場合は、結果なしの表示に留める。
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    void loadIndex();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, fuse, searchIndexUrl]);

  // iOS Safariでも背景が動かないようにするスクロールロック
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(t);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [isOpen]);

  const results = query.trim() && fuse ? fuse.search(query).slice(0, 8) : [];

  const handleClose = useCallback(() => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, results.length]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (isComposingRef.current || e.keyCode === 229) return;
    if (results[activeIndex]) {
      window.location.href = withHighlight(results[activeIndex].item.url, query);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-[#1E1C1A]/50 backdrop-blur-[2px] sm:px-6 sm:pt-[10vh]"
      onClick={handleClose}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#FDFCFA] sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-[640px] sm:rounded-[2px] sm:border sm:border-[#D8D7D2] sm:shadow-[0_20px_60px_rgba(30,28,26,0.18)]"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* ヘッダー：検索窓（モバイルは戻る矢印を追加、スクロールしても常時表示） */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b border-[#D8D7D2] bg-[#FDFCFA] px-5 py-4 sm:px-7 sm:py-6">
          <button
            onClick={handleClose}
            aria-label={clearButtonLabel}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#1E1C1A] sm:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="hidden shrink-0 text-[#A24730] sm:block"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              setTimeout(() => {
                isComposingRef.current = false;
              }, 0);
            }}
            placeholder={placeholder}
            enterKeyHint="search"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-transparent font-serif text-[17px] tracking-[0.03em] text-[#1E1C1A] placeholder:text-[#8A8781] focus:outline-none sm:text-[19px]"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              aria-label={clearButtonLabel}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#8A8781] transition-colors hover:bg-[#F0EFEA] hover:text-[#1E1C1A]"
            >
              <span className="relative block h-3 w-3">
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              </span>
            </button>
          )}
        </div>

        {/* 結果エリア：モバイルは flex-1 で残り全高、下部にセーフエリア＋キーボードバー分の余白を確保 */}
        <div className="relative flex-1 overflow-y-auto overscroll-contain pb-[max(env(safe-area-inset-bottom),1rem)] sm:max-h-[54vh] sm:flex-none sm:pb-0">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 px-7 py-12 text-[13px] tracking-[0.1em] text-[#8A8781]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A24730]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A24730] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A24730] [animation-delay:0.3s]" />
            </div>
          )}
          {!isLoading && query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-7 py-16 text-center">
              <span className="font-serif text-[15px] tracking-[0.04em] text-[#8A8781]">
                {noResultsLabel}
              </span>
            </div>
          )}
          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-[#EFEEEA] py-1">
              {results.map((r, i) => (
                <li key={r.item.url + i}>
                  <a
                    href={withHighlight(r.item.url, query)}
                    onClick={handleClose}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`group flex items-center gap-4 px-5 py-4 transition-colors sm:px-7 sm:py-5 ${
                      i === activeIndex ? 'bg-[#FAF6F0]' : ''
                    }`}
                  >
                    <span className="flex flex-1 flex-col gap-1.5">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-serif text-[15.5px] tracking-[0.02em] text-[#1E1C1A] sm:text-[17px]">
                          {r.item.title}
                        </span>
                        <span className="text-[11px] font-medium tracking-[0.12em] text-[#A24730]">
                          {r.item.category}
                        </span>
                      </span>
                      <span className="line-clamp-1 text-[13px] leading-relaxed text-[#55524C] sm:text-[13.5px]">
                        {r.item.excerpt}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[14px] text-[#8A8781] transition-transform duration-200 sm:${
                        i === activeIndex ? 'translate-x-1 text-[#A24730]' : ''
                      }`}
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !query.trim() && (
            <div className="flex flex-col items-center gap-2 px-7 py-16 text-center">
              <p className="text-[13.5px] tracking-[0.04em] text-[#8A8781]">{emptyStateLabel}</p>
            </div>
          )}
        </div>

        {/* キーボード操作ヒント：矢印キーはPCのみ使うのでモバイルは非表示 */}
        {results.length > 0 && (
          <div className="hidden shrink-0 items-center justify-end gap-5 border-t border-[#D8D7D2] bg-[#FAFAFA] px-7 py-3 text-[11px] tracking-[0.06em] text-[#8A8781] sm:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded-[2px] border border-[#D8D7D2] bg-white px-1.5 py-0.5">↑↓</kbd>
              {navigateHintLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded-[2px] border border-[#D8D7D2] bg-white px-1.5 py-0.5">↵</kbd>
              {openHintLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
