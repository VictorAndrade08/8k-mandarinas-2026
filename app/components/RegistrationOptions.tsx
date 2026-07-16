"use client";

import React from "react";
import Link from "next/link"; // MEJORA: Navegación SPA instantánea
import {
  Globe,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  CreditCard,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

// Configuración de la fuente optimizada
export default function RegistrationOptions() {
  return (
    // Inyectamos la variable de fuente en el contenedor principal
    <section
      className={`flex w-full justify-center bg-gray-50 px-3 py-4 font-sans`}
    >
      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* ================================
            INSCRIPCIÓN EN LÍNEA (BLANCO)
        ================================= */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-gray-100 bg-white px-6 py-10 text-gray-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(255,107,26,0.18)] sm:px-10 sm:py-12">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FF6B1A]/5 to-transparent blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-gray-100 p-2 text-[#FF6B1A]">
                <Globe size={20} />
              </div>
              {/* text-gray-900 y no gray-500: el peso ya era el máximo que da
                   Poppins (900), así que lo que se leía como "fino" era el poco
                   contraste del gris claro sobre blanco, no la tipografía. */}
              <p className="text-sm font-black tracking-[0.2em] text-gray-900 uppercase">
                Recomendado
              </p>
            </div>

            <h2 className="mb-4 font-[family-name:var(--font-poppins)] text-[32px] leading-[1] text-gray-900 sm:text-[42px]">
              ¡Inscríbete online <br />
              <span className="text-[#FF6B1A]">en menos de 3 minutos!</span>
            </h2>

            <p className="mb-8 text-base leading-relaxed text-gray-600">
              Rápido y sin complicaciones. Asegura tu cupo inmediatamente desde
              tu computadora o celular.
            </p>

            <ul className="space-y-4">
              <ListItem icon={UserCheck} text="Elige tu categoría." />
              <ListItem icon={CreditCard} text="Completa tus datos y paga." />
              <ListItem
                icon={CheckCircle2}
                text="Recibe confirmación instantánea."
              />
            </ul>
          </div>

          <div className="relative z-10 mt-10">
            {/* MEJORA: Usamos Link para navegación interna rápida */}
            <Link
              href="/inscripcion"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] text-sm font-bold tracking-[0.15em] text-white uppercase shadow-lg shadow-[#FF6B1A]/30 transition-all duration-300 hover:-translate-y-1 hover:gap-4 hover:shadow-[#FF6B1A]/50"
            >
              Ir al formulario online <ArrowRight size={18} />
            </Link>

            <p className="mt-5 text-center text-sm text-gray-600">
              Preventa: <strong className="text-gray-900">$20</strong> · Tercera
              edad/Discapacidad: <strong className="text-gray-900">$18</strong>
            </p>
          </div>
        </article>

        {/* ================================
            INSCRIPCIÓN POR WHATSAPP (OSCURO)
        ================================= */}
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-gray-800 bg-[#111] px-6 py-10 text-white shadow-[0_15px_50px_-10px_rgba(0,0,0,0.3)] sm:px-10 sm:py-12">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#25D366]/10 to-transparent blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-white/10 p-2 text-[#25D366]">
                <MessageCircle size={20} />
              </div>
              {/* Mismo criterio que "Recomendado": el peso ya era el máximo,
                   lo que faltaba era contraste. */}
              <p className="text-sm font-black tracking-[0.2em] text-white uppercase">
                Asistido
              </p>
            </div>

            <h2 className="mb-4 font-[family-name:var(--font-poppins)] text-[32px] leading-[1] text-white sm:text-[42px]">
              ¿Prefieres ayuda? <br />
              <span className="text-[#25D366]">Hazlo por WhatsApp</span>
            </h2>

            <p className="mb-8 text-base leading-relaxed text-white/70">
              Un asesor te guiará paso a paso. Ideal si necesitas realizar
              consultas específicas antes de pagar.
            </p>

            <ul className="space-y-4">
              <ListItemDark
                icon={Smartphone}
                text="Envía tus datos por chat."
              />
              <ListItemDark
                icon={CreditCard}
                text="Recibe los datos para transferencia."
              />
              <ListItemDark
                icon={CheckCircle2}
                text="Envía comprobante y confirma."
              />
            </ul>
          </div>

          <div className="relative z-10 mt-10">
            {/* NOTA: WhatsApp es externo, así que mantenemos <a> con rel="noopener" */}
            <a
              href="https://wa.me/593995102378"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-transparent bg-white text-sm font-bold tracking-[0.15em] text-gray-900 uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
            >
              Abrir WhatsApp <MessageCircle size={18} />
            </a>

            <p className="mt-5 text-center text-sm text-white/50">
              WhatsApp oficial:{" "}
              <span className="font-semibold text-white">+593 99 510 2378</span>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

// Componentes auxiliares para listas limpias.
// LucideIcon en vez de any: con `any` cualquier cosa pasaba por aquí — un string,
// un número — y reventaba en tiempo de ejecución en vez de al compilar.
const ListItem = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <li className="flex items-start gap-3 text-gray-700">
    <Icon size={20} className="mt-0.5 shrink-0 text-[#FF6B1A]" />
    <span className="text-sm font-medium sm:text-base">{text}</span>
  </li>
);

const ListItemDark = ({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) => (
  <li className="flex items-start gap-3 text-white/90">
    <Icon size={20} className="mt-0.5 shrink-0 text-[#25D366]" />
    <span className="text-sm font-medium sm:text-base">{text}</span>
  </li>
);
