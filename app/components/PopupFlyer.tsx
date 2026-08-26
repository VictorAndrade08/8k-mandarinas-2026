// Pop-up de los flyers oficiales al entrar al home. Enseña "90% vendido"
// (urgencia → lleva a inscribirse) y "Entrega de kits" del 28 de agosto en
// Vehicentro (→ lleva a /informacion, que es donde el horario y la dirección
// están escritos en HTML de verdad). Es un empujón de conversión
// (docs/30-UX-CONVERSION.md, tips 2 y 8), pero un pop-up mal hecho espanta.
// Por eso:
//   - Se ve UNA vez por sesión (sessionStorage): no reaparece en cada página.
//   - Cierre MUY fácil: botón X grande, clic en el fondo, tecla Esc y un botón
//     de texto debajo.
//   - Aparece con la primera interacción (no con temporizador), así nunca
//     cuenta como LCP; y sus imágenes van en lazy dentro de un contenedor
//     oculto, así que no se descargan hasta que se abre.
//
// ── POR QUÉ ES JAVASCRIPT VAINILLA Y NO REACT ─────────────────────────────
// Esto era un componente "use client" con useState y createPortal. Dejó de
// funcionar el 18-ago-2026 sin que nadie se diera cuenta: ese día el home pasó
// a servirse SIN JavaScript (scripts/sin-js-home.mjs borra los <script> de las
// páginas públicas), así que React nunca arrancaba y el pop-up no llegaba a
// existir en producción — se puede comprobar en el HTML publicado, que no
// contiene ni el nombre del archivo del flyer.
//
// La solución no es devolverle el JS al home (es la decisión de la nota 09 y
// lo que sostiene el rendimiento en móvil), sino la misma que ya usa el
// contador del hero: el marcado lo pinta el servidor y un script vainilla de
// unas 30 líneas marcado con data-mantener —lo único que el limpiador
// respeta— lo enseña. Cero framework.
const CLAVE_SESION = "flyer-visto";

// Los dos artes de la campaña de agosto de 2026. Nombres nuevos a propósito:
// Cloudflare no deja pisar el Cache-Control de los binarios y una imagen
// reemplazada bajo el mismo nombre se queda 16 días en los navegadores
// (public/_headers y docs/CAMBIO-IMAGENES.md).
const FLYERS = [
  {
    base: "flyer-vendido",
    href: "/inscripcion/",
    alt: "8K Ruta de las Mandarinas · 90% vendido · Valle de Patate, 29 de agosto, salida en Patate Gardens · premios económicos: 2 motos y dos pasajes internacionales a Medellín — toca para inscribirte",
  },
  {
    base: "flyer-kits",
    href: "/informacion/",
    alt: "Entrega de kits: viernes 28 de agosto de 10h00 a 17h00 en Vehicentro (Ficoa, Ambato), Av. los Guaytambos y La Delicia. Es obligatorio presentar la cédula y el comprobante del pago; el kit que no se retire en ese horario se pierde — toca para ver la información completa",
  },
] as const;

