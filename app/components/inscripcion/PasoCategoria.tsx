"use client";

import { ClockCountdown } from "@phosphor-icons/react";
import type { Category } from "./tipos";

/**
 * Paso 1: elegir categoría.
 *
 * Hace una sola cosa —enseñar las opciones y avisar de cuál se eligió— así que
 * no necesita saber nada del resto del formulario: recibe la lista y devuelve la
 * elección. Es lo que lo hace mirable de un vistazo.
 *
 * No hay botón de "siguiente" a propósito: elegir categoría YA es la decisión,
 * y pedir un clic extra para confirmarla solo añade un paso que nadie quiere.
 */
export function PasoCategoria({
  categorias,
  onElegir,
}: {
  categorias: Category[];
  onElegir: (categoria: Category) => void;
}) {
  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <h1 className="font-bebas mb-4 text-3xl font-bold md:text-5xl">
        Selecciona tu Categoría
      </h1>

      <div className="font-barlow mb-5 flex items-start gap-3 rounded-xl border border-[#ffc53d]/40 bg-[#ffc53d]/10 px-4 py-3.5">
        <ClockCountdown size={20} className="mt-0.5 shrink-0 text-[#ffc53d]" />
        <p className="text-base leading-relaxed text-yellow-50 md:text-lg">
          <strong className="text-white">Precios de preventa.</strong> Suben
          cuando se cierre la preventa, así que inscribirte hoy te sale más
          barato.
        </p>
      </div>

      <p className="font-barlow mb-6 text-lg leading-relaxed text-gray-300 md:mb-8 md:text-xl">
        Elige en cuál vas a competir. Son 2 minutos y no pedimos tarjeta: pagas
        por transferencia o QR y subes el comprobante.
      </p>

      {/* 2 columnas solo en lg: a partir de md aparece la barra lateral y esta
      columna baja a 2/3 del ancho, así que con sm:grid-cols-2 las tarjetas
      quedaban a ~190px y el precio se montaba sobre el título. */}
      <div className="font-barlow grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
        {categorias.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => onElegir(cat)}
            className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#200815] p-6 text-left shadow-md transition-all duration-200 outline-none hover:border-[#f7771c] hover:bg-[#331023] focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] active:scale-[0.98] md:p-7"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              {/* min-w-0: sin esto el nombre no puede encogerse y empuja al
              precio fuera de la tarjeta en anchos estrechos. */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="shrink-0 rounded-lg bg-white/5 p-2 text-gray-400 transition-colors group-hover:bg-[#f7771c]/20 group-hover:text-[#f7771c]">
                  {cat.icon}
                </div>
                <span className="min-w-0 text-xl leading-tight font-bold text-white transition-colors group-hover:text-[#f7771c] md:text-2xl">
                  {cat.name}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="block rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-base font-bold text-white md:text-lg">
                  ${cat.price}
                </span>
                <span className="mt-1 block text-[10px] font-bold tracking-widest text-[#ffc53d] uppercase">
                  Preventa
                </span>
              </div>
            </div>
            <p className="text-base text-gray-400 group-hover:text-gray-300 md:text-lg">
              {cat.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
