import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  MapTrifold,
  Clock,
  FlagCheckered,
  Warning,
  Trophy,
  FirstAidKit,
  Car,
  FileArrowDown,
  Prohibit,
} from "@phosphor-icons/react/dist/ssr";
import { PREMIOS, WHATSAPP_SOPORTE } from "../lib/carrera";

export const metadata: Metadata = {
  title: "Guía del corredor 2026 — 8K Ruta de las Mandarinas",
  description:
    "La guía oficial del corredor: entrega de kits el viernes 28 en Vehicentro, salida el sábado 29 a las 08h00 en Patate Gardens, recorrido, tiempo límite, premios y reglas de descalificación.",
};

/**
 * La Guía del Corredor 2026, en HTML y en PDF.
 *
 * El PDF es el documento oficial y se puede descargar entero
 * (/guia-del-corredor-2026.pdf, 1,6 MB). Pero un PDF en el móvil es
 * incómodo de leer, no lo indexa bien Google, no lo lee un lector de
 * pantalla y no se puede buscar con Ctrl+F desde la web — así que **todo
 * su contenido está también aquí escrito en HTML**. Es la misma regla que
 * el resto del sitio: el texto que importa no vive dentro de una imagen ni
 * de un archivo (docs/30-REGLAS-ANTI-IA.md y las notas de accesibilidad).
 *
 * Nada de lo que hay en esta página está inventado: sale del PDF oficial
 * entregado por la organización el 27-ago-2026 y coincide con el
 * reglamento y con /informacion. Si cambia el PDF, hay que cambiar esto.
 *
 * Componente de SERVIDOR: cero JavaScript, como el resto de páginas
 * públicas (scripts/sin-js-home.mjs les quita los scripts igualmente).
 */

const PDF = "/guia-del-corredor-2026.pdf";

