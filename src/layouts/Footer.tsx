export default function Footer() {
  return (
    <>
      <footer className="border-t-[3px] border-[#A24730] bg-[#16283A] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-10 pb-10 pt-[88px] min-[761px]:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_0.9fr]">
          <div className="mt-0">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="inline-flex h-[26px] w-[26px] shrink-0 -rotate-3 items-center justify-center rounded-[1px] border-[1.5px] border-white font-serif text-[0.82rem] font-semibold leading-none text-white"
                aria-hidden="true"
              >
                湖
              </span>
              <span className="font-serif leading-tight text-white">
                HOTEL
                <br />
                GRAND TOYA
              </span>
            </div>
            <p className="mt-5 text-[0.8rem] leading-[2.1] opacity-60">
              〒049-XXXX 北海道虻田郡洞爺湖町XXXX
              <br />
              TEL: 0142-XX-XXXX
            </p>
          </div>

          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              ご利用案内
            </h4>
            <a href="#rooms" className="text-[0.82rem] opacity-80 hover:opacity-100">
              客室
            </a>
            <a href="#onsen" className="text-[0.82rem] opacity-80 hover:opacity-100">
              温泉
            </a>
            <a href="#food" className="text-[0.82rem] opacity-80 hover:opacity-100">
              お料理
            </a>
            <a href="#access" className="text-[0.82rem] opacity-80 hover:opacity-100">
              アクセス
            </a>
          </div>

          <div className="mt-0 flex flex-col gap-3.5 lg:mt-9">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              サイト情報
            </h4>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              FAQ
            </a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              お客様の声
            </a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              採用情報
            </a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              会社情報
            </a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              プライバシーポリシー
            </a>
            <a href="#" className="text-[0.82rem] opacity-80 hover:opacity-100">
              特定商取引法に基づく表記
            </a>
          </div>

          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">ご予約</h4>
            <a
              href="https://reserve.example.com/grandtoya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.82rem] opacity-80 hover:opacity-100"
            >
              外部予約サイトへ
            </a>
            <a href="tel:0142-XX-XXXX" className="text-[0.82rem] opacity-80 hover:opacity-100">
              0142-XX-XXXX
            </a>
          </div>
        </div>

        <div className="py-6 text-center text-[0.72rem] tracking-[0.05em] opacity-40">
          <p>© 2026 Hotel Grand Toya</p>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-[200] hidden grid-cols-[1fr_1.6fr] border-t border-[#D8D7D2] bg-[#FAFAFA] max-[760px]:grid">
        <a
          href="tel:0142-XX-XXXX"
          className="flex items-center justify-center px-2 py-4 text-[0.82rem] font-medium tracking-[0.05em] text-[#1E1C1A]"
        >
          電話
        </a>

        <a
          href="https://reserve.example.com/grandtoya"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#A24730] px-2 py-4 text-[0.82rem] font-medium tracking-[0.05em] text-white"
        >
          ご予約はこちら
        </a>
      </div>
    </>
  );
}
