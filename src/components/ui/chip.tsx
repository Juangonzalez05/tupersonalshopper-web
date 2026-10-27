import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const chipVariants = cva(
  [
    "inline-flex min-h-11 items-center gap-2 border font-sans text-[13px] whitespace-nowrap no-underline",
    "transition-colors [&_svg]:size-3.5",
  ],
  {
    variants: {
      shape: {
        pill: "rounded-full px-4",
        square: "min-w-12 justify-center rounded-sm px-3",
      },
      state: {
        idle: "border-line-2 bg-transparent text-ink hover:border-navy",
        on: "border-navy bg-navy text-ivory",
        soldOut: "cursor-not-allowed border-dashed border-line-2 text-faint line-through",
      },
    },
    defaultVariants: { shape: "pill", state: "idle" },
  },
);

export function Chip({
  className,
  shape,
  pressed,
  soldOut,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof chipVariants>, "state"> & { pressed?: boolean; soldOut?: boolean }) {
  const state = soldOut ? "soldOut" : pressed ? "on" : "idle";
  return (
    <button type={type} className={cn(chipVariants({ shape, state }), className)} {...props} />
  );
}
