import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Las utilidades propias (type-*, wrap, sec…) se registran para que tailwind-merge
// no las confunda con clases de color o de tamaño de texto.
const twMerge = extendTailwindMerge<"typography">({
  extend: {
    classGroups: {
      typography: [
        "type-display",
        "type-h1",
        "type-h2",
        "type-h3",
        "type-serif",
        "type-lead",
        "type-eyebrow",
        "type-small",
        "type-label",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
