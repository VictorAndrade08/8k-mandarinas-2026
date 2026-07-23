"use client";

import Link from "next/link";
import { srcSetDe } from "../lib/imagen";
import {
  MapPin,
  Users,
  Package,
  Trophy,
  ArrowRight,
} from "@phosphor-icons/react";

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
    href: "/ruta",
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
      {/* FOTO DE FONDO. Es de la carrera de verdad, de la edición anterior.
          Encima va una capa oscura al 88%: sin ella el texto blanco cae sobre
          zonas claras de la foto y se pierde. El contraste se mide sobre la
          parte MÁS CLARA de la imagen, no sobre la media
          (docs/100-CONSEJOS.md, consejo 84). */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/ilustraciones/subida.webp"
          srcSet={srcSetDe("/ilustraciones/subida.webp")}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#140309]/88" />
      </div>

      {/* Sin tarjeta: el fondo va a sangre (de borde a borde) y solo el contenido
          queda centrado en max-w-7xl. Antes esto vivía en una caja redondeada
          flotando sobre un fondo de separación. */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Decoración de fondo optimizada (pointer-events-none para no interferir con clicks) */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#f7771c]/10 blur-[120px]" />

        <div className="relative z-10">
          {/* Titular a la izquierda y no centrado. El segundo renglón iba con un
              degradado de blanco a gris recortado sobre el texto: es el mismo
              efecto que se repetía en otras tres secciones, y un gris apagado
              como remate lee a plantilla. Va en naranja de marca. */}
          <h2 className="mb-10 max-w-3xl font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:mb-14 sm:text-[52px] md:text-[64px]">
            Todo lo que necesitas <br />
            <span className="text-[#f7771c]">saber antes de correr</span>
          </h2>

          {/* Una grande y tres pequeñas, no cuatro iguales en fila. Cuatro
              tarjetas del mismo tamaño, con el mismo icono en la misma esquina y
              el mismo botón abajo, es la rejilla perfecta que delata que nadie
              decidió qué importa más (docs/30-REGLAS-ANTI-IA.md, reglas 8, 23 y
              34). Aquí importa la ruta: es lo que todo el mundo pregunta primero,
              así que ocupa el doble. */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:grid-rows-3">
            {ITEMS.map((it, i) => {
              const destacada = i === 0;
              return (
                <Link
                  key={it.title}
                  href={it.href}
                  aria-label={`${it.cta}: ${it.title}`}
                  className={`group relative isolate flex flex-col overflow-hidden border border-white/10 bg-white/[0.04] text-left transition-colors duration-200 hover:border-[#f7771c]/40 hover:bg-[#f7771c]/10 ${
                    destacada
                      ? "justify-end rounded-[18px] p-7 sm:p-9 lg:col-span-2 lg:row-span-3"
                      : "rounded-[10px] p-5 sm:p-6"
                  }`}
                >
                  {/* La destacada lleva la ilustración de la cinta de la ruta
                      de fondo (z negativo dentro del isolate: pinta sobre el
                      fondo de la tarjeta pero bajo el texto). Con el degradado
                      el texto de abajo conserva su contraste. */}
                  {destacada && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10"
                    >
                      {/* lazy OBLIGATORIO: sin él, Next le genera un preload
                          automático en el <head> y estos 124 KB compiten
                          contra el logo del hero en la ventana crítica del
                          LCP (docs/100-MOVIL.md, consejo #10). */}
                      <img
                        src="/ilustraciones/ruta-cinta.webp"
                        srcSet={srcSetDe("/ilustraciones/ruta-cinta.webp")}
                        sizes="(max-width: 1024px) 100vw, 720px"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top opacity-50 transition-opacity duration-300 group-hover:opacity-65"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#140309] via-[#140309]/55 to-transparent" />
                    </span>
                  )}
                  <div
                    className={`flex items-center justify-center text-[#f7771c] transition-colors group-hover:text-white ${
                      destacada ? "mb-5 h-14 w-14" : "mb-3 h-9 w-9"
                    }`}
                  >
                    {/* La destacada lleva el icono relleno y grande; las otras,
                        de línea y pequeño. Mismo set, distinto peso: así se nota
                        cuál manda sin tener que leer nada. */}
                    <it.icon
                      size={destacada ? 44 : 26}
                      weight={destacada ? "fill" : "regular"}
                    />
                  </div>

                  <h3
                    className={`mb-2 font-[family-name:var(--font-titular)] leading-[1] tracking-wide text-white ${
                      destacada ? "text-[34px] sm:text-[44px]" : "text-[22px]"
                    }`}
                  >
                    {it.title}
                  </h3>

                  <p
                    className={`leading-relaxed text-gray-400 ${
                      destacada
                        ? "mb-7 max-w-md text-base sm:text-lg"
                        : "mb-5 text-sm"
                    }`}
                  >
                    {it.desc}
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 self-start font-bold tracking-[0.1em] uppercase transition-colors ${
                      destacada
                        ? "min-h-[48px] rounded-full bg-[#f7771c] px-6 text-sm text-white group-hover:bg-white group-hover:text-[#780030]"
                        : "mt-auto text-xs text-white/60 group-hover:text-[#f7771c]"
                    }`}
                  >
                    {it.cta}
                    <ArrowRight
                      size={destacada ? 16 : 13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
