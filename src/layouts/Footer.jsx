export default function Footer() {
  return (
    <>
      <footer className="bg-[#16283A] text-white border-t-[3px] border-[#A24730]">
        <div className="max-w-[1320px] mx-auto px-10 pt-[88px] pb-10 grid grid-cols-1 min-[761px]:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_0.9fr] gap-10">
          <div className="mt-0">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border-[1.5px] border-white text-white font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
                aria-hidden="true"
              >
                湖
              </span>
              <span className="font-serif text-white leading-tight">
                HOTEL<br />GRAND TOYA
              </span>
            </div>
            <p className="text-[0.8rem] opacity-60 mt-5 leading-[2.1]">
              〒049-XXXX 北海道虻田郡洞爺湖町XXXX<br />TEL: 0142-XX-XXXX
            </p>
          </div>

          <div className="flex flex-col gap-3.5 mt-0">
            <h4 className="text-[0.72rem] tracking-[0.16em] opacity-50 font-normal mb-5">ご利用案内</h4>
            <a href="#rooms" className="text-[0.82rem] opacity-80 hover:opacity-100">客室</a>
            <a href="#onsen" className="text-[0.82rem] opacity-80 hover:opacity-100">温泉</a>
            <a href="#food" className="text-[0.82rem] opacity-80 hover:opacity-100">お料理</a>
            <a href="#access" className="text-[0.82rem] opacity-80 hover:opacity-100">アクセス</a>
          </div>

          <div className="flex flex-col gap-3.5 mt-0 lg:mt-9">
            <h4 className="text-[0.72rem] tracking-[0.16em] opacity-50 font-normal mb-5">サイト情報</h4>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">FAQ</a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">お客様の声</a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">採用情報</a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">会社情報</a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">プライバシーポリシー</a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">特定商取引法に基づく表記</a>
          </div>

          <div className="flex flex-col gap-3.5 mt-0">
            <h4 className="text-[0.72rem] tracking-[0.16em] opacity-50 font-normal mb-5">ご予約</h4>
            <a
              href="https://reserve.example.com/grandtoya"
              target="_blank"
              rel="noopener"
              className="text-[0.82rem] opacity-80 hover:opacity-100"
            >
              外部予約サイトへ
            </a>
            <a href="tel:0142-XX-XXXX" className="text-[0.82rem] opacity-80 hover:opacity-100">0142-XX-XXXX</a>
          </div>
        </div>

        <div className="text-center text-[0.72rem] opacity-40 py-6 tracking-[0.05em]">
          <p>© 2026 Hotel Grand Toya</p>
        </div>
      </footer>

      <div className="hidden max-[760px]:grid grid-cols-[1fr_1.6fr] fixed bottom-0 left-0 right-0 z-[200] bg-[#FAFAFA] border-t border-[#D8D7D2]">

        <a
          href="tel:0142-XX-XXXX"
          className="flex items-center justify-center py-4 px-2 text-[0.82rem] font-medium tracking-[0.05em] text-[#1E1C1A]"
        >
          電話
        </a>

        <a
          href="https://reserve.example.com/grandtoya"
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center py-4 px-2 text-[0.82rem] font-medium tracking-[0.05em] bg-[#A24730] text-white"
        >
          ご予約はこちら
        </a>
      </div>
    </>
  );
}
