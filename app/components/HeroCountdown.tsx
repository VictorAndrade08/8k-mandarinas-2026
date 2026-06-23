"use client";

import { useEffect, useState } from "react";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-barlow-hero",
});

const VIDEO_ID = "I8EtjbDIOR4";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const INITIAL_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(): TimeLeft {
  const eventDate = new Date("2026-08-29T08:00:00-05:00").getTime();
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

  const videoSrc =
    `https://www.youtube-nocookie.com/embed/${VIDEO_ID}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}` +
    `&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&showinfo=0&fs=0&cc_load_policy=0`;

  return (
    <section
      className={`relative w-full h-screen min-h-[640px] overflow-hidden bg-black ${barlow.variable}`}
    >
      {/* VIDEO DE FONDO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <iframe
          src={videoSrc}
          title="8K Ruta de las Mandarinas — Video"
          allow="autoplay; encrypted-media; picture-in-picture"
          aria-hidden="true"
          tabIndex={-1}
          frameBorder={0}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "max(177.78vh, 300vw)",
            height: "max(56.25vw, 168.75vh)",
            transform: "translate(-50%, -50%) scale(1.6)",
            transformOrigin: "center center",
            pointerEvents: "none",
            border: 0,
          }}
        />
      </div>

      {/* Capa anti-controles de YouTube */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true" />

      {/* OVERLAY MANDARINA — naranja a magenta como en el flyer */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,140,26,0.78) 0%, rgba(255,107,26,0.85) 30%, rgba(255,78,90,0.85) 60%, rgba(255,45,124,0.85) 85%, rgba(184,24,106,0.88) 100%)",
        }}
      />
      {/* Capa de profundidad oscura encima para mejor legibilidad */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%)",
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

      {/* CONTENIDO — 3 grupos distribuidos verticalmente */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12 sm:gap-16 h-full w-full px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-12 text-center text-white">

        {/* GRUPO SUPERIOR — header + logo principal */}
        <div className="flex flex-col items-center w-full">
          <p className="font-[family-name:var(--font-barlow-hero)] text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.32em] sm:tracking-[0.4em] text-white/85 font-semibold mb-5 sm:mb-7 whitespace-nowrap">
            <span className="text-white">8K</span>
            <span className="mx-2 sm:mx-3 text-white/40">·</span>
            <span>Patate</span>
            <span className="mx-2 sm:mx-3 text-white/40">·</span>
            <span>Ecuador</span>
          </p>

          <img
            src="/logo-mandarinas-blanco.svg"
            alt="8K Ruta de las Mandarinas"
            className="w-[240px] sm:w-[340px] md:w-[440px] lg:w-[520px] xl:w-[580px] h-auto select-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
            draggable={false}
          />

          <p className="mt-8 sm:mt-10 md:mt-12 font-[family-name:var(--font-barlow-hero)] text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.25em] sm:tracking-[0.32em] text-white font-bold whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Sábado · 29 agosto · 2026
          </p>
        </div>

        {/* GRUPO CENTRAL — contador */}
        <div className="flex flex-col items-center w-full">
          <p className="font-[family-name:var(--font-barlow-hero)] text-white/85 uppercase tracking-[0.3em] sm:tracking-[0.35em] text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-3 sm:mb-4 md:mb-5">
            Faltan para el inicio
          </p>

          <div className="grid grid-cols-4 gap-2 xs:gap-3 sm:gap-5 md:gap-6 w-full max-w-[300px] xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto">
            {blocks.map((b) => (
              <div
                key={b.label}
                className="
                  min-w-0
                  flex flex-col items-center justify-center
                  bg-white/[0.06] backdrop-blur-md
                  border border-white/15
                  rounded-xl sm:rounded-2xl
                  py-2 sm:py-2.5 md:py-3
                  px-1 sm:px-2
                  shadow-[0_18px_60px_rgba(0,0,0,0.4)]
                  min-h-[68px] sm:min-h-[82px] md:min-h-[95px]
                  overflow-hidden
                "
              >
                <span
                  className="
                    font-[family-name:var(--font-barlow-hero)]
                    font-black italic
                    text-[24px] xs:text-[30px] sm:text-[38px] md:text-[48px] lg:text-[56px]
                    leading-none text-white tabular-nums
                    drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]
                  "
                  suppressHydrationWarning
                >
                  {b.value}
                </span>
                <span className="mt-1 sm:mt-1.5 md:mt-2 font-[family-name:var(--font-barlow-hero)] text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-[0.08em] xs:tracking-[0.15em] sm:tracking-[0.22em] uppercase text-white font-bold">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* BOTÓN DE INSCRIPCIÓN */}
          <a
            href="/inscripcion/"
            className="
              mt-8 sm:mt-10 md:mt-12
              inline-flex items-center justify-center
              rounded-full bg-white
              px-10 py-4 sm:px-14 sm:py-5
              font-[family-name:var(--font-barlow-hero)]
              text-base sm:text-lg md:text-xl
              font-bold uppercase tracking-[0.22em]
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
