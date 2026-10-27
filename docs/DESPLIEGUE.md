# Despliegue en Vercel y dominio propio

## 1. Subir el código a GitHub

```bash
git add -A
git commit -m "Sitio web Tu Shopper USA"
git remote add origin https://github.com/<usuario>/tushopperusa-web.git
git push -u origin main
```

La carpeta `photos/` (originales, ~55 MB) no se sube: está en `.gitignore`. Las fotos ya procesadas (`public/img`) sí.

## 2. Crear el proyecto en Vercel

1. En vercel.com → **Add New… → Project** → importa el repositorio. Vercel detecta Next.js solo; no cambies los comandos.
2. **Settings → Environment Variables** (Production y Preview):
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = número con indicativo, solo dígitos (p. ej. `573001234567`)
   - `NEXT_PUBLIC_INSTAGRAM_USER` = usuario sin `@`
   - `NEXT_PUBLIC_SITE_URL` = déjalo vacío hasta tener dominio (se usa el dominio `*.vercel.app` automáticamente)
3. **Deploy**. Cada push a `main` publica en producción; cada rama o PR genera una vista previa (que no se indexa en Google).

> **Plan de Vercel**: el plan gratuito _Hobby_ es solo para uso personal y **no comercial**. Para el sitio de un negocio corresponde el plan **Pro** (unos USD 20/mes). Alternativas con plan gratis que permite uso comercial: Netlify o Cloudflare (el código no cambia).

## 3. Vincular el dominio (cuando lo compres)

1. Compra el dominio (por ejemplo `tushopperusa.com` o `.co`) en cualquier registrador o directamente en Vercel (**Domains → Buy**).
2. En el proyecto: **Settings → Domains → Add** → escribe el dominio. Agrega también la versión `www` y deja una redirigiendo a la otra.
3. Si lo compraste fuera de Vercel, crea en el registrador los registros DNS que Vercel te muestre (normalmente un registro `A` para el dominio raíz y un `CNAME` para `www`). El certificado HTTPS se emite solo.
4. Cambia `NEXT_PUBLIC_SITE_URL` a `https://tudominio.com` y vuelve a desplegar: así canonical, sitemap, imagen para compartir y enlaces del mensaje de WhatsApp usan el dominio propio.
5. En Google Search Console agrega el dominio y envía `https://tudominio.com/sitemap.xml`.

## Antes de cada despliegue

```bash
npm run check   # lint + typecheck + pruebas + build
npm run e2e     # opcional: flujos completos en el navegador
```
