import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function ArrowLink({
  children,
  href = "#",
  className = "",
  ...props
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 text-[0.82rem] tracking-[0.05em] text-[#29415C] font-medium pb-[5px] border-b border-[#A24730] hover:text-[#7E3623] hover:border-[#7E3623] transition-colors ${className}`}
      {...props}
    >
      {children} →
    </a>
  );
}