export default function GuiaCorredorPage() {
  return (
    <section className="w-full bg-[#140309] px-4 pt-8 pb-24 font-sans sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* CABECERA */}
        <p className="font-barlow text-sm font-bold tracking-[0.2em] text-[#f7771c] uppercase">
          Documento oficial
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-titular)] text-[38px] leading-[0.95] tracking-wide text-white uppercase sm:text-[54px]">
          Guía del corredor <span className="text-[#f7771c]">2026</span>
        </h1>
        <p className="font-barlow mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
          Todo lo que necesitas saber para correr la 8K Ruta de las Mandarinas
          el sábado 29 de agosto en Patate. Está basada en el reglamento
          oficial.
        </p>

        <a
          href={PDF}
          download
          className="font-barlow mt-6 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#c51850] px-8 text-base font-bold text-white transition hover:brightness-110"
        >
          <FileArrowDown size={22} weight="bold" />
          Descargar la guía en PDF
        </a>

        {/* ENTREGA DE KITS — lo primero porque es lo que caduca */}
        <div className="mt-12 rounded-2xl border border-[#ffc53d]/40 bg-[#ffc53d]/[0.07] p-6 sm:p-8">
          <h2 className="font-barlow flex items-center gap-3 text-2xl font-bold text-white">
            <Package size={28} className="shrink-0 text-[#ffc53d]" />
            Entrega de kits
          </h2>
          <p className="font-barlow mt-3 text-lg leading-relaxed text-white/85">
            <strong className="text-white">Viernes 28 de agosto de 2026</strong>
            , de <strong className="text-white">10h00 a 17h00</strong>, en{" "}
            <strong className="text-white">
              Vehicentro | Sinotruk – Ficoa
            </strong>
            , Av. Los Guaytambos, Ambato.
          </p>
          <ul className="font-barlow mt-4 space-y-2 text-base leading-relaxed text-white/75">
            <li>
              · Para retirar el kit es <strong>obligatorio</strong> presentar el{" "}
              <strong className="text-white">comprobante de inscripción</strong>{" "}
              y la{" "}
              <strong className="text-white">
                cédula de identidad a color
              </strong>
              .
            </li>
            <li>
              · Después de ese horario no se aceptan reclamos ni reembolsos.
            </li>
          </ul>

          <h3 className="font-barlow mt-6 text-lg font-bold text-white">
            Qué trae el kit
          </h3>
          <p className="font-barlow mt-2 text-base leading-relaxed text-white/75">
            Camiseta oficial · chip · dorsal · medalla · sporty bag · souvenir ·
            seguro de accidentes · premios económicos.
          </p>
        </div>

        {/* SALIDA Y RECORRIDO */}
        <h2 className="font-barlow mt-12 flex items-center gap-3 text-2xl font-bold text-white">
          <FlagCheckered size={28} className="shrink-0 text-[#f7771c]" />
          Salida, recorrido y tiempo
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "Salida",
              d: "Sábado 29 de agosto de 2026, 08h00, en Patate Gardens. Se recomienda llegar con al menos una hora de anticipación.",
              Icon: Clock,
            },
            {
              t: "Llegada",
              d: "Estadio Municipal de Patate.",
              Icon: FlagCheckered,
            },
            {
              t: "Distancia",
              d: "8 kilómetros sobre asfalto, por las principales calles del cantón.",
              Icon: MapTrifold,
            },
            {
              t: "Tiempo límite",
              d: "2 horas para completar el recorrido.",
              Icon: Clock,
            },
          ].map(({ t, d, Icon }) => (
            <div
              key={t}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-barlow flex items-center gap-2 text-sm font-bold tracking-widest text-white/50 uppercase">
                <Icon size={18} className="text-[#f7771c]" />
                {t}
              </p>
              <p className="font-barlow mt-2 text-base leading-relaxed text-white/85">
                {d}
              </p>
            </div>
          ))}
        </div>
        <p className="font-barlow mt-4 text-base text-white/60">
          El recorrido completo, calle por calle, está en{" "}
          <Link href="/ruta" className="text-[#ffc53d] underline">
            la página de la ruta
          </Link>
          .
        </p>

        {/* IMPLEMENTOS */}
        <h2 className="font-barlow mt-12 flex items-center gap-3 text-2xl font-bold text-white">
          <Warning size={28} className="shrink-0 text-[#f7771c]" />
          Uso de los implementos
        </h2>
        <ul className="font-barlow mt-4 space-y-3 text-base leading-relaxed text-white/80">
          <li>
            · El <strong className="text-white">dorsal</strong> va visible en la
            parte delantera de la camiseta durante todo el recorrido.
          </li>
          <li>
            · El <strong className="text-white">chip</strong> está adherido al
            número. La organización no responde por tiempos no registrados si el
            chip se daña o se usa mal.
          </li>
          <li>
            · Camiseta oficial, dorsal y chip son el único medio para ingresar a
            la salida y a la llegada.
          </li>
          <li>
            · La entrega del chip es el único medio para reclamar los premios.
          </li>
          <li className="flex items-start gap-2">
            <Prohibit
              size={20}
              className="mt-0.5 shrink-0 text-[#ff6b6b]"
              weight="bold"
            />
            <span>
              <strong className="text-white">
                No se permite el ingreso de mascotas
              </strong>
              , ni en la salida ni en la llegada.
            </span>
          </li>
        </ul>

        {/* SEGURIDAD */}
        <h2 className="font-barlow mt-12 flex items-center gap-3 text-2xl font-bold text-white">
          <FirstAidKit size={28} className="shrink-0 text-[#f7771c]" />
          Control, seguridad y vehículos
        </h2>
        <ul className="font-barlow mt-4 space-y-3 text-base leading-relaxed text-white/80">
          <li>
            · Habrá puntos de control de ruta, hidratación y asistencia médica.{" "}
            <strong className="text-white">
              No pasar por un punto de control es motivo de descalificación.
            </strong>
          </li>
          <li>
            · Asistencia, seguridad y personal médico en el recorrido y en la
            meta, más un seguro de accidentes.
          </li>
          <li className="flex items-start gap-2">
            <Car size={20} className="mt-0.5 shrink-0 text-white/50" />
            <span>
              Solo circulan los vehículos acreditados por la organización. El
              tránsito lo gestionan la Policía Nacional y los Agentes de
              Tránsito.
            </span>
          </li>
        </ul>

        {/* DESCALIFICACIÓN */}
        <h2 className="font-barlow mt-12 text-2xl font-bold text-white">
          Descalificación
        </h2>
        <p className="font-barlow mt-3 text-base text-white/70">
          Queda descalificado quien:
        </p>
        <ul className="font-barlow mt-3 space-y-2 text-base leading-relaxed text-white/80">
          <li>· No complete el recorrido oficial.</li>
          <li>· Exceda el tiempo límite de 2 horas.</li>
          <li>· No pase por los puntos de control designados.</li>
          <li>· Use el número de otro corredor o no lo lleve visible.</li>
          <li>· Reciba ayuda externa no autorizada.</li>
        </ul>
        <p className="font-barlow mt-4 rounded-xl border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-4 py-3 text-base leading-relaxed text-white/85">
          <strong className="text-white">Sanción adicional:</strong> los
          corredores descalificados quedan inhabilitados para participar en
          competencias de la organización por 5 años.
        </p>

        {/* PREMIOS */}
        <h2 className="font-barlow mt-12 flex items-center gap-3 text-2xl font-bold text-white">
          <Trophy size={28} className="shrink-0 text-[#f7771c]" />
          Premios y sorteos
        </h2>
        {/* Los importes salen de PREMIOS en app/lib/carrera.ts — la misma
            fuente que usa el artículo 13 del reglamento, para que no puedan
            decir dos cosas distintas. */}
        <div className="mt-4 overflow-x-auto">
          <table className="font-barlow w-full min-w-[420px] border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-white/15 text-sm tracking-widest text-white/50 uppercase">
                <th className="py-3 pr-4 font-bold">Categoría</th>
                <th className="py-3 pr-4 font-bold">1.º</th>
                <th className="py-3 pr-4 font-bold">2.º</th>
                <th className="py-3 font-bold">3.º</th>
              </tr>
            </thead>
            <tbody>
              {PREMIOS.map((p) => (
                <tr key={p.categoria} className="border-b border-white/10">
                  <td className="py-3 pr-4 font-bold text-white">
                    {p.categoria}
                  </td>
                  <td className="py-3 pr-4 text-[#ffc53d]">${p.primero}</td>
                  <td className="py-3 pr-4 text-white/80">${p.segundo}</td>
                  <td className="py-3 text-white/80">${p.tercero}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-barlow mt-4 text-base leading-relaxed text-white/80">
          <strong className="text-white">Sorteo entre los corredores:</strong> 2
          motos y dos pasajes internacionales a Medellín.
        </p>

        {/* RESULTADOS */}
        <h2 className="font-barlow mt-12 text-2xl font-bold text-white">
          Resultados y fotos
        </h2>
        <p className="font-barlow mt-3 text-base leading-relaxed text-white/80">
          Los resultados generales y por categoría se publican después del
          evento en{" "}
          <a
            href="https://www.r2timing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffc53d] underline"
          >
            r2timing.com
          </a>
          , con cronometraje digital. Las fotografías se suben durante la semana
          posterior y son totalmente gratuitas.
        </p>

        {/* ORGANIZA */}
        <p className="font-barlow mt-12 border-t border-white/10 pt-8 text-base leading-relaxed text-white/60">
          Organiza <strong className="text-white/85">Vigop Eventos</strong> en
          alianza con el{" "}
          <strong className="text-white/85">
            GAD Municipal de San Cristóbal de Patate
          </strong>
          . Segunda edición, en homenaje a la cantonización de Patate.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={PDF}
            download
            className="font-barlow inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-[#c51850] px-8 text-base font-bold text-white transition hover:brightness-110"
          >
            <FileArrowDown size={22} weight="bold" />
            Descargar el PDF
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_SOPORTE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-barlow inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full border border-white/20 px-8 text-base font-bold text-white transition hover:bg-white/10"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
