"use client";

import React from "react";
import { Trophy, ArrowRight } from "lucide-react";

// 2. Configuración de fuente (Sin bloqueo)
export default function FeaturedStories() {
  return (
    // 3. Inyección de variable de fuente
    <section
      className={`relative w-full overflow-hidden bg-[#190611] px-4 py-14 font-sans text-white sm:px-6 sm:py-20 lg:px-8`}
    >
      {/* Sin tarjeta: fondo a sangre, contenido centrado en max-w-7xl. */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Fondo decorativo */}
        <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#f7771c]/5 blur-[100px]" />

        <div className="relative z-10">
          {/* CABECERA */}
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <h2 className="font-[family-name:var(--font-poppins)] text-[32px] leading-[0.95] tracking-wide text-white sm:text-[48px] lg:text-[58px]">
              Noticias &amp; <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Historias Destacadas
              </span>
            </h2>

            {/* Paginación Visual OPTIMIZADA */}
            {/* CORRECCIÓN A11Y: Cambiamos <button> por <div> porque están dentro de aria-hidden="true".
                Esto evita que el teclado haga foco en elementos invisibles para el lector de pantalla. */}
            <div
              className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex"
              aria-hidden="true"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-[#f7771c] shadow-[0_0_10px_#f7771c]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20 transition-colors hover:bg-white/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20 transition-colors hover:bg-white/50" />
            </div>
          </div>

          {/* TARJETA PRINCIPAL */}
          <article className="group flex flex-col items-stretch gap-8 rounded-[24px] border border-white/5 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#f7771c]/20 hover:bg-[#f7771c]/5 hover:shadow-[0_20px_50px_-20px_rgba(247,119,28,0.18)] sm:rounded-[40px] sm:p-10 md:flex-row md:gap-12 md:p-12">
            {/* TEXTO */}
            <div className="order-2 flex flex-1 flex-col justify-center md:order-1">
              {/* Sin fecha: decía "Diciembre 2025", que es de la edición
                  anterior. Poner una falsa es peor que no poner ninguna. */}

              <h3 className="mb-5 font-[family-name:var(--font-poppins)] text-[28px] leading-[1] tracking-wide text-white transition-colors group-hover:text-white sm:text-[42px]">
                {/* Ni "nocturna" ni "la independencia de la ciudad": las dos
                    eran del 10K de Ambato. Esta carrera sale a las 08h00 y
                    celebra la Ruta de las Mandarinas. */}
                “La mejor carrera del valle”
              </h3>

              <p className="mb-8 max-w-xl text-base leading-relaxed font-medium text-gray-400 sm:text-lg">
                Conoce la experiencia de quienes ya corrieron la 8K Ruta de las
                Mandarinas: la organización, el ambiente y lo que tiene de único
                correr entre los cultivos de Patate con el Tungurahua de fondo.
              </p>

              <div>
                <button
                  className="group/btn inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-[#f7771c]"
                  aria-label="Leer historia completa sobre la experiencia de los corredores"
                >
                  Leer historia completa
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </button>
              </div>
            </div>

            {/* ÍCONO / IMAGEN */}
            <div
              className="relative order-1 flex min-h-[220px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-colors group-hover:border-[#f7771c]/30 md:order-2 md:min-h-auto md:w-[320px]"
              aria-hidden="true"
            >
              {/* Brillo interior al hover */}
              <div className="absolute inset-0 bg-[#f7771c]/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

              <Trophy
                className="relative z-10 h-20 w-20 text-white/50 transition-all duration-300 group-hover:scale-110 group-hover:text-[#f7771c] sm:h-24 sm:w-24"
                strokeWidth={1.5}
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
