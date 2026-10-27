import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { TAG_LABELS, type ProductTag } from "@/domain/product";

const tagVariants = cva(
  "inline-flex h-6 items-center rounded-xs px-2.5 text-[10px] font-bold uppercase tracking-[.18em]",
  {
    variants: {
      variant: {
        nuevo: "bg-navy text-ivory",
        tendencia: "border border-gold bg-ivory text-gold-ink",
        gold: "bg-gold text-navy",
        line: "border border-line-2 text-muted",
      },
    },
    defaultVariants: { variant: "line" },
  },
);

export function Tag({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagVariants>) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}

export function ProductTagBadge({ tag, className }: { tag: ProductTag; className?: string }) {
  return (
    <Tag variant={tag} className={className}>
      {TAG_LABELS[tag]}
    </Tag>
  );
}
