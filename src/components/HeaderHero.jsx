import { useState } from 'react';

export default function HeaderHero() {
  const [isOpen, setIsOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  const navLinkClass =
    "relative text-white text-[15px] tracking-[0.18em] font-medium [text-shadow:0_2px_10px_rgba(0,0,0,.35)] transition-colors " +
    "after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-[#A24730] after:transition-[width] after:duration-300 " +
    "hover:text-[#A24730] hover:after:w-full";

  return (
    <div className="relative m-[28px] rounded-[28px] overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-20 px-12 py-[30px]" id="site-header">
        <div className="flex items-center">
          <a href="#top" className="flex-none">
            <img src="/assets/photos/ttl.png" alt="ホテルグランドトーヤのロゴ" className="w-[170px] block" />
          </a>

          <nav
            className={`flex-1 justify-center gap-[54px] lg:flex ${
              isOpen
                ? 'max-[760px]:flex max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-5 max-[760px]:absolute max-[760px]:top-full max-[760px]:left-0 max-[760px]:right-0 max-[760px]:bg-[#16283A] max-[760px]:px-6 max-[760px]:py-7 max-[760px]:border-b-[3px] max-[760px]:border-[#A24730]'
                : 'max-[760px]:hidden'
            }`}
            id="main-nav"
            aria-label="グローバルナビゲーション"
          >
            <a href="#rooms" onClick={closeNav} className={navLinkClass}>客室</a>
            <a href="#onsen" onClick={closeNav} className={navLinkClass}>温泉</a>
            <a href="#food" onClick={closeNav} className={navLinkClass}>お料理</a>
            <a href="#facilities" onClick={closeNav} className={navLinkClass}>館内</a>
            <a href="#access" onClick={closeNav} className={navLinkClass}>アクセス</a>
          </nav>

          <div className={`text-white text-sm tracking-[0.18em] font-medium ml-5 [text-shadow:0_2px_10px_rgba(0,0,0,.35)] ${isOpen ? 'max-[760px]:hidden' : ''}`}>
            JP|EN|CH|KR
          </div>

          <button
            className="fixed top-7 right-7 z-[999] w-[58px] h-[58px] flex justify-center items-center flex-col gap-[5px] rounded-full bg-[rgba(22,40,58,.82)] backdrop-blur-md border border-[rgba(255,255,255,.28)] cursor-pointer transition-colors hover:bg-[#A24730]"
            id="nav-toggle"
            aria-label="メニューを開く"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="w-[22px] h-0.5 bg-white block" />
            <span className="w-[22px] h-0.5 bg-white block" />
            <span className="w-[22px] h-0.5 bg-white block" />
          </button>
        </div>
      </header>

      <section className="relative h-[calc(100vh-56px)] min-h-[560px] max-h-[920px] max-[760px]:h-[84vh]">
        <div className="absolute inset-0">
          <img src="/assets/photos/image10.png" alt="洞爺湖の湖畔からの眺め" className="w-full h-full object-cover block" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(20,16,12,.62) 0%, rgba(20,16,12,.32) 32%, rgba(20,16,12,0) 62%), linear-gradient(0deg, rgba(20,16,12,.5) 0%, rgba(20,16,12,0) 40%)',
          }}
        />
        <div className="relative z-[1] h-full max-w-[620px] max-[760px]:max-w-none flex flex-col items-start justify-end text-left pt-0 pr-10 pb-[72px] pl-14 max-[760px]:px-[22px] text-white">
          <p className="text-[0.78rem] tracking-[0.18em] font-medium mb-[22px] opacity-95">洞爺湖温泉</p>
          <h1 className="text-[clamp(1.9rem,1.4rem+2.2vw,2.9rem)] leading-[1.6] font-bold tracking-[0.05em] mb-[26px] text-white">
            湖畔に、<br />いちばん近い時間を。
          </h1>
          <p className="text-[0.94rem] font-normal max-w-[34ch] mb-[38px] opacity-90 tracking-[0.02em]">
            源泉かけ流しの湯と、洞爺湖を望む客室で過ごす静かなひととき。
          </p>
          <a
            href="https://reserve.example.com/grandtoya"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center px-[46px] py-[17px] text-[0.86rem] tracking-[0.1em] font-medium border border-[#29415C] bg-[#29415C] text-white whitespace-nowrap transition-colors hover:bg-[#A24730] hover:border-[#A24730]"
          >
            ご予約はこちら
          </a>
        </div>
      </section>
    </div>
  );
}
