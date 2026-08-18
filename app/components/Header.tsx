"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// --- CONFIGURACIÓN DE FUENTE (Optimización Core Web Vitals) ---
// El logo a todo color, sacado del vector del arte oficial. El anterior era la
// versión blanca, que sobre el header claro obligaba a meterla en una caja naranja
// para que se viera: parecía una pegatina encima del logo, no el logo.
const Logo = ({
  className,
  blanco,
}: {
  className?: string;
  blanco?: boolean;
}) => (
  <img
    // webp y a 520px: el PNG pesaba 80 KB para mostrarse a 200. Carga en eager
    // porque está en el primer pantallazo, así que cada KB cuenta el doble.
    // En el modo transparente del home el logo se vuelve blanco con un FILTRO
    // (brightness-0 + invert) y no con otro archivo: el webp blanco traía una
    // caja naranja pegada, y además el cambio de src era un salto seco — el
    // filtro transiciona suave con el resto de la píldora.
    src="/logo-mandarinas-color.webp"
    alt="8K Ruta de las Mandarinas — inicio"
    width={520}
    height={182}
    className={`${className} object-contain transition-[filter] duration-300 ${
      blanco ? "brightness-0 invert" : ""
    }`}
    // lazy y no eager: en el home móvil la píldora entera va escondida en el
    // tope (el hero ya trae su logo) y con eager este archivo se descargaba
    // igual + Next le generaba un preload que competía con el LCP. Con lazy
    // solo baja cuando la píldora es visible — en las páginas interiores eso
    // es inmediato porque está en el primer pantallazo.
    loading="lazy"
  />
);

// Navegación del sitio. Cada entrada apunta a algo que existe de verdad.
// "Ruta" ya no lleva al ancla del mapa en el home: hay una página entera con el
// recorrido tramo por tramo.
const NAV = [
  { href: "/ruta", label: "Ruta", acento: "#f7771c" },
  { href: "/informacion", label: "Información", acento: "#f7771c" },
  { href: "/reglamento", label: "Reglamento", acento: "#f7771c" },
  // "Mi pago", no "Verificar mi pago": la barra inferior del móvil ya llamaba
  // así a este mismo destino y dos nombres para la misma página se leen como dos
  // páginas distintas (NN/g, Consistency and Standards).
  { href: "/verificar", label: "Mi pago", acento: "#c51850" },
];

