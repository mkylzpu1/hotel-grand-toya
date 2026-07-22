export default function Facilities() {
  return (
    <section
      className="relative max-w-[1320px] mx-auto px-10 py-[108px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#D8D7D2] after:content-[''] after:absolute after:-top-px after:left-1/2 after:-translate-x-1/2 after:w-11 after:h-[3px] after:bg-[#A24730]"
      id="facilities"
    >
      <div className="grid grid-cols-12 gap-7 items-start">
        <div className="col-span-12 lg:col-start-1 lg:col-span-4">
          <p className="flex items-center gap-2.5 text-[0.74rem] tracking-[0.14em] font-medium text-[#29415C] mb-[18px]">
            <span
              className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border border-[1.5px] border-[#A24730] text-[#A24730] font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
              aria-hidden="true"
            >
              館
            </span>
            Facilities
          </p>
          <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] text-[#1E1C1A] mb-[22px] leading-[1.65] font-semibold">
            館内でも、<br />快適なひとときを。
          </h2>
          <p className="text-[#55524C] font-normal max-w-[34ch] leading-[1.95]">
            ロビーや売店、喫茶スペースなどの館内施設に加え、多国籍スタッフによる多言語でのご案内にも対応。初めて洞爺湖を訪れる方や海外からのお客様にも、安心してお過ごしいただけます。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 mt-[30px] text-[0.82rem] tracking-[0.05em] text-[#29415C] font-medium pb-[5px] border-b border-[#A24730] hover:text-[#7E3623] hover:border-[#7E3623] transition-colors"
          >
            館内施設・サービスを見る →
          </a>
        </div>

        <div className="col-span-12 lg:col-start-5 lg:col-span-8 grid grid-cols-1 auto-rows-[220px] gap-5 lg:grid-cols-6 lg:auto-rows-[130px]">
          <figure className="m-0 lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-2">
            <img src="/assets/photos/image4.png" alt="客室からの眺め" className="w-full h-full object-cover block" />
          </figure>
          <figure className="m-0 lg:col-start-4 lg:col-span-2 lg:row-start-1 lg:row-span-1">
            <img src="/assets/photos/image1.png" alt="館内の様子" className="w-full h-full object-cover block" />
          </figure>
          <figure className="m-0 lg:col-start-6 lg:col-span-1 lg:row-start-1 lg:row-span-2">
            <img src="/assets/photos/image5.png" alt="客室からの眺め" className="w-full h-full object-cover block" />
          </figure>
        </div>
      </div>
    </section>
  );
}
