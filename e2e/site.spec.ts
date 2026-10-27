import { expect, test, type Page } from "@playwright/test";

/** Captura las URL que el sitio intenta abrir (WhatsApp) sin salir de la página. */
async function stubWindowOpen(page: Page) {
  await page.addInitScript(() => {
    const opened: string[] = [];
    Object.assign(window, { __opened: opened });
    window.open = ((url?: string | URL) => {
      opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

const openedUrls = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

test("inicio: hero y categorías", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Lo que te gusta de Estados Unidos",
  );
  await expect(page.getByRole("link", { name: /Cuidado facial\s*4 productos/ })).toBeVisible();
});

const ribbonOf = (page: Page) => page.getByRole("region", { name: "Novedades y tendencias" });

test("marquesina: va arriba de todo, antes del menú, en todas las páginas", async ({
  page,
  isMobile,
}) => {
  for (const path of ["/", "/catalogo"]) {
    await page.goto(path);
    const ribbon = ribbonOf(page);
    await expect(ribbon).toBeVisible();
    const [ribbonBox, headerBox] = await Promise.all([
      ribbon.boundingBox(),
      page.getByRole("banner").boundingBox(),
    ]);
    expect(ribbonBox!.y).toBe(0);
    expect(ribbonBox!.height).toBeGreaterThan(isMobile ? 64 : 80);
    expect(ribbonBox!.y + ribbonBox!.height).toBeLessThanOrEqual(headerBox!.y);
  }
});

test("marquesina: se pausa con el cursor", async ({ page, isMobile }) => {
  test.skip(isMobile, "El hover solo aplica con cursor");
  await page.goto("/");
  const ribbon = ribbonOf(page);
  await ribbon.hover({ position: { x: 20, y: 20 }, force: true });
  await expect(ribbon.locator("ul")).toHaveCSS("animation-play-state", "paused");
});

test("marquesina: se va con el scroll y el menú queda fijo", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 900));
  const ribbonBox = await ribbonOf(page).boundingBox();
  expect(ribbonBox!.y + ribbonBox!.height).toBeLessThan(0);
  const header = page.getByRole("banner");
  await expect(header).toBeInViewport();
  expect((await header.boundingBox())!.y).toBeLessThan(60);
});

test("catálogo: categoría + marca filtra y queda en la URL", async ({ page, isMobile }) => {
  await page.goto("/catalogo");
  await page.waitForLoadState("networkidle");
  if (isMobile) await page.getByRole("button", { name: /Filtros/ }).click();
  await page.getByRole("link", { name: /^Cuidado facial/ }).click();
  await expect(page).toHaveURL(/\/catalogo\/cuidado-facial/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cuidado facial");
  if (isMobile) await page.getByRole("button", { name: /Filtros/ }).click();
  await page.getByRole("button", { name: /^Medicube/ }).click();
  await expect(page).toHaveURL(/marca=Medicube/);
  // Next conserva la página anterior oculta para el botón Atrás: se mira solo lo visible.
  await expect(page.locator("#resultados").locator("visible=true")).toContainText("4 productos");
});

test("detalle: exige talla, agrega, abre el panel y persiste al recargar", async ({ page }) => {
  await page.goto("/producto/camiseta-polo-pique-polo-ralph-lauren");
  const add = page.getByRole("button", { name: "Agregar a mi pedido" }).first();
  await add.click();
  await expect(page.getByRole("alert").filter({ hasText: "Elige talla" })).toBeVisible();

  await expect(page.getByRole("radio", { name: /XS, agotada/ })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await page.getByRole("radio", { name: "M", exact: true }).click();
  await add.click();
  await expect(page.getByRole("link", { name: /Agregado · Ver mi pedido/ })).toBeVisible();

  await page.reload();
  const cart = page
    .getByRole("button", { name: /Abrir mi pedido, 1 producto/ })
    .locator("visible=true");
  await expect(cart).toBeVisible();
  await cart.click();
  const drawer = page.getByRole("dialog", { name: /Mi pedido/ });
  await expect(drawer).toContainText("Camiseta polo piqué");
  await expect(drawer).toContainText("Talla: M · Color: Refined Navy");
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("mi pedido: valida y abre WhatsApp con la lista", async ({ page }) => {
  await stubWindowOpen(page);
  await page.goto("/producto/gorra-polo-clasica-polo-ralph-lauren");
  await page.getByRole("button", { name: "Agregar a mi pedido" }).first().click();
  await page.goto("/mi-pedido");

  await page.getByRole("button", { name: "Solicitar cotización" }).click();
  await expect(page.getByText("Escribe tu nombre para saber cómo llamarte.")).toBeVisible();
  await expect(page.getByLabel("Nombre")).toBeFocused();
  expect(await openedUrls(page)).toEqual([]);

  await page.getByLabel("Nombre").fill("Cliente Prueba");
  await page.getByLabel("Ciudad").fill("Cali");
  await page.getByRole("textbox", { name: "WhatsApp" }).fill("+57 300 000 0000");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Solicitar cotización" }).click();

  await expect(page).toHaveURL(/\/mi-pedido\/enviado/);
  const [url] = await openedUrls(page);
  expect(url).toMatch(/^https:\/\/wa\.me\/573239105182\?text=/);
  const text = decodeURIComponent(url!.split("text=")[1]!);
  expect(text).toContain("Gorra Polo clásica (Polo Ralph Lauren)");
  expect(text).toContain("Color: Polo Black");
  expect(text).toContain("Subtotal referencial: $250.000 COP");
  expect(text).toContain("Nombre: Cliente Prueba");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Envía tu lista por WhatsApp");
});

test("encargos: arma el mensaje con el enlace del producto", async ({ page }) => {
  await stubWindowOpen(page);
  await page.goto("/encargos");
  await page.getByLabel("Nombre del producto").fill("Freidora de aire");
  await page.getByLabel("Enlace del producto").fill("https://www.walmart.com/ip/123");
  await page.getByLabel("Nombre", { exact: true }).fill("Cliente Prueba");
  await page.getByRole("textbox", { name: "WhatsApp" }).fill("3000000000");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Enviar encargo" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu encargo está listo en WhatsApp" }),
  ).toBeVisible();
  const [url] = await openedUrls(page);
  expect(decodeURIComponent(url!)).toContain("Enlace: https://www.walmart.com/ip/123");
});

test("móvil: el menú abre y cierra con Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Solo en móvil");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const menu = page.getByRole("navigation", { name: "Menú móvil" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test("móvil: la barra de anuncio queda en una sola línea", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Solo en móvil");
  await page.goto("/");
  const announcement = page.locator("p", { hasText: "Cotiza sin compromiso por WhatsApp" }).first();
  await expect(announcement).toBeVisible();
  expect((await announcement.boundingBox())!.height).toBeLessThan(40);
});

test("contacto: el footer apunta al WhatsApp e Instagram oficiales", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "WhatsApp +57 323 910 5182" })).toHaveAttribute(
    "href",
    "https://wa.me/573239105182",
  );
  await expect(footer.getByRole("link", { name: "Instagram @tushopperusa.co" })).toHaveAttribute(
    "href",
    "https://instagram.com/tushopperusa.co",
  );
});

test("producto inexistente muestra la página 404 sin indexar", async ({ page }) => {
  // Con Cache Components la primera visita a un slug desconocido puede responder 200 con
  // noindex (la página ya empezó a enviarse); las siguientes responden 404.
  const response = await page.goto(`/producto/no-existe-${Date.now()}`);
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No encontramos esta página");
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
});
