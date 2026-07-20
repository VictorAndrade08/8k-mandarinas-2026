import Link from "next/link";
import { Trophy, Medal, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PREMIOS, BOLSA_TOTAL, PREMIO_MAYOR } from "../lib/carrera";

/**
 * Cuánto se llevan los ganadores, por categoría, en el inicio.
 *
 * Estaba solo en el artículo 13 del reglamento, a nueve pantallazos de scroll de
 * una página que casi nadie abre. Es el argumento más fuerte que tiene la
 * carrera y estaba escondido: $840 repartidos en una prueba de $20.
 *
 * Los números NO se escriben aquí — salen de app/lib/carrera.ts, el mismo sitio
 * del que los lee el reglamento. Copiarlos habría dejado la misma tabla en dos
 * archivos, y el día que cambie un premio uno de los dos se queda mintiendo.
 */
export default function Premios() {
  return (
    <section
      id="premios"
      className="w-full bg-[#1c0713] px-4 py-14 font-sans sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Titular a la izquierda, como el resto de secciones desde que se rompió
            la simetría del inicio. */}
        <div className="mb-10 sm:mb-14">
          <p className="font-barlow mb-3 flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
            <Trophy size={18} weight="fill" /> Premios en efectivo
          </p>
          <h2 className="font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px] md:text-[64px]">
            ${BOLSA_TOTAL} repartidos <br />
            <span className="text-[#f7771c]">entre las cuatro categorías</span>
          </h2>
          <p className="font-barlow mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Se premia a los tres primeros de cada categoría, damas y varones. El
            mayor son{" "}
            <strong className="text-white">
              ${PREMIO_MAYOR} al primer lugar
            </strong>{" "}
            de Élite Pro 8K — con una inscripción de $20.
          </p>
        </div>

        {/* Una tarjeta por categoría. Los tres puestos van en fila dentro de cada
            una: en móvil una tabla de cuatro columnas obliga a hacer scroll
            lateral, que es donde la gente deja de leer. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {PREMIOS.map((p, i) => {
            // La primera es la que más paga: se marca, para que el ojo sepa por
            // dónde empezar sin tener que comparar cifras.
            const destacada = i === 0;
            return (
              <div
                key={p.categoria}
                className={`rounded-[18px] border p-6 sm:p-7 ${
                  destacada
                    ? "border-[#f7771c]/50 bg-[#f7771c]/[0.07]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-titular)] text-[24px] leading-none text-white sm:text-[28px]">
                    {p.categoria}
                  </h3>
                  {destacada && (
                    <span className="font-barlow shrink-0 rounded-[4px] bg-[#f7771c] px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                      El mayor
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {(
                    [
                      ["1°", p.primero, "text-[#f7771c]"],
                      ["2°", p.segundo, "text-white/70"],
                      ["3°", p.tercero, "text-white/70"],
                    ] as const
                  ).map(([puesto, monto, color]) => (
                    <div
                      key={puesto}
                      className="rounded-[10px] border border-white/10 bg-black/25 py-3"
                    >
                      <p className="font-barlow mb-1 text-[11px] font-bold tracking-[0.14em] text-gray-400 uppercase">
                        {puesto} lugar
                      </p>
                      {/* tabular-nums: así las cifras de las cuatro tarjetas
                          quedan alineadas entre sí de columna a columna. */}
                      <p
                        className={`font-[family-name:var(--font-titular)] text-[26px] leading-none tabular-nums sm:text-[30px] ${color}`}
                      >
                        ${monto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lo que no es dinero, que también cuenta y nadie lo pregunta hasta el
            día de la carrera. */}
        <div className="font-barlow mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-base text-gray-300 sm:items-center">
            <Medal
              size={22}
              className="mt-0.5 shrink-0 text-[#f7771c] sm:mt-0"
            />
            <span>
              Todos los que terminan reciben medalla, camiseta oficial, dorsal
              con chip e hidratación.
            </span>
          </p>
          <Link
            href="/reglamento#art-13"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-bold tracking-[0.1em] text-white uppercase transition-colors hover:border-[#f7771c] hover:bg-[#f7771c]"
          >
            Cómo se cobran <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
