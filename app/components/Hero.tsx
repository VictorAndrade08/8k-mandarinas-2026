"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VIDEO_SRC, VIDEO_POSTER } from "../lib/carrera";

export default function Hero8K() {
  const [isVideoActive, setIsVideoActive] = useState(false);
  // Arrancado solo, no por el usuario: eso obliga a ir en silencio. Se separa de
  // isVideoActive porque al pulsar play sí queremos sonido.
  const [arrancoSolo, setArrancoSolo] = useState(false);
  const cajaRef = useRef<HTMLDivElement>(null);

  // Autoplay solo en escritorio y solo cuando el vídeo entra en pantalla: son
  // 8 MB, y en móvil se los come el plan de datos de quien quizá ni baja hasta
  // aquí. Va mudo por obligación — ningún navegador deja autoarrancar con sonido
  // sin que el usuario toque antes algo — así que los controles quedan visibles
  // para poder activarlo. Con "reducir movimiento" no arranca: quien lo pide
  // suele hacerlo porque el movimiento le marea o le dispara síntomas.
  useEffect(() => {
    const esEscritorio = window.matchMedia("(min-width: 1024px)").matches;
    const menosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!esEscritorio || menosMovimiento) return;

    const caja = cajaRef.current;
    if (!caja) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        // Puede llegar vacío; sin esta guarda es un crash silencioso dentro del
        // callback del observer.
        if (!entrada?.isIntersecting) return;
        setArrancoSolo(true);
        setIsVideoActive(true);
        observer.disconnect(); // Una vez arrancado, ya no hace falta vigilar.
      },
      { threshold: 0.5 }
    );

    observer.observe(caja);
    return () => observer.disconnect();
  }, []);

  return (
    // Sin tarjeta: el fondo blanco va a sangre y el contenido (vídeo + texto)
    // queda centrado en max-w-7xl.
    <section
      className={`w-full bg-white px-4 py-12 font-sans sm:px-6 sm:py-16 lg:px-8`}
    >
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        {/* 🎬 VIDEO CONTAINER */}
        <div className="relative z-10 order-1 flex items-center justify-center lg:order-none">
          <div
            ref={cajaRef}
            className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-[20px] bg-black shadow-lg sm:rounded-[28px]"
            onClick={() => setIsVideoActive(true)}
            aria-label="Reproducir video promocional"
          >
            {!isVideoActive ? (
              <>
                {/* Póster: un fotograma del propio vídeo, así no hay salto al arrancar */}
                <img
                  src={VIDEO_POSTER}
                  alt="8K Ruta de las Mandarinas — vídeo del recorrido por el valle de Patate"
                  width={1280}
                  height={720}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Oscuro */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/10" />

                {/* Botón de Play */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white sm:h-20 sm:w-20">
                    <svg
                      className="ml-1 h-6 w-6 text-[#FF6B1A] sm:h-9 sm:w-9"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              // preload="none": los 8 MB solo bajan al arrancar el vídeo, no de
              // entrada a todo el que abre la página con datos móviles.
              // El muted va por ref y no como prop: React no siempre refleja
              // `muted` en el DOM, y si el atributo no llega, el navegador ve un
              // autoplay con sonido y lo bloquea — el vídeo se quedaría parado.
              <video
                ref={(el) => {
                  if (el) el.muted = arrancoSolo;
                }}
                className="animate-in fade-in absolute inset-0 h-full w-full object-cover duration-500"
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                controls
                autoPlay
                loop
                playsInline
                preload="none"
              />
            )}
          </div>
        </div>

        {/* 🏃‍♂️ CONTENIDO / TEXTO */}
        <div className="relative z-10 order-2 flex flex-col justify-center text-center lg:order-none lg:text-left">
          {/* A 72px el titular partía en cuatro líneas y "Mandarinas" se comía el
              ancho de la columna. Con el peso nuevo del sitio, menos cuerpo se
              lee mejor y cabe en dos. */}
          <h1 className="mb-4 font-[family-name:var(--font-poppins)] text-[30px] leading-[1] text-black sm:mb-5 sm:text-[38px] lg:text-[46px] xl:text-[54px]">
            <span className="block tracking-wide">
              8K Ruta de las Mandarinas
            </span>
            <span className="block bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] bg-clip-text text-transparent">
              de Patate
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-lg font-sans text-[13px] leading-relaxed font-medium text-gray-600 sm:text-sm md:text-base lg:mx-0">
            Corre celebrando el{" "}
            <span className="font-semibold text-black">
              Aniversario de la Ruta de las Mandarinas
            </span>
            . La carrera que une a la ciudad en sus calles más emblemáticas.
          </p>

          {/* Sin "Ver Reglamento": el reglamento aún no está aprobado por la
              organización y el enlace se retira hasta que lo esté. */}
          <div className="flex flex-col justify-center gap-3 font-sans sm:flex-row lg:justify-start">
            <Link
              href="/inscripcion"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] px-6 py-3.5 text-xs font-bold tracking-[0.15em] text-white uppercase shadow-md shadow-[#FF6B1A]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#FF6B1A]/50 sm:text-sm"
            >
              Inscribirse Ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