export default function PopupFlyer() {
  return (
    <>
      <div
        id="flyer-pop"
        role="dialog"
        aria-modal="true"
        aria-label="8K Ruta de las Mandarinas — 90% vendido y entrega de kits"
        // Nace oculto y el script lo enseña con un display en línea (que gana a
        // cualquier clase). Sin JavaScript se queda oculto, que es exactamente
        // lo que debe pasar: es un añadido, no contenido.
        className="fixed inset-0 z-[9999] hidden items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="relative w-full max-w-[420px] lg:max-w-4xl">
          {/* Botón de cerrar: 44px, alto contraste, esquina de la tarjeta. */}
          <button
            id="flyer-cerrar"
            type="button"
            data-cerrar=""
            aria-label="Cerrar"
            className="absolute -top-3 -right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl leading-none font-black text-[#c51850] shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            ×
          </button>

          {/* Los dos flyers. En móvil van apilados con scroll propio (dos artes
              verticales no caben de otra forma sin encogerlos hasta que no se
              lea la letra pequeña del kit); en lg+ caben uno al lado del otro.
              overscroll-contain para que al llegar al final no arrastre la
              página de detrás. */}
          <div className="grid max-h-[78vh] gap-3 overflow-y-auto overscroll-contain rounded-2xl lg:max-h-none lg:grid-cols-2 lg:gap-4 lg:overflow-visible">
            {FLYERS.map(({ base, href, alt }) => (
              // <a> normal y no <Link>: en el home no hay router de cliente que
              // interceptar, y next/link aquí solo añadiría peso.
              <a
                key={base}
                href={href}
                data-cerrar=""
                className="block overflow-hidden rounded-2xl bg-[#2a0a18] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
              >
                {/* Variantes al tamaño real de la tarjeta (≤420px de CSS en
                    móvil, ~460px por columna en lg+): servir los originales de
                    1080 y 1748px era regalar la mitad de los bytes. */}
                <img
                  src={`/fotos/${base}-840.webp`}
                  srcSet={`/fotos/${base}-480.webp 480w, /fotos/${base}-840.webp 840w`}
                  sizes="(min-width: 1024px) min(50vw, 460px), min(100vw - 2rem, 420px)"
                  alt={alt}
                  width={840}
                  height={979}
                  className="h-auto w-full"
                  // lazy dentro de un contenedor oculto = no se descarga nada
                  // hasta que el pop-up se abre. Las medidas reales van puestas
                  // para que el hueco no salte al llegar la imagen.
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>

          {/* Ayuda de cierre explícita (buena práctica de pop-up). */}
          <button
            type="button"
            data-cerrar=""
            className="mx-auto mt-3 block rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            Cerrar y ver la página
          </button>
        </div>
      </div>

      {/* El script. data-mantener para que scripts/sin-js-home.mjs no lo borre
          (es la misma marca que lleva el contador del hero).
          Dos detalles que no son evidentes:
          - Al abrir, el nodo se MUEVE al <body>. Dentro de <main> (que es
            z-10) la barra inferior y el header, que son z-50, se le ponían
            encima aunque el pop-up pida z-9999: el z-index no sale del
            contexto de apilado de su padre. Es lo que hacía createPortal.
          - Los clics en el fondo se ignoran durante 400 ms. El pop-up se abre
            con el pointerdown, y el click que viene detrás caía sobre el fondo
            recién aparecido: se abría y se cerraba con el mismo toque. */}
      <script
        data-mantener=""
        dangerouslySetInnerHTML={{
          __html: `(function(){var K=${JSON.stringify(CLAVE_SESION)};try{if(sessionStorage.getItem(K))return}catch(e){}var p=document.getElementById("flyer-pop");if(!p)return;var abierto=0,t0=0,ov="";function tecla(e){if(e.key==="Escape")cerrar()}function cerrar(){if(!abierto)return;abierto=0;p.style.display="none";document.body.style.overflow=ov;document.removeEventListener("keydown",tecla);try{sessionStorage.setItem(K,"1")}catch(e){}}function abrir(){if(abierto)return;abierto=1;t0=Date.now();document.body.appendChild(p);ov=document.body.style.overflow;p.style.display="flex";document.body.style.overflow="hidden";document.addEventListener("keydown",tecla);var b=document.getElementById("flyer-cerrar");if(b)b.focus()}p.addEventListener("click",function(e){var t=e.target;if((t&&t.closest&&t.closest("[data-cerrar]"))||(t===p&&Date.now()-t0>400))cerrar()});var ev=["scroll","pointerdown","keydown"];function una(){ev.forEach(function(n){window.removeEventListener(n,una)});abrir()}ev.forEach(function(n){window.addEventListener(n,una,{passive:true})})})();`,
        }}
      />
    </>
  );
}
