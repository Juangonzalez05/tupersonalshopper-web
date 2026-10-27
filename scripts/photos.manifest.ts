/**
 * Qué foto original (en photos/FOTOS FONDO BLANCO) usa cada producto y cada imagen editorial.
 *
 * Modos:
 *  - "pack":  foto de producto sobre fondo blanco. Se recortan los bordes blancos, se centra en
 *             4:5 con margen uniforme y el blanco pasa a ser el neutro #F3F0EA (fusión multiply).
 *  - "cover": foto de modelo o ambiente. Recorte 4:5 tipo cover, con punto focal opcional.
 *
 * Las capturas de tallas y colores (Men PRL/1.jpg … 9.jpg, Niños PRL/2(1).jpg, etc.) no se
 * publican: sus datos ya están en src/data/static/products.ts.
 */

export interface PhotoSource {
  file: string;
  mode: "pack" | "cover";
  /** Recorte previo en píxeles de la foto original. */
  crop?: { left: number; top: number; width: number; height: number };
  /** Punto focal para "cover" (posición de sharp: "north", "centre", "attention"…). */
  position?: string;
  /** Opción de variante que muestra esta foto (debe coincidir con products.ts). */
  variant?: string;
}

const INV = "Fotos inventario";
const DL = "Fotos inventario/Descargadas OK";
const MEN = "Men PRL";
const KIDS = "Niños PRL";
const VS = "Victoria Secret $155.000";

const pack = (file: string, variant?: string): PhotoSource => ({ file, mode: "pack", variant });
const cover = (file: string, position = "north"): PhotoSource => ({
  file,
  mode: "cover",
  position,
});

