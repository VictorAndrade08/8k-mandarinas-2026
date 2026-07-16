"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image"; // IMPORTANTE: Usamos el componente nativo

type GalleryItem = { src: string; alt: string };

// Fotos oficiales de la carrera, servidas desde /public. Antes esto apuntaba a
// mandarinas.8krutadelasmandarinas.com, un subdominio que ya no resuelve en DNS:
// las 15 imágenes llevaban tiempo saliendo rotas.
const IMAGES: GalleryItem[] = [
  { src: "/fotos/corredores-01.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-02.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-03.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-04.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-05.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-06.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-07.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-08.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-09.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-10.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-11.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-12.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-13.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-14.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-15.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-16.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-17.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-18.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-19.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-20.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-21.jpg", alt: "Grupo de corredores con su medalla" },
  { src: "/fotos/corredores-22.jpg", alt: "Corredores en la salida de Patate" },
  { src: "/fotos/corredores-23.jpg", alt: "Podio de premiación de la carrera" },
  { src: "/fotos/corredores-24.jpg", alt: "Grupo de corredores con su medalla" },
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
      if (e.key === "ArrowRight") setActiveIndex(v => (v === null ? 0 : (v + 1) % IMAGES.length));
      if (e.key === "ArrowLeft") setActiveIndex(v => (v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length));
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
      entries => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement) {
            entry.target.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
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
      <section className="w-full px-3 py-4 md:py-6 flex justify-center bg-gray-50">
        <div className="w-full max-w-7xl">
          {/* Contenedor Principal */}
          <div className="
            relative overflow-hidden 
            rounded-[20px] sm:rounded-[32px] 
            border border-black/5
            bg-[#1a1a1a] 
            shadow-lg
          ">
            {/* Gradientes laterales */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10" />

            {/* Carrusel */}
            <div className="py-5 sm:py-6 overflow-hidden">
              <div
                ref={marqueeRef}
                className="flex gap-4 sm:gap-6 tg-marquee"
                style={
                  {
                    "--tgDuration": "40s", // Un poco más lento para apreciar las fotos
                    "--tgDurationMobile": "25s"
                  } as React.CSSProperties
                }
              >
                {belt.map((img, i) => (
                  <button
                    key={i} // Usamos índice porque la lista es estática duplicada
                    type="button"
                    onClick={() => setActiveIndex(i % IMAGES.length)}
                    className="
                      group relative 
                      w-[200px] sm:w-[260px] md:w-[320px] 
                      h-[130px] sm:h-[170px] md:h-[210px] 
                      flex-shrink-0 
                      overflow-hidden rounded-[16px] 
                      border border-white/10 
                      bg-black 
                      transition-transform active:scale-95 hover:scale-[1.02]
                      focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]
                    "
                    aria-label={`Ver foto ${img.alt}`}
                  >
                    {/* OPTIMIZACIÓN: Next Image con 'fill' y 'sizes' */}
                    {/* 'sizes' le dice al navegador que descargue la versión pequeña, no la original de 2MB */}
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 320px"
                      className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay y efecto hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B1A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full">
                           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
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
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
          >
          <div
            className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón Cerrar. Iba en bg-white/10, que sobre una foto clara casi
                no se veía: el fondo sólido lo despega de cualquier imagen. */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
              <button
                ref={closeBtnRef}
                onClick={() => setActiveIndex(null)}
                className="
                    flex items-center justify-center gap-2
                    h-12 px-4 sm:h-14 sm:px-5
                    rounded-full bg-black/70 hover:bg-[#FF6B1A]
                    backdrop-blur-md border-2 border-white/70
                    text-white font-bold text-sm uppercase tracking-[0.1em]
                    shadow-[0_8px_24px_rgba(0,0,0,0.5)]
                    transition-all active:scale-90
                    outline-none focus-visible:ring-2 focus-visible:ring-white
                "
                aria-label="Cerrar galería"
              >
                <span className="text-2xl leading-none">×</span>
                <span className="hidden sm:inline">Cerrar</span>
              </button>
            </div>

            {/* Navegación Desktop. Iban en bg-white/10 translúcido y sobre una
                foto clara no se veían; ahora llevan el degradado de la marca. */}
            <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length)); }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] hover:scale-110 text-white text-3xl font-black leading-none border-2 border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all active:scale-95 z-20"
                aria-label="Foto anterior"
            >
                ‹
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v + 1) % IMAGES.length)); }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] hover:scale-110 text-white text-3xl font-black leading-none border-2 border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all active:scale-95 z-20"
                aria-label="Foto siguiente"
            >
                ›
            </button>

            {/* Imagen Principal del Modal */}
            <div className="relative w-full h-[80vh] sm:h-[85vh] rounded-[20px] overflow-hidden shadow-2xl bg-black/50">
              {/* OPTIMIZACIÓN: Modal con alta calidad pero optimizado */}
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority // Prioridad alta porque el usuario la acaba de pedir
                quality={85}
              />
              
              {/* Zonas táctiles invisibles para móvil */}
              <div className="md:hidden absolute inset-0 flex z-10">
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v - 1 + IMAGES.length) % IMAGES.length)); }}></div>
                  <div className="w-1/3 h-full" onClick={() => setActiveIndex(null)}></div>
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v + 1) % IMAGES.length)); }}></div>
              </div>
            </div>

            {/* Contador */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-sm font-medium border border-white/10">
                {activeIndex !== null ? activeIndex + 1 : 0} / {IMAGES.length}
            </div>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}