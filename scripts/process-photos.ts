/**
 * Prepara las fotos del sitio a partir de los originales en photos/ (no versionados).
 *
 *   npm run photos            procesa solo lo que falta
 *   npm run photos -- --force vuelve a generar todo
 *
 * Salidas:
 *   public/img/p/<slug>-<n>.webp   fotos de producto 4:5
 *   public/img/e/<nombre>.webp     fotos editoriales 4:5
 *   public/brand/*                 logo circular e íconos
 *   src/app/{favicon.ico,icon.png,apple-icon.png}
 *   src/data/static/product-images.generated.json
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type Sharp } from "sharp";
import { editorialPhotos, ignoredFiles, productPhotos, type PhotoSource } from "./photos.manifest";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "photos", "FOTOS FONDO BLANCO");
const LOGO_DIR = path.join(ROOT, "photos", "LOGO");
const OUT_PRODUCTS = path.join(ROOT, "public", "img", "p");
const OUT_EDITORIAL = path.join(ROOT, "public", "img", "e");
const OUT_BRAND = path.join(ROOT, "public", "brand");
const GENERATED_JSON = path.join(ROOT, "src", "data", "static", "product-images.generated.json");

const TILE = "#F3F0EA";
const MAX_WIDTH = 1200;
const MIN_CROP_WIDTH = 640;
/** Margen alrededor del producto en las fotos "pack", como fracción del ancho. */
const PACK_MARGIN = 0.1;
const force = process.argv.includes("--force");

async function exists(file: string): Promise<boolean> {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

function size4x5(width: number): { width: number; height: number } {
  const w = Math.round(width / 4) * 4;
  return { width: w, height: (w / 4) * 5 };
}

async function renderPack(input: string): Promise<Sharp> {
  const { width, height } = size4x5(MAX_WIDTH);
  const trimmed = await sharp(input)
    .rotate()
    .flatten({ background: "#ffffff" })
    .trim({ background: "#ffffff", threshold: 14 })
    .toBuffer();
  const margin = Math.round(width * PACK_MARGIN);
  const product = await sharp(trimmed)
    .resize({ width: width - margin * 2, height: height - margin * 2, fit: "inside" })
    .toBuffer();
  const onWhite = await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: product, gravity: "center" }])
    .png()
    .toBuffer();
  // Multiply: el blanco toma el tono del fondo de foto y el producto casi no cambia.
  return sharp({ create: { width, height, channels: 3, background: TILE } }).composite([
    { input: onWhite, blend: "multiply" },
  ]);
}

async function renderCover(input: string, source: PhotoSource): Promise<Sharp> {
  let image = sharp(input).rotate();
  let sourceWidth = (await image.metadata()).width ?? MAX_WIDTH;
  if (source.crop) {
    image = sharp(await image.extract(source.crop).toBuffer());
    sourceWidth = Math.max(source.crop.width, MIN_CROP_WIDTH);
  }
  const { width, height } = size4x5(Math.min(MAX_WIDTH, sourceWidth));
  return image.resize({ width, height, fit: "cover", position: source.position ?? "north" });
}

async function processOne(source: PhotoSource, output: string): Promise<"done" | "skipped"> {
  if (!force && (await exists(output))) return "skipped";
  const input = path.join(SOURCE_DIR, source.file);
  const pipeline =
    source.mode === "pack" ? await renderPack(input) : await renderCover(input, source);
  await pipeline.webp({ quality: 82, effort: 5 }).toFile(output);
  return "done";
}

async function listSourceFiles(dir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) return listSourceFiles(path.join(dir, entry.name), rel);
      return /\.(png|jpe?g|avif|webp)$/i.test(entry.name) ? [rel] : [];
    }),
  );
  return files.flat();
}

