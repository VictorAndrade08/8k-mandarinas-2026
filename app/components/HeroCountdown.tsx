"use client";

import { useEffect, useState } from "react";
import {
  VIDEO_FONDO_SRC,
  VIDEO_FONDO_POSTER,
  FECHA_CARRERA,
} from "../lib/carrera";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const INITIAL_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(): TimeLeft {
  const eventDate = new Date(FECHA_CARRERA).getTime();
  const diff = eventDate - Date.now();
  if (diff <= 0) return INITIAL_TIME;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL_TIME);
  // El vídeo de fondo solo en escritorio y solo tras montar.
  //
  // `preload="none"` no basta: `autoPlay` obliga al navegador a descargarlo de
  // todos modos. Eran 2,4 MB compitiendo con el logo y el contador, y en 4G eso
  // ponía el LCP en 8,9 s — nueve segundos hasta que la página parecía viva.
  //
  // Detrás de un degradado al 50% y una viñeta, en un móvil no se distingue casi
  // nada del vídeo. La espera sí se nota. Queda el póster, que pesa 24 KB.
  const [ponerVideo, setPonerVideo] = useState(false);
  useEffect(() => {
    // El ancho de pantalla no existe en el build: el HTML lo genera el servidor,
    // que no sabe en qué dispositivo se va a abrir. Por eso se decide al montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(min-width: 1024px)").matches) setPonerVideo(true);
  }, []);

  useEffect(() => {
    // La regla set-state-in-effect avisa de renders en cascada, y tiene razón en
    // general. Aquí es justo lo que hay que hacer: el sitio se compila a HTML
    // estático, así que el servidor no sabe qué hora es en el navegador de quien
    // entra. Si calculáramos el tiempo en el primer render, el HTML generado en
    // el build diría una cosa y el cliente otra, y React tiraría un error de
    // hidratación. Por eso se monta en ceros y se calcula al montar: un render
    // de más a cambio de que el contador sea correcto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calculateTimeLeft());

    let timer: ReturnType<typeof setInterval> | undefined;
    const arrancar = () => {
      if (timer) return;
      timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    };
    const parar = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    // Con la pestaña de fondo el contador no se ve, pero seguía despertando el
    // hilo principal una vez por segundo y gastando batería del móvil para nada.
    // Al volver se recalcula desde la fecha, así que no se desfasa.
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "visible") {
        setTimeLeft(calculateTimeLeft());
        arrancar();
      } else {
        parar();
      }
    };

    arrancar();
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, []);

  const blocks = [
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Minutos", value: pad(timeLeft.minutes) },
    { label: "Segundos", value: pad(timeLeft.seconds) },
  ];

  return (
    <section
      className={`relative h-screen min-h-[640px] w-full overflow-hidden bg-black`}
    >
      {/* VIDEO DE FONDO
          Antes era un iframe de YouTube con autoplay=1&mute=1 que no llegaba a
          arrancar: se quedaba el botón de play fantasma de YouTube en medio del
          hero. Un <video> propio sí autoarranca — muted + playsInline es lo que
          exigen los navegadores — y encima carga desde nuestro dominio. */}
      {ponerVideo ? (
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          src={VIDEO_FONDO_SRC}
          poster={VIDEO_FONDO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : (
        // En móvil solo el póster: 24 KB en vez de 2,4 MB.
        <img
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          src={VIDEO_FONDO_POSTER}
          alt=""
          aria-hidden="true"
        />
      )}

      {/* OVERLAY MANDARINA — naranja a magenta como en el flyer.
          Estaba a 0.78-0.88 y, con la capa negra encima, tapaba ~95% del vídeo:
          el fondo quedaba en un lavado marrón donde no se distinguía nada. A la
          mitad, el valle y el Tungurahua se ven y la marca sigue tiñendo. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,140,26,0.42) 0%, rgba(247,119,28,0.48) 30%, rgba(255,78,90,0.50) 60%, rgba(197,24,80,0.52) 85%, rgba(184,24,106,0.58) 100%)",
        }}
      />
      {/* Viñeta: oscurece los bordes y deja el centro limpio, que es donde va el
          texto. Antes oscurecía también el centro y ahogaba la imagen. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at center, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.56) 60%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      {/* Grano */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* CONTENIDO — 3 grupos distribuidos verticalmente.
          El pt de arriba reserva el header: como el header va fixed, no ocupa
          sitio, y sin esta reserva el contenido se centraba contra toda la
          pantalla y en portátiles bajos el logo se metía debajo de la píldora.
          Las medidas van en vh y no en breakpoints de ancho porque lo que aquí
          aprieta es el alto: un portátil de 1440x700 es ancho y bajo, así que
          por ancho no salta ningún breakpoint y aun así no cabe. Con clamp la
          pieza encoge sola en vez de chocar. */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-[clamp(1.25rem,4vh,4rem)] px-4 pt-[140px] pb-[clamp(1rem,4vh,3rem)] text-center text-white sm:px-6 sm:pt-[165px]">
        {/* GRUPO SUPERIOR — logo principal.
            Sin el rótulo "8K · Patate · Ecuador": con el header flotando encima
            del vídeo, quedaba justo debajo de la píldora y se tocaban. Además
            repetía lo que ya dice el logo que tiene debajo. */}
        <div className="flex w-full flex-col items-center">
          {/* max-h además del ancho: el logo es muy apaisado, así que fijándolo
              solo por ancho se comía el alto entero en pantallas bajas. */}
          {/* Este logo ES el LCP de la página: es lo más grande del primer
              pantallazo. fetchPriority="high" le dice al navegador que lo baje
              antes que nada — sin esto esperaba su turno detrás del CSS y los
              chunks, y ese retraso era casi 2 s del LCP. Nunca lazy aquí. */}
          {/* webp y no SVG: el SVG del logo son 55 KB de vectores que el
              navegador rasteriza en el móvil (era parte de los 2 s de retraso);
              el webp son 21 KB y ya viene pintado. Sin drop-shadow por el mismo
              motivo — la viñeta del hero ya oscurece el fondo.
              width/height reales para reservar el hueco y no causar CLS. */}
          <img
            src="/logo-mandarinas-blanco.webp"
            alt="8K Ruta de las Mandarinas"
            width={900}
            height={316}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="h-auto max-h-[min(20vh,190px)] w-[min(78vw,580px)] object-contain select-none"
            draggable={false}
          />

          {/* min(vh, vw) y no solo vh: con `whitespace-nowrap`, esta línea no
              puede partirse, así que lo que manda es el ancho. Un móvil es
              estrecho y alto — 3.2vh de un iPhone son 27px, y a ese tamaño
              "Sábado · 29 agosto · 2026" con este tracking se sale de los 390px
              por los dos lados. Mirando también el vw, encoge cuando toca. */}
          <p className="mt-[clamp(0.75rem,2.5vh,3rem)] font-[family-name:var(--font-titular)] text-[clamp(0.8rem,min(3.2vh,3.7vw),2.4rem)] font-black tracking-[0.2em] whitespace-nowrap text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:tracking-[0.2em]">
            Sábado · 29 agosto · 2026
          </p>
        </div>

        {/* GRUPO CENTRAL — contador */}
        <div className="flex w-full flex-col items-center">
          <p className="mb-[clamp(0.4rem,1.4vh,1.25rem)] font-[family-name:var(--font-titular)] text-[clamp(0.62rem,min(2vh,2.6vw),1.45rem)] font-black tracking-[0.2em] text-white/90 uppercase sm:tracking-[0.2em]">
            Faltan para el inicio
          </p>

          <div className="xs:gap-3 xs:max-w-sm mx-auto grid w-full max-w-[300px] grid-cols-4 gap-2 sm:max-w-xl sm:gap-4 md:max-w-2xl md:gap-5">
            {blocks.map((b) => (
              <div
                key={b.label}
                className="relative flex min-h-[clamp(56px,11vh,95px)] min-w-0 flex-col items-center justify-center overflow-hidden rounded-t-md rounded-b-xl border-x border-b border-white/10 bg-black/55 px-1 py-[clamp(0.35rem,1vh,0.75rem)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:rounded-b-2xl sm:px-2"
              >
                {/* franja superior estilo dorsal de carrera */}
                <span
                  className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f7771c] via-[#ee374b] to-[#c51850]"
                  aria-hidden="true"
                />
                <span
                  className="font-[family-name:var(--font-titular)] text-[clamp(24px,min(7vw,8vh),68px)] leading-none font-black text-white italic tabular-nums"
                  suppressHydrationWarning
                >
                  {b.value}
                </span>
                {/* "SEGUNDOS" es la palabra más larga y su caja mide un cuarto
                    del ancho: el tamaño tiene que salir del vw, no del vh, o se
                    corta en móvil. Sin tracking hasta xs por el mismo motivo. */}
                <span className="xs:tracking-[0.1em] mt-[clamp(0.15rem,0.6vh,0.5rem)] font-[family-name:var(--font-titular)] text-[clamp(7px,min(1.5vh,2.1vw),1rem)] font-black tracking-normal text-white/80 uppercase sm:tracking-[0.18em]">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* BOTÓN DE INSCRIPCIÓN */}
          <a
            href="/inscripcion/"
            className="mt-[clamp(1rem,3.5vh,3rem)] inline-flex items-center justify-center rounded-full bg-white px-10 py-[clamp(0.6rem,1.8vh,1.25rem)] font-[family-name:var(--font-titular)] text-[clamp(0.9rem,2.2vh,1.4rem)] font-black tracking-[0.22em] text-[#c51850] uppercase shadow-[0_12px_45px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:px-14"
          >
            Inscríbete ahora
          </a>
        </div>
      </div>
    </section>
  );
}
