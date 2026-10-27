# Tu Shopper USA — sitio web

Sitio público de **Tu Shopper USA**, personal shopper que compra en tiendas de Estados Unidos y envía a Colombia. Catálogo, Colección Polo, Tendencias, encargos personalizados y una lista "Mi pedido" que se envía como cotización por **WhatsApp** (no hay pagos en línea).

Construido a partir del diseño del canvas _"Tu Shopper USA — Sitio web"_ (Claude Code).

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack) + **React 19** + **TypeScript** estricto
- **Tailwind CSS v4** con los tokens del diseño en `src/styles/globals.css`
- **Zustand** (pedido en `localStorage`), **nuqs** (filtros en la URL), **Radix Dialog** (panel del pedido), **zod** (validación)
- **sharp** para preparar las fotos, **Vitest** y **Playwright** para pruebas
- Despliegue en **Vercel**; el sitio es 100 % estático (96 páginas generadas en el build)

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run photos       # procesa photos/ → public/img (solo lo que falta; --force para todo)
npm run check        # lint + typecheck + pruebas unitarias + build
npm run e2e          # pruebas de punta a punta (compila y levanta el sitio en :3100)
```

Variables de entorno: copia `.env.example` a `.env.local`. Ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md).

## Arquitectura

```
src/
  app/          Rutas. Solo componen: leen el catálogo y arman las secciones.
  domain/       TypeScript puro (sin React ni Next): modelo del producto, dinero en COP,
                pedido, filtros del catálogo y de la Colección Polo, mensajes de WhatsApp,
                validaciones. Aquí viven las pruebas unitarias.
  data/         Acceso al catálogo detrás de la interfaz CatalogRepository.
    static/     Implementación actual: productos, categorías y selecciones editoriales.
    index.ts    Repositorio activo (para pasar a Supabase o un CMS se cambia solo aquí).
  features/     Funcionalidades: cart (pedido), catalog, product, polo, home, marquee (cinta superior), quote, custom-order.
  components/   UI reutilizable (ui/), layout (header, footer, pasos…), iconos y SEO.
  config/       Datos de marca y contacto (site.ts) y variables validadas (env.ts).
scripts/        Preparación de fotos (process-photos.ts + photos.manifest.ts).
e2e/            Pruebas Playwright.
```

Reglas:

- `domain/` no importa React ni Next.
- Las páginas no conocen la fuente de datos: usan `catalog` de `@/data`.
- Los textos de contacto y marca viven en `src/config/site.ts`.
- Dinero en COP siempre entero; se formatea con `formatCOP` (`$250.000 COP`).

## Catálogo y fotos

- Los productos están en `src/data/static/products.ts` (el orden del arreglo es el orden "Recomendados").
- Las etiquetas Nuevo/Tendencia, los rankings y la cinta superior (`curation.marquee`) están en `src/data/static/curation.ts`.
- Las fotos originales van en `photos/` (no se suben al repositorio). `scripts/photos.manifest.ts` dice qué foto usa cada producto; `npm run photos` genera las versiones 4:5 en `public/img` y el archivo `product-images.generated.json`.

Para **agregar un producto**: súmalo en `products.ts`, agrega sus fotos al manifiesto, corre `npm run photos` y `npm run check`.

## Pendientes de contenido

Lo que debe confirmar Tu Shopper USA (horario, envíos, pagos, colores, marcas…) está en [docs/PENDIENTES.md](docs/PENDIENTES.md). En el sitio aparece como "[… por confirmar]".
