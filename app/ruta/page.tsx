import Link from "next/link";
import {
  MapPin,
  FlagCheckered,
  Clock,
  Drop,
  Warning,
  ArrowRight,
  ArrowDown,
} from "@phosphor-icons/react/dist/ssr";
import { srcSetDe } from "../lib/imagen";

export const metadata = {
  title: "El recorrido — 8K Ruta de las Mandarinas 2026",
  description:
    "Los 8 km calle por calle: salida en Patate Gardens, subida a San Jorge, los viveros de Chalpi y la recta final por la Av. Ambato hasta el Estadio Municipal de Patate.",
};

/**
 * El recorrido, tramo por tramo.
 *
 * Todo lo que hay aquí sale del oficio N°0084 dirigido al alcalde de Patate y
 * sellado por el GAD, que es la misma fuente del artículo 4 del reglamento. No
 * hay una sola calle inventada: quien lea esto va a correr por ahí, y mandar a
 * alguien por una calle que no existe no es una errata, es un problema.
 *
 * Las imágenes de los tramos son ilustraciones de la marca, declaradas como
 * tales (docs/CAMBIO-IMAGENES.md): las fotos reales de 640px se veían suaves
 * en grande y varias ni correspondían al tramo (en "Salida" iba una foto del
 * podio). Una ilustración puede contar exactamente lo que pasa en cada
 * kilómetro; una foto equivocada solo confunde.
 */
const TRAMOS = [
  {
    km: "0",
    titulo: "Salida — Patate Gardens",
    calles: ["Hilario Torres", "E. Dávila"],
    texto:
      "A las 08h00 en punto. Se sale girando a la izquierda por Hilario Torres y luego otra vez a la izquierda por E. Dávila.",
    foto: "/ilustraciones/salida.webp",
  },
  {
    km: "1",
    titulo: "El casco del pueblo",
    calles: ["Escalinata de la Fe", "García Moreno", "Vicente Rocafuerte"],
    texto:
      "Se pasa bajo la Escalinata de la Fe y se sigue por García Moreno hasta girar a la izquierda a Vicente Rocafuerte. Es el tramo con más público: la Banda Municipal toca por aquí.",
    foto: "/ilustraciones/casco.webp",
  },
  {
    km: "2",
    titulo: "La subida a San Jorge",
    calles: ["Naciones Unidas", "vía a San Jorge"],
    texto:
      "A la derecha por Naciones Unidas y a la izquierda para subir la vía a San Jorge hasta el sector de Quinta. Es la parte dura del recorrido: guarda algo para aquí.",
    foto: "/ilustraciones/subida.webp",
  },
  {
    km: "4",
    titulo: "Los viveros de Chalpi",
    calles: ["Chalpi", "Eloy Alfaro"],
    texto:
      "Se circunvala el sector de Chalpi pasando por los viveros y se baja por Eloy Alfaro, tras el colegio Benjamín Araujo. Aquí es donde se ve el valle.",
    foto: "/ilustraciones/alta.webp",
  },
  {
    km: "6",
    titulo: "De vuelta al pueblo",
    calles: ["Manuel Zapater", "Juan León Mera", "Vicente Rocafuerte"],
    texto:
      "Se baja por Manuel Zapater frente al colegio, se gira a Juan León Mera hasta Vicente Rocafuerte y de nuevo a Naciones Unidas.",
    foto: "/ilustraciones/vuelta.webp",
  },
  {
    km: "8",
    titulo: "Meta — Estadio Municipal",
    calles: ["Av. Ambato"],
    texto:
      "La recta final es la Av. Ambato hasta el ingreso al Estadio Municipal de Patate, donde están la tarima, el sonido y la premiación.",
    foto: "/ilustraciones/meta.webp",
  },
];

const DATOS = [
  { icon: MapPin, dato: "8 km", pie: "Distancia oficial" },
  { icon: Clock, dato: "08h00", pie: "Salida, sábado 29 de agosto" },
  { icon: FlagCheckered, dato: "90 min", pie: "Tiempo máximo" },
  { icon: Drop, dato: "En ruta", pie: "Puntos de hidratación y control" },
];

