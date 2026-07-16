"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { WHATSAPP_SOPORTE } from "../lib/carrera";

// Los patrocinadores no se listan aquí: ya pasan todos por la cinta de logos de
// la home (SPONSOR_LOGOS en SponsorsStrip). Repetirlos en texto era mantener la
// misma lista en dos sitios, y las dos se desincronizan a la primera.

const ENLACES = [
  { href: "/inscripcion/", label: "Inscripción" },
  { href: "/reglamento", label: "Reglamento" },
  { href: "/verificar", label: "Verificar mi pago" },
  { href: "/terminos", label: "Términos" },
];

const REDES = [
  {
    href: `https://wa.me/${WHATSAPP_SOPORTE}`,
    label: "WhatsApp",
    Icon: MessageCircle,
    color: "hover:text-[#25D366]",
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    Icon: Instagram,
    color: "hover:text-[#E1306C]",
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    Icon: Facebook,
    color: "hover:text-[#1877F2]",
  },
];

export default function Footer() {
  return (
    // A sangre, sin tarjeta redondeada ni margen: el resto del sitio va en
    // tarjetas, pero el footer cierra la página y una tarjeta flotando aquí deja
    // ver el fondo naranja por debajo, que se lee como que falta algo.
    // id="site-footer": lo busca FloatingCTA para esconder el botón flotante al
    // llegar aquí. Si se renombra, el botón se queda encima del footer.
    <footer
      id="site-footer"
      className="relative w-full bg-[#0B0B0B] text-white font-sans border-t border-white/10 overflow-hidden"
    >
      {/* Resplandor de marca, muy sutil: da profundidad sin meter otra caja */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#FF6B1A]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-14 sm:py-16 flex flex-col items-center text-center">
        {/* Logo desnudo: la versión blanca se sostiene sola sobre este fondo */}
        <Image
          src="/logo-mandarinas-blanco.svg"
          alt="8K Ruta de las Mandarinas"
          width={480}
          height={168}
          className="w-[min(78vw,420px)] h-auto object-contain"
          loading="lazy"
        />

        <p className="mt-5 text-sm sm:text-base uppercase tracking-[0.28em] text-white/50">
          29 Agosto 2026 · Patate · Ecuador
        </p>

        {/* Enlaces del sitio */}
        <nav
          className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-1"
          aria-label="Enlaces del sitio"
        >
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="inline-flex items-center min-h-[44px] text-sm uppercase tracking-[0.12em] text-white/80 hover:text-[#FF6B1A] transition-colors duration-200"
            >
              {e.label}
            </Link>
          ))}
        </nav>

        {/* Redes */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          {REDES.map(({ href, label, Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 min-h-[44px] text-sm uppercase tracking-[0.12em] text-white/60 ${color} transition-colors duration-200`}
            >
              <Icon size={17} /> {label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/35">
          © 2026 Vigop Eventos · Desarrollo web por{" "}
          <span className="text-[#FF6B1A]/80">Prez Agencia</span>
        </p>
      </div>
    </footer>
  );
}