// --- COMPONENTE PRINCIPAL ---
export default function Header() {
  const pathname = usePathname();
  const ruta = pathname.replace(/\/+$/, "") || "/";

  // Header inteligente: en el tope va la píldora grande; al bajar se esconde
  // para dejar leer; al SUBIR reaparece compacta y con vidrio (backdrop-blur).
  // Así "Inscribirse" está siempre a un gesto (50-CONSEJOS-CARRERAS.md, #1)
  // sin una barra clavada tapando contenido todo el rato.
  const [visible, setVisible] = useState(true);
  const [enTope, setEnTope] = useState(true);
  const ultimoY = useRef(0);

  // En el tope la píldora va SIEMPRE transparente (pedido del 22-jul): en el
  // home deja ver el vídeo y en las interiores flota sobre el fondo ciruela
  // del body (#1c0710) — oscuro en ambos casos, así que el texto blanco
  // contrasta siempre. Al hacer scroll vuelve la versión blanca compacta.
  const transparente = enTope;

  // En el HOME MÓVIL la píldora del tope se esconde entera: el hero ya trae
  // el logo grande justo debajo y se veían dos logos apilados (reportado con
  // captura) — y la navegación móvil vive en la barra inferior, así que la
  // píldora ahí solo duplicaba. Reaparece al hacer scroll (compacta) y en
  // lg+ siempre, que es donde lleva el menú.
  const soloEscritorio = transparente && ruta === "/";

  useEffect(() => {
    const alScroll = () => {
      const y = window.scrollY;
      setEnTope(y < 24);
      // Umbral de 8px: sin él, el temblor del trackpad hace parpadear la barra.
      if (Math.abs(y - ultimoY.current) > 8) {
        setVisible(y < ultimoY.current || y < 120);
        ultimoY.current = y;
      }
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <>
      {/* Primer parada del tabulador: saltar el menú e ir al contenido.
          Solo se ve cuando se le da el foco con el teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-[#f7771c] focus:shadow-lg focus:ring-2 focus:ring-[#f7771c] focus:outline-none"
      >
        Saltar al contenido
      </a>

      {/* fixed y no absolute: sigue fuera del flujo (el vídeo arranca en el
          píxel 0 y la píldora flota encima; las páginas sin hero reservan el
          hueco en MainWrapper), pero ahora puede REAPARECER al subir. La
          píldora clavada todo el rato —el problema del fixed clásico— se
          resuelve escondiéndola al bajar con translate.
          Si cambias el pt del tope, cambia HUECO_HEADER en SiteChrome.tsx.
          onFocusCapture: si alguien navega con teclado hacia el menú mientras
          está escondido, se muestra — un menú al que no se puede llegar con
          Tab es un menú roto (WCAG 2.4.3). */}
      <header
        onFocusCapture={() => setVisible(true)}
        className={`fixed inset-x-0 top-0 z-50 flex w-full justify-center px-4 pb-2 font-sans transition-[transform,padding] duration-300 motion-reduce:transition-none ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${enTope ? "pt-10 sm:pt-12" : "pt-3"}`}
      >
        {/* En móvil ya no hay hamburguesa: la navegación vive en la barra
            inferior fija (BottomNav), así que aquí solo queda el logo, centrado.
            Tener dos menús —arriba y abajo— confundía y se pisaban. En lg+
            aparece la navegación completa en línea y el logo vuelve a la
            izquierda. */}
        {/* Dos pieles según el scroll: en el tope, blanco casi sólido y
            aireado; compacta, vidrio esmerilado (bg translúcido + blur) para
            que el contenido se adivine pasando por detrás. */}
        <div
          className={`mx-auto w-full max-w-7xl items-center justify-center rounded-full border px-4 transition-all duration-300 sm:px-6 lg:flex lg:justify-between lg:px-8 ${
            soloEscritorio ? "hidden" : "flex"
          } ${
            transparente
              ? "border-white/15 bg-white/10 py-3 backdrop-blur-md"
              : "border-white/50 bg-white/80 py-2 shadow-[0_14px_36px_rgba(0,0,0,0.16)] backdrop-blur-md"
          }`}
        >
          {/* IZQUIERDA → HOME. El logo va desnudo: es a color y se sostiene solo.
              <a> normal, no <Link>: el home es HTML estático sin JS y cargarlo
              directo es instantáneo — la navegación SPA re-renderizaba toda la
              portada en React y en Safari se sentía lenta. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- navegación dura a propósito: el home exportado va sin scripts */}
          <a
            href="/"
            className="group flex flex-shrink-0 cursor-pointer items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2"
          >
            {/* En móvil manda el ancho, no el alto: el logo es muy apaisado, así
                que con h-16 a secas se comería el sitio. Con min(vw) crece todo
                lo que le deja la píldora y no más. */}
            <Logo
              blanco={transparente}
              className={`h-auto transition-all duration-300 group-hover:scale-[1.03] ${
                enTope
                  ? "w-[min(58vw,220px)] sm:w-[240px] lg:w-[260px]"
                  : "w-[min(48vw,180px)] sm:w-[200px] lg:w-[210px]"
              }`}
            />
          </a>

          {/* ================= DESKTOP (LG+) =================
              Navegar y "Inscribirse" son cosas distintas: los enlaces van en texto
              plano en el centro (antes eran tres píldoras iguales apelotonadas a la
              derecha, y el ojo no sabía cuál era la importante) y solo el CTA lleva
              fondo. El centro estaba vacío 429px mientras la derecha iba apretada. */}
          <nav
            aria-label="Navegación principal"
            className="mr-auto ml-6 hidden items-center gap-1 lg:flex xl:ml-10 xl:gap-3"
          >
            {NAV.map((item) => {
              // Los enlaces con ancla (#ruta, #info) apuntan a la home: no hay
              // "página actual" que marcar, solo las rutas propias.
              const activo =
                !item.href.includes("#") && ruta.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={activo ? "page" : undefined}
                  // Sobre el vídeo oscuro el magenta de "Mi pago" no se lee:
                  // en modo transparente todos los acentos van en naranja, que
                  // sí contrasta (y es el mismo del botón de al lado).
                  style={{
                    ["--acento" as string]: transparente
                      ? "#f7771c"
                      : item.acento,
                  }}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-(--acento) xl:px-4 ${
                    // El hover en modo transparente va a BLANCO PLENO, no a
                    // naranja: el header flota sobre fondos cálidos (el degradado
                    // naranja del home incluido) y el naranja desaparecía ahí.
                    // Sobre la píldora blanca el hover sí usa el color de marca.
                    transparente
                      ? "hover:bg-white/15 hover:text-white"
                      : "hover:bg-black/[0.04] hover:text-(--acento)"
                  } ${
                    // Dónde estás: color de marca + subrayado. Solo color no
                    // basta (WCAG 2.2, 1.4.1).
                    // El activo sobre la píldora transparente va en BLANCO con
                    // subrayado blanco: el naranja se confundía con los fondos
                    // cálidos de las ilustraciones. Sobre la píldora blanca
                    // sigue en color de marca.
                    activo
                      ? transparente
                        ? "text-white underline decoration-2 underline-offset-8"
                        : "text-(--acento) underline decoration-2 underline-offset-8"
                      : transparente
                        ? "text-white/75"
                        : "text-[#333]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Una sola acción con peso visual, a la derecha */}
          <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
            <Link
              href="/inscripcion"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#f7771c] px-6 text-sm font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase shadow-md transition-all duration-300 outline-none hover:-translate-y-0.5 hover:bg-[#d2600f] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2"
            >
              Inscribirse
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
