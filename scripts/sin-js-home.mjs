/**
 * Deja el home SIN JavaScript: quita del out/index.html exportado todos los
 * <script> y los preloads de scripts. Solo el home — las demás rutas
 * (inscripción, verificar…) conservan su interactividad intacta.
 *
 * Por qué así y no "quitando React": con output:"export", Next siempre emite
 * su runtime en el HTML. Este paso corre después de `next build` y convierte
 * la portada en HTML+CSS puros: navegación con <a>, contador de días
 * calculado en el build, FAQ con <details>. Lo que dependía de JS en el home
 * (popup, botón flotante, contador vivo, video) ya se quitó del componente o
 * queda inerte sin romper nada.
 *
 * Corre en el build (package.json). Si algún día el home vuelve a necesitar
 * JS, basta quitar este paso del script "build".
 */
import fs from "fs/promises";

const RUTA = new URL("../out/index.html", import.meta.url);
let html = await fs.readFile(RUTA, "utf8");
const antes = html.length;

// Fuera <script>…</script> (incluye los inline de Next), salvo JSON-LD.
html = html.replace(
  /<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g,
  ""
);
// Fuera los preload/prefetch de scripts que ya no existen en la página.
html = html.replace(/<link[^>]+(?:as="script"|rel="preload")[^>]*\.js"[^>]*\/?>/g, "");

await fs.writeFile(RUTA, html);
console.log(
  `sin-js-home: index.html ${Math.round(antes / 1024)} KB → ${Math.round(html.length / 1024)} KB, 0 <script> restantes: ${!/<script\b(?![^>]*ld\+json)/.test(html)}`
);
