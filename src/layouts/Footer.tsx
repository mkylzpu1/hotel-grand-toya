import { ExternalLink } from 'lucide-react';
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
  reservationExternalNote: string;
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
  postalCode: string;
  tel: string;
  fax: string;
  email: string;
  reservationUrl: string;
  logoAlt: string;
}

export default function Footer({
  guideLinks,
  infoLinks,
  copy,
  logoSrc,
  address,
  postalCode,
  tel,
  fax,
  email,
  reservationUrl,
  logoAlt,
}: FooterProps) {
  return (
    <>
      <footer className="border-t-[3px] border-[#A24730] bg-[#16283A] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-10 pb-10 pt-[88px] min-[761px]:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_0.9fr]">
          <div className="mt-0">
            <div className="mb-4 flex items-center">
              <img src={logoSrc} alt={logoAlt} className="h-9 w-auto" />
            </div>
            <p className="mt-5 text-[0.8rem] leading-[2.1] opacity-60">
              {postalCode} {address}
              <br />
              TEL: {tel}
              <br />
              FAX: {fax}
              <br />
              MAIL: {email}
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
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[0.82rem] opacity-80 hover:opacity-100"
            >
              {copy.reservationExternalText}
              <ExternalLink size={12} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <p className="text-[0.7rem] opacity-40">{copy.reservationExternalNote}</p>
            <a href={`tel:${tel}`} className="text-[0.82rem] opacity-80 hover:opacity-100">
              {tel}
            </a>
          </div>
        </div>
        <div className="py-6 text-center text-[0.72rem] tracking-[0.05em] opacity-40">
          <p>{copy.copyright}</p>
        </div>
      </footer>
    </>
  );
}
