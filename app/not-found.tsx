import Link from "next/link";
import { ArrowRight, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import { srcSetDe } from "./lib/imagen";

export const metadata = {
  title: "Página no encontrada — 8K Ruta de las Mandarinas",
};

/**
 * El 404 con la línea gráfica del sitio. Antes salía la página en blanco por
 * defecto de Next — un callejón sin salida sin marca ni caminos. Aquí el
 * error se cuenta en el idioma de la carrera ("te saliste de la ruta") y se
 * ofrecen los tres destinos que resuelven el 99% de los casos.
 */
export default function NoEncontrada() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1c0710] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* La ilustración de la bajada al pueblo, con la capa al 85% como el
          resto de cabeceras: se adivina, no compite con el mensaje. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* lazy: Next incrusta el boundary del 404 en TODAS las páginas y sin
            el lazy le generaba un preload de esta imagen en cada <head>,
            compitiendo con el LCP del home (docs/100-MOVIL.md). */}
        <img
          src="/ilustraciones/vuelta.webp"
          srcSet={srcSetDe("/ilustraciones/vuelta.webp")}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1c0710]/85" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <p className="font-barlow mb-3 flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
          <MapTrifold size={18} /> Error 404
        </p>
        <h1 className="font-[family-name:var(--font-titular)] text-[40px] leading-[0.95] tracking-wide text-white uppercase sm:text-[56px]">
          Te saliste <br />
          <span className="text-[#f7771c]">de la ruta</span>
        </h1>
        <p className="font-barlow mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Esta página no existe o cambió de lugar. El recorrido oficial sigue
          por aquí:
        </p>

        <div className="font-barlow mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#f7771c] px-8 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-colors hover:bg-[#d2600f]"
          >
            Ir al inicio <ArrowRight size={16} />
          </Link>
          <Link
            href="/inscripcion"
            className="inline-flex min-h-[52px] items-center gap-2 text-sm font-bold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
          >
            Inscribirme <ArrowRight size={14} />
          </Link>
          <Link
            href="/informacion"
            className="inline-flex min-h-[52px] items-center gap-2 text-sm font-bold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
          >
            Ver la información <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
