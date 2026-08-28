import { test, expect, type Page } from "@playwright/test";

// Errores de consola y respuestas 404/500 que NO deben aparecer en ninguna
// página. El favicon y los beacons de terceros no aplican en local.
function vigilar(page: Page) {
  const errores: string[] = [];
  page.on("console", (m) => {
    // ERR_SOCKET_NOT_CONNECTED es el server estático de Python cortando una
    // conexión bajo carga paralela — ruido del entorno local, no del sitio.
    if (m.type() === "error" && !m.text().includes("ERR_SOCKET_NOT_CONNECTED"))
      errores.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("favicon"))
      errores.push(`${r.status()} ${r.url()}`);
  });
  return errores;
}

async function sinScrollHorizontal(page: Page) {
  const desborda = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(desborda, "la página no debe tener scroll horizontal").toBe(false);
}

const PAGINAS = [
  "/",
  "/inscripcion/",
  "/ruta/",
  "/reglamento/",
  "/informacion/",
  "/verificar/",
];

for (const ruta of PAGINAS) {
  test(`${ruta} carga sin errores ni scroll horizontal`, async ({ page }) => {
    const errores = vigilar(page);
    await page.goto(ruta);
    await page.waitForLoadState("networkidle");
    await sinScrollHorizontal(page);
    expect(errores).toEqual([]);
  });
}

// Las inscripciones se cerraron el 27-ago-2026 (INSCRIPCIONES_ABIERTAS en
// app/lib/carrera.ts). Estas pruebas comprobaban los tres primeros pasos del
// formulario; ahora comprueban lo contrario: que el formulario NO esté y que
// quien llegue ahí encuentre la salida. Si se reabren, hay que recuperarlas del
// historial de git — están en el commit que cerró las inscripciones.
test("la home lleva a consultar la inscripción", async ({ page }) => {
  await page.goto("/");
  await expect(
    page
      .getByRole("link", { name: /mi inscripción|ver mi inscripción/i })
      .first()
  ).toBeVisible();
});

test("/inscripcion avisa de que está cerrado y ofrece salida", async ({
  page,
}) => {
  await page.goto("/inscripcion/");
  await expect(page.getByText(/inscripciones cerradas/i).first()).toBeVisible();
  // Las dos salidas: consultar el pago y la guía del corredor.
  await expect(
    page.getByRole("link", { name: /ver el estado/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /guía del corredor/i }).first()
  ).toBeVisible();
  // Y que no quede rastro del formulario.
  await expect(page.locator("input")).toHaveCount(0);
});

test("la guía del corredor abre y ofrece el PDF", async ({ page }) => {
  await page.goto("/guiacorredor/");
  await expect(page.getByText(/entrega de kits/i).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /descargar la guía en pdf/i })
  ).toHaveAttribute("href", "/guia-del-corredor-2026.pdf");
});

test("el reglamento muestra la entrega de kits en Vehicentro", async ({
  page,
}) => {
  await page.goto("/reglamento/");
  await expect(page.getByText(/Vehicentro/i).first()).toBeVisible();
  await expect(
    page.getByText(/no se aceptan\s+cambios ni devoluciones/i).first()
  ).toBeVisible();
});
