"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

// --- CONFIGURACIÓN DE FUENTE (Optimización Core Web Vitals) ---
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

// El logo a todo color, sacado del vector del arte oficial. El anterior era la
// versión blanca, que sobre el header claro obligaba a meterla en una caja naranja
// para que se viera: parecía una pegatina encima del logo, no el logo.
const Logo = ({ className }: { className?: string }) => (
  <img
    src="/logo-mandarinas-color.png"
    alt="8K Ruta de las Mandarinas — inicio"
    width={744}
    height={260}
    className={`${className} object-contain`}
    loading="eager"
  />
);

// --- COMPONENTE PRINCIPAL ---
export default function Header() {
  const [open, setOpen] = useState(false);

  // Escape cierra el menú. Además bloqueamos el scroll del fondo: si no, al
  // deslizar sobre el menú se mueve la página de detrás y desorienta.
  useEffect(() => {
    if (!open) return;
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", alPulsar);
    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = scrollPrevio;
    };
  }, [open]);

  return (
    <>
      {/* sticky: antes desaparecía al bajar y había que subir del todo para llegar a
          "Inscribirse". Se queda en 74-86px, muy por debajo del 20% de pantalla que
          empieza a agobiar. top-0 con un poco de aire arriba para que la píldora
          no quede pegada al borde. */}
      {/* Primer parada del tabulador: saltar el menú e ir al contenido.
          Solo se ve cuando se le da el foco con el teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-5 focus:py-3 focus:rounded-full focus:bg-white focus:text-[#FF6B1A] focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
      >
        Saltar al contenido
      </a>

      <header className={`sticky top-0 pt-4 sm:pt-5 pb-2 z-50 w-full flex justify-center px-4 font-sans ${bebas.variable}`}>
        <div
          className="
            w-full max-w-7xl mx-auto
            bg-white/95 backdrop-blur-sm
            rounded-full
            shadow-[0_8px_28px_rgba(0,0,0,0.10)]
            hover:shadow-[0_15px_40px_-10px_rgba(255,107,26,0.18)]
            transition-all duration-300
            px-4 sm:px-6 lg:px-8 py-3
            flex items-center justify-between
            border border-[#EFEFF3]
          "
        >
          {/* IZQUIERDA → HOME. El logo va desnudo: es a color y se sostiene solo. */}
          <Link
            href="/"
            className="flex items-center cursor-pointer group flex-shrink-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
          >
            <Logo className="h-9 sm:h-11 w-auto group-hover:scale-[1.03] transition-transform duration-300" />
          </Link>

          {/* ================= DESKTOP (LG+) =================
              Navegar y "Inscribirse" son cosas distintas: los enlaces van en texto
              plano en el centro (antes eran tres píldoras iguales apelotonadas a la
              derecha, y el ojo no sabía cuál era la importante) y solo el CTA lleva
              fondo. El centro estaba vacío 429px mientras la derecha iba apretada. */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-3 xl:gap-5 mr-auto ml-6 xl:ml-10"
          >
            <Link
              href="/reglamento"
              className="
                inline-flex items-center min-h-[44px] px-4
                text-sm font-bold text-[#333]
                uppercase tracking-[0.08em]
                rounded-full hover:bg-black/[0.04] hover:text-[#FF6B1A]
                transition-colors duration-200
                outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]
                whitespace-nowrap
              "
            >
              Reglamento
            </Link>

            <Link
              href="/verificar"
              className="
                inline-flex items-center min-h-[44px] px-4
                text-sm font-bold text-[#333]
                uppercase tracking-[0.08em]
                rounded-full hover:bg-black/[0.04] hover:text-[#FF2D7C]
                transition-colors duration-200
                outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D7C]
                whitespace-nowrap
              "
            >
              Verificar mi pago
            </Link>
          </nav>

          {/* Una sola acción con peso visual, a la derecha */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link
              href="/inscripcion"
              className="
                inline-flex items-center min-h-[44px] px-6
                text-sm font-bold
                bg-[#FF6B1A] text-white
                rounded-full uppercase tracking-[0.08em]
                hover:bg-[#E55104] hover:-translate-y-0.5
                shadow-md hover:shadow-lg transition-all duration-300
                outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2
                whitespace-nowrap
              "
            >
              Inscribirse
            </Link>
          </div>

          {/* ================= BURGER (LG-) ================= */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 transition outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="w-7 h-7 text-[#111]" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU OSCURO ================= */}
      {open && (
        // Tocar el fondo cierra: es lo que todo el mundo intenta primero.
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              absolute top-4 left-4 right-4
              bg-[#0B0B0B]
              rounded-[32px]
              shadow-[0_30px_80px_rgba(0,0,0,0.85)]
              p-6 sm:p-8
              text-white
              animate-in slide-in-from-top-10 duration-300
            "
          >
            <div className="flex items-center justify-between mb-8">
              {/* Aquí el fondo es negro, así que va la versión blanca del logo:
                  la de color lleva el texto en morado y no se leería. */}
              <img
                src="/logo-mandarinas-blanco.svg"
                alt="8K Ruta de las Mandarinas"
                className="h-9 w-auto object-contain"
              />
              <button
                onClick={() => setOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Cerrar menú"
              >
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-xl font-bold py-3 border-b border-white/10 text-white/90" onClick={() => setOpen(false)}>
                Inicio
              </Link>

              <Link href="/reglamento" className="text-xl font-bold py-3 border-b border-white/10 text-white/90" onClick={() => setOpen(false)}>
                Reglamento
              </Link>

              <Link
                href="/verificar"
                className="text-xl font-bold py-3 border-b border-white/10 text-[#FF2D7C]"
                onClick={() => setOpen(false)}
              >
                Verificar inscripción
              </Link>
              
              <Link
                href="/inscripcion"
                className="
                  mt-6
                  inline-flex justify-center w-full
                  px-6 py-5
                  bg-[#FF6B1A]
                  rounded-2xl
                  uppercase tracking-[0.25em]
                  font-bold text-base
                  shadow-lg
                  active:scale-95 transition-transform
                "
                onClick={() => setOpen(false)}
              >
                Inscribirse Ahora
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}