import { PersonSimpleRun } from "@phosphor-icons/react/dist/ssr";

// Botón flotante "Inscribirme" del home, en escritorio.
//
// Aparece al dejar atrás el header (arriba ya está el "Inscríbete ahora" del
// hero, y dos veces la misma acción en la misma pantalla se lee como un error,
// no como insistencia) y se esconde al llegar al footer, que ya lleva su
// propio enlace.
//
// ── POR QUÉ ES JAVASCRIPT VAINILLA ────────────────────────────────────────
// Esto era "use client" con useState y dos IntersectionObserver en efectos.
// Dejó de funcionar el 18-ago-2026, el día que el home pasó a servirse sin
// JavaScript (scripts/sin-js-home.mjs): el marcado sí se pintaba, pero React
// nunca arrancaba, así que los efectos no corrían, `isVisible` se quedaba en
// false para siempre y el botón vivía en el HTML con `opacity-0
// pointer-events-none` — invisible e inservible durante ocho días, y sin dar
// ni un error que lo delatara. Se descubrió el 26-ago-2026 al reparar el
// pop-up del flyer, que estaba muerto por lo mismo.
//
// La solución es la que ya usan el contador del hero y el pop-up: marcado del
// servidor + un script vainilla marcado con data-mantener, que es lo único que
// el limpiador respeta. Se conservan los dos IntersectionObserver del original
// (escuchar `scroll` dispara cientos de eventos por segundo en el hilo
// principal, que es justo lo que atasca un móvil barato).
//
// El script espera a DOMContentLoaded porque vive DENTRO de <main> y el footer
// se pinta DESPUÉS: buscándolo al vuelo, getElementById("site-footer") devolvía
// null y el botón se quedaba encendido encima del pie de página.

/** Alto del header (pt + píldora + pb). Hasta aquí, el botón no aparece. */
const ALTO_HEADER = 142;

export default function FloatingCTA() {
  return (
    // hidden en móvil: ahí la barra inferior (BottomNav) ya lleva "Inscribirme"
    // siempre visible, y dos botones flotando abajo se pisan.
    <div className="hidden lg:block">
      <a
        id="cta-flotante"
        href="/inscripcion/"
        aria-label="Ir a formulario de inscripción"
        // Nace invisible y sin poder recibir clics; el script le quita estas dos
        // clases cuando toca. Sin JavaScript se queda oculto, que es lo correcto:
        // es un añadido, y el hero, el footer y la barra inferior ya llevan la
        // misma acción.
        className="pointer-events-none fixed right-8 bottom-8 z-50 flex translate-y-6 items-center gap-2 rounded-full bg-[#c51850] px-7 py-3.5 text-base leading-none font-bold tracking-[0.08em] text-white uppercase opacity-0 shadow-[0_8px_24px_rgba(247,119,28,0.35)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
      >
        <span>Inscribirme</span>
        <PersonSimpleRun size={22} weight="fill" />
      </a>

      <script
        data-mantener=""
        dangerouslySetInnerHTML={{
          __html: `(function(){function init(){var b=document.getElementById("cta-flotante");if(!b||!window.IntersectionObserver)return;var bajo=0,pie=0;function pinta(){var v=bajo&&!pie;b.classList.toggle("opacity-0",!v);b.classList.toggle("translate-y-6",!v);b.classList.toggle("pointer-events-none",!v)}var c=document.createElement("div");c.style.cssText="position:absolute;top:${ALTO_HEADER}px;left:0;width:1px;height:1px;pointer-events:none";document.body.appendChild(c);new IntersectionObserver(function(e){bajo=e[0]&&!e[0].isIntersecting?1:0;pinta()},{threshold:0}).observe(c);var f=document.getElementById("site-footer");if(f)new IntersectionObserver(function(e){pie=e[0]&&e[0].isIntersecting?1:0;pinta()},{threshold:0,rootMargin:"0px 0px 100px 0px"}).observe(f)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();`,
        }}
      />
    </div>
  );
}
