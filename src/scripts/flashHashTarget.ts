/**
 * 検索結果からの遷移用：URLのハッシュに一致する要素へスクロールし、一瞬ハイライトする。
 * ハイライトの見た目は global.css の `.search-flash` で定義。
 */
export function initHashFlash({
  beforeFlash,
}: { beforeFlash?: (target: HTMLElement) => void } = {}) {
  function flash() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    beforeFlash?.(target);

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('search-flash');
      setTimeout(() => target.classList.remove('search-flash'), 2000);
    });
  }

  flash();
  window.addEventListener('hashchange', flash);
}
