"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { srcSetDe } from "../lib/imagen";

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
            <h2 className="font-[family-name:var(--font-titular)] text-[32px] leading-[0.95] tracking-wide text-white sm:text-[48px] lg:text-[58px]">
              {/* Se llamaba "Noticias & Historias Destacadas" y no hay ni
                  noticias ni historias: era una sola tarjeta con puntos de
                  paginación que prometían más. Ahora dice lo que de verdad
                  enseña. El degradado de blanco a gris del segundo renglón se
                  cambia por naranja, como en el resto de secciones. */}
              Así fue <br className="sm:hidden" />
              <span className="text-[#f7771c]">la edición anterior</span>
            </h2>
          </div>

          {/* TARJETA PRINCIPAL */}
          <article className="group flex flex-col items-stretch gap-8 rounded-[24px] border border-white/5 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#f7771c]/20 hover:bg-[#f7771c]/5 hover:shadow-[0_20px_50px_-20px_rgba(247,119,28,0.18)] sm:rounded-[40px] sm:p-10 md:flex-row md:gap-12 md:p-12">
            {/* TEXTO */}
            <div className="order-2 flex flex-1 flex-col justify-center md:order-1">
              {/* Sin fecha: decía "Diciembre 2025", que es de la edición
                  anterior. Poner una falsa es peor que no poner ninguna. */}

              <h3 className="mb-5 font-[family-name:var(--font-titular)] text-[28px] leading-[1] tracking-wide text-white sm:text-[42px]">
                {/* Aquí había un “La mejor carrera del valle” entrecomillado y
                    sin autor. Una frase entre comillas es un testimonio, y un
                    testimonio que nadie dijo es exactamente lo que la gente
                    detecta (docs/30-REGLAS-ANTI-IA.md, regla 69). */}
                Corredores de verdad, en las calles de Patate
              </h3>

              <p className="mb-8 max-w-xl text-base leading-relaxed font-medium text-gray-400 sm:text-lg">
                Las fotos de esta página son de la edición anterior: la salida
                desde Patate Gardens, los 8 km entre los cultivos con el
                Tungurahua de fondo y la llegada al Estadio Municipal. Los
                nombres de quienes subieron al podio están publicados.
              </p>

              {/* Un enlace que lleva a algo que existe de verdad: el cuadro de
                  ganadores, con nombre y apellido de cada uno. Antes había un
                  <button> de "Leer historia completa" sin onClick ni href: se
                  pulsaba y no pasaba nada. */}
              <div>
                <Link
                  href="/ganadores"
                  className="group/btn inline-flex min-h-[48px] items-center gap-2 self-start text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-[#f7771c]"
                >
                  Ver el cuadro de ganadores
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Aquí había un icono de trofeo de relleno dentro de una caja
                vacía. Es una sección que habla de la experiencia de quien ya
                corrió: enseñarla con un pictograma en vez de con la gente es
                desaprovechar lo único que ningún competidor puede copiarte
                (docs/AUTENTICIDAD-LOCAL.md, consejo 3). */}
            <div className="relative order-1 min-h-[220px] w-full overflow-hidden rounded-[20px] border border-white/10 md:order-2 md:min-h-auto md:w-[320px]">
              <img
                src="/fotos/corredores-15.webp"
                srcSet={srcSetDe("/fotos/corredores-15.webp")}
                sizes="(max-width: 768px) 100vw, 320px"
                alt="Corredores de la edición anterior con su medalla, en Patate"
                width={640}
                height={376}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {/* Degradado por abajo: sin él la foto choca de golpe con el borde
                  de la tarjeta y la sección se parte en dos. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
