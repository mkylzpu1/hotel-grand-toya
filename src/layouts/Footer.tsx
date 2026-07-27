import { asset } from './../utils/asset';
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
  logoSrc: string;
  address: string;
  tel: string;
  reservationUrl: string;
  logoAlt: string;
}

const HOTEL_ADDRESS = '〒049-5721 北海道虻田郡洞爺湖町洞爺湖温泉144';
const HOTEL_TEL = '0142-75-2288';
const HOTEL_FAX = '0142-75-3434';
const HOTEL_EMAIL = 'info@grandtoya.com';
const RESERVATION_URL = 'https://d-reserve.jp/GSEA001F01300/GSEA001A01?hotelCode=0000002996'; // 実際の予約URLに置き換えてください

export default function Footer({ guideLinks, infoLinks, copy, logoSrc, logoAlt }: FooterProps) {
  return (
    <>
      <footer className="border-t-[3px] border-[#A24730] bg-[#16283A] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-10 pb-10 pt-[88px] min-[761px]:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_0.9fr]">
          <div className="mt-0">
            <div className="mb-4 flex items-center">
              <img src={logoSrc} alt={logoAlt} className="h-9 w-auto" />
            </div>
            <p className="mt-5 text-[0.8rem] leading-[2.1] opacity-60">
              {HOTEL_ADDRESS}
              <br />
              TEL: {HOTEL_TEL}
              <br />
              FAX: {HOTEL_FAX}
              <br />
              MAIL: {HOTEL_EMAIL}
            </p>
          </div>

          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              {copy.guideHeading}
            </h4>
            {guideLinks.map((link) => (
              <a
                key={asset(link.href)}
                href={asset(link.href)}
                className="text-[0.82rem] opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* lg:mt-9 を削除してズレを解消 */}
          <div className="mt-0 flex flex-col gap-3.5">
            <h4 className="mb-5 text-[0.72rem] font-normal tracking-[0.16em] opacity-50">
              {copy.infoHeading}
            </h4>
            {infoLinks.map((link) => (
              <a
                key={asset(link.href)}
                href={asset(link.href)}
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
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.82rem] opacity-80 hover:opacity-100"
            >
              {copy.reservationExternalText}
            </a>
            <a href={`tel:${HOTEL_TEL}`} className="text-[0.82rem] opacity-80 hover:opacity-100">
              {HOTEL_TEL}
            </a>
          </div>
        </div>

        <div className="py-6 text-center text-[0.72rem] tracking-[0.05em] opacity-40">
          <p>{copy.copyright}</p>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-[200] hidden grid-cols-[1fr_1.6fr] border-t border-[#D8D7D2] bg-[#FAFAFA] max-[760px]:grid">
        <a
          href={`tel:${HOTEL_TEL}`}
          className="flex items-center justify-center px-2 py-4 text-[0.82rem] font-medium tracking-[0.05em] text-[#1E1C1A]"
        >
          {copy.mobileTelLabel}
        </a>
        <a
          href={RESERVATION_URL}
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
