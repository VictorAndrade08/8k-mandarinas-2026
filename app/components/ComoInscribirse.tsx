import Link from "next/link";
import {
  UserCheck,
  PencilSimpleLine,
  Bank,
  Ticket,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { PRECIO_PREVENTA } from "../lib/carrera";

/**
 * Los cuatro pasos para inscribirse, en grande.
 *
 * Existían, pero como una lista de tres líneas dentro de la tarjeta "Inscríbete
 * online". Quien duda de si inscribirse por internet duda porque no sabe qué le
 * van a pedir, y esa respuesta estaba en letra pequeña dentro de otra cosa.
 *
 * Va en HTML y no como una imagen generada, a propósito. Un diagrama generado
 * pesa cientos de KB, se ve borroso al ampliar, no lo lee un lector de pantalla,
 * no lo indexa Google, no se puede corregir una palabra sin volver a generarlo
 * — y los modelos de imagen escriben mal el texto: el vídeo de fondo de este
 * mismo sitio salió con un "CS185D" inventado pese a pedirle que no pusiera
 * ninguno. Un paso que dijera "Sube tu comprovante" sería peor que no tenerlo.
 */
const PASOS = [
  {
    icon: UserCheck,
    titulo: "Elige tu categoría",
    texto:
      "Élite Pro 8K, Máster, Leyenda o Especiales. El sitio te sugiere la que te toca por tu edad.",
  },
  {
    icon: PencilSimpleLine,
    titulo: "Llena tus datos",
    texto:
      "Cédula, nombre, ciudad, WhatsApp y correo. Se guarda solo, por si tienes que salir a mitad.",
  },
  {
    icon: Bank,
    titulo: "Paga y sube el comprobante",
    texto:
      "La transferencia se hace en tu banco. Aquí solo subes la foto o el PDF del pago.",
  },
  {
    icon: Ticket,
    titulo: "Listo",
    texto:
      "Validamos el pago en 2 o 3 días laborables y te avisamos por WhatsApp.",
  },
];

export default function ComoInscribirse() {
  return (
    <section
      id="como-inscribirse"
      className="w-full bg-white px-4 py-14 font-sans sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 sm:mb-14">
          <p className="font-barlow mb-3 text-sm font-bold tracking-[0.2em] text-[#780030] uppercase">
            Cómo inscribirse
          </p>
          <h2 className="max-w-3xl font-[family-name:var(--font-titular)] text-[34px] leading-[0.95] tracking-wide text-gray-900 uppercase sm:text-[48px] md:text-[58px]">
            Cuatro pasos, <span className="text-[#f7771c]">tres minutos</span>
          </h2>
          <p className="font-barlow mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Aquí no se cobra nada. El pago va por transferencia a la cuenta de
            la organización y tú solo subes el comprobante.
          </p>
        </div>

        {/* Cuatro columnas en escritorio y una sola en móvil. El número va grande
            y detrás: es lo que deja claro que esto es una secuencia y no cuatro
            cosas sueltas, sin gastar una flecha entre cada par que en móvil no
            cabría. */}
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <li
              key={p.titulo}
              className="relative overflow-hidden rounded-[18px] border border-gray-200 bg-gray-50 p-6 sm:p-7"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-3 -right-1 font-[family-name:var(--font-titular)] text-[86px] leading-none text-gray-900/[0.06] select-none"
              >
                {i + 1}
              </span>

              <div className="relative">
                <p.icon
                  size={30}
                  weight="duotone"
                  className="mb-4 text-[#f7771c]"
                />
                <h3 className="font-barlow mb-2 text-[19px] leading-tight font-bold text-gray-900">
                  {p.titulo}
                </h3>
                <p className="font-barlow text-sm leading-relaxed text-gray-600">
                  {p.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="font-barlow mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/inscripcion"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#f7771c] px-8 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-colors hover:bg-[#d2600f]"
          >
            Empezar mi inscripción <ArrowRight size={16} />
          </Link>
          {/* El precio sale de app/lib/carrera.ts, el mismo sitio del que lo lee
              el reglamento y el formulario. Escrito a mano aquí sería el cuarto
              lugar donde vive el mismo número. */}
          <p className="text-sm text-gray-600">
            Preventa{" "}
            <strong className="text-gray-900">${PRECIO_PREVENTA}</strong> ·
            tercera edad y capacidades diferentes tienen descuento
          </p>
        </div>
      </div>
    </section>
  );
}
