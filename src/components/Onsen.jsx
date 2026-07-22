export default function Onsen() {
  return (
    <section
      className="relative max-w-[1320px] mx-auto px-10 py-[108px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#D8D7D2] after:content-[''] after:absolute after:-top-px after:left-1/2 after:-translate-x-1/2 after:w-11 after:h-[3px] after:bg-[#A24730]"
      id="onsen"
    >
      <div className="grid grid-cols-12 gap-7 items-start">
        <div className="col-span-12 lg:col-start-9 lg:col-span-4 order-2">
          <p className="flex items-center gap-2.5 text-[0.74rem] tracking-[0.14em] font-medium text-[#29415C] mb-[18px]">
            <span
              className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border border-[1.5px] border-[#A24730] text-[#A24730] font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
              aria-hidden="true"
            >
              湯
            </span>
            Onsen
          </p>
          <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] text-[#1E1C1A] mb-[22px] leading-[1.65] font-semibold">
            源泉かけ流しの湯で、<br />心も体もゆっくりと。
          </h2>
          <p className="text-[#55524C] font-normal max-w-[34ch] leading-[1.95]">
            保温性に優れた源泉かけ流しの天然温泉。<br />
            熱め・ぬるめ・人肌の3つの浴槽で、お好みの湯加減をお楽しみいただけます。宿泊はもちろん、日帰り入浴でもご利用いただけます。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 mt-[30px] text-[0.82rem] tracking-[0.05em] text-[#29415C] font-medium pb-[5px] border-b border-[#A24730] hover:text-[#7E3623] hover:border-[#7E3623] transition-colors"
          >
            温泉のご案内 →
          </a>
        </div>

        <div className="col-span-12 lg:col-start-1 lg:col-span-8 order-1 grid grid-cols-1 max-[760px]:grid-cols-1 min-[761px]:grid-cols-2 lg:grid-cols-[1fr_1.3fr] gap-5 min-[761px]:auto-rows-[180px] lg:auto-rows-[230px]">
          <figure className="m-0 min-[761px]:col-start-2 min-[761px]:row-start-1 min-[761px]:row-span-2">
            <img src="/assets/photos/room-2.jpg" alt="大浴場" className="w-full h-full object-cover block" />
            <figcaption className="mt-3 text-[0.78rem] text-[#55524C] tracking-[0.08em]">大浴場</figcaption>
          </figure>
          <figure className="m-0 min-[761px]:col-start-1 min-[761px]:row-start-1">
            <img src="/assets/photos/image9.png" alt="露天風呂（夜景）" className="w-full h-full object-cover block" />
          </figure>
          <figure className="m-0 min-[761px]:col-start-1 min-[761px]:row-start-2">
            <img src="/assets/photos/onsen-3.jpg" alt="露天風呂" className="w-full h-full object-cover block" />
            <figcaption className="mt-3 text-[0.78rem] text-[#55524C] tracking-[0.08em]">露天風呂</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
