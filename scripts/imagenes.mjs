/**
 * Genera las versiones pequeñas de las fotos para poder servirlas con srcset.
 *
 * Por qué existe esto y no usamos next/image: el sitio se compila con
 * `output: "export"` e `images: { unoptimized: true }` (ver next.config.ts).
 * Con export estático NO hay servidor que redimensione nada, así que el
 * optimizador de Next no llega a ejecutarse: `sizes`, `quality`, `formats`,
 * `deviceSizes`… todo eso se queda escrito en el HTML sin hacer nada, y el
 * navegador acaba bajando siempre el archivo original.
 *
 * Así que los tamaños los generamos aquí, en el build, y los componentes los
 * sirven con un srcset escrito a mano.
 *
 * Uso:
 *   node scripts/imagenes.mjs           genera lo que falte
 *   node scripts/imagenes.mjs --force   regenera todo
 *
 * Corre solo en `npm run build` (ver package.json). Las variantes se escriben
 * al lado del original como  foto-240.webp / foto-400.webp  y están en
 * .gitignore: son derivadas, se rehacen en cada despliegue.
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));

// Cada carpeta con sus anchos, porque se pintan a tamaños distintos:
// - fotos: tarjetas de 200-320 px de CSS → 240/400 cubren 1x y 2x (el
//   original de 640 queda para 3x).
// - ilustraciones: tarjetas de ~600 px de CSS → 480/800 cubren 1x y 2x (el
//   original de 1280 queda para pantallas grandes).
const CARPETAS = [
  { carpeta: "fotos", anchos: [240, 400] },
  { carpeta: "ilustraciones", anchos: [480, 800] },
];

const forzar = process.argv.includes("--force");

// El sufijo lleva @ y la w de "width" a propósito: con un simple "-400" el
// filtro tomaba "corredores-01.webp" por una variante ya generada y se saltaba
// las nueve fotos de la cinta, que son justo las que hay que encoger.
const esVariante = (n) => /@\d+w\.webp$/.test(n);

let generadas = 0;
let saltadas = 0;
// Qué anchos acabó teniendo cada imagen. Se escribe a un JSON que leen los
// componentes: si el srcset se armara a ciegas con la lista de anchos, las
// imágenes que ya eran pequeñas apuntarían a variantes que este script no
// llegó a crear, y el navegador se comería un 404 por cada una.
const manifiesto = {};

for (const { carpeta, anchos } of CARPETAS) {
  const DIR = path.join(RAIZ, "public", carpeta);
  const archivos = (await fs.readdir(DIR)).filter(
    (n) => n.endsWith(".webp") && !esVariante(n)
  );

  for (const nombre of archivos) {
    const origen = path.join(DIR, nombre);
    const base = nombre.replace(/\.webp$/, "");
    const meta = await sharp(origen).metadata();
    const anchosListos = [];

    for (const ancho of anchos) {
      // Si el original ya es más pequeño que la variante, la variante sobra:
      // agrandar una imagen no la mejora, solo pesa más.
      if (!meta.width || meta.width <= ancho) continue;

      const destino = path.join(DIR, `${base}@${ancho}w.webp`);
      if (!forzar) {
        try {
          const [o, d] = await Promise.all([fs.stat(origen), fs.stat(destino)]);
          if (d.mtimeMs >= o.mtimeMs) {
            saltadas++;
            anchosListos.push(ancho);
            continue;
          }
        } catch {
          // No existe todavía: se genera.
        }
      }

      await sharp(origen)
        .resize({ width: ancho, withoutEnlargement: true })
        .webp({ quality: 74 })
        .toFile(destino);
      generadas++;
      anchosListos.push(ancho);
    }

    // El original entra al final: es siempre el ancho mayor disponible.
    if (meta.width) anchosListos.push(meta.width);
    manifiesto[`/${carpeta}/${nombre}`] = anchosListos.sort((a, b) => a - b);
  }
}

await fs.writeFile(
  path.join(RAIZ, "app", "lib", "imagenes-generadas.json"),
  JSON.stringify(manifiesto, null, 2) + "\n"
);

console.log(
  `imágenes: ${generadas} generadas, ${saltadas} ya estaban al día ` +
    `(${Object.keys(manifiesto).length} originales en ${CARPETAS.length} carpetas)`
);
