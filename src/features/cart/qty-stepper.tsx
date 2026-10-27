"use client";

import { MAX_QTY } from "@/domain/cart";
import { cn } from "@/lib/cn";

export function QtyStepper({
  value,
  onChange,
  label,
  className,
  tall,
}: {
  value: number;
  onChange: (qty: number) => void;
  /** Nombre del producto para los aria-label ("Quitar una unidad de …"). */
  label?: string;
  className?: string;
  tall?: boolean;
}) {
  const suffix = label ? ` de ${label}` : "";
  const button = cn(
    "w-10 border-0 bg-transparent text-lg text-navy disabled:cursor-not-allowed disabled:text-faint",
    tall ? "h-[50px]" : "h-[42px]",
  );
  return (
    <div
      className={cn(
        "inline-flex items-center border border-line-2",
        tall ? "h-[52px]" : "h-11",
        className,
      )}
    >
      <button
        type="button"
        className={button}
        aria-label={`Quitar una unidad${suffix}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="min-w-7 text-center text-sm font-semibold" aria-live="polite">
        <span className="sr-only">Cantidad: </span>
        {value}
      </span>
      <button
        type="button"
        className={button}
        aria-label={`Agregar una unidad${suffix}`}
        disabled={value >= MAX_QTY}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
