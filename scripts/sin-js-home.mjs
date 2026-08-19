/**
 * Deja las páginas PÚBLICAS sin JavaScript: quita de los HTML exportados
 * todos los <script> y los preloads de scripts. Son páginas de solo lectura
 * (HTML + CSS + imágenes): navegan con <a>, el acordeón de FAQ es <details>,
 * la galería anima con CSS y el video usa controles nativos.
 *
 * CONSERVAN su JavaScript (interacción real):
 *   - /inscripcion  → el formulario completo
 *   - /verificar    → consulta el estado del pago contra la API
 *   - /ganadores    → botón de imprimir/descargar PDF
 *
 * Por qué así y no "quitando React": con output:"export", Next siempre emite
 * su runtime en el HTML. Este paso corre después de `next build`. Si una
 * página vuelve a necesitar JS, se añade a CONSERVAN abajo.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
const CONSERVAN = ["inscripcion", "verificar", "ganadores"];

async function htmls(dir) {
  const res = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "_next") continue;
      res.push(...(await htmls(p)));
    } else if (e.name.endsWith(".html")) res.push(p);
  }
  return res;
}

let limpiadas = 0;
for (const archivo of await htmls(OUT)) {
  const rel = path.relative(OUT, archivo);
  if (CONSERVAN.some((r) => rel === `${r}/index.html` || rel.startsWith(`${r}/`)))
    continue;

  let html = await fs.readFile(archivo, "utf8");
  const antes = html.length;
  // Fuera <script>…</script> (incluye los inline de Next), salvo JSON-LD y
  // los marcados con data-mantener (JS vainilla mínimo, p. ej. el contador
  // del hero en escritorio: ~20 líneas sin framework).
  html = html.replace(
    /<script\b(?![^>]*type="application\/ld\+json")(?![^>]*data-mantener)[^>]*>[\s\S]*?<\/script>/g,
    ""
  );
  // Fuera los preload/prefetch de scripts que ya no existen en la página.
  html = html.replace(
    /<link[^>]+(?:as="script"|rel="preload")[^>]*\.js"[^>]*\/?>/g,
    ""
  );
  if (html.length !== antes) {
    await fs.writeFile(archivo, html);
    limpiadas++;
    console.log(
      `sin-js: ${rel} ${Math.round(antes / 1024)} KB → ${Math.round(html.length / 1024)} KB`
    );
  }
}
console.log(
  `sin-js: ${limpiadas} páginas sin scripts; conservan JS: ${CONSERVAN.join(", ")}`
);
