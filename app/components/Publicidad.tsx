// El banner de "Inscripciones abiertas", debajo del contador.
//
// Viene de op1.png (1916x821, 2 MB) reescalado a 1600 y pasado por cwebp a
// calidad 82: 90 KB, un 96% menos, con PSNR 43,6 dB — o sea, sin diferencia
// visible. Es lo primero que ve quien baja del hero, así que carga en eager.
// Arte oficial 2026 actualizado (v2). Nombres nuevos para saltar la caché de
// Cloudflare. Horizontal para escritorio, vertical (la corredora, promo $20)
// para móvil.
const DESKTOP_IMAGE = "/fotos/banner-inscripciones-v2.webp";
const MOBILE_IMAGE = "/fotos/post-8k-v2.webp";

export default function Publicidad() {
  return (
    <section className="mt-3 mb-2 flex w-full justify-center px-4 md:mt-5 md:mb-3">
      <div
        className="relative w-full max-w-7xl overflow-hidden rounded-[20px] bg-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] md:rounded-[32px]"
        // bg-gray-200 ayuda a que se vea un cuadro gris sutil mientras carga, mejorando la percepción
      >
        {/* Las medidas son las reales de cada archivo, no estimadas: si no cuadran,
            el navegador reserva un hueco del tamaño equivocado y la página salta al cargar. */}
        <picture className="block h-auto w-full">
          <source
            media="(min-width: 768px)"
            srcSet={DESKTOP_IMAGE}
            width={1600}
            height={711}
          />
          <img
            src={MOBILE_IMAGE}
            alt="8K Ruta de las Mandarinas · Inscripciones abiertas · Precio preventa $20 (hasta el 31 de agosto) · Lugar: Valle de Patate · Fecha: 29 de agosto · Salida: Patate Gardens"
            width={900}
            height={1124}
            className="h-auto w-full"
            // Ni eager ni fetchPriority: este banner está DEBAJO del pliegue —
            // el hero ocupa la pantalla entera. Con prioridad alta le robaba el
            // turno al logo del hero, que es el LCP de verdad.
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
