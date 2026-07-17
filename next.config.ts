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

  experimental: {
    // Mete el CSS dentro del HTML en vez de enlazarlo.
    //
    // Era el LCP entero: la hoja bloquea el pintado de toda la página y tardaba
    // 670 ms en 4G lenta. El logo del hero se descargaba en 80 ms y luego el
    // navegador esperaba 2 s sin poder dibujar nada. Sin petición que esperar,
    // el CSS llega en el mismo flujo de bytes que el HTML.
    //
    // Es la versión de Next de lo que intenté a mano y no funcionó: incrustarlo
    // con un script post-build no sirve porque Next referencia el CSS también en
    // el payload de hidratación y el cliente volvía a pedirlo. Esta opción lo
    // hace bien, desde dentro.
    //
    // Marcada como experimental: si un día el sitio sale sin estilos, esto es lo
    // primero que hay que quitar.
    inlineCss: true,
  },
};

export default nextConfig;
