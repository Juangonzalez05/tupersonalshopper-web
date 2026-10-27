import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Acordeón con <details> nativo: accesible y funciona sin JavaScript. */
export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("border-t border-line", className)}>{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary
        className={cn(
          "flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-3 type-serif text-[19px]",
          "[&::-webkit-details-marker]:hidden",
          "after:font-sans after:text-[22px] after:text-gold-ink after:content-['+'] group-open:after:content-['–']",
        )}
      >
        {title}
      </summary>
      <div className="max-w-[68ch] pb-[22px] text-[15px] text-muted">{children}</div>
    </details>
  );
}