/** Archivo .ico con imágenes PNG embebidas (formato admitido por todos los navegadores). */
function buildIco(sizes: number[], pngs: Buffer[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: icono
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map((png, index) => {
    const entry = Buffer.alloc(16);
    const px = sizes[index]!;
    entry.writeUInt8(px >= 256 ? 0 : px, 0);
    entry.writeUInt8(px >= 256 ? 0 : px, 1);
    entry.writeUInt8(0, 2); // sin paleta
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por píxel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

async function processBrand() {
  await mkdir(OUT_BRAND, { recursive: true });
  const logo = path.join(LOGO_DIR, "logo.jpg");
  const size = 512;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/></svg>`,
  );
  const circle = await sharp(logo)
    .resize(size, size)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp(circle)
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(path.join(OUT_BRAND, "logo-mark.webp"));
  // PNG para la imagen Open Graph (ImageResponse no lee WebP).
  await writeFile(path.join(OUT_BRAND, "logo-mark.png"), circle);

  // El favicon.ico original trae un PNG sin canal alfa que Next.js no decodifica: se genera
  // uno nuevo (16, 32 y 48 px) a partir del logo circular.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((px) => sharp(circle).resize(px, px).png().toBuffer()));
  await writeFile(path.join(ROOT, "src", "app", "favicon.ico"), buildIco(sizes, pngs));

  const copies: [string, string][] = [
    ["pwa-512x512.png", path.join(ROOT, "src", "app", "icon.png")],
    ["apple-touch-icon-180x180.png", path.join(ROOT, "src", "app", "apple-icon.png")],
    ["pwa-192x192.png", path.join(OUT_BRAND, "pwa-192x192.png")],
    ["pwa-512x512.png", path.join(OUT_BRAND, "pwa-512x512.png")],
    ["maskable-icon-512x512.png", path.join(OUT_BRAND, "maskable-icon-512x512.png")],
  ];
  // Se re-codifican como PNG RGBA (los originales no siempre traen canal alfa).
  for (const [from, to] of copies) {
    await sharp(path.join(LOGO_DIR, from)).ensureAlpha().png().toFile(to);
  }
}

async function main() {
  await mkdir(OUT_PRODUCTS, { recursive: true });
  await mkdir(OUT_EDITORIAL, { recursive: true });

  const referenced = new Set<string>([...ignoredFiles]);
  const missing: string[] = [];
  const all = [...Object.values(productPhotos).flat(), ...Object.values(editorialPhotos)];
  for (const source of all) {
    referenced.add(source.file);
    if (!(await exists(path.join(SOURCE_DIR, source.file)))) missing.push(source.file);
  }
  if (missing.length) {
    console.error(`Faltan ${missing.length} fotos de origen:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }

  let done = 0;
  let skipped = 0;
  const count = (result: "done" | "skipped") => (result === "done" ? done++ : skipped++);
  const generated: Record<string, { src: string; variant?: string }[]> = {};

  for (const [slug, sources] of Object.entries(productPhotos)) {
    generated[slug] = [];
    for (const [index, source] of sources.entries()) {
      const name = `${slug}-${index + 1}.webp`;
      count(await processOne(source, path.join(OUT_PRODUCTS, name)));
      generated[slug].push({
        src: `/img/p/${name}`,
        ...(source.variant ? { variant: source.variant } : {}),
      });
    }
  }
  for (const [name, source] of Object.entries(editorialPhotos)) {
    count(await processOne(source, path.join(OUT_EDITORIAL, `${name}.webp`)));
  }

  await writeFile(GENERATED_JSON, `${JSON.stringify(generated, null, 2)}\n`);
  await processBrand();

  const unused = (await listSourceFiles(SOURCE_DIR)).filter((file) => !referenced.has(file));
  console.log(
    `Fotos: ${done} generadas, ${skipped} ya existían. JSON: ${path.relative(ROOT, GENERATED_JSON)}`,
  );
  if (unused.length) {
    console.warn(`Aviso: ${unused.length} fotos de origen no se usan:\n  ${unused.join("\n  ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
