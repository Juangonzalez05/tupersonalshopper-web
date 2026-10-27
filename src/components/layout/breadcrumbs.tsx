import Link from "next/link";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

export interface Crumb {
  label: string;
  href?: string;
}

/** Ruta de navegación + su BreadcrumbList en JSON-LD. El último elemento es la página actual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta" className="pt-7">
        <ol className="m-0 flex list-none flex-wrap gap-x-2.5 gap-y-1 p-0 text-xs tracking-[.06em] text-muted">
          {all.map((crumb, index) => {
            const last = index === all.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex gap-2.5">
                {last || !crumb.href ? (
                  <span aria-current={last ? "page" : undefined}>{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="no-underline hover:underline">
                    {crumb.label}
                  </Link>
                )}
                {!last ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            ...(crumb.href ? { item: `${site.url}${crumb.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
