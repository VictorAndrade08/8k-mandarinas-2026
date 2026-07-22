"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Sin header ni footer: el formulario trae su propio marco y navegación por pasos.
const SIN_CHROME = new Set<string>(["/inscripcion"]);

// Sin margen superior: el contenido arranca en el píxel 0 y el header flota
// encima. El hero trae su propio vídeo a pantalla completa y cualquier hueco
// arriba deja ver el fondo naranja por encima del vídeo, que se lee como un fallo.
const SIN_MARGEN_SUPERIOR = new Set<string>(["/", "/inscripcion"]);

// El header es `fixed`, así que no ocupa sitio: las páginas sin hero tienen que
// reservar su altura a mano o el contenido nace debajo de la píldora. Son los
// ~110px que mide (pt + píldora + pb) más aire. Si cambias el pt del header,
// cambia esto.
const HUECO_HEADER = "pt-[158px] sm:pt-[182px]";

// Normaliza el slash final ("/inscripcion/" -> "/inscripcion")
const ruta = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (SIN_CHROME.has(ruta(pathname))) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (SIN_CHROME.has(ruta(pathname))) return null;
  return <Footer />;
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pegado = SIN_MARGEN_SUPERIOR.has(ruta(pathname));
  return (
    // id="contenido": destino del enlace "Saltar al contenido" del header.
    <main
      id="contenido"
      className={`${pegado ? "" : HUECO_HEADER} relative z-10`}
    >
      {children}
    </main>
  );
}
