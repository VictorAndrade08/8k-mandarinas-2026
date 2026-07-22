import Link from "next/link";
import {
  CalendarBlank,
  MapPin,
  Clock,
  CurrencyDollar,
  Package,
  Trophy,
  Warning,
  WhatsappLogo,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import {
  CATEGORIAS,
  PREMIOS,
  PRECIO_PREVENTA,
  WHATSAPP_SOPORTE,
} from "../lib/carrera";
import { srcSetDe } from "../lib/imagen";

export const metadata = {
  title: "Información — 8K Ruta de las Mandarinas 2026",
  description:
    "Todo lo del evento en una página: fecha, hora, lugar, categorías con edades y precios, el kit del corredor, los premios y el cierre de vías.",
};

/**
 * Toda la información del evento en una sola página.
 *
 * Existe porque "Información" en el header llevaba a un ancla del home: quien
 * buscaba UN dato (¿a qué hora?, ¿cuánto cuesta mi categoría?, ¿qué me dan?)
 * tenía que pescarlo entre las secciones del inicio o bajar por los 15
 * artículos del reglamento. Aquí está todo junto, en el orden en que la gente
 * lo pregunta, y cada bloque enlaza a la página con el detalle completo.
 *
 * Los números NO se escriben aquí: categorías, precios y premios salen de
 * app/lib/carrera.ts, el mismo archivo del que leen el reglamento y el resto
 * del sitio. Es la lección más cara de este proyecto — el precio llegó a decir
 * tres cosas distintas en tres páginas.
 */
const DATOS = [
  { icon: CalendarBlank, dato: "29 de agosto", pie: "Sábado · 2026" },
  { icon: Clock, dato: "08h00", pie: "Salida en Patate Gardens" },
  { icon: MapPin, dato: "Patate", pie: "Tungurahua · Ecuador" },
  {
    icon: CurrencyDollar,
    dato: `$${PRECIO_PREVENTA}`,
    pie: "Preventa · con descuentos",
  },
];

const KIT = [
  "Camiseta oficial de la carrera",
  "Dorsal con chip de cronometraje",
  "Medalla al terminar",
  "Hidratación en ruta y en la meta",
  "Obsequios de los auspiciantes",
];

export default function InformacionPage() {
  return (
    <div className="w-full font-sans">
      {/* ── CABECERA ───────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#1c0710] px-4 pt-20 pb-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src="/fotos/corredores-15.webp"
            srcSet={srcSetDe("/fotos/corredores-15.webp")}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1c0710]/88" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
            Información del evento
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-titular)] text-[38px] leading-[0.9] tracking-wide text-white uppercase sm:text-[52px] md:text-[64px]">
            Todo lo del evento, <br />
            <span className="text-[#f7771c]">en una página</span>
          </h1>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 lg:grid-cols-4">
            {DATOS.map((d) => (
              <div
                key={d.pie}
                className="rounded-[10px] border border-white/10 bg-white/[0.04] p-5"
              >
                <d.icon size={22} className="mb-3 text-[#f7771c]" />
                <dt className="font-[family-name:var(--font-titular)] text-[24px] leading-none text-white sm:text-[26px]">
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

      {/* ── CATEGORÍAS Y PRECIOS ───────────────────────────────────────── */}
      <section className="w-full bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="mb-3 font-[family-name:var(--font-titular)] text-[30px] leading-[0.95] tracking-wide text-gray-900 uppercase sm:text-[42px]">
            Categorías <span className="text-[#f7771c]">y precios</span>
          </h2>
          <p className="font-barlow mb-9 max-w-2xl text-base text-gray-600 sm:text-lg">
            El formulario te sugiere la tuya según tu edad. Damas y varones
            compiten por separado en todas.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIAS.map((c) => (
              <div
                key={c.nombre}
                className="flex flex-col rounded-[18px] border border-gray-200 bg-gray-50 p-6"
              >
                <h3 className="font-[family-name:var(--font-titular)] text-[22px] leading-tight text-gray-900">
                  {c.nombre}
                </h3>
                <p className="font-barlow mt-1 text-sm text-gray-600">
                  {c.edades}
                </p>
                <p className="mt-5 font-[family-name:var(--font-titular)] text-[30px] leading-none text-[#f7771c] tabular-nums">
                  ${c.precio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL KIT Y LOS PREMIOS, LADO A LADO ──────────────────────────── */}
      <section className="w-full bg-[#140309] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="mb-3 flex items-center gap-3 font-[family-name:var(--font-titular)] text-[28px] leading-none tracking-wide text-white uppercase sm:text-[36px]">
              <Package size={30} className="shrink-0 text-[#f7771c]" /> El kit
              del corredor
            </h2>
            <ul className="font-barlow mt-6 space-y-3">
              {KIT.map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-3 text-base text-gray-300"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7771c]"
                  />
                  {k}
                </li>
              ))}
            </ul>
            {/* La entrega sigue sin fecha oficial. Se dice tal cual — inventar
                una fecha manda a la gente a un sitio equivocado. */}
            <p className="font-barlow mt-6 rounded-[10px] border border-[#ffc53d]/30 bg-[#ffc53d]/[0.07] p-4 text-sm leading-relaxed text-gray-300">
              <strong className="text-[#ffc53d]">Entrega del kit:</strong> la
              fecha, el lugar y el horario se anunciarán en esta página y en los
              canales oficiales. Para retirarlo: comprobante de inscripción y
              cédula a color.
            </p>
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-3 font-[family-name:var(--font-titular)] text-[28px] leading-none tracking-wide text-white uppercase sm:text-[36px]">
              <Trophy size={30} className="shrink-0 text-[#f7771c]" /> Premios
              en efectivo
            </h2>
            <p className="font-barlow mt-3 text-sm text-gray-400">
              A los tres primeros de cada categoría, damas y varones.
            </p>
            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/10">
              <table className="font-barlow w-full text-sm text-gray-300">
                <thead>
                  <tr className="bg-white/[0.04] text-left text-xs tracking-[0.12em] text-gray-400 uppercase">
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">1°</th>
                    <th className="px-4 py-3 text-right">2°</th>
                    <th className="px-4 py-3 text-right">3°</th>
                  </tr>
                </thead>
                <tbody>
                  {PREMIOS.map((p) => (
                    <tr key={p.categoria} className="border-t border-white/10">
                      <td className="px-4 py-3 font-bold text-white">
                        {p.categoria}
                      </td>
                      <td className="px-4 py-3 text-right text-[#f7771c] tabular-nums">
                        ${p.primero}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        ${p.segundo}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        ${p.tercero}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/reglamento#art-13"
              className="font-barlow mt-5 inline-flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
            >
              Cómo se cobran <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EL DÍA DE LA CARRERA ───────────────────────────────────────── */}
      <section className="w-full bg-[#190611] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[18px] border border-[#ffc53d]/30 bg-[#ffc53d]/[0.07] p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Warning size={24} weight="fill" className="text-[#ffc53d]" />
              <h2 className="font-[family-name:var(--font-titular)] text-[22px] text-white sm:text-[26px]">
                El día de la carrera
              </h2>
            </div>
            <ul className="font-barlow space-y-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              <li>
                Las vías del recorrido se cierran de{" "}
                <strong className="text-white">07h00 a 10h00</strong>, con
                apertura progresiva. El tránsito lo controla la Policía
                Nacional.
              </li>
              <li>
                Tiempo máximo para completar los 8 km:{" "}
                <strong className="text-white">90 minutos</strong>.
              </li>
              <li>
                Hay puntos de control e hidratación en ruta.{" "}
                <strong className="text-white">
                  No pasar por un control descalifica.
                </strong>
              </li>
              <li>
                La llegada es en el Estadio Municipal: tarima, sonido y
                premiación.
              </li>
            </ul>
          </div>

          {/* Los tres caminos que puede necesitar quien llegó hasta aquí. */}
          <div className="font-barlow mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/inscripcion"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#f7771c] px-8 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-colors hover:bg-[#d2600f]"
            >
              Inscribirme <ArrowRight size={16} />
            </Link>
            <Link
              href="/ruta"
              className="inline-flex min-h-[52px] items-center gap-2 text-sm font-bold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
            >
              Ver el recorrido <ArrowRight size={14} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_SOPORTE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 text-sm font-bold tracking-[0.1em] text-[#25D366] uppercase transition-colors hover:text-white"
            >
              <WhatsappLogo size={18} weight="fill" /> Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
