"use client";

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
const MAPA_ESCRITORIO = "/fotos/mapa-ruta.webp";
const MAPA_MOVIL = "/fotos/mapa-ruta-movil.webp";

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
      className="relative flex w-full justify-center overflow-hidden px-4 py-4 lg:py-12"
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
          />
        )}
        {/* El mapa es blanco y el fondo naranja fuerte: sin esta capa oscura en
            medio, el borde de la tarjeta se pierde y las dos cosas compiten. */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="w-full max-w-7xl overflow-hidden rounded-[20px] bg-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] md:rounded-[32px]">
        {/* Las medidas son las reales de cada archivo: si no cuadran, el
            navegador reserva un hueco del tamaño equivocado y la página salta. */}
        <picture className="block h-auto w-full">
          <source
            media="(min-width: 768px)"
            srcSet={MAPA_ESCRITORIO}
            width={1600}
            height={686}
          />
          <img
            src={MAPA_MOVIL}
            alt="Mapa de la carrera 8K Ruta de las Mandarinas. Salida en Patate Gardens a las 08h00 y llegada al Estadio Municipal de Patate, pasando por E. Dávila, H. Torres, G. Moreno, V. Rocafuerte, Naciones Unidas, vía a San Jorge, E. Alfaro, Juan León Mera y Av. Ambato."
            width={640}
            height={746}
            className="h-auto w-full"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
