import Link from "next/link";
import { site } from "@/config/site";
import { whatsappUrl } from "@/domain/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/icons";
import { Logo } from "./logo";

const columns = [
  {
    title: "Explorar",
    links: [
      { label: "Catálogo completo", href: "/catalogo" },
      { label: "Colección Polo", href: "/coleccion-polo" },
      { label: "Tendencias", href: "/tendencias" },
      { label: "Belleza y cuidado facial", href: "/catalogo/cuidado-facial" },
      { label: "Salud y bienestar", href: "/catalogo/salud-y-bienestar" },
    ],
  },
  {
    title: "Tu pedido",
    links: [
      { label: "Mi pedido", href: "/mi-pedido" },
      { label: "Encargo personalizado", href: "/encargos" },
      { label: "Cómo funciona", href: "/como-funciona" },
      { label: "Preguntas frecuentes", href: "/como-funciona#preguntas" },
      { label: "Tratamiento de datos", href: "/politica-de-datos" },
    ],
  },
];

const linkClass =
  "flex min-h-9 items-center text-sm text-on-navy-link no-underline hover:text-ivory hover:underline hover:decoration-gold hover:underline-offset-4";

export function SiteFooter() {
  const wa = whatsappUrl(site.whatsappNumber);
  return (
    <footer className="border-t border-gold bg-navy text-on-navy">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 pt-[52px] pb-8 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] md:gap-12 md:pt-[72px] md:pb-12">
          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <Logo />
            <p className="m-0 max-w-[38ch] text-[15px] leading-relaxed">{site.description}</p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "lineOnDark", size: "sm" })}
              >
                WhatsApp
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "lineOnDark", size: "sm" })}
              >
                Instagram
              </a>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="type-eyebrow mb-[18px] text-gold">{column.title}</h2>
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="type-eyebrow mb-[18px] text-gold">Contacto</h2>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {site.whatsappLabel}
                </a>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Instagram {site.instagramLabel}
                </a>
              </li>
              <li>
                <span className="flex min-h-9 items-center text-sm text-on-navy-link">
                  Horario {site.schedule}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-navy-line pt-6 pb-8 text-xs text-on-navy-faint md:flex-row md:justify-between md:gap-6">
          <p className="m-0 max-w-[80ch]">{site.legal}</p>
          <p className="m-0 whitespace-nowrap">
            © {site.copyrightYear} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(site.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-70 flex size-14 items-center justify-center rounded-full border border-gold bg-navy text-gold no-underline shadow-fab md:right-6 md:bottom-6 md:size-[60px]"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
