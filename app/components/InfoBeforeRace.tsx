"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Users, Package, Trophy, ArrowRight } from "lucide-react";

/**
 * Las cuatro cosas que un corredor pregunta antes de inscribirse, y cada una
 * lleva al artículo del reglamento que la responde.
 *
 * Antes las cuatro tarjetas hacían `alert("Próximamente")` y una de ellas
 * ("Colegiales & juveniles") anunciaba una categoría del 10K de Ambato que en
 * esta carrera no existe. Un botón que no lleva a ningún sitio es peor que no
 * tener botón: el corredor lo pulsa, no pasa nada, y se va.
 */
const ITEMS = [
  {
    title: "La ruta",
    desc: "El recorrido oficial calle por calle: salida en Patate Gardens, 8 km entre los cultivos y llegada al Estadio Municipal.",
    cta: "Ver el recorrido",
    href: "/#ruta",
    icon: MapPin,
  },
  {
    title: "Categorías y precios",
    desc: "Élite Pro 8K, Máster, Leyenda y Especiales. Con la edad que corresponde a cada una y lo que cuesta inscribirse.",
    cta: "Ver categorías",
    href: "/reglamento#art-5",
    icon: Users,
  },
  {
    title: "El kit del corredor",
    desc: "Camiseta oficial, dorsal, chip de cronometraje, medalla y obsequios. Con lo que hay que llevar para retirarlo.",
    cta: "Ver el kit",
    href: "/reglamento#art-7",
    icon: Package,
  },
  {
    title: "Premios",
    desc: "Lo que gana cada categoría, cómo se cobra y el plazo para reclamar si no estás de acuerdo con tu ubicación.",
    cta: "Ver premios",
    href: "/reglamento#art-13",
    icon: Trophy,
  },
];

export default function InfoBeforeRace() {
  return (
    // 4. Inyectamos la variable de fuente CSS
    <section
      className={`relative w-full overflow-hidden bg-[#140309] px-4 py-14 font-sans sm:px-6 sm:py-20 lg:px-8`}
    >
      {/* Sin tarjeta: el fondo va a sangre (de borde a borde) y solo el contenido
          queda centrado en max-w-7xl. Antes esto vivía en una caja redondeada
          flotando sobre un fondo de separación. */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Decoración de fondo optimizada (pointer-events-none para no interferir con clicks) */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#f7771c]/10 blur-[120px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-10 text-center sm:mb-12 md:text-left">
            <h2 className="font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px] md:text-[64px]">
              Todo lo que necesitas <br />
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                saber antes de correr
              </span>
            </h2>
          </div>

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ITEMS.map((it) => (
              <Link
                key={it.title}
                href={it.href}
                className="group relative flex min-h-[280px] flex-col rounded-[24px] border border-white/5 bg-white/5 p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#f7771c]/30 hover:bg-[#f7771c]/10 sm:p-8"
                aria-label={`${it.cta}: ${it.title}`}
              >
                {/* Icono */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-300 group-hover:border-[#f7771c] group-hover:bg-[#f7771c] group-hover:shadow-[0_0_20px_rgba(247,119,28,0.45)]">
                  <it.icon size={24} />
                </div>

                <h3 className="mb-3 font-[family-name:var(--font-titular)] text-[28px] leading-[1] tracking-wide text-white">
                  {it.title}
                </h3>

                <p className="mb-8 text-sm leading-relaxed font-medium text-gray-400 sm:text-base">
                  {it.desc}
                </p>

                {/* Botón de verdad, no un rótulo: ahora lleva a algún sitio, así
                    que tiene que parecer pulsable y medir lo que mide un dedo. */}
                <span className="mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-black tracking-[0.12em] text-white uppercase transition-all group-hover:border-[#f7771c] group-hover:bg-[#f7771c] group-hover:text-white">
                  {it.cta}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
