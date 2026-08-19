"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * El mapa oficial del recorrido.
 *
 * Es lo que más se preguntaba y lo único que no estaba: hasta ahora la tarjeta
 * "La Ruta de la Carrera" de la home hacía `alert("Próximamente")` y el enlace
 * "Ruta" del header llevaba al artículo 4 del reglamento, que describe el
 * trazado en palabras. Un mapa lo cuenta mejor que tres párrafos.
 *
 * Las calles del arte coinciden con el oficio N°0084 sellado por el GAD: salida
 * en Patate Gardens, E. Dávila, H. Torres, G. Moreno, V. Rocafuerte, N. Unidas,
 * vía a San Jorge, E. Alfaro, Juan León Mera, Av. Ambato y llegada al Estadio
 * Municipal.
 */
// El arte OFICIAL del mapa (2026), el mismo que en /ruta. Reemplaza al mapa
// anterior; una sola imagen para las dos, servida escalada.
const MAPA_ESCRITORIO = "/fotos/mapa-carrera-oficial.webp";
const MAPA_MOVIL = "/fotos/mapa-carrera-oficial.webp";

/**
 * Fondo animado en los colores de la marca. Es una animación gráfica —degradado
 * y montañas en línea—, no metraje: no finge ser Patate, que para eso ya está el
 * promo de verdad grabado en el valle.
 */
const VIDEO_FONDO = "/video/fondo-marca.mp4";
const VIDEO_POSTER = "/video/fondo-marca-poster.webp";

export default function MapaRuta() {
  // Solo en escritorio. En móvil va el póster y punto: son 284 KB que no tiene
  // por qué descargarse alguien con datos en Patate, y detrás de un mapa opaco
  // no se vería casi nada. Se decide en el cliente y no con CSS porque un
  // <video> oculto con `hidden` se descarga igual.
  const [conVideo, setConVideo] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(min-width: 1024px)").matches) setConVideo(true);
  }, []);

  return (
    <section
      id="ruta"
      className="relative flex w-full flex-col items-center overflow-hidden px-4 py-8 lg:py-14"
    >
      {/* CAPA DE FONDO */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {conVideo ? (
          <video
            className="h-full w-full object-cover"
            src={VIDEO_FONDO}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
          />
        ) : (
          <img
            className="h-full w-full object-cover"
            src={VIDEO_POSTER}
            alt=""
            // lazy: esta sección va bajo el pliegue; sin el lazy, Next le
            // genera un preload que compite con el LCP del hero.
            loading="lazy"
            decoding="async"
          />
        )}
        {/* El mapa es blanco y el fondo naranja fuerte: sin esta capa oscura en
            medio, el borde de la tarjeta se pierde y las dos cosas compiten. */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* La frase distintiva de la carrera (notas de identidad): no podría
          copiarse para una carrera de otra ciudad — eso es lo que la hace
          propia. Va aquí porque presenta exactamente lo que enseña el mapa. */}
      <div className="mb-6 w-full max-w-7xl text-center sm:mb-8">
        <h2 className="font-[family-name:var(--font-titular)] text-[30px] leading-[0.95] tracking-wide text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[42px]">
          Una ruta que solo puede{" "}
          <span className="text-[#ffc53d]">ocurrir en Patate</span>
        </h2>
        <p className="font-barlow mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          8 kilómetros que salen de Patate Gardens, pasan por calles
          emblemáticas y zonas rurales entre cultivos de mandarinas, y terminan
          en el Estadio Municipal.
        </p>
        {/* La línea que se dibuja: el recorrido como elemento propio de la
            marca, en los colores del flyer. CSS puro (scaleX). */}
        <div
          aria-hidden="true"
          className="linea-ruta mx-auto mt-5 h-1 w-44 rounded-full bg-gradient-to-r from-[#f7771c] via-[#ee374b] to-[#c51850]"
        />
      </div>

      {/* El mapa entero vive en /ruta, con el recorrido tramo por tramo. Aquí
          se enseña como adelanto clicable y no a tamaño completo: estaba
          duplicado en las dos páginas, y en el home a pantalla completa hacía
          que la página no acabara nunca. */}
      <Link
        href="/ruta"
        className="group block w-full max-w-7xl overflow-hidden rounded-[20px] bg-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-[1.005] md:rounded-[32px]"
        aria-label="Ver el recorrido completo, tramo por tramo"
      >
        <div className="relative">
          <picture className="block h-auto w-full">
            <source
              media="(min-width: 768px)"
              srcSet={MAPA_ESCRITORIO}
              width={1600}
              height={1128}
            />
            <img
              src={MAPA_MOVIL}
              alt="Mapa de la carrera 8K Ruta de las Mandarinas: salida en Patate Gardens y llegada al Estadio Municipal de Patate."
              width={1600}
              height={1128}
              // Sin recorte. Se probó con max-h + object-cover y la tijera se
              // comía el logo por arriba y las montañas por abajo: un mapa al
              // que le faltan trozos parece un error, no un adelanto. Entero
              // mide 455px en móvil y 549 en escritorio — cabe.
              className="h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          </picture>
          {/* La invitación va sobre el propio mapa, abajo, con su fondo: el mapa
              es claro y un texto suelto encima no se leería. */}
          <span className="font-barlow absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent px-5 pt-10 pb-4 text-sm font-bold tracking-[0.12em] text-white uppercase sm:px-7">
            El recorrido tramo por tramo
            <span className="rounded-full bg-[#b83f00] px-4 py-2 text-xs transition-colors group-hover:bg-white group-hover:text-[#780030]">
              Ver la ruta →
            </span>
          </span>
        </div>
      </Link>
    </section>
  );
}
