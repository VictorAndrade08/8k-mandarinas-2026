"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import Image from "next/image"; // IMPORTANTE: Optimización de imágenes
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// Sacados de las capas del arte oficial (myairbridge/FACEBOOK PORTADA.psd) y servidos
// desde /public. Antes esto apuntaba a fotos de la 10K de Ambato alojadas en dominios
// temporales de Hostinger: contenido de otra carrera y un enlace que puede morir solo.
// Salen del vector .ai incrustado. El de boho solo existía en el PSD como un
// bitmap de 165x35, y se pintaba a más de 500 de ancho: salía borroso. Se
// vectorizó TRAZANDO ese original con potrace: el contorno es el del logo real,
// no está redibujado ni generado. Ahora es un SVG y se ve nítido a cualquier
// tamaño.
//
// El trazado lleva un desenfoque suave antes de binarizar. Sin él salían muescas
// en la base de la B y en las uniones de la H — el escalonado que arrastra un
// archivo de 165px. Un trazado reproduce lo que hay; no recupera lo que no está,
// así que lo bueno de verdad sería el .svg original de la marca.
//
// Los tres últimos llegaron sueltos y se prepararon a mano: recortados al
// contenido y con el fondo a transparente. El de Full Fun Travel venía en blanco
// sobre azul marino y se recoloreó al azul del propio logo — un rectángulo azul
// dentro de una tarjeta clara desentonaba con los demás, que son marca oscura
// sobre nada.
const SPONSOR_LOGOS = [
  { src: "/sponsors/vehicentro-sinotruk.webp", alt: "Vehicentro · Sinotruk" },
  {
    src: "/sponsors/oscus-coop.webp",
    alt: "OSCUS · Cooperativa de Ahorro y Crédito",
  },
  { src: "/sponsors/vigop.webp", alt: "VIGOP Eventos" },
  { src: "/sponsors/boho.svg", alt: "BOHO" },
  { src: "/sponsors/prez.webp", alt: "PREZ · Agencia de Growth Marketing" },
  { src: "/sponsors/full-fun-travel-2.webp", alt: "Full Fun Travel" },
  { src: "/sponsors/mokenla.webp", alt: "Mokenla" },
  { src: "/sponsors/sweaden.webp", alt: "Sweaden Compañía de Seguros" },
  { src: "/sponsors/neurovitalfit.webp", alt: "NeuroVitalFit" },
  // Llegó suelto (PNG negro sobre blanco): recortado al contenido y con el
  // blanco a transparente, como los demás, para que la cinta lo pinte en
  // gris y a color al pasar por encima.
  { src: "/sponsors/matrix.webp", alt: "Matrix Training Center" },
];

export default function SponsorsStrip() {
  // El orden cambia en cada visita para que ninguna marca esté siempre la
  // primera ni siempre la última.
  //
  // Pero NO se puede barajar durante el render: el HTML lo genera el build una
  // sola vez, y si el navegador pinta otro orden distinto React se queja de
  // hidratación y vuelve a dibujar la cinta entera. Así que se arranca con el
  // orden del archivo —el mismo que trae el HTML— y se baraja justo después de
  // montar, cuando ya no hay nada que cuadrar.
  const [orden, setOrden] = useState(SPONSOR_LOGOS);

  useEffect(() => {
    const mezcla = [...SPONSOR_LOGOS];
    // Fisher-Yates. Un sort(() => Math.random() - 0.5) parece lo mismo pero no
    // reparte igual: deja las posiciones sesgadas según el algoritmo de orden
    // que use el navegador.
    for (let i = mezcla.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // El intercambio va con variables y no desestructurando porque el
      // proyecto compila con noUncheckedIndexedAccess: para TypeScript,
      // mezcla[i] puede ser undefined aunque aquí nunca lo sea.
      const a = mezcla[i];
      const b = mezcla[j];
      if (a && b) {
        mezcla[i] = b;
        mezcla[j] = a;
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrden(mezcla);
  }, []);

  // Cuatro copias seguidas: la cinta gira en bucle y necesita material de sobra
  // para que nunca se vea el hueco del final.
  const duplicated = useMemo(
    () => [...orden, ...orden, ...orden, ...orden],
    [orden]
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
      {/* La clase `montanas-fondo` vive en globals.css y no aquí, en un style
          inline, porque hace falta una media query: el archivo original mide
          1600px de ancho y pesa 54 KB — era la imagen más pesada que se bajaba
          un teléfono, para pintarla a 390px y al 18% de opacidad. En pantallas
          pequeñas se sirve la versión de 400px, que son 8 KB. */}
      <div
        className="montanas-fondo pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-bottom bg-no-repeat opacity-[0.18]"
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

        {/* EN MÓVIL, REJILLA COMPLETA: el carrusel enseñaba 2 logos y escondía
            8 — un patrocinador pagó por salir, no por pasar de refilón. En
            escritorio la cinta funciona porque caben 5 a la vez. */}
        <ul className="relative z-10 grid grid-cols-2 gap-3 md:hidden">
          {SPONSOR_LOGOS.map((logo) => (
            <li
              key={logo.src}
              className="flex h-24 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={640}
                height={320}
                // object-contain sin recorte: un scale uniforme cortaba los
                // logos anchos (Vehicentro, OSCUS, VIGOR ya llenan el ancho de
                // la tarjeta). La tarjeta se hizo más alta (h-24) para darles
                // más aire; cada logo se ve entero.
                className="h-full w-full object-contain opacity-80"
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>

        {/* Contenedor Principal (solo escritorio). z-10 sobre las montañas. */}
        <div className="relative z-10 hidden w-full items-center md:flex">
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
                  : "border-[#f7771c]/40 bg-white text-[#b83f00] hover:border-[#b83f00] hover:bg-[#b83f00] hover:text-white"
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
                  className="group relative flex h-24 w-[192px] flex-none items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[#f7771c]/20 hover:bg-white hover:shadow-lg sm:h-28 sm:w-[224px] md:h-32 md:w-[256px]"
                >
                  {/* OPTIMIZACIÓN DE IMAGEN */}
                  <div className="relative h-full w-full">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      className="object-contain opacity-70 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
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
                  : "border-[#f7771c]/40 bg-white text-[#b83f00] hover:border-[#b83f00] hover:bg-[#b83f00] hover:text-white"
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
