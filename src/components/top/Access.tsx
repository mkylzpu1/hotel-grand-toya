import ArrowLink from '../ui/ArrowLink';
import { asset } from '../../utils/asset';
interface SceneryItem {
  img: string;
  title: string;
  note: string;
}
interface AccessListItem {
  label: string;
  value: string;
}
interface AccessProps {
  lang: string;
  heroImage: string;
  heroImageAlt: string;
  eyebrow: string;
  heading: string;
  accessList: AccessListItem[];
  note: string;
  detailLinkText: string;
  mapEmbedUrl: string;
  mapTitle: string;
  sceneryHeading: string;
  sceneryDescription: string;
  sceneryItems: SceneryItem[];
  sceneryLinkText: string;
}
export default function Access({
  lang,
  heroImage,
  heroImageAlt,
  eyebrow,
  heading,
  accessList,
  note,
  detailLinkText,
  mapEmbedUrl,
  mapTitle,
  sceneryHeading,
  sceneryDescription,
  sceneryItems,
  sceneryLinkText,
}: AccessProps) {
  // シームレスな無限スクロールのためにリストを複製
  const sceneryLoop: SceneryItem[] = [...sceneryItems, ...sceneryItems];
  return (
    <section
      className="relative mx-auto max-w-[1320px] px-10 pb-[108px] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-[#D8D7D2] before:content-[''] after:absolute after:-top-px after:left-1/2 after:h-[3px] after:w-11 after:-translate-x-1/2 after:bg-[#A24730] after:content-['']"
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
        <img src={heroImage} alt={heroImageAlt} className="block h-full w-full object-cover" />
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
          {eyebrow}
        </p>
        <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] font-semibold leading-[1.65] text-[#1E1C1A]">
          {heading}
        </h2>
      </div>
      {/* Access info + map */}
      <div className="mb-[110px] grid grid-cols-1 items-start gap-[72px] lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ul className="m-0 list-none p-0">
            {accessList.map((item) => (
              <li key={item.label} className="border-b border-[#D8D7D2] py-4 text-[0.9rem]">
                <b>{item.label}</b>：{item.value}
              </li>
            ))}
          </ul>
          <p className="my-5 mb-[30px] text-[0.78rem] text-[#8A8781]">{note}</p>
          <ArrowLink href={asset(`/${lang}/access/`)}>{detailLinkText}</ArrowLink>
        </div>
        <div className="h-[360px] border-[0.5px] border-[#29415C]">
          <iframe
            src={mapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={mapTitle}
            className="block h-full w-full border-0"
          />
        </div>
      </div>
      {/* Scenery lead + marquee gallery */}
      <div className="text-center">
        <h3 className="mb-5 text-[1.7rem] font-medium">{sceneryHeading}</h3>
        <p className="mx-auto mb-14 max-w-[720px] leading-[2] text-[#55524C]">
          {sceneryDescription}
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
        <ArrowLink href={asset(`/${lang}/facilities/`)}>{sceneryLinkText}</ArrowLink>
      </div>
    </section>
  );
}
