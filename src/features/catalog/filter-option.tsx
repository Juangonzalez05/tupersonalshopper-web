import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const optionClass =
  "flex min-h-10 w-full items-center justify-between gap-2.5 border-0 bg-transparent p-0 text-left font-sans text-sm text-ink no-underline";

function Box({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-[18px] flex-none items-center justify-center border",
        on ? "border-navy bg-navy" : "border-line-2 bg-white",
      )}
    >
      {on ? <span className="size-2 bg-gold" /> : null}
    </span>
  );
}

function Content({ on, label, count }: { on: boolean; label: ReactNode; count?: number }) {
  return (
    <>
      <span className={cn("flex flex-1 items-center gap-3", on && "font-semibold")}>
        <Box on={on} />
        {label}
      </span>
      {count !== undefined ? <span className="text-xs text-muted">{count}</span> : null}
    </>
  );
}

/** Opción de filtro tipo casilla (botón con aria-pressed). */
export function FilterOption({
  on,
  label,
  count,
  onClick,
}: {
  on: boolean;
  label: ReactNode;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={optionClass}>
      <Content on={on} label={label} count={count} />
    </button>
  );
}

/** Igual que FilterOption pero navega (cambiar de categoría cambia la ruta). */
export function FilterLink({
  on,
  label,
  count,
  href,
}: {
  on: boolean;
  label: ReactNode;
  count?: number;
  href: string;
}) {
  return (
    <Link href={href} aria-current={on ? "page" : undefined} className={optionClass} scroll={false}>
      <Content on={on} label={label} count={count} />
    </Link>
  );
}

export function FilterGroup({
  title,
  children,
  first,
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div className={cn("py-5", first ? "pt-0" : "border-t border-line")}>
      <h3 className="mb-3.5 text-[11px] font-bold tracking-[.2em] uppercase">{title}</h3>
      {children}
    </div>
  );
}
