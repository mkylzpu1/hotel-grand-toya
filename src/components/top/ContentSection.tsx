import type { SectionData } from "../../types/section";
import ArrowLink from "../ui/ArrowLink";

export default function ContentSection({
  id,
  icon,
  eyebrow,
  titleLines = [],
  description = [],
  linkText,
  linkHref = "#",
  centerText = false,
  showDivider = true,
  tallImagePosition = "right",
  images = [],
}: SectionData) {
  const dividerClass = showDivider
    ? "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#D8D7D2] after:content-[''] after:absolute after:-top-px after:left-1/2 after:-translate-x-1/2 after:w-11 after:h-[3px] after:bg-[#A24730]"
    : "";

  const isThreeImages = images.length === 3;

  return (
    <section
      id={id}
      className={`relative max-w-[1320px] mx-auto px-10 py-[108px] ${dividerClass}`}
    >
      <div className="grid grid-cols-12 gap-7 items-start">
        {/* テキストカラム */}
        <div
          className={`col-span-12 lg:col-start-1 lg:col-span-4 ${
            centerText ? "self-center" : ""
          }`}
        >
          <p className="flex items-center gap-2.5 text-[0.74rem] tracking-[0.14em] font-medium text-[#29415C] mb-[18px]">
            <span
              className="inline-flex items-center justify-center w-[26px] h-[26px] shrink-0 border-[1.5px] border-[#A24730] text-[#A24730] font-serif font-semibold text-[0.82rem] leading-none -rotate-3 rounded-[1px]"
              aria-hidden="true"
            >
              {icon}
            </span>
            {eyebrow}
          </p>

          <h2 className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.05rem)] text-[#1E1C1A] mb-[22px] leading-[1.65] font-semibold">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p className={`text-[#55524C] ${centerText ? "mt-2" : ""} mb-[30px]`}>
            {description.map((line, i) => (
              <span key={i}>
                {line}
                {i < description.length - 1 && <br />}
              </span>
            ))}
          </p>

          {linkText && (
            <ArrowLink href={linkHref}>{linkText}</ArrowLink>
          )}
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

function TwoImageGrid({ images }: { images: SectionData["images"] }) {
  return (
    <div className="col-span-12 lg:col-start-6 lg:col-span-7 grid grid-cols-[1.15fr_0.85fr] gap-6 h-[320px] lg:h-[460px]">
      {images?.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`w-full object-cover block ${img.className || "h-full"}`}
        />
      ))}
    </div>
  );
}

function ThreeImageGrid({ images, tallImagePosition }: { images: SectionData["images"]; tallImagePosition: "left" | "right" }) {
  const isLeft = tallImagePosition === "left";

  const gridColsClass = isLeft ? "lg:grid-cols-[1.3fr_1fr]" : "lg:grid-cols-[1fr_1.3fr]";

  const positionClasses = isLeft
    ? [
        "min-[761px]:col-start-1 min-[761px]:row-start-1 min-[761px]:row-span-2", // tall
        "min-[761px]:col-start-2 min-[761px]:row-start-1", // top
        "min-[761px]:col-start-2 min-[761px]:row-start-2", // bottom
      ]
    : [
        "min-[761px]:col-start-2 min-[761px]:row-start-1 min-[761px]:row-span-2", // tall
        "min-[761px]:col-start-1 min-[761px]:row-start-1", // top
        "min-[761px]:col-start-1 min-[761px]:row-start-2", // bottom
      ];

  return (
    <div
      className={`col-span-12 lg:col-start-6 lg:col-span-8 grid grid-cols-1 max-[760px]:grid-cols-1 min-[761px]:grid-cols-2 ${gridColsClass} gap-5 min-[761px]:auto-rows-[180px] lg:auto-rows-[230px]`}
    >
      {images?.map((img, i) => (
        <figure key={i} className={`m-0 ${positionClasses[i]}`}>
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover block"
          />
          {img.caption && (
            <figcaption className="mt-3 text-[0.78rem] text-[#55524C] tracking-[0.08em]">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
