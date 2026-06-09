"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-barlow-hero",
});

const VIDEO_ID = "2gLjb0nnq_4";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const INITIAL_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(): TimeLeft {
  const eventDate = new Date("2026-11-15T07:00:00-05:00").getTime();
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
          title="10K Independencia de Ambato — Video"
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

      {/* OVERLAY OSCURO base */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(4,4,4,0.92) 100%)",
        }}
      />
      {/* Vignette central extra fuerte para tapar controles de YouTube */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%)",
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

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 py-8 sm:py-10 text-center text-white">
        {/* Top label */}
        <p className="font-[family-name:var(--font-barlow-hero)] text-[11px] xs:text-[12px] sm:text-base md:text-lg lg:text-xl uppercase tracking-[0.32em] sm:tracking-[0.4em] text-white/80 font-semibold mb-3 sm:mb-5 whitespace-nowrap">
          <span className="text-white">10K</span>
          <span className="mx-2 sm:mx-3 text-white/40">·</span>
          <span>Ambato</span>
          <span className="mx-2 sm:mx-3 text-white/40">·</span>
          <span>Ecuador</span>
        </p>

        {/* Logo oficial 10K Independencia de Ambato */}
        <div className="relative w-full max-w-[260px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[540px] xl:max-w-[620px] mx-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
          <Image
            src="/logo-10k.webp"
            alt="10K Independencia de Ambato"
            width={1622}
            height={515}
            priority
            sizes="(max-width: 640px) 260px, (max-width: 768px) 340px, (max-width: 1024px) 440px, (max-width: 1280px) 540px, 620px"
            className="w-full h-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* Sub fecha */}
        <p className="mt-5 sm:mt-8 font-[family-name:var(--font-barlow-hero)] text-[12px] xs:text-[13px] sm:text-lg md:text-xl lg:text-2xl uppercase tracking-[0.25em] sm:tracking-[0.32em] text-white/85 font-semibold whitespace-nowrap">
          Domingo · 15 noviembre · 2026
        </p>

        {/* Faltan */}
        <p className="mt-3 sm:mt-5 font-[family-name:var(--font-barlow-hero)] text-white/65 uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] sm:text-sm md:text-base">
          Faltan para el inicio
        </p>

        {/* CONTADOR */}
        <div className="mt-4 sm:mt-6 grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-5 w-full max-w-4xl">
          {blocks.map((b) => (
            <div
              key={b.label}
              className="
                flex flex-col items-center justify-center
                bg-white/[0.06] backdrop-blur-md
                border border-white/15
                rounded-xl sm:rounded-2xl md:rounded-3xl
                py-2.5 sm:py-4 md:py-6
                px-1 sm:px-3
                shadow-[0_18px_60px_rgba(0,0,0,0.4)]
                min-h-[80px] sm:min-h-[110px] md:min-h-[140px]
              "
            >
              <span
                className="
                  font-[family-name:var(--font-barlow-hero)]
                  font-black italic
                  text-[34px] xs:text-[40px] sm:text-[56px] md:text-[80px] lg:text-[100px]
                  leading-none text-white tabular-nums
                  drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]
                "
                suppressHydrationWarning
              >
                {b.value}
              </span>
              <span className="mt-1 sm:mt-2 font-[family-name:var(--font-barlow-hero)] text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs tracking-[0.18em] sm:tracking-[0.28em] uppercase text-white/70 font-semibold">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
