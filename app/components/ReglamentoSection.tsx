"use client";

import Link from "next/link"; // 1. Navegación SPA instantánea
import { Scales, ArrowRight } from "@phosphor-icons/react";

// Configuración de la fuente (Carga eficiente sin bloqueo)
export default function ReglamentoSection() {
  return (
    // 3. Inyectamos la variable de fuente en el contenedor principal
    <section
      id="reglamento"
      className={`relative w-full overflow-hidden bg-[#190611] px-4 py-14 font-sans text-white sm:px-6 sm:py-20 lg:px-8`}
    >
      {/* Sin tarjeta: fondo a sangre, contenido centrado en max-w-7xl. */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        {/* Fondo Decorativo Magenta */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f7771c]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          {/* Icono Principal */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_30px_rgba(247,119,28,0.18)] backdrop-blur-sm">
            <Scales className="h-8 w-8 text-[#f7771c] sm:h-10 sm:w-10" />
          </div>

          {/* Etiqueta */}
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-gray-300 uppercase sm:text-sm">
            Normativa Oficial
          </p>

          {/* Título usando la variable de fuente */}
          <h2 className="mb-6 font-[family-name:var(--font-titular)] text-[36px] leading-[0.95] tracking-wide text-white sm:text-[52px] lg:text-[64px]">
            Reglamento General <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              8K Ruta de las Mandarinas 2026
            </span>
          </h2>

          {/* Descripción */}
          <p className="mb-10 max-w-2xl text-base leading-relaxed font-medium text-gray-400 sm:text-lg">
            Para garantizar una competencia justa y segura, es obligatorio
            conocer las reglas. Aquí encontrarás detalles sobre categorías,
            chips de cronometraje, puntos de hidratación, descalificaciones y
            premiación.
          </p>

          {/* Botones de Acción (Reemplazados <a> por <Link>) */}
          <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/reglamento"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7771c] to-[#c51850] px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase shadow-lg shadow-[#f7771c]/30 transition-all duration-300 hover:-translate-y-1 hover:gap-3 hover:shadow-[#f7771c]/50"
            >
              Leer Reglamento Completo <ArrowRight size={18} />
            </Link>

            <a
              href="https://wa.me/593995102378"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              Preguntas Frecuentes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