export const productPhotos: Record<string, PhotoSource[]> = {
  // Cuidado facial
  "serum-pdrn-pink-peptide-medicube": [pack(`${INV}/SERUM COLAGNEO MEDICUE.png`)],
  "gel-contorno-de-ojos-kojic-acid-turmeric-medicube": [
    pack(`${INV}/CONTORNO DE OJOS MEDICUBE CURCUMA.png`),
  ],
  "crema-pdrn-pink-collagen-capsule-medicube": [pack(`${INV}/CREMA COLAGENO MEDICUBE.png`)],
  "crema-contorno-de-ojos-pdrn-pink-peptide-medicube": [pack(`${INV}/CONTORNO OJOS MEDICUBE.png`)],

  // Cuidado personal
  "crema-corporal-shea-better-24h-eos": [
    pack(`${INV}/CREMA EOS 1.png`, "Vanilla Cashmere"),
    pack(`${INV}/CREMA EOS 2.png`, "Coconut Waters"),
    pack(`${INV}/CREMA EOS 3.png`, "Beach Waves"),
    pack(`${INV}/CREMA EOS 4.png`, "Pink Champagne"),
    pack(`${INV}/CREMA EOS 5.png`, "Sensitive · sin fragancia"),
  ],
  "aceite-en-gel-sunlit-glow-vaseline": [pack(`${INV}/VASELINE SHIMMER MINI.png`)],
  "gel-de-bano-shea-better-cashmere-eos": [
    pack(`${INV}/JABON EOS 1.png`, "Vanilla Cashmere"),
    pack(`${INV}/JABON EOS 2.png`, "Pink Champagne"),
  ],
  "balsamo-labial-daily-care-spf-15-carmex": [
    pack(`${INV}/CARMEX CEREZA 2.png`, "Cereza · barra"),
    pack(`${INV}/CARMEX CEREZA.jfif.png`, "Cereza · tubo"),
    pack(`${INV}/CARMEX FRESA 2.png`, "Fresa · barra"),
    pack(`${INV}/CARMEX FRESA.png`, "Fresa · tubo"),
    pack(`${INV}/CARMEX WINTER GREEN.png`, "Wintergreen · barra"),
    pack(`${INV}/CARMEX.png`, "Pack x3 surtido"),
  ],
  "crema-corporal-intensive-care-vaseline": [
    pack(`${DL}/Vaseline ALOE.png`, "Aloe Soothe"),
    pack(`${DL}/Vaseline COCOA.png`, "Cocoa Glow"),
    pack(`${DL}/Vaseline men.png`, "Men Fast Absorbing"),
  ],
  "barra-antirozaduras-thigh-glide-happy-curves": [pack(`${DL}/happy curves.png`)],
  "desodorante-en-spray-para-hombre-guess": [pack(`${DL}/Desodorane guess.png`)],
  "spray-bucal-scope-crest": [pack(`${DL}/Spray crest scope.jfif.png`)],
  "spray-bucal-pro-health-pack-x3-crest": [pack(`${DL}/Spray Crest.jfif.png`)],
  "palillos-dentales-coolmint-x300-ice-breakers": [pack(`${DL}/iCE BREAKERS DENTAL PICKS.png`)],
  "gel-antibacterial-japanese-cherry-blossom-bath-and-body-works": [
    pack(`${DL}/japanese cherry.png`),
  ],
  "set-antibacterial-sweet-treats-serendipity-3": [pack(`${DL}/ANTIBACTERIAL EN GEL.png`)],
  "crema-corporal-ck-one-calvin-klein": [pack(`${DL}/Crema CK one.png`)],
  "set-de-cremas-corporales-juicy-couture": [pack(`${DL}/Cremas juicy couture.png`)],

  // Belleza y maquillaje
  "set-lip-amplifier-juicy-couture": [pack(`${INV}/GLOSS JUICY COUTURE.png`)],
  "set-4-gloss-labiales-juliette-and-co": [pack(`${DL}/GLOSS.png`)],
  "gloss-labial-kiko-milano": [pack(`${INV}/KIKO MILANO.png`)],
  "bolso-con-set-de-brochas": [pack(`${DL}/BOLSO CON BROCHAS.png`)],
  "kit-de-maquillaje-in-the-bag": [pack(`${DL}/BOLSO CON MAQUILLAJE.png`)],
  "cosmetiquera-guess": [pack(`${DL}/COSMETIQUERA GUESS.png`)],
  "perfume-golden-caramel": [pack(`${DL}/Golden caramel.png`)],
  "perfume-one-billionaire-for-men": [pack(`${DL}/One Billionaire.png`)],
  "perfume-vintage-heroes-red": [pack(`${DL}/PERFUME VINTAGE HEROES RED.png`)],
  "perfume-vintage-heroes": [pack(`${DL}/PERFUME VINTAGE HEROES.png`)],

  // Salud y bienestar
  "undeniable-beauty-gomitas-olly": [pack(`${DL}/BIOTINA OLLY.png`)],
  "kit-rise-and-rest-olly": [pack(`${DL}/KIT OLLY.png`)],
  "aloe-vera-sabila-capsulas-blandas-sunshine-naturals": [pack(`${INV}/ALOE-VERA-SABILA.png`)],
  "gomitas-hair-skin-and-nails-natures-bounty": [pack(`${DL}/BIOTINA NATURE´S.png`)],
  "multivitaminico-men-centrum": [pack(`${DL}/CENTRUM MEN.png`)],
  "gomitas-turmeric-and-ginger-got-gummys": [pack(`${DL}/GOT GUMMYS CURCUMA Y JENGIBRE.png`)],
  "greens-en-polvo-jocko": [pack(`${DL}/JOCKO GREENS.png`)],
  "melatonina-10-mg-spring-valley": [pack(`${DL}/MELATONINA.png`)],
  "melatonina-kids-spring-valley": [pack(`${DL}/MELATONINA KIDS.png`)],
  "vitamina-d3-nature-made": [pack(`${DL}/VITAMINA D3 NATURE MADE.png`)],
  "allergy-relief-30-tabletas-topcare": [pack(`${DL}/ALLERGY RELIEF.jfif.png`)],
  "unguento-bacitracin-zinc-lucky": [pack(`${DL}/BACITRACIN ZINC.png`)],
  "dayquil-y-nyquil-combo-vicks": [pack(`${DL}/DAYQUIL AND NYQUIL.png`)],
  "dayquil-y-nyquil-kids-combo-vicks": [pack(`${DL}/DAYQUIL AND NYQUIL KIDS.png`)],
  "inhalador-pack-x2-vicks": [pack(`${DL}/INHALER VICKS.png`)],
  "dual-action-con-tylenol-motrin": [pack(`${DL}/Motrin_Dual_Action_with_Tylenol.png`)],
  "tylenol-paracetamol-500-mg": [pack(`${INV}/TYLENOL COMPUESTO.jfif.png`)],

  // Hogar y snacks
  "lavaplatos-liquido-ultra-strength-palmolive": [pack(`${DL}/JABON PLATOS PALMOLIVE.png`)],
  "bebida-postbiotica-tropical-wave-arih": [pack(`${DL}/ARIH TROPICAL WAVE.png`)],
  "fideos-instantaneos-modern-noodle-arih": [pack(`${DL}/FIDEOS ARIH.png`)],

  // Ropa interior (Victoria's Secret): 14 fotos agrupadas en 3 estilos según la foto
  "pack-x5-panties-linea-logo-victorias-secret": [
    pack(`${VS}/112956864YXY_OF_F.avif`, "Diseño 1"),
    pack(`${VS}/112956844YXY_OF_B.avif`, "Diseño 2"),
    pack(`${VS}/1126543757MY_OF_F.avif`, "Diseño 3"),
    pack(`${VS}/1127707857NI_OF_F.avif`, "Diseño 4"),
  ],
  "pack-x5-panties-sin-costuras-victorias-secret": [
    pack(`${VS}/112904124YXY_OF_F.avif`, "Diseño 1"),
    pack(`${VS}/112904154YXY_OF_F.avif`, "Diseño 2"),
    pack(`${VS}/112956914YXY_OF_F.avif`, "Diseño 3"),
    pack(`${VS}/112859484YXY_OF_F.avif`, "Diseño 4"),
  ],
  "pack-x5-panties-de-encaje-victorias-secret": [
    pack(`${VS}/112920154YXY_OF_F.avif`, "Diseño 1"),
    pack(`${VS}/112718305AFG_OF_F.avif`, "Diseño 2"),
    pack(`${VS}/112956684YXY_OF_F.avif`, "Diseño 3"),
    pack(`${VS}/112956744YXY_OF_F.avif`, "Diseño 4"),
    pack(`${VS}/112904054YXY_OF_F.avif`, "Diseño 5"),
    pack(`${VS}/112904004YXY_OF_F.avif`, "Diseño 6"),
  ],

  // Colección Polo · hombre (carpeta numerada 1 a 9)
  "camiseta-polo-pique-polo-ralph-lauren": [
    pack(`${MEN}/1(1).jpg`),
    cover(`${MEN}/1(2).jpg`),
    cover(`${MEN}/1(3).jpg`),
  ],
  "camiseta-a-rayas-cuello-redondo-polo-ralph-lauren": [
    pack(`${MEN}/2.jpg`),
    cover(`${MEN}/2(1).jpg`),
    pack(`${MEN}/2(2).jpg`),
    cover(`${MEN}/2(3).jpg`),
    cover(`${MEN}/2(5).jpg`),
  ],
  "camisa-oxford-manga-corta-polo-ralph-lauren": [
    pack(`${MEN}/3.jpg`),
    cover(`${MEN}/3(3).jpg`),
    cover(`${MEN}/3(1).jpg`),
  ],
  "camiseta-polo-ny-polo-ralph-lauren": [
    pack(`${MEN}/4(4).jpg`),
    cover(`${MEN}/4(1).jpg`),
    cover(`${MEN}/4(2).jpg`),
    cover(`${MEN}/4(3).jpg`),
  ],
  "camiseta-polo-chevron-polo-ralph-lauren": [
    pack(`${MEN}/5(3).jpg`),
    pack(`${MEN}/5(2).jpg`),
    cover(`${MEN}/5(1).jpg`),
  ],
  "camiseta-polo-houndstooth-polo-ralph-lauren": [
    pack(`${MEN}/6(3).jpg`),
    pack(`${MEN}/6(2).jpg`),
    cover(`${MEN}/6(1).jpg`),
  ],
  "camiseta-polo-a-rayas-polo-ralph-lauren": [
    pack(`${MEN}/7(3).jpg`),
    pack(`${MEN}/7(4).jpg`),
    cover(`${MEN}/7(1).jpg`),
    cover(`${MEN}/7(2).jpg`),
  ],
  "camiseta-a-rayas-polo-ralph-lauren": [
    pack(`${MEN}/8(3).jpg`),
    cover(`${MEN}/8(1).jpg`),
    cover(`${MEN}/8(2).jpg`),
  ],
  "camiseta-polo-la-polo-ralph-lauren": [
    pack(`${MEN}/9(1).jpg`),
    pack(`${MEN}/9(2).jpg`),
    cover(`${MEN}/9(3).jpg`),
    cover(`${MEN}/9(4).jpg`),
  ],

  // Colección Polo · niños (carpeta numerada 1 a 8)
  "rugby-a-rayas-manga-larga-nino-polo-ralph-lauren": [
    pack(`${KIDS}/1.jpg`),
    pack(`${KIDS}/1(1).jpg`),
    cover(`${KIDS}/1(2).jpg`),
  ],
  "camiseta-polo-pique-nino-pequeno-polo-ralph-lauren": [
    pack(`${KIDS}/2(3).jpg`),
    pack(`${KIDS}/2(2).jpg`),
    cover(`${KIDS}/2.jpg`),
    cover(`${KIDS}/2(4).jpg`),
  ],
  "camiseta-polo-pique-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/3(4).jpg`),
    pack(`${KIDS}/3(3).jpg`),
    cover(`${KIDS}/3(1).jpg`),
    cover(`${KIDS}/3(2).jpg`),
  ],
  "chaleco-tejido-trenzado-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/4(4).jpg`),
    pack(`${KIDS}/4(3).jpg`),
    cover(`${KIDS}/4(1).jpg`),
    cover(`${KIDS}/4(2).jpg`),
  ],
  "cardigan-tejido-trenzado-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/5(3).jpg`),
    pack(`${KIDS}/5(2).jpg`),
    cover(`${KIDS}/5(1).jpg`),
  ],
  "sueter-medio-cierre-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/6(4).jpg`),
    pack(`${KIDS}/6(3).jpg`),
    cover(`${KIDS}/6(1).jpg`),
    cover(`${KIDS}/6(2).jpg`),
  ],
  "chaqueta-tejida-con-capucha-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/7(1).jpg`),
    pack(`${KIDS}/7(2).jpg`),
    cover(`${KIDS}/7(3).jpg`),
    cover(`${KIDS}/7(4).jpg`),
  ],
  "sueter-tejido-trenzado-juvenil-polo-ralph-lauren": [
    pack(`${KIDS}/8(4).jpg`),
    pack(`${KIDS}/8(3).jpg`),
    cover(`${KIDS}/8(1).jpg`),
    cover(`${KIDS}/8(2).jpg`),
  ],

  // Gorra: no hay foto de producto, solo la captura de 25 colores. Se recortan fotos de modelos.
  "gorra-polo-clasica-polo-ralph-lauren": [
    {
      file: `${MEN}/3(3).jpg`,
      mode: "cover",
      crop: { left: 210, top: 0, width: 400, height: 500 },
    },
    {
      file: `${MEN}/5(1).jpg`,
      mode: "cover",
      crop: { left: 250, top: 0, width: 720, height: 900 },
    },
  ],
};

