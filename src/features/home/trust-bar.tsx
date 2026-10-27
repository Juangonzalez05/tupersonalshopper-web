import { ChatIcon, CheckSquareIcon, InfoCircleIcon, StoreIcon } from "@/components/icons/icons";

const items = [
  {
    Icon: StoreIcon,
    title: "Tiendas reales de EE. UU.",
    text: "Compramos en Walmart, Amazon y otras tiendas que tú también puedes consultar.",
  },
  {
    Icon: CheckSquareIcon,
    title: "Precio final antes de pagar",
    text: "El valor inicial es una referencia; la cifra final te llega por WhatsApp.",
  },
  {
    Icon: ChatIcon,
    title: "Atención personal",
    text: "Una shopper te acompaña, resuelve dudas de tallas y te propone alternativas.",
  },
  {
    Icon: InfoCircleIcon,
    title: "Importación consultada",
    text: "Vitaminas y productos de venta libre pasan por consulta previa de viabilidad.",
  },
];

export function TrustBar() {
  return (
    <section className="bg-mist" aria-label="Por qué comprar con Tu Shopper USA">
      <ul className="m-0 wrap grid list-none grid-cols-1 gap-6 sec-sm md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-4">
            <Icon className="size-7 flex-none text-gold-ink" />
            <div>
              <b className="mb-1 block type-serif text-[19px] leading-[1.25] font-normal">
                {title}
              </b>
              <p className="m-0 text-sm text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
