/**
 * Selecciones editoriales por id de producto. Las etiquetas "Nuevo"/"Tendencia" y los rankings
 * son una asignación de ejemplo del diseño: se cambian aquí sin tocar las páginas.
 */
export const curation = {
  home: {
    newArrivals: ["g1", "f01", "p05", "m9"],
    trending: ["f04", "b01", "v1", "p01"],
    marquee: [
      { id: "g1", label: "Nuevo" },
      { id: "f04", label: "Tendencia", title: "Sérum Medicube PDRN" },
      { id: "m9", label: "Nuevo" },
      { id: "p01", label: "Tendencia", title: "Crema eos Vanilla Cashmere" },
      { id: "p05", label: "Nuevo", title: "Vaseline Sunlit Glow" },
      { id: "v1", label: "Tendencia", title: "Pack Victoria's Secret" },
      { id: "f01", label: "Nuevo", title: "Contorno Medicube cúrcuma" },
      { id: "b03", label: "Tendencia", title: "Gloss Juliette & Co." },
      { id: "k7", label: "Nuevo", title: "Chaqueta tejida niño" },
      { id: "s07", label: "Tendencia", title: "Kit Olly Rise & Rest" },
    ],
    collage: { small: ["f04", "p01"] },
  },
  trends: {
    weekLabel: "Semana del 26 de octubre",
    ranking: ["f04", "p01", "v1", "m1", "s03"],
    viral: ["b03", "f02", "p06", "d01"],
    news: ["k7", "s07", "p05", "g1"],
    gifts: ["b01", "p14", "b05", "b07"],
    blackFriday: ["b09", "m1", "f03", "s03", "p01", "v1"],
    christmas: ["b01", "p14", "p12", "b04", "b07", "b03"],
  },
} as const;

export interface EditorialImage {
  src: string;
  alt: string;
  /** Producto al que lleva la foto. */
  productId?: string;
  caption?: string;
}

const e = (name: string) => `/img/e/${name}.webp`;

export const editorial = {
  heroMain: {
    src: e("hero-polo-navy"),
    alt: "Hombre con camiseta polo azul marino de la Colección Polo",
  },
  poloHero: {
    src: e("polo-hero"),
    alt: "Modelo con camiseta polo a rayas verde y roja y gorra morada",
  },
  poloCollection: {
    src: e("coleccion-polo"),
    alt: "Camiseta polo a rayas con gorra verde, Colección Polo",
  },
  lookbook: [
    {
      src: e("lookbook-polo-la"),
      alt: "Pareja con camisetas polo LA azul rey",
      productId: "m9",
      caption: "Camiseta polo LA",
    },
    {
      src: e("lookbook-polo-pique-lila"),
      alt: "Hombre con camiseta polo piqué lila",
      productId: "m1",
      caption: "Polo piqué",
    },
    {
      src: e("lookbook-rugby-nino"),
      alt: "Niño con rugby a rayas de colores",
      productId: "k1",
      caption: "Rugby niño",
    },
    {
      src: e("lookbook-camiseta-rayas"),
      alt: "Hombre con camiseta a rayas azules",
      productId: "m8",
      caption: "Camiseta a rayas",
    },
    {
      src: e("lookbook-chaqueta-tejida"),
      alt: "Niño con chaqueta tejida color crema",
      productId: "k7",
      caption: "Chaqueta tejida",
    },
    {
      src: e("lookbook-polo-ny"),
      alt: "Hombre con camiseta polo NY vinotinto",
      productId: "m4",
      caption: "Camiseta polo NY",
    },
    {
      src: e("lookbook-sueter-trenzado"),
      alt: "Niño con suéter tejido trenzado azul",
      productId: "k8",
      caption: "Suéter trenzado",
    },
  ] satisfies EditorialImage[],
} as const;
