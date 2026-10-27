# Datos pendientes de confirmar

En el sitio aparecen como "[… por confirmar]". Al confirmarlos, cámbialos donde se indica y vuelve a desplegar.

## Contacto e identidad → variables de entorno y `src/config/site.ts`

- [ ] Número de WhatsApp de atención → `NEXT_PUBLIC_WHATSAPP_NUMBER` (solo dígitos, con 57). Mientras falte, WhatsApp se abre con el mensaje y deja elegir el contacto.
- [ ] Usuario de Instagram → `NEXT_PUBLIC_INSTAGRAM_USER`.
- [ ] Horario de atención → `site.schedule`.
- [x] Logo circular: ya está en el sitio (header, footer, favicon, íconos e imagen para compartir).

## Condiciones del servicio → `src/app/como-funciona/page.tsx` y `src/app/producto/[slug]/page.tsx`

- [ ] Medios de pago.
- [ ] Tiempos estimados de envío.
- [ ] Cobertura de envío (ciudades).
- [ ] Política de cambios y devoluciones.
- [ ] Fecha límite para pedidos de Navidad → `src/app/tendencias/page.tsx`.
- [ ] Responsable del tratamiento de datos (nombre o razón social, documento, contacto) y revisión de la política → `src/app/politica-de-datos/page.tsx`.

## Precios y disponibilidad → `src/data/static/products.ts`

- [ ] Solo dos carpetas traen valor: Gorras PRL ($250.000) y Victoria's Secret ($155.000). Los otros 65 productos muestran "Valor por confirmar".
- [ ] Confirmar si $155.000 aplica a los 3 packs de Victoria's Secret.
- [ ] Ningún producto trae disponibilidad: todos aparecen "Disponibilidad por confirmar". Si las fotos de "Fotos inventario" son mercancía en stock, esos productos pueden pasar a `availability: "disponible"`.

## Colección Polo

- [ ] Nombres de las prendas (venían numeradas 1–9 hombre y 1–8 niños; los nombres del sitio son descriptivos).
- [ ] Nombres de los colores: solo el color seleccionado en cada captura tiene nombre (Refined Navy, Moss Agate, Deckwash White…). Los demás, incluidos 24 de la gorra, figuran como "nombre por confirmar" u "Otro color".
- [ ] Gorra Polo: no hay foto de producto; se usan recortes de fotos de modelos.
- [ ] Rugby a rayas de niño: sin captura de tallas ni colores.
- [ ] Tallas tachadas en las capturas se tomaron como agotadas en origen (XS del polo piqué; XXS y XS de los polos NY y LA; L de la camisa Oxford).
- [ ] Permiso de uso de las fotos de modelos tomadas de la tienda de origen (lookbook).

## Nombres y marcas ilegibles

- [ ] Marca del bolso con brochas y del kit "In the Bag".
- [ ] Marcas de los perfumes Golden Caramel, One Billionaire y Vintage Heroes (rojo y azul).
- [ ] Tylenol: el archivo dice "compuesto", la foto muestra Paracetamol 500 mg en tabletas.
- [ ] Gloss Kiko Milano (línea y tono) y desodorante Guess (línea exacta).
- [ ] Victoria's Secret: 14 fotos sin nombre de línea ni tallas; agrupadas en 3 estilos (logo, sin costuras, encaje). Las tallas XS–XL son de referencia.

## Decisiones editoriales a validar → `src/data/static/curation.ts`

- [ ] Etiquetas "Nuevo" y "Tendencia", ranking "Lo más pedido" y "Viral en USA" (asignación de ejemplo del diseño).
- [ ] "Tecnología" no tiene productos: se dirige a Encargos.
- [ ] "Dulces" quedó como "Snacks y ediciones especiales".
