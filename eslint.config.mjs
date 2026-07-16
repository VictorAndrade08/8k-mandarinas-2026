import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Este sitio se compila con `output: "export"`, lo que obliga a
      // `images: { unoptimized: true }` (ver next.config.ts). Con eso,
      // <Image /> no redimensiona, no convierte a webp y no hace nada que un
      // <img> no haga: solo añade un componente de React y su JavaScript
      // encima. La regla asume un servidor de Next detrás que aquí no existe.
      //
      // Lo que sí importa del rendimiento de imágenes se sigue haciendo a mano:
      // width/height reales para que no salte el layout, loading="lazy" salvo
      // en lo que se ve de entrada, y los archivos ya comprimidos en public/.
      "@next/next/no-img-element": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
