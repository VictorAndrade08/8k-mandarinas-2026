"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 1. Navegación rápida
import { usePathname } from "next/navigation"; // 2. Detección reactiva de ruta
import { MousePointerClick } from "lucide-react";

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

  // Aparece al dejar atrás el header. `passive` porque solo leemos el scroll, y
  // sin él Safari asume que vamos a cancelar el gesto y frena el desplazamiento.
  useEffect(() => {
    const alScrollear = () => setPasoElHeader(window.scrollY > ALTO_HEADER);
    alScrollear(); // Por si se entra con la página ya desplazada (recarga, #ancla)
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
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
    // Inyectamos la variable de fuente
    <div>
      <Link
        href="/inscripcion"
        aria-label="Ir a formulario de inscripción"
        className={`/* Gradiente Rojo */ /* Sombras y Efectos */ cubic-bezier(0.34, 1.56, 0.64, 1) /* Estado de visibilidad */ fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] px-10 py-4 font-[family-name:var(--font-poppins)] text-[20px] leading-none font-bold tracking-[0.1em] text-white uppercase shadow-[0_10px_40px_rgba(255,107,26,0.55)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_60px_rgba(255,107,26,0.75)] active:scale-95 md:right-8 md:bottom-8 md:left-auto md:translate-x-0 md:px-12 md:py-5 md:text-[22px] ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0"} `}
      >
        <span>Inscribirme</span>
        <MousePointerClick size={24} className="animate-pulse" />
      </Link>
    </div>
  );
}
