import {
  FECHA_CARRERA,
  VIDEO_FONDO_POSTER,
  PRECIO_DESCUENTO,
  CUPOS_VENDIDOS_PCT,
} from "../lib/carrera";
import ContadorDesktop from "./ContadorDesktop";
import VideoFondoDesktop from "./VideoFondoDesktop";

// COMPONENTE DE SERVIDOR — a propósito no lleva "use client".
//
// Antes el hero entero era cliente y se hidrataba en el móvil aunque ahí es
// puro contenido estático (logo, fecha, días, botón, una imagen). Eso obligaba
// a descargar y ejecutar el JS del hero en el teléfono para nada. Ahora el hero
// es HTML de servidor con CERO JS, y lo único interactivo —el vídeo de fondo y
// el contador vivo, ambos SOLO de escritorio— vive en dos islas cliente
// (VideoFondoDesktop, ContadorDesktop) que devuelven null en móvil. En el
// teléfono no entra ni el vídeo ni el reloj: solo se pinta el número de días.
// (docs/100-MOVIL.md, técnica 21: no hidratar contenido presentacional.)

// Días que faltan, calculados en el BUILD (y en el primer render). Es lo que se
// enseña en móvil: un número fijo, sin setInterval ni reloj. El sitio es
// estático, así que se refresca en cada despliegue — suficiente a semanas vista.
const MS_DIA = 1000 * 60 * 60 * 24;
function diasFaltantes(): number {
  const diff = new Date(FECHA_CARRERA).getTime() - Date.now();
  return diff > 0 ? Math.ceil(diff / MS_DIA) : 0;
}

