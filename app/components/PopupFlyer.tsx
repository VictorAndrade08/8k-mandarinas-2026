"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Pop-up del flyer oficial al entrar al home. Enseña "Inscripciones abiertas",
// premios y el QR, y al tocarlo lleva a /inscripcion — es un empujón de
// conversión (docs/30-UX-CONVERSION.md, tips 2 y 8), pero un pop-up mal hecho
// espanta. Por eso:
//   - Se ve UNA vez por sesión (sessionStorage): no reaparece en cada página.
//   - Cierre MUY fácil: botón X grande, clic en el fondo, y tecla Esc.
//   - Aparece con un pequeño retraso para no robarle el primer pintado al hero
//     (el LCP en móvil), y nunca se pre-renderiza en el HTML estático.
//   - Dos artes: el horizontal en escritorio, el vertical en móvil (<picture>).
const CLAVE_SESION = "flyer-visto";

export default function PopupFlyer() {
  const [abierto, setAbierto] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  const cerrar = () => {
    sessionStorage.setItem(CLAVE_SESION, "1");
    setAbierto(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem(CLAVE_SESION)) return;
    const t = setTimeout(() => setAbierto(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    // Enfoca el botón de cerrar (accesible con teclado) y cierra con Esc.
    cerrarRef.current?.focus();
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", alTecla);
    // Evita que el fondo haga scroll mientras el pop-up está abierto.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTecla);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="8K Ruta de las Mandarinas — inscripciones abiertas"
      onClick={cerrar}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
    >
      {/* El clic dentro de la tarjeta NO cierra (solo el fondo y la X). */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] lg:max-w-3xl"
      >
        {/* Botón de cerrar: 44px, alto contraste, esquina de la imagen. */}
        <button
          ref={cerrarRef}
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl leading-none font-black text-[#c51850] shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none"
        >
          ×
        </button>

        {/* El flyer lleva a inscribirse. Vertical en móvil, horizontal en lg+. */}
        <Link
          href="/inscripcion"
          onClick={cerrar}
          className="block overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        >
          <picture className="block">
            <source
              media="(min-width: 1024px)"
              srcSet="/fotos/flyer-inscripciones.webp"
              width={1600}
              height={1128}
            />
            <img
              src="/fotos/flyer-inscripciones-movil.webp"
              alt="8K Ruta de las Mandarinas · Inscripciones abiertas · 29 de agosto en Patate · toca para inscribirte"
              width={900}
              height={1273}
              className="h-auto max-h-[80vh] w-full object-contain lg:max-h-[85vh]"
              decoding="async"
            />
          </picture>
        </Link>

        {/* Ayuda de cierre explícita (buena práctica de pop-up). */}
        <button
          onClick={cerrar}
          className="mx-auto mt-3 block rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          Cerrar y ver la página
        </button>
      </div>
    </div>
  );
}
