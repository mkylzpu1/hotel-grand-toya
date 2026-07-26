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
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false); // IME変換中かどうか

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

  // ESCとカーソル移動はグローバルで受ける（IMEに影響されないため）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [onClose, results.length]);

  // Enterでの決定は入力欄側で、IME確定と区別して処理する
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    // 変換中のEnter、またはIME確定のEnter(keyCode 229)は無視
    if (isComposingRef.current || (e as any).keyCode === 229) return;
    if (results[activeIndex]) {
      window.location.href = withHighlight(results[activeIndex].item.url, query);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-[#1E1C1A]/50 px-6 pt-[10vh] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] overflow-hidden rounded-[2px] border border-[#D8D7D2] bg-[#FDFCFA] shadow-[0_20px_60px_rgba(30,28,26,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 入力欄 */}
        <div className="relative flex items-center gap-4 border-b border-[#D8D7D2] px-7 py-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="shrink-0 text-[#A24730]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              // ブラウザによってはcompositionendとkeydownの順序がずれるため、
              // 少し遅らせてフラグを下ろす
              setTimeout(() => {
                isComposingRef.current = false;
              }, 0);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent font-serif text-[19px] tracking-[0.03em] text-[#1E1C1A] placeholder:text-[#8A8781] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="clear"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#8A8781] transition-colors hover:bg-[#F0EFEA] hover:text-[#1E1C1A]"
            >
              <span className="relative block h-3 w-3">
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              </span>
            </button>
          )}
        </div>

        {/* 結果一覧 */}
        <div className="relative max-h-[54vh] overflow-y-auto">
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
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`group flex items-center gap-4 px-7 py-5 transition-colors ${
                      i === activeIndex ? 'bg-[#FAF6F0]' : ''
                    }`}
                  >
                    <span className="flex flex-1 flex-col gap-1.5">
                      <span className="flex items-baseline gap-3">
                        <span className="font-serif text-[17px] tracking-[0.02em] text-[#1E1C1A]">
                          {r.item.title}
                        </span>
                        <span className="text-[11px] font-medium tracking-[0.12em] text-[#A24730]">
                          {r.item.category}
                        </span>
                      </span>
                      <span className="line-clamp-1 text-[13.5px] leading-relaxed text-[#55524C]">
                        {r.item.excerpt}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[14px] text-[#8A8781] transition-transform duration-200 ${
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
              <p className="text-[13.5px] tracking-[0.04em] text-[#8A8781]">
                客室・温泉・お料理・館内施設などを検索できます
              </p>
            </div>
          )}
        </div>

        {/* フッター: キー操作ヒント */}
        {results.length > 0 && (
          <div className="flex items-center justify-end gap-5 border-t border-[#D8D7D2] bg-[#FAFAFA] px-7 py-3 text-[11px] tracking-[0.06em] text-[#8A8781]">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded-[2px] border border-[#D8D7D2] bg-white px-1.5 py-0.5">↑↓</kbd>
              移動
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded-[2px] border border-[#D8D7D2] bg-white px-1.5 py-0.5">↵</kbd>
              開く
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