export default function HeroCountdown() {
  const dias = diasFaltantes();

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      {/* FONDO DE ESCRITORIO — poster inmediato (server) + vídeo encima (isla).
          El poster da fondo desde el primer pixel mientras el vídeo, que carga
          tras confirmar escritorio, lo cubre. En móvil va oculto (lg:block). */}
      <img
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover select-none lg:block"
        src={VIDEO_FONDO_POSTER}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />
      <VideoFondoDesktop />

      {/* FONDO MÓVIL — la ilustración vertical de corredores. Es el LCP en el
          teléfono: fetchPriority alta, decode async. (docs/HERO-IMAGEN.md) */}
      <img
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none lg:hidden"
        src="/hero-movil-corredores.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
      />

      {/* OVERLAY MANDARINA — naranja a magenta como en el flyer. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,140,26,0.42) 0%, rgba(247,119,28,0.48) 30%, rgba(255,78,90,0.50) 60%, rgba(197,24,80,0.52) 85%, rgba(184,24,106,0.58) 100%)",
        }}
      />
      {/* Viñeta MÁS SUAVE: antes ahogaba el fondo (0.46→0.72). Bajada para que
          el hero se vea vibrante como el banner, sin perder el foco del texto. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 92% 72% at center, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.52) 100%)",
        }}
      />
      {/* Solo MÓVIL: degradado ciruela superior para respaldar el logo blanco
          sobre el cielo crema de la ilustración. Más ligero que antes (0.82) —
          justo lo necesario para que el logo se lea sin oscurecer la escena. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,7,17,0.58) 0%, rgba(28,7,17,0.26) 30%, rgba(28,7,17,0) 52%)",
        }}
      />
      {/* Grano: textura webp pre-horneada (no feTurbulence, que rasterizarlo en
          el móvil retenía el primer pintado del LCP). */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "url(/texturas/grano.webp)",
          backgroundSize: "160px 160px",
        }}
      />

      {/* CONTENIDO. En móvil se ancla arriba (la píldora del header va oculta en
          el home móvil); desde sm+ se centra. */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-start gap-[clamp(1.25rem,4vh,4rem)] px-4 pt-[clamp(4.5rem,12vh,7rem)] pb-[clamp(1rem,4vh,3rem)] text-center text-white sm:justify-center sm:px-6 sm:pt-[165px]">
        {/* GRUPO SUPERIOR — logo (LCP). */}
        <div className="flex w-full flex-col items-center">
          <img
            src="/logo-mandarinas-blanco.webp"
            alt="8K Ruta de las Mandarinas"
            width={900}
            height={316}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="h-auto max-h-[min(20vh,190px)] w-[min(78vw,580px)] object-contain select-none"
            draggable={false}
          />
          <p className="mt-[clamp(0.75rem,2.5vh,3rem)] font-[family-name:var(--font-titular)] text-[clamp(0.8rem,min(3.2vh,3.7vw),2.4rem)] font-black tracking-[0.2em] whitespace-nowrap text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:tracking-[0.2em]">
            Sábado · 29 agosto · 2026
          </p>
        </div>

        {/* GRUPO CENTRAL — contador. */}
        <div className="flex w-full flex-col items-center">
          {/* Prueba social + urgencia. El número sale de INSCRITOS_APROX en
              lib/carrera.ts —el total REAL que maneja la organización, online
              (Airtable/D1) MÁS los de efectivo aún sin pasar al sistema— y se
              actualiza a mano ahí. (docs/30-UX-CONVERSION.md, tips 6 y 24.) */}
          <p className="mb-[clamp(0.6rem,1.8vh,1.5rem)] inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-1.5 text-[clamp(0.62rem,min(1.9vh,2.9vw),0.95rem)] font-bold tracking-[0.04em] text-white backdrop-blur-sm">
            🔥 {CUPOS_VENDIDOS_PCT}% vendido
          </p>
          <p className="mb-[clamp(0.4rem,1.4vh,1.25rem)] font-[family-name:var(--font-titular)] text-[clamp(0.62rem,min(2vh,2.6vw),1.45rem)] font-black tracking-[0.2em] text-white/90 uppercase sm:tracking-[0.2em]">
            Faltan para el inicio
          </p>

          {/* MÓVIL — número de días ESTÁTICO (server, sin JS de reloj). */}
          <div className="relative mx-auto flex min-h-[clamp(84px,16vh,120px)] w-full max-w-[260px] flex-col items-center justify-center overflow-hidden rounded-t-md rounded-b-2xl border-x border-b border-white/10 bg-black/55 px-4 py-[clamp(0.6rem,2vh,1rem)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] lg:hidden">
            <span
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f7771c] via-[#ee374b] to-[#c51850]"
              aria-hidden="true"
            />
            <span className="font-[family-name:var(--font-titular)] text-[clamp(48px,18vw,88px)] leading-none font-black text-white italic tabular-nums">
              {dias}
            </span>
            <span className="mt-[clamp(0.2rem,0.8vh,0.6rem)] font-[family-name:var(--font-titular)] text-[clamp(11px,3.4vw,1.1rem)] font-black tracking-[0.22em] text-white/80 uppercase">
              {dias === 1 ? "Día" : "Días"}
            </span>
          </div>

          {/* ESCRITORIO — contador vivo (isla cliente, null en móvil). Reserva
              alto para no causar CLS mientras hidrata. */}
          <div className="hidden min-h-[95px] w-full lg:block">
            <ContadorDesktop />
          </div>

          {/* BOTÓN DE INSCRIPCIÓN. */}
          <a
            href="/inscripcion/"
            className="mt-[clamp(1rem,3.5vh,3rem)] inline-flex items-center justify-center rounded-full bg-white px-10 py-[clamp(0.6rem,1.8vh,1.25rem)] font-[family-name:var(--font-titular)] text-[clamp(0.9rem,2.2vh,1.4rem)] font-black tracking-[0.22em] text-[#c51850] uppercase shadow-[0_12px_45px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:px-14"
          >
            Inscribirme ahora
          </a>

          {/* Valor de un vistazo: distancia + precio + qué incluye, junto al
              CTA. Es lo que un desconocido necesita para decidir sin bajar.
              El precio y el kit salen de fuentes únicas (carrera.ts, reglamento
              art. 6). (docs/30-UX-CONVERSION.md, tips 2 y 9.) */}
          <p className="mt-[clamp(0.6rem,1.8vh,1.1rem)] max-w-[22rem] text-[clamp(0.72rem,min(1.7vh,2.7vw),1rem)] leading-snug font-semibold tracking-wide text-white/90">
            8 km · Patate · salida 08h00 · desde ${PRECIO_DESCUENTO} · incluye
            camiseta, dorsal, chip y medalla
          </p>
          {/* Las tres dudas que frenan el clic, resueltas antes de pulsarlo:
              cómo se paga, dónde va el comprobante y cuándo se confirma. */}
          <p className="mt-[clamp(0.35rem,1.2vh,0.75rem)] max-w-[24rem] text-[clamp(0.62rem,min(1.5vh,2.4vw),0.85rem)] leading-snug text-white/75">
            Pago por transferencia bancaria · subes tu comprobante en la página
            · validación en 2 o 3 días laborables
          </p>
        </div>
      </div>
    </section>
  );
}
