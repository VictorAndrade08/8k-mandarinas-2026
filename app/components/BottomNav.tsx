"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MapTrifold, Scroll, Ticket } from "@phosphor-icons/react";

/**
 * Barra de navegación inferior fija, solo en móvil.
 *
 * Sustituye al menú hamburguesa como navegación principal en el teléfono. La
 * evidencia es clara: un menú oculto baja la finalización de tareas ~21%
 * (Nielsen Norman Group) y una barra inferior es ~40% más rápida de usar (test
 * de Airbnb), porque las opciones están siempre visibles y al alcance del pulgar
 * — que es donde llega la mano en un móvil, no arriba del todo.
 *
 * Cuatro destinos + el CTA de inscripción, que es la acción para la que existe
 * el sitio, destacado en el color de marca. El hamburguesa del header se queda
 * para lo secundario (Términos, etc.), pero lo importante ya no se esconde.
 *
 * En /inscripcion no aparece: ahí el formulario tiene su propia barra de
 * Atrás/Siguiente abajo y dos barras fijas competirían por el mismo sitio.
 */

const DESTINOS = [
  { href: "/", label: "Inicio", Icon: House, match: (p: string) => p === "/" },
  {
    href: "/#ruta",
    label: "Ruta",
    Icon: MapTrifold,
    match: () => false,
  },
  {
    href: "/reglamento",
    label: "Reglas",
    Icon: Scroll,
    match: (p: string) => p.startsWith("/reglamento"),
  },
  {
    href: "/verificar",
    label: "Mi pago",
    Icon: Ticket,
    match: (p: string) => p.startsWith("/verificar"),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const ruta = pathname.replace(/\/+$/, "") || "/";

  // El formulario trae su propia barra fija abajo; no encajamos otra encima.
  if (ruta.startsWith("/inscripcion")) return null;

  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {DESTINOS.map(({ href, label, Icon, match }) => {
          const activo = match(ruta);
          return (
            <Link
              key={label}
              href={href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-colors ${
                activo ? "text-[#FF6B1A]" : "text-gray-500 hover:text-[#FF6B1A]"
              }`}
            >
              <Icon size={24} weight={activo ? "fill" : "regular"} />
              {label}
            </Link>
          );
        })}

        {/* CTA: la acción para la que existe el sitio, siempre a mano. */}
        <Link
          href="/inscripcion"
          className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5"
        >
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] px-4 py-2 text-[11px] font-black tracking-wide text-white uppercase shadow-md shadow-[#FF6B1A]/30">
            Inscribirme
          </span>
        </Link>
      </div>
    </nav>
  );
}
