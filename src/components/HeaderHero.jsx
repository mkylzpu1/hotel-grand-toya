import { useState } from 'react';

export default function HeaderHero() {
  const [isOpen, setIsOpen] = useState(false);

  const closeNav = () => setIsOpen(false);

  return (
    <div className="hero-wrap">
      <header className="site-header" id="site-header">
        <div className="header-inner">
          <a href="#top" className="logo">
            <img src="/assets/photos/ttl.png" alt="ホテルグランドトーヤのロゴ" />
          </a>

          <nav
            className={`main-nav${isOpen ? ' is-open' : ''}`}
            id="main-nav"
            aria-label="グローバルナビゲーション"
          >
            <a href="#rooms" onClick={closeNav}>客室</a>
            <a href="#onsen" onClick={closeNav}>温泉</a>
            <a href="#food" onClick={closeNav}>お料理</a>
            <a href="#facilities" onClick={closeNav}>館内</a>
            <a href="#access" onClick={closeNav}>アクセス</a>
          </nav>
          <div className="language"> JP|EN|CH|KR</div>

          <button
            className="nav-toggle"
            id="nav-toggle"
            aria-label="メニューを開く"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-photo">
          <img src="/assets/photos/image10.png" alt="洞爺湖の湖畔からの眺め" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">洞爺湖温泉</p>
          <h1>湖畔に、<br />いちばん近い時間を。</h1>
          <p className="hero-sub">源泉かけ流しの湯と、洞爺湖を望む客室で過ごす静かなひととき。</p>
          <a
            href="https://reserve.example.com/grandtoya"
            className="btn btn-cta btn-lg"
            target="_blank"
            rel="noopener"
          >
            ご予約はこちら
          </a>
        </div>
      </section>
    </div>
  );
}
