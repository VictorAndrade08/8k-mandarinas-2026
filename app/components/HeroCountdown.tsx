"use client";

import { useEffect, useState } from "react";
import { VIDEO_FONDO_SRC, VIDEO_FONDO_POSTER, FECHA_CARRERA } from "../lib/carrera";


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

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Minutos", value: pad(timeLeft.minutes) },
    { label: "Segundos", value: pad(timeLeft.seconds) },
  ];

  return (
    <section
      className={`relative w-full h-screen min-h-[640px] overflow-hidden bg-black`}
    >
      {/* VIDEO DE FONDO
          Antes era un iframe de YouTube con autoplay=1&mute=1 que no llegaba a
          arrancar: se quedaba el botón de play fantasma de YouTube en medio del
          hero. Un <video> propio sí autoarranca — muted + playsInline es lo que
          exigen los navegadores — y encima carga desde nuestro dominio. */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        src={VIDEO_FONDO_SRC}
        poster={VIDEO_FONDO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* OVERLAY MANDARINA — naranja a magenta como en el flyer.
          Estaba a 0.78-0.88 y, con la capa negra encima, tapaba ~95% del vídeo:
          el fondo quedaba en un lavado marrón donde no se distinguía nada. A la
          mitad, el valle y el Tungurahua se ven y la marca sigue tiñendo. */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,140,26,0.42) 0%, rgba(255,107,26,0.48) 30%, rgba(255,78,90,0.50) 60%, rgba(255,45,124,0.52) 85%, rgba(184,24,106,0.58) 100%)",
        }}
      />
      {/* Viñeta: oscurece los bordes y deja el centro limpio, que es donde va el
          texto. Antes oscurecía también el centro y ahogaba la imagen. */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at center, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.56) 60%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      {/* Grano */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-30"
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
      <div className="relative z-10 flex flex-col items-center justify-center gap-[clamp(1.25rem,4vh,4rem)] h-full w-full px-4 sm:px-6 pt-[140px] sm:pt-[165px] pb-[clamp(1rem,4vh,3rem)] text-center text-white">

        {/* GRUPO SUPERIOR — logo principal.
            Sin el rótulo "8K · Patate · Ecuador": con el header flotando encima
            del vídeo, quedaba justo debajo de la píldora y se tocaban. Además
            repetía lo que ya dice el logo que tiene debajo. */}
        <div className="flex flex-col items-center w-full">
          {/* max-h además del ancho: el logo es muy apaisado, así que fijándolo
              solo por ancho se comía el alto entero en pantallas bajas. */}
          <img
            src="/logo-mandarinas-blanco.svg"
            alt="8K Ruta de las Mandarinas"
            className="w-[min(78vw,580px)] max-h-[min(20vh,190px)] h-auto object-contain select-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
            draggable={false}
          />

          <p className="mt-[clamp(0.75rem,2.5vh,3rem)] font-[family-name:var(--font-poppins)] text-[clamp(1.05rem,3.2vh,2.4rem)] uppercase tracking-[0.25em] sm:tracking-[0.32em] text-white font-black whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Sábado · 29 agosto · 2026
          </p>
        </div>

        {/* GRUPO CENTRAL — contador */}
        <div className="flex flex-col items-center w-full">
          <p className="font-[family-name:var(--font-poppins)] text-white/90 uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[clamp(0.82rem,2vh,1.45rem)] font-black mb-[clamp(0.4rem,1.4vh,1.25rem)]">
            Faltan para el inicio
          </p>

          <div className="grid grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 w-full max-w-[300px] xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto">
            {blocks.map((b) => (
              <div
                key={b.label}
                className="
                  relative min-w-0 overflow-hidden
                  flex flex-col items-center justify-center
                  bg-black/55
                  border-x border-b border-white/10
                  rounded-b-xl sm:rounded-b-2xl rounded-t-md
                  py-[clamp(0.35rem,1vh,0.75rem)]
                  px-1 sm:px-2
                  shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                  min-h-[clamp(56px,11vh,95px)]
                "
              >
                {/* franja superior estilo dorsal de carrera */}
                <span
                  className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF8C1A] via-[#FF4E5A] to-[#FF2D7C]"
                  aria-hidden="true"
                />
                <span
                  className="
                    font-[family-name:var(--font-poppins)]
                    font-black italic
                    text-[clamp(24px,min(7vw,8vh),68px)]
                    leading-none text-white tabular-nums
                  "
                  suppressHydrationWarning
                >
                  {b.value}
                </span>
                <span className="mt-[clamp(0.15rem,0.6vh,0.5rem)] font-[family-name:var(--font-poppins)] text-[clamp(9px,1.5vh,1rem)] tracking-[0.08em] xs:tracking-[0.15em] sm:tracking-[0.22em] uppercase text-white/80 font-black">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* BOTÓN DE INSCRIPCIÓN */}
          <a
            href="/inscripcion/"
            className="
              mt-[clamp(1rem,3.5vh,3rem)]
              inline-flex items-center justify-center
              rounded-full bg-white
              px-10 sm:px-14 py-[clamp(0.6rem,1.8vh,1.25rem)]
              font-[family-name:var(--font-poppins)]
              text-[clamp(0.9rem,2.2vh,1.4rem)]
              font-black uppercase tracking-[0.22em]
              text-[#B8186A]
              shadow-[0_12px_45px_rgba(0,0,0,0.5)]
              transition-transform duration-300
              hover:scale-105 active:scale-95
            "
          >
            Inscríbete ahora
          </a>
        </div>
      </div>
    </section>
  );
}
