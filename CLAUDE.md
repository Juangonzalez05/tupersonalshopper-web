@AGENTS.md

# Tu Shopper USA — sitio web (contexto para Claude Code)

Lee `README.md` (arquitectura y comandos) y `docs/PENDIENTES.md` antes de cambiar contenido.

## Reglas

- Next.js 16 con Cache Components: los cambios de API están documentados en `node_modules/next/dist/docs/`. Léelos antes de usar algo que no conozcas.
- Capas: `domain/` es TypeScript puro y testeado; `data/` implementa `CatalogRepository`; `app/` solo compone; la lógica de UI interactiva va en `features/` con `"use client"`.
- Textos en español de Colombia (es-CO). Dinero en COP entero, con `formatCOP`.
- No hay backend ni pagos: la cotización y los encargos se envían como mensaje de WhatsApp (`domain/whatsapp.ts`).
- Estilos con Tailwind v4 y los tokens de `src/styles/globals.css`; tipografía con las utilidades `type-*`; clases de botón con `buttonVariants`.
- No inventes datos del negocio (precios, colores, marcas): lo que falta va como "[… por confirmar]" y en `docs/PENDIENTES.md`.
- Antes de cerrar un cambio: `npm run check` (y `npm run e2e` si tocaste flujos).
