import type { Metadata } from "next";
import {
  FECHA_CARRERA,
  VIDEO_FONDO_SRC,
  VIDEO_FONDO_POSTER,
  PRECIO_PREVENTA,
  PRECIO_DESCUENTO,
  CUPOS_VENDIDOS_PCT,
  CATEGORIAS,
  WHATSAPP_SOPORTE,
} from "../lib/carrera";
import { srcSetDe } from "../lib/imagen";

export const metadata: Metadata = {
  title: "La Carrera · 8K Ruta de las Mandarinas",
  description:
    "La 8K Ruta de las Mandarinas en una página editorial: la salida en Patate Gardens, la ruta entre cultivos, el kit, las categorías y las fechas que importan.",
};

// Página /carrera (nota 21): la traducción FIEL de la referencia Ruvent —
// hero tipográfico con tarjeta flotante, partners, sección editorial,
// acordeón nativo, trío de fotos con etiquetas, tarjetas de fechas y cierre
// de preguntas — con la identidad, los datos y las fotos REALES de la 8K.
// El home oficial no se toca. Componente de SERVIDOR: cero JavaScript salvo
// el contador vainilla (data-mantener).

function diasFaltantes() {
  const ms = new Date(FECHA_CARRERA).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

const ACORDEON = [
  {
    t: "La ruta, calle por calle",
    c: "Salida en Patate Gardens, subida a San Jorge, los viveros de Chalpi, Juan León Mera y la recta final por la Av. Ambato hasta el Estadio Municipal. Vías cerradas de 07h00 a 10h00 con apertura progresiva.",
  },
  {
    t: "Qué incluye tu inscripción",
    c: "Camiseta oficial, dorsal, chip de cronometraje, medalla y obsequios de auspiciantes. En la ruta: hidratación, asistencia y seguridad.",
  },
  {
    t: "Categorías y precios",
    c: `Élite Pro 8K (hasta 39 años) y Máster (40–64): $${PRECIO_PREVENTA}. Leyenda (65 en adelante) y Especiales: $${PRECIO_DESCUENTO}. El formulario te sugiere la tuya según tu edad.`,
  },
  {
    t: "Cómo se paga",
    c: "Transferencia bancaria o QR deúna! a la cuenta oficial; subes tu comprobante en la página y validamos en 2 o 3 días laborables. Sin cambios ni devoluciones una vez concluida la inscripción.",
  },
];

const HITOS = [
  {
    fecha: "Vie 28 de agosto · 10h00–17h00",
    titulo: "Entrega de kits",
    lugar:
      "Vehicentro | Sinotruk – Ficoa, Av. los Guaytambos y La Delicia, Ambato",
    href: "/reglamento#art-7",
  },
  {
    fecha: "Sáb 29 de agosto · 08h00",
    titulo: "La salida",
    lugar: "Patate Gardens — 8 km por calles y zonas rurales",
    href: "/ruta/",
  },
  {
    fecha: "Sáb 29 de agosto",
    titulo: "Llegada y premiación",
    lugar: "Estadio Municipal de Patate — tarima, sonido y premios en efectivo",
    href: "/reglamento#art-13",
  },
];

export default function CarreraPage() {
  const dias = diasFaltantes();

  return (
    <div id="tope" className="w-full bg-[#fdf6ee] text-[#2a161e]">
      {/* ============ HERO TIPOGRÁFICO ============ */}
      <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="mx-auto w-full max-w-7xl">
          <div className="font-barlow flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[11px] font-bold tracking-[0.18em] text-[#7c5f52] uppercase sm:text-xs">
            <span>Patate · Tungurahua</span>
            <span>Sábado 29 de agosto · 08h00</span>
            <span className="hidden sm:inline">8 kilómetros</span>
          </div>

          <h1 className="mt-3 font-(family-name:--font-titular) text-[clamp(2.4rem,8vw,7.2rem)] leading-[0.9] tracking-wide uppercase">
            Ruta de las
            <br />
            <span className="text-[#d2600f]">Mandarinas</span>
          </h1>

          <div className="relative mt-8 overflow-hidden rounded-2xl bg-black sm:mt-10">
            <img
              className="h-[420px] w-full object-cover object-top sm:h-[480px] lg:hidden"
              src="/hero-movil-real.webp"
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="lazy"
            />
            <img
              className="hidden aspect-21/9 w-full object-cover lg:block"
              src={VIDEO_FONDO_POSTER}
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="lazy"
            />
            <video
              className="absolute inset-0 hidden h-full w-full object-cover lg:block"
              poster={VIDEO_FONDO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source
                src={VIDEO_FONDO_SRC}
                media="(min-width: 1024px)"
                type="video/mp4"
              />
            </video>
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10"
              aria-hidden="true"
            />

            <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white p-5 shadow-[0_18px_50px_rgba(20,3,9,0.35)] sm:right-auto sm:bottom-6 sm:left-6 sm:w-90 sm:p-6">
              <p className="font-barlow text-[11px] font-bold tracking-[0.16em] text-[#b83f00] uppercase">
                Últimos días · {CUPOS_VENDIDOS_PCT}% vendido
              </p>
              <p className="font-barlow mt-1 text-sm leading-snug text-[#4c3a41]">
                Desde ${PRECIO_DESCUENTO} · incluye camiseta, dorsal, chip y
                medalla
              </p>
              <a
                href="/inscripcion/"
                className="font-barlow mt-4 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#c51850] px-8 text-base font-bold tracking-[0.08em] text-white uppercase transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Inscribirme ahora
              </a>
              <p className="font-barlow mt-3 text-center text-xs font-bold tracking-[0.14em] text-[#7c5f52] uppercase">
                <span className="lg:hidden">
                  Faltan {dias} {dias === 1 ? "día" : "días"}
                </span>
                <span className="hidden tabular-nums lg:inline">
                  Faltan <span id="cd-d">{dias}</span>d{" "}
                  <span id="cd-h">--</span>:<span id="cd-m">--</span>:
                  <span id="cd-s">--</span>
                </span>
              </p>
              <script
                data-mantener=""
                dangerouslySetInnerHTML={{
                  __html: `(function(){var f=new Date(${JSON.stringify(FECHA_CARRERA)}).getTime();function p(n){return n<10?"0"+n:""+n}function t(){var r=f-Date.now();if(r<0)r=0;var d=Math.floor(r/864e5),h=Math.floor(r/36e5)%24,m=Math.floor(r/6e4)%60,s=Math.floor(r/1e3)%60;var e=function(i,v){var x=document.getElementById(i);if(x)x.textContent=v};e("cd-d",""+d);e("cd-h",p(h));e("cd-m",p(m));e("cd-s",p(s))}t();setInterval(t,1000)})();`,
                }}
              />
            </div>

            <p className="font-barlow absolute right-6 bottom-6 hidden max-w-60 text-right text-sm leading-snug font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] lg:block">
              8 km entre las calles y cultivos de Patate — salida en Patate
              Gardens, llegada al Estadio Municipal ↗
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN EDITORIAL ASIMÉTRICA ============ */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 className="max-w-xl font-(family-name:--font-titular) text-[36px] leading-[0.95] tracking-wide uppercase sm:text-[48px]">
              Patate corre entre sus{" "}
              <span className="text-[#d2600f]">calles y cultivos</span>
            </h2>
            <p className="font-barlow mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              La carrera forma parte de las festividades de Patate: sale de
              Patate Gardens, sube a San Jorge, pasa por los viveros de Chalpi y
              entra por la Av. Ambato al Estadio Municipal, donde esperan la
              tarima y la premiación.
            </p>
            <a
              href="/ruta/"
              className="font-barlow mt-7 inline-flex min-h-13 items-center justify-center rounded-full border-2 border-[#2a161e]/15 px-8 text-base font-bold tracking-[0.08em] uppercase transition hover:border-[#b83f00] hover:text-[#b83f00]"
            >
              Ver el recorrido
            </a>
          </div>
          <div className="grid grid-cols-[1.35fr_1fr] items-end gap-4">
            <img
              src="/fotos/corredores-12.webp"
              srcSet={`${srcSetDe("/fotos/corredores-12.webp") ?? ""}, /fotos/corredores-12-960.webp 960w`}
              sizes="(max-width: 1024px) 60vw, 380px"
              alt="Corredores por las calles de Patate en la edición anterior"
              width={640}
              height={376}
              className="aspect-4/5 w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/fotos/corredores-24.webp"
              srcSet={`${srcSetDe("/fotos/corredores-24.webp") ?? ""}, /fotos/corredores-24-960.webp 960w`}
              sizes="(max-width: 1024px) 40vw, 280px"
              alt="Grupo de corredores con su medalla de la edición anterior"
              width={640}
              height={375}
              className="aspect-square w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ============ FOTO + ACORDEÓN NATIVO ============ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img
            src="/fotos/corredores-05.webp"
            srcSet={`${srcSetDe("/fotos/corredores-05.webp") ?? ""}, /fotos/corredores-05-960.webp 960w`}
            sizes="(max-width: 1024px) 100vw, 620px"
            alt="Podio de premiación de la edición anterior"
            width={640}
            height={376}
            className="aspect-4/3 w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h2 className="max-w-lg font-(family-name:--font-titular) text-[34px] leading-[0.95] tracking-wide uppercase sm:text-[44px]">
              Correr con <span className="text-[#d2600f]">propósito</span>
            </h2>
            <div className="mt-6 divide-y divide-[#2a161e]/10 border-y border-[#2a161e]/10">
              {ACORDEON.map((a) => (
                <details key={a.t} className="group py-4">
                  <summary className="font-barlow flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold sm:text-lg [&::-webkit-details-marker]:hidden">
                    {a.t}
                    <span
                      aria-hidden="true"
                      className="text-[#d2600f] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="font-barlow mt-2 max-w-prose text-sm leading-relaxed text-gray-600 sm:text-base">
                    {a.c}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRÍO DE FOTOS CON ETIQUETAS ============ */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-(family-name:--font-titular) text-[34px] leading-[0.95] tracking-wide uppercase sm:text-[44px]">
              Comunidad, esfuerzo{" "}
              <span className="text-[#d2600f]">y premiación</span>
            </h2>
            <a
              href="/galeria/"
              className="font-barlow inline-flex min-h-11 items-center text-sm font-bold tracking-widest text-[#b83f00] uppercase underline decoration-2 underline-offset-4 hover:text-[#2a161e]"
            >
              Ver todas las fotos
            </a>
          </div>

          <div className="mt-8 grid items-start gap-4 md:grid-cols-[1fr_1.5fr_1fr]">
            <figure>
              <img
                src="/fotos/corredores-21.webp"
                srcSet={`${srcSetDe("/fotos/corredores-21.webp") ?? ""}, /fotos/corredores-21-960.webp 960w`}
                sizes="(max-width: 768px) 100vw, 300px"
                alt="Corredores celebrando con su medalla"
                width={640}
                height={376}
                className="aspect-square w-full rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="font-barlow mt-3 text-sm font-bold tracking-widest text-[#7c5f52] uppercase">
                Comunidad
              </figcaption>
            </figure>
            <figure className="md:mt-10">
              <img
                src="/fotos/corredores-12.webp"
                srcSet={`${srcSetDe("/fotos/corredores-12.webp") ?? ""}, /fotos/corredores-12-960.webp 960w`}
                sizes="(max-width: 768px) 100vw, 480px"
                alt="Corredores en plena ruta por las calles de Patate"
                width={640}
                height={376}
                className="aspect-video w-full rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="font-barlow mt-3 text-sm font-bold tracking-widest text-[#7c5f52] uppercase">
                En la ruta
              </figcaption>
            </figure>
            <figure>
              <img
                src="/fotos/corredores-02.webp"
                srcSet={`${srcSetDe("/fotos/corredores-02.webp") ?? ""}, /fotos/corredores-02-960.webp 960w`}
                sizes="(max-width: 768px) 100vw, 300px"
                alt="Podio de premiación de la edición anterior"
                width={640}
                height={376}
                className="aspect-square w-full rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="font-barlow mt-3 text-sm font-bold tracking-widest text-[#7c5f52] uppercase">
                Premiación
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ LAS FECHAS QUE IMPORTAN ============ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="max-w-2xl font-(family-name:--font-titular) text-[34px] leading-[0.95] tracking-wide uppercase sm:text-[44px]">
            Las fechas <span className="text-[#d2600f]">que importan</span>
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {HITOS.map((h) => (
              <a
                key={h.titulo}
                href={h.href}
                className="group rounded-2xl border border-[#2a161e]/10 bg-white p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[#d2600f]/50"
              >
                <span className="font-barlow inline-block rounded-full border border-[#2a161e]/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#7c5f52] uppercase">
                  {h.fecha}
                </span>
                <h3 className="font-barlow mt-4 text-xl font-bold">
                  {h.titulo}
                </h3>
                <p className="font-barlow mt-2 text-sm leading-relaxed text-gray-600">
                  {h.lugar}
                </p>
                <span className="font-barlow mt-4 inline-block text-sm font-bold tracking-widest text-[#b83f00] uppercase">
                  Ver detalle{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>

          {/* Categorías en línea, como los datos compactos de la referencia. */}
          <div className="font-barlow mt-10 grid gap-y-2 rounded-2xl border border-[#2a161e]/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIAS.map((c) => (
              <p key={c.nombre} className="text-sm text-gray-600">
                <strong className="text-[#2a161e]">{c.nombre}</strong> ·{" "}
                {c.edades} ·{" "}
                <strong className="text-[#b83f00]">${c.precio}</strong>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CIERRE DE PREGUNTAS (estilo Ruvent) ============ */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="max-w-xl font-(family-name:--font-titular) text-[38px] leading-[0.92] tracking-wide uppercase sm:text-[52px]">
              ¿Tienes preguntas{" "}
              <span className="text-[#d2600f]">antes de correr?</span>
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent("Hola, tengo una consulta sobre la 8K Ruta de las Mandarinas 2026.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-barlow inline-flex min-h-13 items-center justify-center rounded-full bg-[#c51850] px-8 text-base font-bold tracking-[0.08em] text-white uppercase transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Escribir por WhatsApp
              </a>
              <a
                href="/informacion/"
                className="font-barlow inline-flex min-h-13 items-center justify-center rounded-full border-2 border-[#2a161e]/15 px-8 text-base font-bold tracking-[0.08em] uppercase transition hover:border-[#b83f00] hover:text-[#b83f00]"
              >
                Toda la información
              </a>
            </div>
          </div>
          <div className="font-barlow grid gap-2 text-base">
            <a
              href="/inscripcion/"
              className="font-bold text-[#b83f00] underline decoration-2 underline-offset-4 hover:text-[#2a161e]"
            >
              Inscripción
            </a>
            <a href="/ruta/" className="text-gray-600 hover:text-[#b83f00]">
              El recorrido
            </a>
            <a href="/galeria/" className="text-gray-600 hover:text-[#b83f00]">
              Galería
            </a>
            <a
              href="/reglamento/"
              className="text-gray-600 hover:text-[#b83f00]"
            >
              Reglamento
            </a>
            <a
              href="/verificar/"
              className="text-gray-600 hover:text-[#b83f00]"
            >
              Mi pago
            </a>
            <a
              href="#tope"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-[#7c5f52] uppercase hover:text-[#2a161e]"
            >
              ↑ Volver arriba
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
