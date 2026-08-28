"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Sin header ni footer. Estaba /inscripcion, porque el formulario traía su
// propio marco y navegación por pasos; desde que las inscripciones se cerraron
// (27-ago-2026) esa ruta enseña un aviso corriente y necesita el marco del
// sitio para poder salir de ahí.
const SIN_CHROME = new Set<string>([]);

// Sin margen superior: el contenido arranca en el píxel 0 y el header flota
// encima. El hero trae su propio vídeo a pantalla completa y cualquier hueco
// arriba deja ver el fondo naranja por encima del vídeo, que se lee como un fallo.
const SIN_MARGEN_SUPERIOR = new Set<string>(["/"]);

// El header es `fixed`, así que no ocupa sitio: las páginas sin hero tienen que
// reservar su altura a mano o el contenido nace debajo de la píldora. Son los
// ~110px que mide (pt + píldora + pb) más aire. Si cambias el pt del header,
// cambia esto.
// pt del header (40/48) + píldora (~103/117) + ~25px de aire: antes el bloque
// del hero arrancaba a 1px de la píldora y se veían pegados.
const HUECO_HEADER = "pt-[168px] sm:pt-[192px]";

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
