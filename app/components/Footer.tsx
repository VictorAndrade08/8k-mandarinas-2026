"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // 1. Optimización de imagen
import { Bebas_Neue } from "next/font/google"; // 2. Carga de fuente sin bloqueo
import { Facebook, Instagram, MessageCircle } from "lucide-react";

// Configuración de la fuente
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

export default function Footer() {
  return (
    // 3. Inyectamos la fuente y MANTENEMOS el ID crítico para el botón flotante
    <footer id="site-footer" className={`w-full px-3 py-4 flex justify-center bg-gray-50 font-sans ${bebas.variable}`}>
      
      {/* Eliminado <style> @import para evitar bloqueo */}

      <div
        className="
          w-full max-w-7xl
          rounded-[32px] sm:rounded-[48px]
          bg-gradient-to-br from-[#050B16] via-[#070D18] to-[#02040A]
          text-white
          px-6 sm:px-10 lg:px-16
          py-12 sm:py-16
          shadow-[0_28px_70px_rgba(0,0,0,0.45)]
          border border-white/10
          flex flex-col lg:flex-row
          gap-12 lg:gap-20
          relative
          overflow-hidden
          transform-gpu translate-z-0
        "
      >
        {/* Fondo Decorativo */}
        <div 
            className="
                absolute top-0 right-0 
                w-[500px] h-[500px] 
                bg-[#FF6B1A]/5 
                rounded-full 
                blur-[120px] 
                pointer-events-none 
                translate-x-1/3 -translate-y-1/3
                transform-gpu will-change-transform
            " 
        />

        {/* IZQUIERDA — LOGO Y TEXTO */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6 md:gap-8 items-start relative z-10">
          <div
            className="
              rounded-2xl
              bg-[#FF6B1A]
              flex items-center justify-center
              shadow-[0_12px_30px_rgba(255,107,26,0.38)]
              flex-shrink-0
              px-4 py-3 sm:px-5 sm:py-4
            "
            aria-hidden="true"
          >
            {/* Logo oficial de las Mandarinas */}
            <Image
              src="/logo-mandarinas-blanco.svg"
              alt="Logo 8K Ruta de las Mandarinas"
              width={120}
              height={42}
              className="h-9 sm:h-11 w-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-[28px] sm:text-[36px] leading-none font-[family-name:var(--font-bebas)] tracking-wide mb-2">
              Ruta de las Mandarinas 2026
            </h3>

            <p className="text-sm text-white/60 font-medium uppercase tracking-wider mb-6">
                Patate – Ecuador
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md">
              © 2026. Evento oficial organizado por la <span className="text-white">Asociación de Periodistas Deportivos de Tungurahua</span>.
              <br className="mb-2"/>
              Desarrollo web por <span className="text-[#FF6B1A]">Prez Agencia</span>.
            </p>
          </div>
        </div>

        {/* DERECHA — ENLACES */}
        <nav
          className="flex-[1.2] grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-sm relative z-10"
          aria-label="Enlaces del sitio"
        >
          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-[family-name:var(--font-bebas)] tracking-wide text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-gray-400">
              {/* Usamos Link o <a> según corresponda. Si es scroll interno, <a> está bien. */}
              <li><Link href="/inscripcion/" className="hover:text-[#FF6B1A] transition-colors duration-200">Inscripción</Link></li>
              <li><Link href="/reglamento" className="hover:text-[#FF6B1A] transition-colors duration-200">Reglamento</Link></li>
              <li><a href="https://wa.me/593995102378" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B1A] transition-colors duration-200">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Patrocinadores */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-[family-name:var(--font-bebas)] tracking-wide text-white">
              Patrocinadores
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]"></span> Vehicentro
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]"></span> Sinotruk Ecuador
              </li>
            </ul>
          </div>

          {/* Conéctate */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-[family-name:var(--font-bebas)] tracking-wide text-white">
              Conéctate
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/593995040437"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#25D366] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar por WhatsApp"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#E1306C] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir en Instagram"
                >
                  <Instagram size={18} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#1877F2] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir en Facebook"
                >
                  <Facebook size={18} /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}