export default function Food() {
  return (
    <section className="max-w-[1320px] mx-auto px-10 pt-14 pb-0" id="food">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] items-center min-h-[580px]">
        <div className="pt-0 lg:pt-10 pr-0 lg:pr-[72px] pb-10 pl-0">
          <p className="flex items-center gap-2.5 text-[0.74rem] tracking-[0.14em] font-medium text-[#29415C] mb-[18px]">
            <span
              className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border border-[1.5px] border-[#A24730] text-[#A24730] font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
              aria-hidden="true"
            >
              膳
            </span>
            Dinner
          </p>
          <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] text-[#1E1C1A] mb-[22px] leading-[1.65] font-semibold">
            北海道の味覚を、<br />ゆったりと味わう。
          </h2>
          <p className="mt-2.5 max-w-[32ch] text-[#55524C]">
            ご夕食は会席膳、朝は和朝食をご用意。<br />
            ご宿泊とともに、夕食・朝食をお楽しみいただけるプランをご用意しております。温泉とお食事で、ゆったりとしたひとときをお過ごしください。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 mt-[30px] text-[0.82rem] tracking-[0.05em] text-[#29415C] font-medium pb-[5px] border-b border-[#A24730] hover:text-[#7E3623] hover:border-[#7E3623] transition-colors"
          >
            お料理のご案内 →
          </a>
        </div>

        <div className="order-first lg:order-none grid grid-cols-2 gap-5 h-[360px] lg:h-4/5 py-10">
          <img src="/assets/photos/lobby-1.jpg" alt="夕食のお料理" className="w-full h-full object-cover block" />
          <img
            src="/assets/photos/lobby-2.jpg"
            alt="お食事の一品"
            className="w-full h-[78%] object-cover block self-end mb-0 lg:mb-14"
          />
        </div>
      </div>
    </section>
  );
}
