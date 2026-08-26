import Link from "next/link";
import { PRECIO_GENERAL, PRECIO_DESCUENTO } from "../lib/carrera";

// Las cinco preguntas que más llegan por WhatsApp, respondidas en el propio
// home para que nadie tenga que escribir para saberlas (notas UX: FAQ cerca
// del final y CTA clara para cerrar la página, no un footer vacío). El detalle
// completo vive en /informacion — aquí solo lo que desatasca la inscripción.
const PREGUNTAS = [
  {
    q: "¿Cuánto cuesta inscribirse?",
    a: `$${PRECIO_GENERAL} en Élite Pro 8K (hasta 39 años) y Máster (40–64). $${PRECIO_DESCUENTO} en Leyenda (65 en adelante) y Especiales.`,
  },
  {
    // La pregunta de los últimos días, y no estaba. La respuesta es el plazo
    // REAL: las inscripciones no se cierran por decreto, se cierran solas
    // cuando ya no se puede entregar el kit (docs/100-URGENCIA.md, nº 8).
    q: "¿Hasta cuándo me puedo inscribir?",
    a: "Hasta que se pueda entregar el kit: el viernes 28 de agosto a las 17h00 se cierra la única entrega, en Vehicentro (Ambato). Sin kit no hay dorsal ni chip, así que inscribirse después de esa hora es pagar para no correr.",
  },
  {
    q: "¿Cómo se paga?",
    a: "Por transferencia bancaria o QR deúna! a la cuenta oficial. En la página solo subes el comprobante: aquí no se procesa ningún cobro.",
  },
  {
    q: "¿Cuánto tarda la validación del pago?",
    a: "De 2 a 3 días laborables. Te escribimos por WhatsApp, y puedes revisar tu estado con tu cédula en la página Mi pago.",
  },
  {
    q: "¿Dónde y cuándo retiro el kit?",
    a: "El viernes 28 de agosto (un día antes de la carrera), de 10h00 a 17h00, en Vehicentro | Sinotruk – Ficoa, Av. los Guaytambos y La Delicia, Ambato. Lleva tu cédula a color. El kit que no se retire en ese horario se pierde.",
  },
  {
    q: "¿Puedo cambiar mi inscripción o pedir devolución?",
    a: "No. Una vez concluido el proceso de inscripción, no se aceptan cambios ni devoluciones de dinero.",
  },
];

export default function FaqHome() {
  return (
    <section
      aria-label="Preguntas frecuentes"
      className="w-full bg-[#140309] px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-8 font-[family-name:var(--font-titular)] text-[32px] leading-[0.95] tracking-wide text-white uppercase sm:mb-10 sm:text-[46px]">
          Preguntas <span className="text-[#f7771c]">frecuentes</span>
        </h2>

        <div className="space-y-3">
          {PREGUNTAS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <summary className="font-barlow flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-bold text-white sm:text-lg [&::-webkit-details-marker]:hidden">
                {q}
                <span
                  aria-hidden="true"
                  className="text-[#f7771c] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="font-barlow px-5 pb-5 text-base leading-relaxed text-gray-300">
                {a}
              </p>
            </details>
          ))}
        </div>

        <p className="font-barlow mt-6 text-base text-gray-400">
          ¿Otra duda?{" "}
          <Link
            href="/informacion"
            className="font-bold text-[#f7771c] underline underline-offset-4 hover:text-white"
          >
            Toda la información en una página
          </Link>
        </p>

        {/* CTA final: la página cierra invitando a inscribirse, no con un
            footer vacío. Mismo texto que el resto de CTAs del sitio. */}
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center">
          <p className="font-[family-name:var(--font-titular)] text-[26px] leading-none tracking-wide text-white uppercase sm:text-[34px]">
            Nos vemos el 29 de agosto en Patate
          </p>
          <p className="font-barlow text-base text-gray-300 sm:text-lg">
            8 km · desde ${PRECIO_DESCUENTO} · incluye camiseta, dorsal, chip y
            medalla
          </p>
          <Link
            href="/inscripcion"
            className="font-barlow mt-3 inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#c51850] px-10 text-lg font-bold tracking-wide text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Inscribirme ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