/** Fotos editoriales (hero, colecciones, lookbook). Se publican en /img/e/<nombre>.webp */
export const editorialPhotos: Record<string, PhotoSource> = {
  "hero-polo-navy": cover(`${MEN}/1(2).jpg`),
  "polo-hero": cover(`${MEN}/7(2).jpg`),
  "coleccion-polo": cover(`${MEN}/7(1).jpg`),
  "lookbook-polo-la": cover(`${MEN}/9(4).jpg`),
  "lookbook-polo-pique-lila": cover(`${MEN}/1(3).jpg`),
  "lookbook-rugby-nino": cover(`${KIDS}/1(2).jpg`),
  "lookbook-camiseta-rayas": cover(`${MEN}/8(1).jpg`),
  "lookbook-chaqueta-tejida": cover(`${KIDS}/7(3).jpg`),
  "lookbook-polo-ny": cover(`${MEN}/4(1).jpg`),
  "lookbook-sueter-trenzado": cover(`${KIDS}/8(1).jpg`),
};

/** Archivos que no se publican a propósito (capturas de tallas/colores y duplicados). */
export const ignoredFiles: string[] = [
  `${MEN}/1.jpg`,
  `${MEN}/2(4).jpg`,
  `${MEN}/3(2).jpg`,
  `${MEN}/4.jpg`,
  `${MEN}/5.jpg`,
  `${MEN}/6.jpg`,
  `${MEN}/7.jpg`,
  `${MEN}/8.jpg`,
  `${MEN}/9.jpg`,
  `${KIDS}/2(1).jpg`,
  `${KIDS}/3.jpg`,
  `${KIDS}/4.jpg`,
  `${KIDS}/5.jpg`,
  `${KIDS}/6.jpg`,
  `${KIDS}/7.jpg`,
  `${KIDS}/8.jpg`,
  `${VS}/112859484YXY_OF_F(1).avif`,
  "Gorras PRL $250.000/Captura de pantalla 2026-10-25 145230.png",
];
