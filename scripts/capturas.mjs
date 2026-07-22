/**
 * Auditoría visual: captura las seis páginas en móvil, tablet y escritorio, más
 * el detalle del header, la barra inferior y el pie de cada una.
 *
 * Uso:
 *   npm run dev            (en otra terminal)
 *   npx playwright install chromium   (solo la primera vez)
 *   node scripts/capturas.mjs
 *
 * Deja las imágenes en capturas/ (que está en .gitignore: son ~57 MB) y las
 * medidas en capturas/reporte.json. Las conclusiones de la última pasada están
 * escritas en docs/LINEA-GRAFICA.md.
 *
 * Playwright no es dependencia del proyecto a propósito: esto no se ejecuta ni
 * en el build ni en el despliegue, así que se instala a mano cuando se usa.
 */
import pkg from "playwright";
const { chromium } = pkg;
import fs from "fs";
import { fileURLToPath } from "url";

// fileURLToPath y no .pathname: la carpeta del proyecto tiene espacios en el
// nombre y .pathname los devuelve como %20, así que el script se creaba a sí
// mismo un "Prez%20-%20Backup" al lado y dejaba las capturas ahí dentro.
const OUT = fileURLToPath(new URL("../capturas", import.meta.url));
const BASE = "http://localhost:3000";

const RUTAS = [
  ["home", "/"],
  ["ruta", "/ruta/"],
  ["informacion", "/informacion/"],
  ["inscripcion", "/inscripcion/"],
  ["reglamento", "/reglamento/"],
  ["terminos", "/terminos/"],
  ["verificar", "/verificar/"],
  ["ganadores", "/ganadores/"],
];

const VIEWPORTS = [
  ["movil", 390, 844, true],
  ["tablet", 820, 1180, true],
  ["desktop", 1440, 900, false],
];

for (const [v] of VIEWPORTS) fs.mkdirSync(`${OUT}/${v}`, { recursive: true });
fs.mkdirSync(`${OUT}/navegacion`, { recursive: true });

const browser = await chromium.launch();
const reporte = [];

// El indicador de desarrollo de Next se dibuja encima de la barra inferior y
// tapa el botón "Inicio" en las capturas. No existe en producción.
const OCULTAR_DEV = "nextjs-portal{display:none!important}";

for (const [vName, w, h, mobile] of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();

  for (const [nombre, ruta] of RUTAS) {
    await page.goto(BASE + ruta, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: OCULTAR_DEV });
    await page.waitForTimeout(1200);
    // Recorrer la página para disparar las animaciones al hacer scroll y que
    // no salgan bloques en blanco o a medio aparecer en la captura completa.
    await page.evaluate(async () => {
      const paso = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    await page.waitForTimeout(600);

    await page.screenshot({
      path: `${OUT}/${vName}/${nombre}-completa.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `${OUT}/${vName}/${nombre}-arriba.png` });

    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      alto: document.body.scrollHeight,
    }));
    reporte.push({ vista: vName, pagina: nombre, ...m, overflow: m.sw > m.cw });
  }

  await ctx.close();
}

// ── Detalles de navegación ────────────────────────────────────────────────
const ctxM = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const pm = await ctxM.newPage();
for (const [nombre, ruta] of RUTAS) {
  await pm.goto(BASE + ruta, { waitUntil: "networkidle" });
  await pm.addStyleTag({ content: OCULTAR_DEV });
  await pm.waitForTimeout(1000);
  const header = pm.locator("header").first();
  if (await header.count())
    await header
      .screenshot({ path: `${OUT}/navegacion/movil-header-${nombre}.png` })
      .catch(() => {});
  const bottom = pm.locator("nav[aria-label='Navegación rápida']").first();
  if (await bottom.count())
    await bottom
      .screenshot({ path: `${OUT}/navegacion/movil-bottomnav-${nombre}.png` })
      .catch(() => {});
  // Pie de página: hay que estar abajo del todo para que se vea entero.
  await pm.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pm.waitForTimeout(800);
  const footer = pm.locator("footer").first();
  if (await footer.count())
    await footer
      .screenshot({ path: `${OUT}/navegacion/movil-footer-${nombre}.png` })
      .catch(() => {});
}
await ctxM.close();

const ctxD = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const pd = await ctxD.newPage();
for (const [nombre, ruta] of RUTAS) {
  await pd.goto(BASE + ruta, { waitUntil: "networkidle" });
  await pd.addStyleTag({ content: OCULTAR_DEV });
  await pd.waitForTimeout(1000);
  const header = pd.locator("header").first();
  if (await header.count())
    await header
      .screenshot({ path: `${OUT}/navegacion/desktop-header-${nombre}.png` })
      .catch(() => {});
  await pd.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pd.waitForTimeout(800);
  const footer = pd.locator("footer").first();
  if (await footer.count())
    await footer
      .screenshot({ path: `${OUT}/navegacion/desktop-footer-${nombre}.png` })
      .catch(() => {});
}
await ctxD.close();

await browser.close();
fs.writeFileSync(`${OUT}/reporte.json`, JSON.stringify(reporte, null, 2));
console.log(JSON.stringify(reporte, null, 2));
