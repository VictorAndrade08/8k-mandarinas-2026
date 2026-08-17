import { defineConfig, devices } from "@playwright/test";

// Pruebas de humo contra el build de producción exportado (out/), servido en
// estático — igual que Cloudflare Pages. Usa el Chrome instalado (channel)
// para no descargar navegadores en cada máquina.
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:4173",
    channel: "chrome",
  },
  projects: [
    { name: "escritorio", use: { viewport: { width: 1280, height: 800 } } },
    { name: "movil", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "python3 -m http.server 4173 -d out",
    port: 4173,
    reuseExistingServer: true,
  },
});
