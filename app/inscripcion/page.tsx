import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  MagnifyingGlass,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { INSCRIPCIONES_ABIERTAS, WHATSAPP_SOPORTE } from "../lib/carrera";
import FormInscripcion from "../components/FormInscripcion";

export const metadata: Metadata = {
  title: "Inscripciones cerradas — 8K Ruta de las Mandarinas 2026",
  description:
    "Las inscripciones a la 8K Ruta de las Mandarinas 2026 están cerradas. Consulta el estado de tu inscripción y retira tu kit el viernes 28 en Vehicentro.",
};

/**
 * La ruta /inscripcion.
 *
 * Mientras INSCRIPCIONES_ABIERTAS sea true, aquí va el formulario. Cuando es
 * false —que es el estado desde el 27-ago-2026— sale este aviso.
 *
 * La ruta NO se borra a propósito: el enlace lleva meses circulando por
 * WhatsApp, está en flyers impresos y en publicaciones de Instagram que no se
 * pueden editar. Un 404 deja a esa gente pensando que el sitio se cayó; esto le
 * dice qué pasó y a dónde ir.
 *
 * El cierre de verdad NO está aquí, está en functions/api/inscribir.js: este
 * endpoint acepta CORS "*" y cualquiera puede postear sin pasar por esta
 * pantalla. Quitar el formulario sin cerrar el endpoint no cierra nada.
 */
export default function InscripcionPage() {
  if (INSCRIPCIONES_ABIERTAS) return <FormInscripcion />;

  return (
    <section className="w-full bg-[#140309] px-4 pt-8 pb-24 font-sans sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-barlow text-sm font-bold tracking-[0.2em] text-[#ffc53d] uppercase">
          8K Ruta de las Mandarinas 2026
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-titular)] text-[38px] leading-[0.95] tracking-wide text-white uppercase sm:text-[52px]">
          Inscripciones cerradas
        </h1>
        <p className="font-barlow mt-4 text-lg leading-relaxed text-white/75">
          Ya no se aceptan nuevas inscripciones. La entrega de kits es el{" "}
          <strong className="text-white">viernes 28 de agosto</strong> y es la
          única: quien se inscribiera ahora no alcanzaría a retirar el suyo, y
          sin kit no hay dorsal ni chip. Preferimos no cobrar por algo que no
          podemos entregar.
        </p>

        {/* Los dos caminos que sí sirven ahora. */}
        <div className="mt-8 space-y-3">
          <Link
            href="/verificar"
            className="font-barlow flex min-h-[64px] items-center gap-3 rounded-2xl bg-[#c51850] px-6 text-base font-bold text-white transition hover:brightness-110"
          >
            <MagnifyingGlass size={24} weight="bold" className="shrink-0" />
            <span>
              Ya me inscribí — ver el estado de mi pago
              <span className="mt-0.5 block text-sm font-semibold text-white/75">
                Con tu número de cédula
              </span>
            </span>
          </Link>

          <Link
            href="/guiacorredor"
            className="font-barlow flex min-h-[64px] items-center gap-3 rounded-2xl border border-[#ffc53d]/40 bg-[#ffc53d]/[0.07] px-6 text-base font-bold text-white transition hover:bg-[#ffc53d]/15"
          >
            <Package
              size={24}
              weight="bold"
              className="shrink-0 text-[#ffc53d]"
            />
            <span>
              Guía del corredor 2026
              <span className="mt-0.5 block text-sm font-semibold text-white/70">
                Kits el viernes 28, de 10h00 a 17h00, en Vehicentro (Ambato)
              </span>
            </span>
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(
              "Hola, tengo una duda sobre la 8K Ruta de las Mandarinas."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-barlow flex min-h-[56px] items-center gap-3 rounded-2xl border border-white/20 px-6 text-base font-bold text-white transition hover:bg-white/10"
          >
            <WhatsappLogo size={22} weight="fill" className="shrink-0" />
            Escribirnos por WhatsApp
          </a>
        </div>

        <p className="font-barlow mt-10 border-t border-white/10 pt-6 text-base leading-relaxed text-white/55">
          Nos vemos el sábado 29 a las 08h00 en Patate Gardens. Si te quedaste
          fuera esta vez, la siguiente carrera de la organización es la{" "}
          <strong className="text-white/75">
            10K Independencia de Ambato, el 15 de noviembre de 2026
          </strong>
          .
        </p>
      </div>
    </section>
  );
}
