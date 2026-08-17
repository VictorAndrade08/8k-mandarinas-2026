"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 1. Navegación rápida
import { usePathname } from "next/navigation"; // 2. Detección reactiva de ruta
import { PersonSimpleRun } from "@phosphor-icons/react";

// Alto del header (pt + píldora + pb). Hasta que no se baja de aquí, el botón
// flotante no aparece: arriba ya está el "Inscríbete ahora" del hero y dos veces
// la misma acción en la misma pantalla se lee como un error, no como insistencia.
const ALTO_HEADER = 142;

export default function FloatingCTA() {
  const pathname = usePathname(); // Hook para saber en qué página estamos
  const [mounted, setMounted] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [pasoElHeader, setPasoElHeader] = useState(false);

  // Detección de montaje: el botón solo puede aparecer una vez estamos en el
  // navegador. La regla set-state-in-effect avisa de renders en cascada, pero
  // este es el patrón estándar para valores que solo existen en el cliente — el
  // HTML lo genera el build, donde no hay scroll que medir.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Aparece al dejar atrás el header.
  //
  // Con IntersectionObserver y no escuchando `scroll`: el scroll dispara cientos
  // de eventos por segundo y cada uno ejecutaba JS en el hilo principal, que es
  // justo lo que atasca un móvil barato. El observer lo resuelve el navegador
  // fuera de ese hilo y solo nos avisa cuando el estado cambia de verdad.
  //
  // El centinela es un div de 1px a la altura del header: cuando sale de
  // pantalla, es que ya bajamos.
  useEffect(() => {
    const centinela = document.createElement("div");
    centinela.style.cssText = `position:absolute;top:${ALTO_HEADER}px;left:0;width:1px;height:1px;pointer-events:none;`;
    document.body.appendChild(centinela);

    const obs = new IntersectionObserver(
      ([e]) => setPasoElHeader(!e?.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(centinela);

    return () => {
      obs.disconnect();
      centinela.remove();
    };
  }, [pathname]);

  // Lógica del Intersection Observer (Detector de Footer)
  useEffect(() => {
    // Si no estamos en el navegador, no hacemos nada
    if (typeof window === "undefined") return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // El array puede llegar vacío: leerlo a ciegas es un crash en el callback
      // del observer, que además nadie ve porque no revienta el render.
      const entry = entries[0];
      if (!entry) return;
      setIsOverFooter(entry.isIntersecting);
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px 100px 0px", // Margen de seguridad para ocultarlo antes de tocar el footer
    });

    const footer = document.getElementById("site-footer"); // Asegúrate de que tu Footer tenga este ID
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, [pathname]); // Se re-ejecuta si cambiamos de página

  // Si estamos en la página de inscripción, NO renderizamos nada
  if (pathname?.startsWith("/inscripcion")) return null;

  // Visibilidad final
  const isVisible = mounted && pasoElHeader && !isOverFooter;

  return (
    // hidden en móvil: ahí la barra de navegación inferior (BottomNav) ya lleva
    // "Inscribirme" siempre visible, y dos botones flotando abajo se pisan.
    // Este queda para escritorio, donde no hay barra inferior.
    <div className="hidden lg:block">
      <Link
        href="/inscripcion"
        aria-label="Ir a formulario de inscripción"
        // Este className llevaba dentro tres comentarios CSS y un
        // `cubic-bezier(0.34, 1.56, 0.64, 1)` suelto, que Tailwind se comía como
        // clases inexistentes. Y era un botón de 22px con dos sombras de 40 y
        // 60px: un CTA gigante que grita (reglas 6 y 20). Ahora tiene el tamaño
        // de un botón y una sola sombra, la de marca.
        className={`fixed right-8 bottom-8 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7771c] to-[#c51850] px-7 py-3.5 text-base leading-none font-bold tracking-[0.08em] text-white uppercase shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      >
        <span>Inscribirme</span>
        <PersonSimpleRun size={22} weight="fill" />
      </Link>
    </div>
  );
}