export default function RutaPage() {
  return (
    <div className="w-full font-sans">
      {/* ── CABECERA ───────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#1c0710] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* De fondo va la ilustración del valle, con la capa al 85% (no al 88
            de las fotos): sus formas planas aguantan verse un poco más sin
            pelearse con el titular. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src="/ilustraciones/alta.webp"
            srcSet={srcSetDe("/ilustraciones/alta.webp")}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1c0710]/85" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
            Recorrido oficial
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px] md:text-[64px]">
            8 kilómetros por <br />
            <span className="text-[#f7771c]">las calles de Patate</span>
          </h1>
          <p className="font-barlow mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Del oficio N°0084 sellado por el GAD Municipal. Calle por calle, sin
            sorpresas el día de la carrera.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 lg:grid-cols-4">
            {DATOS.map((d) => (
              <div
                key={d.pie}
                className="rounded-[10px] border border-white/10 bg-white/[0.04] p-5"
              >
                <d.icon size={22} className="mb-3 text-[#f7771c]" />
                <dt className="font-[family-name:var(--font-titular)] text-[26px] leading-none text-white">
                  {d.dato}
                </dt>
                <dd className="font-barlow mt-1.5 text-sm text-gray-400">
                  {d.pie}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── EL MAPA OFICIAL ────────────────────────────────────────────── */}
      <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="overflow-hidden rounded-[18px] border border-gray-200">
            {/* El mismo mapa del inicio, aquí sin nada encima que lo tape. */}
            <picture className="block h-auto w-full">
              <source
                media="(min-width: 768px)"
                srcSet="/fotos/mapa-ruta.webp"
                width={1600}
                height={686}
              />
              <img
                src="/fotos/mapa-ruta-movil.webp"
                alt="Mapa oficial del recorrido de la 8K Ruta de las Mandarinas: salida en Patate Gardens, subida por la vía a San Jorge, sector de Chalpi, bajada por Eloy Alfaro y llegada al Estadio Municipal de Patate por la Av. Ambato."
                width={640}
                height={746}
                className="h-auto w-full"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* ── TRAMO POR TRAMO ────────────────────────────────────────────── */}
      <section className="w-full bg-[#140309] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="mb-10 max-w-3xl font-[family-name:var(--font-titular)] text-[32px] leading-[0.95] tracking-wide text-white uppercase sm:mb-14 sm:text-[46px]">
            Tramo <span className="text-[#f7771c]">por tramo</span>
          </h2>

          <ol className="space-y-5">
            {TRAMOS.map((t, i) => {
              // Se alternan lado: la foto va a la izquierda en los pares y a la
              // derecha en los impares. Seis bloques idénticos en fila se leen
              // como una tabla y se dejan de mirar al tercero.
              const invertido = i % 2 === 1;
              return (
                <li
                  key={t.titulo}
                  className={`grid items-center gap-6 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:grid-cols-[auto_1fr_1.1fr] lg:gap-8 ${
                    invertido ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  {/* El kilómetro, en grande. Es el dato que busca quien viene a
                      esta página a saber "¿dónde está la subida?". */}
                  <div className="flex items-baseline gap-2 lg:flex-col lg:items-center lg:gap-0 lg:[direction:ltr]">
                    <span className="font-[family-name:var(--font-titular)] text-[42px] leading-none text-[#f7771c] tabular-nums sm:text-[54px]">
                      {t.km}
                    </span>
                    <span className="font-barlow text-xs font-bold tracking-[0.18em] text-gray-500 uppercase">
                      km
                    </span>
                  </div>

                  <div className="lg:[direction:ltr]">
                    <h3 className="mb-2 font-[family-name:var(--font-titular)] text-[22px] leading-tight text-white sm:text-[27px]">
                      {t.titulo}
                    </h3>
                    <p className="font-barlow mb-4 text-sm leading-relaxed text-gray-400 sm:text-base">
                      {t.texto}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {t.calles.map((c) => (
                        <li
                          key={c}
                          className="font-barlow rounded-[4px] bg-[#780030] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="overflow-hidden rounded-[10px] lg:[direction:ltr]">
                    <img
                      src={t.foto}
                      srcSet={srcSetDe(t.foto)}
                      sizes="(max-width: 1024px) 100vw, 480px"
                      alt={`Ilustración del tramo: ${t.titulo}`}
                      width={1280}
                      height={716}
                      className="h-[200px] w-full object-cover object-center sm:h-[250px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── CIERRE DE VÍAS ─────────────────────────────────────────────── */}
      <section className="w-full bg-[#190611] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[18px] border border-[#ffc53d]/30 bg-[#ffc53d]/[0.07] p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Warning size={24} weight="fill" className="text-[#ffc53d]" />
              <h2 className="font-[family-name:var(--font-titular)] text-[22px] text-white sm:text-[26px]">
                Cierre de vías
              </h2>
            </div>
            <ul className="font-barlow space-y-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              <li className="flex gap-3">
                <ArrowDown
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ffc53d]"
                />
                Las vías se cierran de{" "}
                <strong className="text-white">07h00 a 10h00</strong>. La
                apertura es progresiva, conforme avanza la competencia.
              </li>
              <li className="flex gap-3">
                <ArrowDown
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ffc53d]"
                />
                El control de tránsito está a cargo de la Policía Nacional, con
                vallado en todo el trayecto.
              </li>
              <li className="flex gap-3">
                <ArrowDown
                  size={18}
                  className="mt-0.5 shrink-0 text-[#ffc53d]"
                />
                Hay puntos de control en ruta.{" "}
                <strong className="text-white">
                  No pasar por uno es motivo de descalificación.
                </strong>
              </li>
            </ul>
          </div>

          <div className="font-barlow mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/inscripcion"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#f7771c] px-8 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-colors hover:bg-[#d2600f]"
            >
              Inscribirme <ArrowRight size={16} />
            </Link>
            <Link
              href="/reglamento#art-4"
              className="inline-flex min-h-[52px] items-center gap-2 text-sm font-bold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
            >
              Ver el artículo 4 del reglamento <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
