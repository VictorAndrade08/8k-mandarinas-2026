"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// --- CONFIGURACIÓN DE FUENTE (Optimización Core Web Vitals) ---
// El logo a todo color, sacado del vector del arte oficial. El anterior era la
// versión blanca, que sobre el header claro obligaba a meterla en una caja naranja
// para que se viera: parecía una pegatina encima del logo, no el logo.
const Logo = ({ className }: { className?: string }) => (
  <img
    // webp y a 520px: el PNG pesaba 80 KB para mostrarse a 200. Carga en eager
    // porque está en el primer pantallazo, así que cada KB cuenta el doble.
    src="/logo-mandarinas-color.webp"
    alt="8K Ruta de las Mandarinas — inicio"
    width={520}
    height={182}
    className={`${className} object-contain`}
    loading="eager"
  />
);

// Navegación del sitio. Cada entrada apunta a algo que existe de verdad.
// "Ruta" lleva al mapa de la home; el detalle calle por calle está en el
// artículo 4 del reglamento, al que apunta el propio mapa.
const NAV = [
  { href: "/#ruta", label: "Ruta", acento: "#FF6B1A" },
  { href: "/#info", label: "Información", acento: "#FF6B1A" },
  { href: "/reglamento", label: "Reglamento", acento: "#FF6B1A" },
  // "Mi pago", no "Verificar mi pago": la barra inferior del móvil ya llamaba
  // así a este mismo destino y dos nombres para la misma página se leen como dos
  // páginas distintas (NN/g, Consistency and Standards).
  { href: "/verificar", label: "Mi pago", acento: "#FF2D7C" },
];

// --- COMPONENTE PRINCIPAL ---
export default function Header() {
  const pathname = usePathname();
  const ruta = pathname.replace(/\/+$/, "") || "/";

  return (
    <>
      {/* Primer parada del tabulador: saltar el menú e ir al contenido.
          Solo se ve cuando se le da el foco con el teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-[#FF6B1A] focus:shadow-lg focus:ring-2 focus:ring-[#FF6B1A] focus:outline-none"
      >
        Saltar al contenido
      </a>

      {/* absolute, ni sticky ni fixed:
          - sticky/normal ocupan sitio en el flujo y empujaban el hero hacia
            abajo, dejando una franja del fondo naranja por encima del vídeo;
          - fixed lo arreglaba, pero dejaba la píldora clavada en pantalla todo
            el rato.
          Con absolute está fuera del flujo (el vídeo arranca en el píxel 0 y la
          píldora flota encima) y además se va con el scroll. Se ancla al <body>,
          que ya es relative desde layout.tsx.
          Contrapartida: al no ocupar sitio, las páginas sin hero tienen que
          reservar ese hueco a mano — lo hace MainWrapper en SiteChrome.tsx. */}
      <header
        className={`absolute inset-x-0 top-0 z-50 flex w-full justify-center px-4 pt-8 pb-2 font-sans sm:pt-10`}
      >
        {/* En móvil ya no hay hamburguesa: la navegación vive en la barra
            inferior fija (BottomNav), así que aquí solo queda el logo, centrado.
            Tener dos menús —arriba y abajo— confundía y se pisaban. En lg+
            aparece la navegación completa en línea y el logo vuelve a la
            izquierda. */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center rounded-full border border-[#EFEFF3] bg-white/95 px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(255,107,26,0.18)] sm:px-6 lg:justify-between lg:px-8">
          {/* IZQUIERDA → HOME. El logo va desnudo: es a color y se sostiene solo. */}
          <Link
            href="/"
            className="group flex flex-shrink-0 cursor-pointer items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
          >
            {/* En móvil manda el ancho, no el alto: el logo es muy apaisado, así
                que con h-16 a secas se comería el sitio. Con min(vw) crece todo
                lo que le deja la píldora y no más. */}
            <Logo className="h-auto w-[min(58vw,220px)] transition-transform duration-300 group-hover:scale-[1.03] sm:w-[240px] lg:w-[260px]" />
          </Link>

          {/* ================= DESKTOP (LG+) =================
              Navegar y "Inscribirse" son cosas distintas: los enlaces van en texto
              plano en el centro (antes eran tres píldoras iguales apelotonadas a la
              derecha, y el ojo no sabía cuál era la importante) y solo el CTA lleva
              fondo. El centro estaba vacío 429px mientras la derecha iba apretada. */}
          <nav
            aria-label="Navegación principal"
            className="mr-auto ml-6 hidden items-center gap-1 lg:flex xl:ml-10 xl:gap-3"
          >
            {NAV.map((item) => {
              // Los enlaces con ancla (#ruta, #info) apuntan a la home: no hay
              // "página actual" que marcar, solo las rutas propias.
              const activo =
                !item.href.includes("#") && ruta.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={activo ? "page" : undefined}
                  style={{ ["--acento" as string]: item.acento }}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200 outline-none hover:bg-black/[0.04] hover:text-(--acento) focus-visible:ring-2 focus-visible:ring-(--acento) xl:px-4 ${
                    // Dónde estás: color de marca + subrayado. Solo color no
                    // basta (WCAG 2.2, 1.4.1).
                    activo
                      ? "text-(--acento) underline decoration-2 underline-offset-8"
                      : "text-[#333]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Una sola acción con peso visual, a la derecha */}
          <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
            <Link
              href="/inscripcion"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#FF6B1A] px-6 text-sm font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase shadow-md transition-all duration-300 outline-none hover:-translate-y-0.5 hover:bg-[#E55104] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
            >
              Inscribirse
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
