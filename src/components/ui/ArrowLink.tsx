import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function ArrowLink({
  children,
  href = '#',
  className = '',
  ...props
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 border-b border-[#A24730] pb-[5px] text-[0.82rem] font-medium tracking-[0.05em] text-[#29415C] transition-colors hover:border-[#7E3623] hover:text-[#7E3623] ${className}`}
      {...props}
    >
      {children} →
    </a>
  );
}
