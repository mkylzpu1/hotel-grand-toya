import type { SectionData } from '../../types/section';
import ArrowLink from '../ui/ArrowLink';

export default function ContentSection({
  id,
  icon,
  eyebrow,
  titleLines = [],
  description = [],
  linkText,
  linkHref = '#',
  centerText = false,
  showDivider = true,
  tallImagePosition = 'right',
  images = [],
}: SectionData) {
  const dividerClass = showDivider
    ? "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#D8D7D2] after:content-[''] after:absolute after:-top-px after:left-1/2 after:-translate-x-1/2 after:w-11 after:h-[3px] after:bg-[#A24730]"
    : '';

  const isThreeImages = images.length === 3;

  return (
    <section id={id} className={`relative mx-auto max-w-[1320px] px-10 py-[108px] ${dividerClass}`}>
      <div className="grid grid-cols-12 items-start gap-7">
        {/* テキストカラム */}
        <div
          className={`col-span-12 lg:col-span-4 lg:col-start-1 ${centerText ? 'self-center' : ''}`}
        >
          <p className="mb-[18px] flex items-center gap-2.5 text-[0.74rem] font-medium tracking-[0.14em] text-[#29415C]">
            <span
              className="inline-flex h-[26px] w-[26px] shrink-0 -rotate-3 items-center justify-center rounded-[1px] border-[1.5px] border-[#A24730] font-serif text-[0.82rem] font-semibold leading-none text-[#A24730]"
              aria-hidden="true"
            >
              {icon}
            </span>
            {eyebrow}
          </p>

          <h2 className="mb-[22px] font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] font-semibold leading-[1.65] text-[#1E1C1A]">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p className={`text-[#55524C] ${centerText ? 'mt-2' : ''} mb-[30px]`}>
            {description.map((line, i) => (
              <span key={i}>
                {line}
                {i < description.length - 1 && <br />}
              </span>
            ))}
          </p>

          {linkText && <ArrowLink href={linkHref}>{linkText}</ArrowLink>}
        </div>

        {/* 画像カラム */}
        {isThreeImages ? (
          <ThreeImageGrid images={images} tallImagePosition={tallImagePosition} />
        ) : (
          <TwoImageGrid images={images} />
        )}
      </div>
    </section>
  );
}

function TwoImageGrid({ images }: { images: SectionData['images'] }) {
  return (
    <div className="col-span-12 grid h-[320px] grid-cols-[1.15fr_0.85fr] gap-6 lg:col-span-7 lg:col-start-6 lg:h-[460px]">
      {images?.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`block w-full object-cover ${img.className || 'h-full'}`}
        />
      ))}
    </div>
  );
}

function ThreeImageGrid({
  images,
  tallImagePosition,
}: {
  images: SectionData['images'];
  tallImagePosition: 'left' | 'right';
}) {
  const isLeft = tallImagePosition === 'left';

  const gridColsClass = isLeft ? 'lg:grid-cols-[1.3fr_1fr]' : 'lg:grid-cols-[1fr_1.3fr]';

  const positionClasses = isLeft
    ? [
        'min-[761px]:col-start-1 min-[761px]:row-start-1 min-[761px]:row-span-2', // tall
        'min-[761px]:col-start-2 min-[761px]:row-start-1', // top
        'min-[761px]:col-start-2 min-[761px]:row-start-2', // bottom
      ]
    : [
        'min-[761px]:col-start-2 min-[761px]:row-start-1 min-[761px]:row-span-2', // tall
        'min-[761px]:col-start-1 min-[761px]:row-start-1', // top
        'min-[761px]:col-start-1 min-[761px]:row-start-2', // bottom
      ];

  return (
    <div
      className={`col-span-12 grid grid-cols-1 max-[760px]:grid-cols-1 min-[761px]:grid-cols-2 lg:col-span-8 lg:col-start-6 ${gridColsClass} gap-5 min-[761px]:auto-rows-[180px] lg:auto-rows-[230px]`}
    >
      {images?.map((img, i) => (
        <figure key={i} className={`m-0 ${positionClasses[i]}`}>
          <img src={img.src} alt={img.alt} className="block h-full w-full object-cover" />
          {img.caption && (
            <figcaption className="mt-3 text-[0.78rem] tracking-[0.08em] text-[#55524C]">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
