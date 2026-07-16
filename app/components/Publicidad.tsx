"use client";

import React from "react";

// Línea gráfica de julio (nuevaslineasgraficas/), reescalada y comprimida para web:
// el original del banner venía en 3240x1440 sin comprimir y pesaba 59 MB.
// Las dos imágenes que había antes vivían en un dominio temporal de Hostinger y
// devolvían 404: la sección llevaba tiempo mostrando un recuadro vacío.
const DESKTOP_IMAGE = "/fotos/banner-8k.jpg";
const MOBILE_IMAGE = "/fotos/post-8k.jpg";

export default function Publicidad() {
  return (
    <section className="w-full flex justify-center px-4 mt-3 md:mt-5 mb-2 md:mb-3">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[20px] md:rounded-[32px]
          overflow-hidden
          shadow-[0_10px_30px_rgba(0,0,0,0.28)]
          bg-gray-200 
        "
        // bg-gray-200 ayuda a que se vea un cuadro gris sutil mientras carga, mejorando la percepción
      >
        {/* Las medidas son las reales de cada archivo, no estimadas: si no cuadran,
            el navegador reserva un hueco del tamaño equivocado y la página salta al cargar. */}
        <picture className="w-full h-auto block">
          <source
            media="(min-width: 768px)"
            srcSet={DESKTOP_IMAGE}
            width={2000}
            height={889}
          />
          <img
            src={MOBILE_IMAGE}
            alt="8K Ruta de las Mandarinas · Inscripciones abiertas · Valle de Patate · 29 de agosto · Salida Patate Gardens · Preventa $20"
            width={1100}
            height={1281}
            className="w-full h-auto"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}