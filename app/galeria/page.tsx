import type { Metadata } from "next";
import { srcSetDe } from "../lib/imagen";

export const metadata: Metadata = {
  title: "Galería · 8K Ruta de las Mandarinas",
  description:
    "Fotos reales de la edición anterior de la 8K Ruta de las Mandarinas: la salida, la ruta entre cultivos, los podios y los corredores en Patate.",
};

// Galería editorial (notas 18 y 20): mosaico con ritmo — algunas fotos a
// doble ancho — en vez de 24 tarjetas idénticas. Miniaturas con lazy y
// srcset; la versión -960 (reescalada con lanczos + enfoque) entra en retina
// y es la que abre el enlace. Cero JavaScript: pies de foto y mosaico son CSS.
const FOTOS = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/fotos/corredores-${n}.webp`,
    alt: `Edición anterior de la 8K en Patate — corredores y premiación (foto ${i + 1} de 24)`,
    // Ritmo editorial: una destacada a doble ancho cada tantas fotos.
    destacada: i % 7 === 0,
  };
});

export default function GaleriaPage() {
  return (
    <section className="w-full bg-[#140309] px-4 pt-8 pb-24 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Cabecera editorial en dos columnas: el titular manda a la
            izquierda; la descripción y el conteo equilibran la derecha. */}
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
              Fotos de la edición anterior
            </p>
            <h1 className="max-w-3xl font-(family-name:--font-titular) text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px]">
              Así se corre <span className="text-[#f7771c]">Patate</span>
            </h1>
            {/* La línea del recorrido, la firma de la marca, también aquí. */}
            <div
              aria-hidden="true"
              className="linea-ruta mt-5 h-1 w-44 rounded-full bg-linear-to-r from-[#f7771c] via-[#ee374b] to-[#c51850]"
            />
          </div>
          <div className="lg:pb-1 lg:text-right">
            <p className="font-barlow text-base leading-relaxed text-gray-300 sm:text-lg">
              La salida, la ruta entre cultivos, los podios y la llegada, tal
              como se vivieron. Toca cualquier foto para verla en grande.
            </p>
            <p className="font-barlow mt-3 text-sm font-bold tracking-[0.14em] text-white/50 uppercase">
              24 fotografías · Patate, Tungurahua
            </p>
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {FOTOS.map((f) => {
            const grande = f.src.replace(".webp", "-960.webp");
            return (
              <a
                key={f.src}
                href={grande}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver en grande: ${f.alt}`}
                className={`group relative block overflow-hidden rounded-xl border border-white/10 bg-black outline-none focus-visible:ring-2 focus-visible:ring-[#f7771c] ${
                  f.destacada ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={f.src}
                  srcSet={`${srcSetDe(f.src) ?? `${f.src} 640w`}, ${grande} 960w`}
                  sizes={
                    f.destacada
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                  alt={f.alt}
                  width={640}
                  height={376}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                {/* Pie de foto al pasar el cursor (solo escritorio: en táctil
                    no hay hover y la foto queda limpia). */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/80 to-transparent px-4 pt-8 pb-3 text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
                  <span className="font-barlow text-xs font-bold tracking-widest text-white/90 uppercase">
                    Ver en grande
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        {/* Cierre con la invitación, en la misma tarjeta de marca que el home. */}
        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-6 py-10 text-center">
          <p className="font-(family-name:--font-titular) text-[26px] leading-none tracking-wide text-white uppercase sm:text-[34px]">
            La próxima foto puede ser la tuya
          </p>
          <p className="font-barlow text-base text-gray-300 sm:text-lg">
            29 de agosto · salida 08h00 desde Patate Gardens · desde $18
          </p>
          <a
            href="/inscripcion/"
            className="font-barlow mt-3 inline-flex min-h-14 items-center justify-center rounded-full bg-[#c51850] px-10 text-lg font-bold tracking-wide text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Inscribirme ahora
          </a>
        </div>
      </div>
    </section>
  );
}
