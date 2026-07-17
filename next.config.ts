import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔹 Muy importante para generar /out con `next build && next export`
  output: "export",

  // 🔹 Necesario en hosting estático (Hostinger, cPanel, S3, GitHub Pages…)
  images: {
    unoptimized: true,
  },

  // 🔥 Solución al problema de /inscripcion → genera /inscripcion/index.html
  trailingSlash: true,

  // experimental.inlineCss se probó y se midió: NO compensa aquí.
  //
  // La teoría era buena — el CSS bloquea el pintado, así que incrustarlo quita
  // la espera. Y funcionó en lo suyo: la sección "solicitudes que bloquean el
  // renderizado" desapareció del informe. Pero los números dicen otra cosa:
  //   FCP:      0,9 s → 1,7 s   (el HTML pasó de 17 a 68 KB comprimidos)
  //   LCP:      5,4 s → 5,3 s   (sin cambio real)
  //   retraso:  2.080 → 2.020 ms
  //
  // O sea: el CSS bloqueante NO era la causa de los 2 s de retraso. Se quita.
};

export default nextConfig;
