import generadas from "./imagenes-generadas.json";

/**
 * Arma el `srcset` de una foto de /public/fotos.
 *
 * Hace falta hacerlo a mano porque el sitio se exporta estático
 * (`output: "export"` + `images: { unoptimized: true }`) y en ese modo el
 * optimizador de Next no se ejecuta: `next/image` acaba pintando un <img>
 * corriente con el archivo original, y los `sizes` y `quality` que lleve puestos
 * no hacen nada. Los tamaños los genera scripts/imagenes.mjs en el build y aquí
 * solo se listan.
 *
 * @param src  ruta tal cual está en /public, p. ej. "/fotos/corredores-01.webp"
 * @returns    el srcset, o undefined si de esa foto no hay más que el original
 *             (devolver una cadena con una sola entrada no aporta nada y encima
 *             desactiva el `sizes` que le pongas al <img>)
 */
export function srcSetDe(src: string): string | undefined {
  const anchos = (generadas as Record<string, number[]>)[src];
  if (!anchos || anchos.length < 2) return undefined;

  const base = src.replace(/\.webp$/, "");
  const mayor = anchos[anchos.length - 1];

  return anchos
    .map((w) => (w === mayor ? `${src} ${w}w` : `${base}@${w}w.webp ${w}w`))
    .join(", ");
}
