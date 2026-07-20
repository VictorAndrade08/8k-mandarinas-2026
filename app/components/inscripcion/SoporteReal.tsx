"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { WHATSAPP_SOPORTE } from "../../lib/carrera";

/** Salida de emergencia: si el formulario falla, que haya un humano detrás. */
export const SoporteReal = () => (
  <div className="font-barlow">
    <a
      href={`https://wa.me/${WHATSAPP_SOPORTE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[48px] items-center gap-2 rounded-lg text-base font-bold text-gray-200 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#f7771c]"
    >
      <WhatsappLogo size={20} className="text-[#25D366]" />
      ¿Algún problema? Escríbenos
    </a>
    <p className="mt-1 text-sm font-medium text-gray-400">
      © 2026 8K Ruta de las Mandarinas · Patate, Ecuador.
    </p>
  </div>
);
