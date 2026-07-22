import type { AnchorHTMLAttributes, ReactNode } from "react";

interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  className?: string;
}

export default function CtaButton({
  children,
  href,
  className = "",
  ...props
}: CtaButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center justify-center px-[46px] py-[17px] text-[0.86rem] tracking-[0.1em] font-medium border border-[#29415C] bg-[#29415C] text-white whitespace-nowrap transition-colors hover:bg-[#A24730] hover:border-[#A24730] ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
