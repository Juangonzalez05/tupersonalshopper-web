import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Eyebrow } from "@/components/ui/typography";
import { QuoteWorkspace } from "@/features/quote/quote-workspace";

export const metadata: Metadata = {
  title: "Mi pedido",
  description: "Revisa tu lista y solicita la cotización por WhatsApp. Sin pagos en línea.",
  alternates: { canonical: "/mi-pedido" },
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <div className="wrap pb-24">
      <Breadcrumbs items={[{ label: "Mi pedido" }]} />
      <header className="flex flex-col gap-3 pt-5 pb-10">
        <Eyebrow>Lista de cotización</Eyebrow>
        <h1 className="type-h1">Mi pedido</h1>
        <p className="type-lead max-w-[60ch] text-muted">
          Revisa tus productos y envíanos la solicitud. No pagas nada aquí: te confirmamos precio
          final, disponibilidad y condiciones por WhatsApp.
        </p>
      </header>
      <QuoteWorkspace />
    </div>
  );
}
