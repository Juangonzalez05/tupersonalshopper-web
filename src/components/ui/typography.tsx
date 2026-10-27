import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  onDark,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("type-eyebrow", onDark ? "text-gold" : "text-gold-ink", className)}>
      {children}
    </Tag>
  );
}

/** Enlace de cabecera de sección: mayúsculas con subrayado dorado. */
export function SectionLink({
  href,
  children,
  onDark,
}: {
  href: string;
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b border-gold pb-1 text-[13px] font-semibold tracking-[.12em] whitespace-nowrap uppercase no-underline",
        onDark && "text-ivory",
      )}
    >
      {children}
    </Link>
  );
}

export function SectionHead({
  eyebrow,
  title,
  titleId,
  action,
  onDark,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  titleId?: string;
  action?: ReactNode;
  onDark?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-7 flex flex-col items-start gap-3.5 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="flex flex-col gap-2.5">
        <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        <Heading id={titleId} className={cn("type-h2", onDark && "text-ivory")}>
          {title}
        </Heading>
      </div>
      {action}
    </div>
  );
}
