"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { srcSetDe } from "../lib/imagen";

type GalleryItem = { src: string; alt: string };

// Fotos oficiales de la carrera, servidas desde /public. Antes esto apuntaba a
// mandarinas.8krutadelasmandarinas.com, un subdominio que ya no resuelve en DNS:
// las 15 imágenes llevaban tiempo saliendo rotas.
const IMAGES: GalleryItem[] = [
  {
    src: "/fotos/corredores-01.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-02.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-03.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-04.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-05.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-06.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-07.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-08.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-09.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-10.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-11.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-12.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-13.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-14.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-15.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-16.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-17.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-18.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-19.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-20.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-21.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-22.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-23.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-24.webp",
    alt: "Grupo de corredores con su medalla",
  },
];

export default function TopGallery() {
  // NOTA: Eliminamos el estado de 'shuffle' para evitar Hydration Errors.
  // Es mejor renderizar estático para PageSpeed y evitar saltos visuales.

  // Duplicamos la lista para el efecto infinito "seamless"
  const belt = useMemo(() => [...IMAGES, ...IMAGES], []);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : IMAGES[activeIndex];
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Navegación con teclado
  useEffect(() => {
    if (!active) return;
    // Focus para accesibilidad
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight")
        setActiveIndex((v) => (v === null ? 0 : (v + 1) % IMAGES.length));
      if (e.key === "ArrowLeft")
        setActiveIndex((v) =>
          v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length
        );
    };
    window.addEventListener("keydown", onKey);

    // Congela la página de detrás: sin esto, al arrastrar sobre la foto se
    // desplaza el fondo y al cerrar apareces en otro sitio del que abriste.
    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = scrollPrevio;
    };
  }, [active]);

  // Performance: Pausar animación si no está en pantalla
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    // IntersectionObserver desconecta la animación CSS cuando el usuario no la ve
    // para ahorrar batería y CPU.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement) {
            entry.target.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          }
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Sin tarjeta: el carrusel va a sangre, de borde a borde. El fondo oscuro
          pasa a la <section> y las fotos ocupan todo el ancho de la pantalla. */}
      <section className="relative w-full overflow-hidden bg-[#230a17] py-5 sm:py-6">
        <div className="relative">
          {/* Gradientes laterales */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#230a17] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#230a17] to-transparent sm:w-20" />

          {/* Carrusel */}
          <div className="overflow-hidden">
            <div
              ref={marqueeRef}
              className="tg-marquee flex gap-4 sm:gap-6"
              style={
                {
                  "--tgDuration": "40s", // Un poco más lento para apreciar las fotos
                  "--tgDurationMobile": "25s",
                } as React.CSSProperties
              }
            >
              {belt.map((img, i) => (
                <button
                  key={i} // Usamos índice porque la lista es estática duplicada
                  type="button"
                  onClick={() => setActiveIndex(i % IMAGES.length)}
                  className="group relative h-[130px] w-[200px] flex-shrink-0 overflow-hidden rounded-[16px] border border-white/10 bg-black transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-[#f7771c] focus:outline-none active:scale-95 sm:h-[170px] sm:w-[260px] md:h-[210px] md:w-[320px]"
                  aria-label={`Ver foto ${img.alt}`}
                >
                  {/* Aquí había un <Image> de Next con `sizes` y `quality={70}`,
                      y un comentario diciendo que así el navegador se bajaba la
                      versión pequeña. No era verdad: con `output: "export"` e
                      `images: { unoptimized: true }` el optimizador de Next no
                      llega a correr, `next/image` pinta un <img> normal con el
                      archivo original y `sizes`/`quality` se quedan de adorno.
                      Se bajaban los 640px para pintarlos a 198.

                      Ahora los anchos los genera scripts/imagenes.mjs y el
                      srcset es de verdad: un teléfono normal se lleva la de
                      400px (17 KB) en vez de la de 640 (47 KB). */}
                  <img
                    src={img.src}
                    srcSet={srcSetDe(img.src)}
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 320px"
                    alt={img.alt}
                    width={640}
                    height={427}
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Overlay y efecto hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f7771c]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-black/30 p-2 backdrop-blur-sm">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <style>{`
              @keyframes tgMarquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .tg-marquee {
                animation: tgMarquee var(--tgDuration, 40s) linear infinite;
                will-change: transform;
              }
              @media (hover: hover) {
                .tg-marquee:hover { animation-play-state: paused; }
              }
              @media (max-width: 640px) {
                .tg-marquee { animation-duration: var(--tgDurationMobile, 25s); }
              }
              @media (prefers-reduced-motion: reduce) {
                .tg-marquee { animation: none; transform: none; }
              }
            `}</style>
        </div>
      </section>

      {/* Modal - Fullscreen.
          Va por portal a <body> y no aquí dentro: <main> lleva `relative z-10`,
          que abre un contexto de apilamiento, y el header es hermano suyo con
          z-50. Estando dentro de <main>, el visor competía como z-10 contra el
          z-50 del header y perdía — por muy alto que le pusiéramos el z-index
          aquí dentro, el header seguía tapándolo. Colgado del body ya juega en
          la misma liga y el 10000 sirve de algo. */}
      {active &&
        createPortal(
          // 10000 y no 9999 para quedar también por encima del botón flotante
          // "Inscribirme", que está en 9999.
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-2 backdrop-blur-md sm:p-4"
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón Cerrar. Iba en bg-white/10, que sobre una foto clara casi
                no se veía: el fondo sólido lo despega de cualquier imagen. */}
              <div className="absolute top-3 right-3 z-50 sm:top-4 sm:right-4">
                <button
                  ref={closeBtnRef}
                  onClick={() => setActiveIndex(null)}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-white/70 bg-black/70 px-4 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all outline-none hover:bg-[#f7771c] focus-visible:ring-2 focus-visible:ring-white active:scale-90 sm:h-14 sm:px-5"
                  aria-label="Cerrar galería"
                >
                  <span className="text-2xl leading-none">×</span>
                  <span className="hidden sm:inline">Cerrar</span>
                </button>
              </div>

              {/* Navegación Desktop. Iban en bg-white/10 translúcido y sobre una
                foto clara no se veían; ahora llevan el degradado de la marca. */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((v) =>
                    v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length
                  );
                }}
                className="absolute top-1/2 left-4 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-gradient-to-r from-[#f7771c] to-[#c51850] text-3xl leading-none font-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95 md:flex"
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((v) =>
                    v === null ? 0 : (v + 1) % IMAGES.length
                  );
                }}
                className="absolute top-1/2 right-4 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-gradient-to-r from-[#f7771c] to-[#c51850] text-3xl leading-none font-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95 md:flex"
                aria-label="Foto siguiente"
              >
                ›
              </button>

              {/* Imagen Principal del Modal */}
              <div className="relative h-[80vh] w-full overflow-hidden rounded-[20px] bg-black/50 shadow-2xl sm:h-[85vh]">
                {/* Aquí sí va el original y sin srcset: el usuario acaba de
                    pedir ver la foto grande, es el único sitio donde los 640px
                    completos se justifican. */}
                <img
                  src={active.src}
                  alt={active.alt}
                  className="absolute inset-0 h-full w-full object-contain"
                  decoding="async"
                />

                {/* Zonas táctiles invisibles para móvil */}
                <div className="absolute inset-0 z-10 flex md:hidden">
                  <div
                    className="h-full w-1/3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex((v) =>
                        v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length
                      );
                    }}
                  ></div>
                  <div
                    className="h-full w-1/3"
                    onClick={() => setActiveIndex(null)}
                  ></div>
                  <div
                    className="h-full w-1/3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex((v) =>
                        v === null ? 0 : (v + 1) % IMAGES.length
                      );
                    }}
                  ></div>
                </div>
              </div>

              {/* Contador */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                {activeIndex !== null ? activeIndex + 1 : 0} / {IMAGES.length}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
