import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonCva = cva(
  [
    "inline-flex items-center justify-center gap-2.5 rounded-sm border",
    "font-sans font-semibold uppercase tracking-[.12em] whitespace-nowrap no-underline",
    "transition-colors duration-200 [&_svg]:size-[18px] [&_svg]:flex-none",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
    "aria-disabled:cursor-not-allowed aria-disabled:border-disabled aria-disabled:bg-disabled aria-disabled:text-disabled-ink",
  ],
  {
    variants: {
      variant: {
        gold: "border-gold bg-gold text-navy hover:border-gold-hover hover:bg-gold-hover",
        navy: "border-navy bg-navy text-ivory hover:bg-navy-2",
        line: "border-navy bg-transparent text-navy hover:bg-navy hover:text-ivory",
        lineOnDark: "border-gold bg-transparent text-ivory hover:bg-gold hover:text-navy",
        ghost:
          "border-transparent bg-transparent px-0 text-navy underline decoration-gold underline-offset-[6px]",
        added: "border-ok bg-ivory text-ok",
      },
      size: {
        md: "min-h-12 px-[26px] text-[13px]",
        sm: "min-h-11 px-4 text-xs",
        lg: "min-h-14 px-[26px] text-[13px]",
      },
      block: { true: "w-full" },
    },
    compoundVariants: [{ variant: "ghost", className: "px-0" }],
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonCva>;

/** Clases del botón (también para <Link> y <a>). Se pasan por tailwind-merge para que las
 *  variantes y los tamaños puedan sobrescribir el estilo base sin depender del orden del CSS. */
export function buttonVariants(props?: ButtonVariantProps): string {
  return cn(buttonCva(props));
}

export function Button({
  className,
  variant,
  size,
  block,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps) {
  return (
    <button type={type} className={cn(buttonCva({ variant, size, block }), className)} {...props} />
  );
}
