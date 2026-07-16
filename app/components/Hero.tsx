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
        if (!entrada.isIntersecting) return;
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
    <section className={`w-full px-3 py-6 md:py-8 flex justify-center bg-gray-50 font-sans`}>
      <div
        className="
          relative w-full max-w-7xl
          rounded-[24px] sm:rounded-[40px]
          overflow-hidden
          bg-white
          border border-black/5
          px-5 py-8
          sm:px-8 sm:py-10
          md:px-12 md:py-12
          grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]
          gap-8 lg:gap-12
          shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]
          transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(255,107,26,0.18)]
        "
      >
        {/* 🎬 VIDEO CONTAINER */}
        <div className="relative z-10 flex items-center justify-center order-1 lg:order-none">
          <div
            ref={cajaRef}
            className="
              w-full aspect-video
              rounded-[20px] sm:rounded-[28px]
              overflow-hidden
              bg-black
              shadow-lg
              relative
              group
              cursor-pointer
            "
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
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Oscuro */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                {/* Botón de Play */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                    <svg className="w-6 h-6 sm:w-9 sm:h-9 text-[#FF6B1A] ml-1" fill="currentColor" viewBox="0 0 24 24">
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
                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                controls
                autoPlay
                playsInline
                preload="none"
              />
            )}
          </div>
        </div>

        {/* 🏃‍♂️ CONTENIDO / TEXTO */}
        <div className="relative z-10 flex flex-col justify-center text-center lg:text-left order-2 lg:order-none">
          {/* A 72px el titular partía en cuatro líneas y "Mandarinas" se comía el
              ancho de la columna. Con el peso nuevo del sitio, menos cuerpo se
              lee mejor y cabe en dos. */}
          <h1 className="font-[family-name:var(--font-poppins)] text-[30px] sm:text-[38px] lg:text-[46px] xl:text-[54px] leading-[1] text-black mb-4 sm:mb-5">
            <span className="block tracking-wide">8K Ruta de las Mandarinas</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C]">
              de Patate
            </span>
          </h1>

          <p className="text-[13px] sm:text-sm md:text-base text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0 font-medium font-sans">
            Corre celebrando el <span className="text-black font-semibold">Aniversario de la Ruta de las Mandarinas</span>. La carrera que une a la ciudad en sus calles más emblemáticas.
          </p>

          {/* Sin "Ver Reglamento": el reglamento aún no está aprobado por la
              organización y el enlace se retira hasta que lo esté. */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start font-sans">
            <Link
              href="/inscripcion"
              className="
                inline-flex items-center justify-center px-6 py-3.5
                rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C]
                text-white text-xs sm:text-sm tracking-[0.15em] font-bold uppercase
                shadow-md shadow-[#FF6B1A]/30
                hover:shadow-[#FF6B1A]/50 hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              Inscribirse Ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}