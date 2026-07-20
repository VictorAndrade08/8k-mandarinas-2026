"use client";

import React from "react";
import { Map, Users, Package, PartyPopper, ArrowRight } from "lucide-react";

// 2. Configurar la fuente (Carga eficiente sin bloqueo)
const CARDS = [
  {
    Icon: Map,
    title: "La Ruta de la Carrera",
    text: "Conoce cada tramo del recorrido por las calles de Patate.",
    cta: "Ver mapa 3D",
  },
  {
    Icon: Users,
    title: "Categorías disponibles",
    // Las cuatro reales del artículo 5 del reglamento. Antes listaba Juvenil,
    // Senior, Supermaster, Vilcabambas y Colegial: las del 10K de Ambato, de
    // donde se clonó este proyecto. Ninguna de esas existe en esta carrera.
    text: "Élite Pro 8K, Máster, Leyenda y Especiales / Capacidades Diferentes.",
    cta: "Ver categorías",
  },
  {
    Icon: Package,
    title: "El mejor kit deportivo",
    text: "Camiseta oficial, medalla, chip, medias, Sporty bag e hidratación.",
    cta: "Ver kit completo",
  },
  {
    Icon: PartyPopper,
    title: "Fiesta, ciudad & ambiente",
    text: "La carrera se integra al aniversario de la Ruta de las Mandarinas: ciudad, ambiente y celebración.",
    cta: "Ver galería",
  },
];

export default function ExperienceSection() {
  const handleCTA = () => {
    alert("🚀 ¡Próximamente disponible! Estamos preparando esta sección.");
  };

  return (
    // 3. Inyectar la variable de fuente en el contenedor principal
    <section
      className={`relative w-full overflow-hidden bg-[#190611] px-4 py-14 font-sans text-white sm:px-6 sm:py-20 lg:px-8`}
    >
      {/* Sin tarjeta: fondo a sangre, contenido centrado en max-w-7xl. */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Luces de fondo decorativas */}
        <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/2 rounded-full bg-[#f7771c]/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="relative z-10">
          {/* Título de Sección */}
          <h2 className="mb-10 text-center font-[family-name:var(--font-poppins)] text-[32px] leading-[0.95] sm:mb-14 sm:text-[48px] md:text-left lg:text-[58px]">
            Explora la experiencia <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              8K Ruta de las Mandarinas
            </span>
          </h2>

          {/* Grid de Tarjetas */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {CARDS.map(({ Icon, title, text, cta }) => (
              <button
                key={title}
                onClick={handleCTA}
                // 4. Accesibilidad mejorada para lectores de pantalla
                aria-label={`Ver más detalles sobre ${title}`}
                className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-[24px] border border-white/5 bg-white/5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#f7771c]/30 hover:bg-[#f7771c]/10"
              >
                {/* Cabecera Icono */}
                <div className="flex h-[120px] items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent transition-colors duration-300 group-hover:from-[#f7771c]/20 group-hover:to-transparent">
                  <Icon className="h-12 w-12 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <h3 className="mb-3 font-[family-name:var(--font-poppins)] text-[24px] tracking-wide text-white transition-colors group-hover:text-[#f7771c] sm:text-[28px]">
                      {title}
                    </h3>

                    <p className="text-sm leading-relaxed font-medium text-gray-400">
                      {text}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase transition-colors group-hover:text-white">
                    {cta}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
