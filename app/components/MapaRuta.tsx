"use client";

import React from "react";

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

export default function MapaRuta() {
  return (
    <section id="ruta" className="flex w-full justify-center px-4 py-4">
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
