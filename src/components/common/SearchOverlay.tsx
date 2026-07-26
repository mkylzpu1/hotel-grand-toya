import { useState, useEffect, useRef } from 'react';
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
}

export default function SearchOverlay({
  isOpen,
  onClose,
  searchIndexUrl,
  placeholder,
  noResultsLabel,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || fuse || !searchIndexUrl) return;
    setIsLoading(true);
    fetch(searchIndexUrl)
      .then((res) => res.json())
      .then((data: SearchEntry[]) => {
        setFuse(
          new Fuse(data, {
            keys: [
              { name: 'title', weight: 2 },
              { name: 'excerpt', weight: 1 },
              { name: 'category', weight: 0.5 },
            ],
            threshold: 0.35,
          })
        );
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isOpen, fuse, searchIndexUrl]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const results = query.trim() && fuse ? fuse.search(query).slice(0, 8) : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        window.location.href = results[activeIndex].item.url;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, results, activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-[#0B141F]/80 px-6 pt-[10vh] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[600px] overflow-hidden rounded-[3px] border border-white/[0.08] bg-[#16283A] shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 装飾: 右上の淡い漢字 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[140px] leading-none text-white/[0.025]"
        >
          探
        </span>

        {/* 入力欄 */}
        <div className="relative flex items-center gap-4 border-b border-white/[0.08] px-6 py-5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="shrink-0 text-[#E8A87C]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent font-serif text-[17px] tracking-[0.04em] text-white placeholder:text-white/30 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="clear"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="relative block h-2.5 w-2.5">
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              </span>
            </button>
          )}
          <kbd className="hidden shrink-0 rounded-[3px] border border-white/15 px-2 py-1 text-[10px] tracking-[0.08em] text-white/35 sm:block">
            ESC
          </kbd>
        </div>

        {/* 結果一覧 */}
        <div className="relative max-h-[52vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 px-6 py-10 text-[12px] tracking-[0.1em] text-white/35">
              <span className="h-1 w-1 animate-pulse rounded-full bg-[#E8A87C]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-[#E8A87C] [animation-delay:0.15s]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-[#E8A87C] [animation-delay:0.3s]" />
            </div>
          )}

          {!isLoading && query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="font-serif text-[28px] text-white/15">無</span>
              <p className="text-[13px] tracking-[0.05em] text-white/40">{noResultsLabel}</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-2">
              {results.map((r, i) => (
                <li key={r.item.url + i}>
                  <a
                    href={r.item.url}
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`group flex items-start gap-4 px-6 py-4 transition-colors ${
                      i === activeIndex ? 'bg-white/[0.06]' : ''
                    }`}
                  >
                    <span
                      className={`mt-1 h-[3px] w-[3px] shrink-0 origin-left rounded-full bg-[#A24730] transition-transform duration-200 ${
                        i === activeIndex ? 'scale-150' : 'scale-0'
                      }`}
                    />
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="flex items-baseline gap-2.5">
                        <span className="font-serif text-[15.5px] tracking-[0.03em] text-white">
                          {r.item.title}
                        </span>
                        <span className="text-[9.5px] font-medium tracking-[0.16em] text-[#E8A87C]/70">
                          {r.item.category}
                        </span>
                      </span>
                      <span className="line-clamp-1 text-[12.5px] leading-relaxed text-white/40">
                        {r.item.excerpt}
                      </span>
                    </span>
                    <span
                      className={`mt-1.5 shrink-0 text-[12px] text-white/20 transition-all duration-200 ${
                        i === activeIndex ? 'translate-x-0.5 text-[#E8A87C]' : ''
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
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <span className="font-serif text-[10px] tracking-[0.2em] text-white/25">
                SEARCH
              </span>
              <p className="text-[12px] tracking-[0.05em] text-white/30">
                客室・温泉・お料理・館内施設などを検索できます
              </p>
            </div>
          )}
        </div>

        {/* フッター: キー操作ヒント */}
        {results.length > 0 && (
          <div className="flex items-center justify-end gap-4 border-t border-white/[0.06] px-6 py-2.5 text-[10px] tracking-[0.08em] text-white/25">
            <span className="flex items-center gap-1">
              <kbd className="rounded-[2px] border border-white/15 px-1.5 py-0.5">↑↓</kbd>
              移動
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded-[2px] border border-white/15 px-1.5 py-0.5">↵</kbd>
              開く
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
