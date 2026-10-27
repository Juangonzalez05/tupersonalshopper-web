import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AVAILABILITY_LABELS, type Availability } from "@/domain/product";
import { InfoIcon } from "@/components/icons/icons";

const tone: Record<Availability, { text: string; dot: string }> = {
  disponible: { text: "text-ok", dot: "bg-ok" },
  confirmar: { text: "text-muted", dot: "bg-gold" },
  agotado: { text: "text-off", dot: "bg-off" },
};

export function AvailabilityStatus({
  availability,
  label,
  className,
}: {
  availability: Availability;
  label?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "m-0 inline-flex items-center gap-2 text-xs",
        tone[availability].text,
        className,
      )}
    >
      <span
        className={cn("size-[7px] flex-none rounded-full", tone[availability].dot)}
        aria-hidden="true"
      />
      {label ?? AVAILABILITY_LABELS[availability]}
    </p>
  );
}

export function HealthNote({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <p
      className={cn(
        "m-0 flex items-start gap-2.5 border-t border-line pt-2.5 text-xs text-muted",
        className,
      )}
    >
      <InfoIcon className="mt-px size-4 flex-none text-gold-ink" />
      <span>{children ?? "Consulta previa de viabilidad de importación"}</span>
    </p>
  );
}
