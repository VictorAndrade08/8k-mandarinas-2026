import Link from "next/link";
import { Package, FileArrowDown } from "@phosphor-icons/react/dist/ssr";

// Los dos artes oficiales de la campaña de agosto, en el home.
//
// Antes aquí iba un solo banner (banner-inscripciones-v3 en escritorio,
// post-8k-v3 en móvil). Ahora van los dos flyers que ya usa el pop-up: el
// pop-up se ve UNA vez por sesión y solo con JavaScript, así que quien vuelve
// al sitio, quien lo tiene desactivado o quien entra desde un enlace directo no
// los veía nunca. En el home los ve todo el mundo, siempre.
//
// Debajo, la entrega de kits escrita en HTML: el texto de un JPG no lo lee
// Google, ni un lector de pantalla, ni se puede copiar. Y a dos días de la
// carrera es el dato que más se consulta.
const FLYERS = [
  {
    base: "flyer-vendido",
    href: "/inscripcion/",
    alt: "8K Ruta de las Mandarinas · 90% vendido · Valle de Patate, 29 de agosto, salida en Patate Gardens · premios económicos: 2 motos y dos pasajes internacionales a Medellín",
  },
  {
    base: "flyer-kits",
    href: "/guiacorredor/",
    alt: "Entrega de kits: viernes 28 de agosto de 10h00 a 17h00 en Vehicentro (Ficoa, Ambato), Av. los Guaytambos y La Delicia. Es obligatorio presentar la cédula y el comprobante del pago",
  },
] as const;

export default function Publicidad() {
  return (
    <section
      aria-label="Inscripciones y entrega de kits"
      className="mt-3 w-full px-4 md:mt-5"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          {FLYERS.map(({ base, href, alt }) => (
            <Link
              key={base}
              href={href}
              className="block overflow-hidden rounded-[20px] bg-[#2a0a18] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5 md:rounded-[28px]"
            >
              {/* Las medidas son las reales del archivo: si no cuadran, el
                  navegador reserva un hueco del tamaño equivocado y la página
                  salta al cargar. */}
              <img
                src={`/fotos/${base}-840.webp`}
                srcSet={`/fotos/${base}-480.webp 480w, /fotos/${base}-840.webp 840w`}
                sizes="(min-width: 640px) min(50vw, 620px), calc(100vw - 2rem)"
                alt={alt}
                width={840}
                height={979}
                className="h-auto w-full"
                // Está debajo del pliegue — el hero ocupa la pantalla entera —
                // así que ni eager ni fetchPriority: con prioridad alta le roban
                // el turno al logo del hero, que es el LCP de verdad.
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </div>

        {/* LA ENTREGA DEL KIT, EN TEXTO. Mismos datos que el flyer de arriba y
            que /guiacorredor — salen del PDF oficial de la Guía del Corredor. */}
        <div className="mt-4 rounded-[20px] border border-[#ffc53d]/40 bg-[#ffc53d]/[0.07] p-5 sm:p-6 md:mt-6 md:rounded-[28px]">
          <h2 className="font-barlow flex items-center gap-2.5 text-xl font-bold text-white sm:text-2xl">
            <Package size={26} className="shrink-0 text-[#ffc53d]" />
            Retira tu kit el viernes 28
          </h2>
          <p className="font-barlow mt-2 text-base leading-relaxed text-white/85 sm:text-lg">
            De <strong className="text-white">10h00 a 17h00</strong> en{" "}
            <strong className="text-white">
              Vehicentro | Sinotruk – Ficoa
            </strong>
            , Av. los Guaytambos y La Delicia, Ambato. Es la única entrega.
          </p>
          <p className="font-barlow mt-2 text-base leading-relaxed text-white/70">
            Lleva tu <strong className="text-white/90">cédula a color</strong> y
            el{" "}
            <strong className="text-white/90">
              comprobante de inscripción
            </strong>
            . Después de ese horario no se aceptan reclamos ni reembolsos.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/guiacorredor"
              className="font-barlow inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#c51850] px-7 text-base font-bold text-white transition hover:brightness-110"
            >
              <FileArrowDown size={20} weight="bold" />
              Guía del corredor 2026
            </Link>
            <Link
              href="/verificar"
              className="font-barlow inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/25 px-7 text-base font-bold text-white transition hover:bg-white/10"
            >
              Ver mi inscripción
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
