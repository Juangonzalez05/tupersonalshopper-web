"use client";

import { BagIcon } from "@/components/icons/icons";
import { cn } from "@/lib/cn";
import { useCart, useCartCount } from "./store";

function CountBadge({ count, floating }: { count: number; floating?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gold font-bold text-navy",
        floating
          ? "absolute top-0.5 right-0 h-[18px] min-w-[18px] px-1 text-[10px]"
          : "h-[22px] min-w-[22px] px-1.5 text-[11px]",
      )}
      aria-hidden="true"
    >
      {count}
    </span>
  );
}

/** Botón "Mi pedido" del header: completo en escritorio, solo icono en móvil. */
export function CartButton({ compact }: { compact?: boolean }) {
  const count = useCartCount();
  const open = useCart((s) => s.setDrawerOpen);
  const label = `Abrir mi pedido, ${count} ${count === 1 ? "producto" : "productos"}`;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => open(true)}
        aria-label={label}
        className="relative inline-flex size-11 items-center justify-center rounded-sm border-0 bg-transparent text-inherit"
      >
        <BagIcon className="size-[22px]" />
        <CountBadge count={count} floating />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open(true)}
      aria-label={label}
      className="inline-flex h-11 items-center gap-2.5 rounded-sm border border-navy-line bg-transparent pr-3.5 pl-2.5 font-sans text-[13px] tracking-[.06em] text-ivory hover:border-gold"
    >
      <BagIcon className="size-5" />
      <span>Mi pedido</span>
      <CountBadge count={count} />
    </button>
  );
}
