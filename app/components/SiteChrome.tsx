"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Sin header ni footer: el formulario trae su propio marco y navegación por pasos.
const SIN_CHROME = new Set<string>(["/inscripcion"]);

// Sin margen superior: el contenido arranca pegado al header porque el hero trae
// su propio fondo a pantalla completa y un hueco ahí se lee como un fallo.
const SIN_MARGEN_SUPERIOR = new Set<string>(["/", "/inscripcion"]);

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
    <main id="contenido" className={`${pegado ? "" : "pt-8"} relative z-10`}>
      {children}
    </main>
  );
}
