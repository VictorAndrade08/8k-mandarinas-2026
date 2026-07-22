"use client";

import Link from "next/link";
import { srcSetDe } from "../lib/imagen";
import { Scales, ArrowRight } from "@phosphor-icons/react";

// Configuración de la fuente (Carga eficiente sin bloqueo)
export default function ReglamentoSection() {
  return (
    // 3. Inyectamos la variable de fuente en el contenedor principal
    <section
      id="reglamento"
      className={`relative w-full overflow-hidden bg-[#190611] px-4 py-14 font-sans text-white sm:px-6 sm:py-20 lg:px-8`}
    >
      {/* FOTO DE FONDO. Es de la carrera de verdad, de la edición anterior.
          Encima va una capa oscura al 90%: sin ella el texto blanco cae sobre
          zonas claras de la foto y se pierde. El contraste se mide sobre la
          parte MÁS CLARA de la imagen, no sobre la media
          (docs/100-CONSEJOS.md, consejo 84). */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/ilustraciones/casco.webp"
          srcSet={srcSetDe("/ilustraciones/casco.webp")}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#190611]/90" />
      </div>

      {/* Sin tarjeta: fondo a sangre, contenido centrado en max-w-7xl. */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        {/* Fondo Decorativo Magenta */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f7771c]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          {/* Icono Principal */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_4px_12px_rgba(20,3,9,0.22)] backdrop-blur-sm">
            <Scales className="h-8 w-8 text-[#f7771c] sm:h-10 sm:w-10" />
          </div>

          {/* Etiqueta */}
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-gray-300 uppercase sm:text-sm">
            Normativa Oficial
          </p>

          {/* Título usando la variable de fuente */}
          <h2 className="mb-6 font-[family-name:var(--font-titular)] text-[36px] leading-[0.95] tracking-wide text-white sm:text-[52px] lg:text-[64px]">
            Reglamento General <br className="hidden sm:block" />
            <span className="text-[#f7771c]">
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

            {/* Antes este botón decía "Preguntas Frecuentes" pero abría
                WhatsApp: prometía una cosa y daba otra. Ahora sí hay FAQ de
                verdad en /informacion (y el home ya tiene su banda de
                WhatsApp más arriba). */}
            <Link
              href="/informacion#preguntas"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              Preguntas Frecuentes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
