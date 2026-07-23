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

  // experimental.inlineCss: probado DOS veces, malo las dos. La segunda
  // (22-jul, ya sin feTurbulence ni preloads de vídeo): score simulado
  // 73→69, FCP 2,3→3,2 s, LCP 8,4→11,4 s. El HTML pasa de ~19 a ~70 KB y
  // en 4G lento ese peso extra cuesta más de lo que ahorra quitar la hoja.
  // NO volver a activarlo sin una tercera medición que diga lo contrario.
};

export default nextConfig;
