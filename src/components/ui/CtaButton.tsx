import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  className?: string;
}

export default function CtaButton({ children, href, className = '', ...props }: CtaButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center whitespace-nowrap border border-[#29415C] bg-[#29415C] px-[46px] py-[17px] text-[0.86rem] font-medium tracking-[0.1em] text-white transition-colors hover:border-[#A24730] hover:bg-[#A24730] ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
