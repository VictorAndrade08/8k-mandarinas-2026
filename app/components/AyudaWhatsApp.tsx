import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_SOPORTE } from "../lib/carrera";

/**
 * La alternativa por WhatsApp, en una franja compacta.
 *
 * Antes era media sección de dos tarjetas grandes ("Inscríbete online" +
 * "Hazlo por WhatsApp"). La primera tarjeta repetía lo mismo que "Cómo
 * inscribirse", que está justo encima — mismos pasos, mismo botón, otra vez.
 * Lo único con valor propio era el canal de WhatsApp para quien no quiere
 * hacerlo solo, y eso cabe en una franja.
 */
export default function AyudaWhatsApp() {
  return (
    <section className="w-full bg-[#1c0710] px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-titular)] text-[24px] leading-tight text-white sm:text-[30px]">
            ¿Prefieres hacerlo con ayuda?
          </h2>
          <p className="font-barlow mt-2 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Un asesor te guía por WhatsApp: envías tus datos, recibes la cuenta
            para la transferencia y mandas el comprobante por chat.
          </p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_SOPORTE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-7 text-sm font-bold tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#1EBE57]"
        >
          <WhatsappLogo size={20} weight="fill" /> Abrir WhatsApp
        </a>
      </div>
    </section>
  );
}
