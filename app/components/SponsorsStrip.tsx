"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import Image from "next/image"; // IMPORTANTE: Optimización de imágenes
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// Sacados de las capas del arte oficial (myairbridge/FACEBOOK PORTADA.psd) y servidos
// desde /public. Antes esto apuntaba a fotos de la 10K de Ambato alojadas en dominios
// temporales de Hostinger: contenido de otra carrera y un enlace que puede morir solo.
// Los seis primeros vienen del vector .ai incrustado; boho y patate-gardens solo
// existían como píxeles en el PSD, así que van a su tamaño nativo.
const SPONSOR_LOGOS = [
  { src: "/sponsors/vehicentro-sinotruk.webp", alt: "Vehicentro · Sinotruk" },
  { src: "/sponsors/cani.webp", alt: "cani" },
  { src: "/sponsors/nutritec.webp", alt: "Nutritec" },
  { src: "/sponsors/oscus.webp", alt: "OSCUS" },
  { src: "/sponsors/vigop.webp", alt: "VIGOP Eventos" },
  { src: "/sponsors/boho.webp", alt: "BOHO" },
  { src: "/sponsors/prez.webp", alt: "PREZ · Agencia de Growth Marketing" },
  { src: "/sponsors/patate-gardens.webp", alt: "Patate Gardens" },
];

export default function SponsorsStrip() {
  // Orden estable para evitar errores de hidratación y saltos visuales
  const duplicated = useMemo(
    () => [
      ...SPONSOR_LOGOS,
      ...SPONSOR_LOGOS,
      ...SPONSOR_LOGOS,
      ...SPONSOR_LOGOS,
    ],
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationRef = useRef<number>(0);
  const speedRef = useRef(0.4);

  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      if (!isPaused && container) {
        positionRef.current -= speedRef.current * direction;

        // Optimización: Usar offsetWidth es más rápido que scrollWidth en bucles
        const totalWidth = container.scrollWidth;
        const singleSetWidth = totalWidth / 4;

        if (direction === 1) {
          if (positionRef.current <= -singleSetWidth) {
            positionRef.current += singleSetWidth;
          }
        } else {
          if (positionRef.current >= 0) {
            positionRef.current -= singleSetWidth;
          }
        }

        container.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [direction, isPaused]);

  const handleArrowEnter = (newDirection: 1 | -1) => {
    setDirection(newDirection);
    speedRef.current = 2.5;
    setIsPaused(false);
  };

  const handleArrowLeave = () => {
    speedRef.current = 0.4;
  };

  return (
    <section
      className={`relative w-full overflow-hidden bg-white px-4 py-10 font-sans sm:px-6 sm:py-14 md:px-8`}
    >
      {/* Las montañas del arte oficial, ancladas abajo y al 18%: es fondo, no
          ilustración. Ahora a sangre (antes vivían dentro de la tarjeta). Van en
          <div> con background y no en <img> para que no cuenten como contenido. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-bottom bg-no-repeat opacity-[0.18]"
        style={{
          backgroundImage: "url(/fotos/montanas.webp)",
          backgroundSize: "100% auto",
        }}
        aria-hidden="true"
      />
      {/* Sin tarjeta: fondo a sangre, contenido centrado en max-w-7xl. */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Título. z-10 para quedar por encima de las montañas del fondo. */}
        <div className="relative z-10 mb-6 flex items-center justify-center gap-4 sm:mb-8">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#f7771c]/50 sm:w-16"></div>
          {/* "Partners" y no "Parners": llevaba la errata desde el clon. */}
          <p className="text-center font-[family-name:var(--font-titular)] text-[26px] font-black tracking-[0.1em] text-gray-900 uppercase sm:text-[36px]">
            Nuestros <span className="text-[#780030]">Partners</span>
          </p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#f7771c]/50 sm:w-16"></div>
        </div>

        {/* Contenedor Principal. z-10 por encima de las montañas del fondo. */}
        <div className="relative z-10 flex w-full items-center">
          {/* Flecha Izquierda */}
          <div className="absolute left-0 z-20 flex h-full items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-8 pl-2">
            <button
              onMouseEnter={() => handleArrowEnter(-1)}
              onMouseLeave={handleArrowLeave}
              onClick={() => setDirection(-1)}
              // Backticks y no comillas: iba con comillas dobles, así que el
              // ${...} no se interpolaba nunca y se colaba tal cual como texto
              // en el class. De ahí que la flecha saliera siempre gris: los
              // colores del estado activo jamás llegaban a aplicarse.
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-md transition-all active:scale-95 ${
                direction === -1
                  ? "border-[#f7771c] bg-[#f7771c] text-white shadow-[0_6px_18px_rgba(247,119,28,0.5)]"
                  : "border-[#f7771c]/40 bg-white text-[#f7771c] hover:border-[#f7771c] hover:bg-[#f7771c] hover:text-white"
              } `}
              aria-label="Mover a la derecha rápido"
            >
              <CaretLeft size={24} />
            </button>
          </div>

          {/* Área Visible (Viewport) */}
          <div
            className="mx-8 w-full cursor-grab overflow-hidden active:cursor-grabbing sm:mx-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={containerRef}
              className="flex w-max items-center gap-6 will-change-transform sm:gap-10"
            >
              {duplicated.map((logo, i) => (
                <div
                  key={`${logo.src}-${i}`}
                  className="/* Ancho fijo para evitar CLS */ group relative flex h-16 w-[120px] flex-none items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#f7771c]/20 hover:bg-white hover:shadow-lg sm:h-20 sm:w-[160px] sm:px-6 md:h-24"
                >
                  {/* OPTIMIZACIÓN DE IMAGEN */}
                  <div className="relative h-full max-h-12 w-full sm:max-h-14 md:max-h-16">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      className="object-contain opacity-70 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                      sizes="(max-width: 768px) 120px, 160px"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flecha Derecha */}
          <div className="absolute right-0 z-20 flex h-full items-center bg-gradient-to-l from-white via-white/80 to-transparent pr-2 pl-8">
            <button
              onMouseEnter={() => handleArrowEnter(1)}
              onMouseLeave={handleArrowLeave}
              onClick={() => setDirection(1)}
              // Mismo arreglo que la flecha izquierda: iba con comillas dobles
              // y el ${...} no se interpolaba.
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-md transition-all active:scale-95 ${
                direction === 1
                  ? "border-[#f7771c] bg-[#f7771c] text-white shadow-[0_6px_18px_rgba(247,119,28,0.5)]"
                  : "border-[#f7771c]/40 bg-white text-[#f7771c] hover:border-[#f7771c] hover:bg-[#f7771c] hover:text-white"
              } `}
              aria-label="Mover a la izquierda rápido"
            >
              <CaretRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
