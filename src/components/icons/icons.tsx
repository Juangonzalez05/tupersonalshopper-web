import type { ReactNode, SVGProps } from "react";
import type { CategoryKey } from "@/domain/product";

/** Iconos de línea del sistema de diseño. Decorativos por defecto (aria-hidden). */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, viewBox = "0 0 24 24", strokeWidth = 1.4, ...props }: IconProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Icon strokeWidth={1.6} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
/** Estrella de cinco puntas del logo (relleno, no de línea). */
export const StarIcon = (p: IconProps) => (
  <Icon fill="currentColor" stroke="none" {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </Icon>
);
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Icon>
);
export const SmallCloseIcon = (p: IconProps) => (
  <Icon strokeWidth={1.6} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Icon>
);
export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5l7 7-7 7" />
  </Icon>
);
export const FiltersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const InfoIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8v.5" />
  </Icon>
);
export const WhatsAppIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6L4.5 19.5Z" />
    <path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.2-.1.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-3.2-.5-1.4-.8-2.4-1.9-3.1-3.2-.7-1.4-.6-2.4-.2-3.2Z" />
  </Icon>
);

// ---------- Iconos de categoría (32 px, trazo fino) ----------

const categoryPaths: Record<CategoryKey | "polo", ReactNode> = {
  beauty: (
    <>
      <path d="M12 28h8V15h-8v13Z" />
      <path d="M13.5 15V8l5-4v11" />
    </>
  ),
  face: (
    <>
      <path d="M16 4c4 5.5 8 9.5 8 15a8 8 0 0 1-16 0c0-5.5 4-9.5 8-15Z" />
      <path d="M12.5 20a3.5 3.5 0 0 0 3.5 3.5" />
    </>
  ),
  body: (
    <>
      <path d="M10 11h12v16a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V11Z" />
      <path d="M13 11V7h6v4M16 7V4h4" />
    </>
  ),
  health: (
    <>
      <path d="M16 27c-6-3-9-8-9-14 6 0 9 3 9 8 0-5 3-8 9-8 0 6-3 11-9 14Z" />
      <path d="M16 27V16" />
    </>
  ),
  fashion: <path d="M16 10a2.5 2.5 0 1 1 2.5-2.5M16 10v2.5L4 22h24l-12-9.5" />,
  polo: (
    <>
      <path d="M11 5l5 3 5-3 6 4-3 5-3-1.5V27H11V12.5L8 14 5 9l6-4Z" />
      <path d="M14 8v4M18 8v4" />
    </>
  ),
  home: (
    <>
      <path d="M5 15l11-9 11 9v12H5V15Z" />
      <path d="M13 27v-7h6v7" />
    </>
  ),
  snack: (
    <>
      <rect x="6" y="12" width="20" height="15" />
      <path d="M5 12h22M16 12v15M16 12c-3-5-8-5-8-1.5S16 12 16 12Zm0 0c3-5 8-5 8-1.5S16 12 16 12Z" />
    </>
  ),
};

export function CategoryIcon({ category, ...p }: IconProps & { category: CategoryKey | "polo" }) {
  return (
    <Icon viewBox="0 0 32 32" strokeWidth={1.2} {...p}>
      {categoryPaths[category]}
    </Icon>
  );
}

// ---------- Iconos de confianza y encargos ----------

export const StoreIcon = (p: IconProps) => (
  <Icon viewBox="0 0 32 32" strokeWidth={1.2} {...p}>
    <path d="M6 11h20l-1.5 16h-17L6 11Z" />
    <path d="M11 11V9a5 5 0 0 1 10 0v2" />
  </Icon>
);
export const CheckSquareIcon = (p: IconProps) => (
  <Icon viewBox="0 0 32 32" strokeWidth={1.2} {...p}>
    <rect x="6" y="6" width="20" height="20" />
    <path d="M11 16.5l3.5 3.5 7-8" />
  </Icon>
);
export const ChatIcon = (p: IconProps) => (
  <Icon viewBox="0 0 32 32" strokeWidth={1.2} {...p}>
    <path d="M6 26l1.6-4.8A10.5 10.5 0 1 1 11.4 25L6 26Z" />
  </Icon>
);
export const InfoCircleIcon = (p: IconProps) => (
  <Icon viewBox="0 0 32 32" strokeWidth={1.2} {...p}>
    <circle cx="16" cy="16" r="11" />
    <path d="M16 14v8M16 10v.5" />
  </Icon>
);
export const LaptopIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <rect x="4" y="5" width="16" height="11" />
    <path d="M2 19h20" />
  </Icon>
);
export const HouseIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <path d="M4 11l8-7 8 7v9H4v-9Z" />
  </Icon>
);
export const HangerIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <path d="M12 7a2 2 0 1 1 2-2M12 7v2L3 16h18l-9-7" />
  </Icon>
);
export const LipstickIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <path d="M9 21h6V11H9v10Z" />
    <path d="M10 11V6l4-3v8" />
  </Icon>
);
