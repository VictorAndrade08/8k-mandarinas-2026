import Link from "next/link";
import { CATEGORIAS } from "../lib/carrera";

// Las categorías con su precio EN el home (notas de conversión: que nadie
// tenga que abrir el reglamento para saber cuánto paga). Los datos salen de
// carrera.ts — la misma fuente que usan /informacion y el reglamento, así un
// cambio de precio no deja al home mintiendo.
export default function CategoriasHome() {
  return (
    <section
      aria-label="Categorías y precios"
      className="w-full bg-white px-4 pt-2 pb-14 font-sans sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#780030] uppercase">
          Categorías y precios
        </p>
        <h2 className="mb-8 max-w-3xl font-[family-name:var(--font-titular)] text-[34px] leading-[0.95] tracking-wide text-gray-900 uppercase sm:mb-10 sm:text-[44px]">
          Elige la tuya <span className="text-[#d2600f]">según tu edad</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIAS.map((c) => (
            <div
              key={c.nombre}
              className="flex flex-col rounded-[18px] border border-gray-200 bg-gray-50 p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[#d2600f]/50"
            >
              <h3 className="font-barlow text-lg leading-tight font-bold text-gray-900">
                {c.nombre}
              </h3>
              <p className="font-barlow mt-1 text-sm text-gray-600">
                {c.edades}
              </p>
              <p className="mt-4 font-[family-name:var(--font-titular)] text-[40px] leading-none text-[#b83f00]">
                ${c.precio}
              </p>
            </div>
          ))}
        </div>

        <p className="font-barlow mt-5 text-sm text-gray-600">
          Todas incluyen camiseta oficial, dorsal, chip de cronometraje y
          medalla. El formulario te sugiere la categoría según tu edad, para que
          la revises.
        </p>

        {/* Sin cifras de inscritos: la organización decidió el 26-ago-2026 no
            publicar cuánta gente hay dentro, ni en total ni por categoría. El
            argumento se mantiene porque es cierto igual —Leyenda y Discapacidad
            son con diferencia las que menos corredores reúnen— y los premios
            salen del artículo 13 del reglamento (PREMIOS en carrera.ts). */}
        <p className="font-barlow mt-3 rounded-xl border border-[#d2600f]/30 bg-[#fff6ed] px-4 py-3 text-sm leading-relaxed text-gray-800">
          <strong>
            Leyenda y Discapacidad son las que menos corredores reúnen
          </strong>{" "}
          y reparten los mismos premios que las demás ($80 / $60 / $40): es
          donde se sube al podio con menos competencia.
        </p>

        <Link
          href="/verificar"
          className="font-barlow mt-6 inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-[#c51850] px-10 text-lg font-bold tracking-wide text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
        >
          Ver mi inscripción
        </Link>
      </div>
    </section>
  );
}
