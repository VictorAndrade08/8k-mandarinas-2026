import type { Metadata } from "next";
import { srcSetDe } from "../lib/imagen";

export const metadata: Metadata = {
  title: "Galería · 8K Ruta de las Mandarinas",
  description:
    "Fotos reales de la edición anterior de la 8K Ruta de las Mandarinas: la salida, la ruta entre cultivos, la llegada y los corredores en Patate.",
};

// Galería completa (nota 20): cuadrícula de MINIATURAS con lazy loading, y la
// versión grande solo bajo demanda — cada foto es un enlace <a> que abre el
// archivo completo. Cero JavaScript: funciona con las páginas sin scripts.
// El home enseña la muestra (la cinta de TopGallery); aquí viven las 24.
const FOTOS = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const alts = [
    "Corredores en la salida de Patate",
    "Podio de premiación de la carrera",
    "Grupo de corredores con su medalla",
  ];
  return {
    src: `/fotos/corredores-${n}.webp`,
    alt: `${alts[i % 3]} — edición anterior`,
  };
});

export default function GaleriaPage() {
  return (
    <section className="w-full bg-[#140309] px-4 pb-24 sm:px-6 sm:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
          Fotos de la edición anterior
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px]">
          Así se corre <span className="text-[#f7771c]">Patate</span>
        </h1>
        <p className="font-barlow mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          La salida, la ruta entre cultivos, los podios y la llegada, tal como
          se vivieron. Toca cualquier foto para verla en grande.
        </p>

        {/* Las fuentes originales miden 640px; las versiones -960 están
            reescaladas con lanczos + enfoque fino (se ven claramente más
            nítidas que dejar que el navegador amplíe el 640). La celda usa la
            960 en retina y la vista grande abre la 960 directamente. Si algún
            día llegan los originales de cámara, se regeneran sin tocar nada
            más. */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {FOTOS.map((f) => {
            const grande = f.src.replace(".webp", "-960.webp");
            return (
              <a
                key={f.src}
                href={grande}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver en grande: ${f.alt}`}
                className="group block overflow-hidden rounded-[14px] border border-white/10 bg-black outline-none focus-visible:ring-2 focus-visible:ring-[#f7771c]"
              >
                <img
                  src={f.src}
                  srcSet={`${srcSetDe(f.src) ?? `${f.src} 640w`}, ${grande} 960w`}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  alt={f.alt}
                  width={640}
                  height={376}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="font-barlow text-base text-gray-300 sm:text-lg">
            La próxima foto puede ser la tuya: 29 de agosto, salida 08h00 desde
            Patate Gardens.
          </p>
          <a
            href="/inscripcion/"
            className="font-barlow inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#c51850] px-10 text-lg font-bold tracking-wide text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Inscribirme ahora
          </a>
        </div>
      </div>
    </section>
  );
}
