"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  MapTrifold,
  Scroll,
  Ticket,
  PersonSimpleRun,
} from "@phosphor-icons/react";

/**
 * Barra de navegación inferior fija, solo en móvil.
 *
 * Sustituye al menú hamburguesa como navegación principal en el teléfono. La
 * evidencia es clara: un menú oculto baja la finalización de tareas ~21%
 * (Nielsen Norman Group) y una barra inferior es ~40% más rápida de usar (test
 * de Airbnb), porque las opciones están siempre visibles y al alcance del pulgar.
 *
 * Cinco celdas de IGUAL ancho, no cuatro iconos apretados y una píldora ancha
 * que rompe la rejilla: la uniformidad es lo que la hace ver de app y no de
 * remiendo. "Inscribirme" —la acción para la que existe el sitio— destaca por
 * color (un círculo de marca), no por tamaño.
 *
 * En /inscripcion no aparece: ahí el formulario tiene su propia barra de
 * Atrás/Siguiente abajo y dos barras fijas competirían por el mismo sitio.
 */

const DESTINOS = [
  { href: "/", label: "Inicio", Icon: House, match: (p: string) => p === "/" },
  { href: "/#ruta", label: "Ruta", Icon: MapTrifold, match: () => false },
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

  const itemBase =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold tracking-wide uppercase transition-colors";

  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {DESTINOS.map(({ href, label, Icon, match }) => {
          const activo = match(ruta);
          const contenido = (
            <>
              <Icon size={26} weight={activo ? "fill" : "regular"} />
              {label}
            </>
          );
          const clase = `${itemBase} ${
            activo ? "text-[#FF6B1A]" : "text-gray-500"
          }`;

          // "Inicio" estando ya en el home: sube arriba en vez de no hacer nada.
          // El header se va con el scroll, así que al final del home este es el
          // único "volver arriba" que hay.
          if (label === "Inicio" && ruta === "/") {
            return (
              <button
                key={label}
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={clase}
                aria-label="Volver arriba"
              >
                {contenido}
              </button>
            );
          }
          return (
            <Link key={label} href={href} className={clase}>
              {contenido}
            </Link>
          );
        })}

        {/* Inscribirme: 5ª celda del MISMO ancho. Destaca por el círculo de
            marca, no por ser una píldora ancha que descuadra la fila. */}
        <Link
          href="/inscripcion"
          className={`${itemBase} text-[#FF6B1A]`}
          aria-label="Ir a inscripción"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B1A] to-[#FF2D7C] text-white shadow-md shadow-[#FF6B1A]/40">
            <PersonSimpleRun size={22} weight="bold" />
          </span>
          Inscribirme
        </Link>
      </div>
    </nav>
  );
}
