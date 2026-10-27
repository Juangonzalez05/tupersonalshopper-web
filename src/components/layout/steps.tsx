import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Step {
  title?: string;
  text: ReactNode;
}

/** Pasos numerados con línea dorada (Cómo funciona, confirmación). */
export function Steps({
  steps,
  onDark,
  compact,
  className,
}: {
  steps: Step[];
  onDark?: boolean;
  /** Números pequeños sin título (confirmación). */
  compact?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "m-0 grid list-none grid-cols-1 p-0 md:border-t md:border-gold",
        steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        className,
      )}
    >
      {steps.map((step, index) => (
        <li
          key={index}
          className="flex flex-row items-start gap-5 border-t border-gold py-6 md:flex-col md:gap-3 md:border-t-0 md:pt-8 md:pr-7 md:pb-0"
        >
          <span
            className={cn(
              "min-w-11 type-serif leading-none text-gold",
              compact ? "text-[32px]" : "text-4xl md:text-[44px]",
            )}
            aria-hidden="true"
          >
            {compact ? index + 1 : String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {step.title ? (
              <h3 className={cn("type-h3 mb-2", onDark && "text-ivory")}>{step.title}</h3>
            ) : null}
            <p className={cn("m-0 text-[15px]", onDark ? "text-on-navy" : "text-muted")}>
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export const howItWorksSteps: Step[] = [
  {
    title: "Explora y arma tu lista",
    text: "Agrega productos del catálogo o pídenos algo que no esté publicado.",
  },
  {
    title: "Solicita tu cotización",
    text: "Envías tu lista con nombre, ciudad y WhatsApp. No pagas nada en el sitio.",
  },
  {
    title: "Te confirmamos por WhatsApp",
    text: "Precio final, disponibilidad, tiempos y condiciones antes de comprar.",
  },
  {
    title: "Compramos y enviamos",
    text: "Hacemos la compra en EE. UU. y coordinamos el envío hasta tu ciudad.",
  },
];
