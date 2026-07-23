interface NavLink {
  href: string;
  label: string;
}

interface FooterCopy {
  guideHeading: string;
  infoHeading: string;
  reservationHeading: string;
  reservationExternalText: string;
  copyright: string;
  mobileTelLabel: string;
  mobileReserveLabel: string;
}

interface FooterProps {
  guideLinks: NavLink[];
  infoLinks: NavLink[];
  copy: FooterCopy;
  address: string;
  tel: string;
  reservationUrl: string;
  logoAlt: string;
}

export default function Footer({
  guideLinks,
  infoLinks,
  copy,
  address,
  tel,
  reservationUrl,
  logoAlt,
}: FooterProps) {
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
              <span className="font-serif leading-tight text-white" aria-label={logoAlt}>
                HOTEL
                <br />
                GRAND TOYA
              </span>
            </div>
            <p className="mt-5 text-[0.8rem] leading-[2.1] opacity-60">
              {address}
              <br />
              TEL: {tel}
            </p>
          </div>

          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              {copy.guideHeading}
            </h4>
            {guideLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.82rem] opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-0 flex flex-col gap-3.5 lg:mt-9">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              {copy.infoHeading}
            </h4>
            {infoLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[0.82rem] opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              {copy.reservationHeading}
            </h4>
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.82rem] opacity-80 hover:opacity-100"
            >
              {copy.reservationExternalText}
            </a>
            <a href={`tel:${tel}`} className="text-[0.82rem] opacity-80 hover:opacity-100">
              {tel}
            </a>
          </div>
        </div>

        <div className="py-6 text-center text-[0.72rem] tracking-[0.05em] opacity-40">
          <p>{copy.copyright}</p>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-[200] hidden grid-cols-[1fr_1.6fr] border-t border-[#D8D7D2] bg-[#FAFAFA] max-[760px]:grid">
        <a
          href={`tel:${tel}`}
          className="flex items-center justify-center px-2 py-4 text-[0.82rem] font-medium tracking-[0.05em] text-[#1E1C1A]"
        >
          {copy.mobileTelLabel}
        </a>

        <a
          href={reservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#A24730] px-2 py-4 text-[0.82rem] font-medium tracking-[0.05em] text-white"
        >
          {copy.mobileReserveLabel}
        </a>
      </div>
    </>
  );
}
