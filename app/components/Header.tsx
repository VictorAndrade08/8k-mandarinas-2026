"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

// --- CONFIGURACIÓN DE FUENTE (Optimización Core Web Vitals) ---
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

// Navegación del sitio. Cada entrada apunta a algo que existe de verdad: "Ruta"
// va al artículo 4 del reglamento (Distancia y Recorrido) porque no hay página de
// recorrido — las tarjetas "Ver mapa 3D" de la home son un alert("Próximamente").
// Si algún día se hace esa página, se cambia el href aquí y nada más.
const NAV = [
  { href: "/reglamento#art-4", label: "Ruta", acento: "#FF6B1A" },
  { href: "/#info", label: "Información", acento: "#FF6B1A" },
  { href: "/reglamento", label: "Reglamento", acento: "#FF6B1A" },
  { href: "/verificar", label: "Verificar mi pago", acento: "#FF2D7C" },
];

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
      {/* absolute, ni sticky ni fixed:
          - sticky/normal ocupan sitio en el flujo y empujaban el hero hacia
            abajo, dejando una franja del fondo naranja por encima del vídeo;
          - fixed lo arreglaba, pero dejaba la píldora clavada en pantalla todo
            el rato.
          Con absolute está fuera del flujo (el vídeo arranca en el píxel 0 y la
          píldora flota encima) y además se va con el scroll. Se ancla al <body>,
          que ya es relative desde layout.tsx.
          Contrapartida: al no ocupar sitio, las páginas sin hero tienen que
          reservar ese hueco a mano — lo hace MainWrapper en SiteChrome.tsx.
          Y como la píldora se pierde al bajar, quien lleva a "Inscribirse" a
          partir de ahí es el botón flotante de FloatingCTA, que aparece justo
          cuando esta desaparece. */}
      {/* Primer parada del tabulador: saltar el menú e ir al contenido.
          Solo se ve cuando se le da el foco con el teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-[#FF6B1A] focus:shadow-lg focus:ring-2 focus:ring-[#FF6B1A] focus:outline-none"
      >
        Saltar al contenido
      </a>

      <header
        className={`absolute inset-x-0 top-0 z-50 flex w-full justify-center px-4 pt-8 pb-2 font-sans sm:pt-10`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-[#EFEFF3] bg-white/95 px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(255,107,26,0.18)] sm:px-6 lg:px-8">
          {/* IZQUIERDA → HOME. El logo va desnudo: es a color y se sostiene solo. */}
          <Link
            href="/"
            className="group flex flex-shrink-0 cursor-pointer items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
          >
            <Logo className="h-12 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-14 lg:h-16" />
          </Link>

          {/* ================= DESKTOP (LG+) =================
              Navegar y "Inscribirse" son cosas distintas: los enlaces van en texto
              plano en el centro (antes eran tres píldoras iguales apelotonadas a la
              derecha, y el ojo no sabía cuál era la importante) y solo el CTA lleva
              fondo. El centro estaba vacío 429px mientras la derecha iba apretada. */}
          <nav
            aria-label="Navegación principal"
            className="mr-auto ml-6 hidden items-center gap-1 lg:flex xl:ml-10 xl:gap-3"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ ["--acento" as string]: item.acento }}
                className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold tracking-[0.08em] whitespace-nowrap text-[#333] uppercase transition-colors duration-200 outline-none hover:bg-black/[0.04] hover:text-(--acento) focus-visible:ring-2 focus-visible:ring-(--acento) xl:px-4"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Una sola acción con peso visual, a la derecha */}
          <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
            <Link
              href="/inscripcion"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#FF6B1A] px-6 text-sm font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase shadow-md transition-all duration-300 outline-none hover:-translate-y-0.5 hover:bg-[#E55104] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
            >
              Inscribirse
            </Link>
          </div>

          {/* ================= BURGER (LG-) ================= */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full transition outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#FF6B1A] lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="h-7 w-7 text-[#111]" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU OSCURO ================= */}
      {open && (
        // Tocar el fondo cierra: es lo que todo el mundo intenta primero.
        <div
          className="animate-in fade-in fixed inset-0 z-50 bg-black/70 backdrop-blur-sm duration-200"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in slide-in-from-top-10 absolute top-4 right-4 left-4 rounded-[32px] bg-[#0B0B0B] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.85)] duration-300 sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              {/* Aquí el fondo es negro, así que va la versión blanca del logo:
                  la de color lleva el texto en morado y no se leería. */}
              <img
                src="/logo-mandarinas-blanco.svg"
                alt="8K Ruta de las Mandarinas"
                className="h-9 w-auto object-contain"
              />
              <button
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full transition outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Cerrar menú"
              >
                <X className="h-7 w-7 text-white" />
              </button>
            </div>

            {/* Cae desde arriba, no entra desde un lado: el burger está arriba a
                la derecha y el menú aparece donde el dedo acaba de tocar. */}
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="border-b border-white/10 py-3 text-xl font-bold text-white/90"
                onClick={() => setOpen(false)}
              >
                Inicio
              </Link>

              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    color: item.acento === "#FF2D7C" ? item.acento : undefined,
                  }}
                  className="border-b border-white/10 py-3 text-xl font-bold text-white/90"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/inscripcion"
                className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#FF6B1A] px-6 py-5 text-base font-bold tracking-[0.25em] uppercase shadow-lg transition-transform active:scale-95"
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
