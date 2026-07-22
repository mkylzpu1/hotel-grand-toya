export default function Concept() {
  return (
    <section className="max-w-[1320px] mx-auto px-10 py-[108px]">
      <div className="grid grid-cols-12 gap-7 items-start">
        <div className="col-span-12 lg:col-start-1 lg:col-span-4 self-center">
          <p className="flex items-center gap-2.5 text-[0.74rem] tracking-[0.14em] font-medium text-[#29415C] mb-[18px]">
            <span
              className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border border-[1.5px] border-[#A24730] text-[#A24730] font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
              aria-hidden="true"
            >
              心
            </span>
            Concept
          </p>
          <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] text-[#1E1C1A] mb-[22px] leading-[1.65] font-semibold">
            洞爺湖のほとりで、<br />心ほどける時間を。
          </h2>
          <p className="mt-2 text-[#55524C]">
            ホテルグランドトーヤは、洞爺湖のほとりに佇む温泉宿です。<br />
            湖畔の散策や周辺観光を楽しんだあとは、天然温泉でゆっくりと疲れを癒やす。
            気取らず、心地よく過ごせる滞在をご提供します。
          </p>
        </div>

        <div className="col-span-12 lg:col-start-6 lg:col-span-7 grid grid-cols-[1.15fr_0.85fr] gap-6 h-[320px] lg:h-[460px]">
          <img
            src="/assets/photos/image12.jpg"
            alt="館内のロビー"
            className="w-full h-full object-cover block"
          />
          <img
            src="/assets/photos/image2.png"
            alt="洞爺湖畔の花火"
            className="w-full h-[74%] object-cover block self-end mt-0 lg:mt-[70px]"
          />
        </div>
      </div>
    </section>
  );
}
