import ArrowLink from '../ui/ArrowLink';
interface SceneryItem {
  img: string;
  title: string;
  note: string;
}

const sceneryItems: SceneryItem[] = [
  { img: '/assets/photos/garden-2.jpg', title: 'ひまわり畑', note: 'ホテルから車で約15分' },
  {
    img: '/assets/photos/image2.png',
    title: '洞爺湖ロングラン花火大会',
    note: '湖畔から観覧できます',
  },
  { img: '/assets/photos/hero-lake-sub.jpg', title: '洞爺湖遊覧船', note: '乗り場まで徒歩約8分' },
];

// シームレスな無限スクロールのためにリストを複製
const sceneryLoop: SceneryItem[] = [...sceneryItems, ...sceneryItems];

export default function Access() {
  return (
    <section
      className="relative mx-auto max-w-[1320px] px-10 py-[108px] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-[#D8D7D2] before:content-[''] after:absolute after:-top-px after:left-1/2 after:h-[3px] after:w-11 after:-translate-x-1/2 after:bg-[#A24730] after:content-['']"
      id="access"
    >
      {/* キーフレームはTailwind標準にないため個別定義 */}
      <style>{`
        @keyframes galleryScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 14px)); }
        }
      `}</style>

      {/* Hero image (full-bleed) */}
      <div className="mb-20 ml-[calc(50%-50vw)] h-[52vh] min-h-[340px] w-screen overflow-hidden">
        <img
          src="/assets/photos/image12.jpg"
          alt="ホテルグランドトーヤ周辺"
          className="block h-full w-full object-cover"
        />
      </div>

      {/* Heading */}
      <div className="mb-[72px] text-center">
        <p className="mb-[18px] flex items-center justify-center gap-2.5 text-[0.74rem] font-medium tracking-[0.14em] text-[#29415C]">
          <span
            className="inline-flex h-[26px] w-[26px] shrink-0 -rotate-3 items-center justify-center rounded-[1px] border-[1.5px] border-[#A24730] font-serif text-[0.82rem] font-semibold leading-none text-[#A24730]"
            aria-hidden="true"
          >
            道
          </span>
          Access
        </p>
        <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] font-semibold leading-[1.65] text-[#1E1C1A]">
          アクセス・周辺観光
        </h2>
      </div>

      {/* Access info + map */}
      <div className="mb-[110px] grid grid-cols-1 items-start gap-[72px] lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ul className="m-0 list-none p-0">
            <li className="border-b border-[#D8D7D2] py-4 text-[0.9rem]">
              <b>お車</b>：札幌市街から約2時間
            </li>
            <li className="border-b border-[#D8D7D2] py-4 text-[0.9rem]">
              <b>JR</b>：JR洞爺駅より送迎バス約20分
            </li>
            <li className="border-b border-[#D8D7D2] py-4 text-[0.9rem]">
              <b>高速バス</b>：札幌から約2時間30分
            </li>
            <li className="border-b border-[#D8D7D2] py-4 text-[0.9rem]">
              <b>新千歳空港</b>：空港連絡バスで約2時間
            </li>
          </ul>
          <p className="my-5 mb-[30px] text-[0.78rem] text-[#8A8781]">
            冬季は積雪・路面凍結のため、お車でお越しの際は冬用タイヤをご準備ください。
          </p>
          <ArrowLink href="#">詳細はこちら</ArrowLink>
        </div>
        <div className="h-[360px] border-[0.5px] border-[#29415C]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938.515404605304!2d140.81545087618343!3d42.565581722092354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f9fe2bdc82d202d%3A0x94c12be9cc1e0e64!2z44Ob44OG44Or44Kw44Op44Oz44OJ44OI44O844Ok!5e0!3m2!1sja!2sjp!4v1784723174147!5m2!1sja!2sjp"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title="ホテルグランドトーヤ地図"
            className="block h-full w-full border-0"
          />
        </div>
      </div>

      {/* Scenery lead + marquee gallery */}
      <div className="text-center">
        <h3 className="mb-5 text-[1.7rem] font-medium">四季折々の洞爺湖を楽しめる立地</h3>
        <p className="mx-auto mb-14 max-w-[720px] leading-[2] text-[#55524C]">
          ホテルグランドトーヤは洞爺湖畔に位置し、 春の桜、夏のロングラン花火大会やひまわり畑、
          秋の紅葉、冬のイルミネーションなど、 季節ごとの見どころへのアクセスにも便利です。
        </p>
        <div className="ml-[calc(50%-50vw)] mt-[60px] w-screen overflow-hidden">
          <div
            className="flex w-max gap-7"
            style={{ animation: 'galleryScroll 32s linear infinite' }}
          >
            {sceneryLoop.map((item, i) => (
              <figure key={i} className="group m-0 w-[400px] flex-none">
                <div className="overflow-hidden rounded-[18px]">
                  <img
                    src={item.img}
                    alt=""
                    className="block h-[250px] w-full origin-center object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.08] group-hover:cursor-pointer"
                  />
                </div>
                <figcaption className="px-1 pb-0 pt-[18px] text-left">
                  <h4 className="mb-1.5 text-base font-semibold text-[#1E1C1A]">{item.title}</h4>
                  <p className="m-0 text-[0.85rem] leading-[1.7] text-[#55524C]">{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[70px] text-center">
        <ArrowLink href="#">周辺観光はこちら</ArrowLink>
      </div>
    </section>
  );
}
