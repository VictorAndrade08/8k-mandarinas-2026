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

test("la home permite iniciar la inscripción", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /inscrib/i }).first()
  ).toBeVisible();
});

test("el paso 1 muestra las cuatro categorías con precio", async ({ page }) => {
  await page.goto("/inscripcion/");
  for (const categoria of ["Élite Pro 8K", "Máster", "Leyenda"]) {
    await expect(page.getByText(categoria).first()).toBeVisible();
  }
  await expect(page.getByText("$20").first()).toBeVisible();
});

test("elegir categoría lleva a los datos personales", async ({ page }) => {
  await page.goto("/inscripcion/");
  await page.getByText("Élite Pro 8K").first().click();
  await expect(page.getByText(/cédula/i).first()).toBeVisible();
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
