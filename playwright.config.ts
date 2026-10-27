import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * Pruebas de punta a punta contra el build de producción.
 * Localmente usan el Edge/Chrome instalado (channel) para no descargar navegadores;
 * en CI se puede quitar `channel` y correr `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "es-CO",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "escritorio",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "movil",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
