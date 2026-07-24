"use client";

import { useEffect, useState } from "react";
import { FECHA_CARRERA } from "../lib/carrera";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
const INITIAL: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calc(): TimeLeft {
  const diff = new Date(FECHA_CARRERA).getTime() - Date.now();
  if (diff <= 0) return INITIAL;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
const pad = (n: number) => n.toString().padStart(2, "0");

// Contador VIVO — solo escritorio. Es una isla: se separó del hero para que el
// hero pueda ser un componente de SERVIDOR (cero JS). En móvil se enseña el
// número de días estático que renderiza el servidor; este bloque devuelve null
// hasta confirmar que la pantalla es de escritorio, así que en el teléfono su
// código llega pero no monta el DOM ni arranca el setInterval. El chunk pesa
// unos cientos de bytes frente a hidratar el hero entero.
export default function ContadorDesktop() {
  const [esEscritorio, setEsEscritorio] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEsEscritorio(mq.matches);
    const alCambiar = () => setEsEscritorio(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  useEffect(() => {
    if (!esEscritorio) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calc());

    let timer: ReturnType<typeof setInterval> | undefined;
    const arrancar = () => {
      if (timer) return;
      timer = setInterval(() => setTimeLeft(calc()), 1000);
    };
    const parar = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const alVisibilidad = () => {
      if (document.visibilityState === "visible") {
        setTimeLeft(calc());
        arrancar();
      } else {
        parar();
      }
    };
    arrancar();
    document.addEventListener("visibilitychange", alVisibilidad);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", alVisibilidad);
    };
  }, [esEscritorio]);

  if (!esEscritorio) return null;

  const blocks = [
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Minutos", value: pad(timeLeft.minutes) },
    { label: "Segundos", value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-4 gap-4 md:max-w-2xl md:gap-5">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="relative flex min-h-[clamp(56px,11vh,95px)] min-w-0 flex-col items-center justify-center overflow-hidden rounded-t-md rounded-b-xl border-x border-b border-white/10 bg-black/55 px-1 py-[clamp(0.35rem,1vh,0.75rem)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:rounded-b-2xl sm:px-2"
        >
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
          <span className="mt-[clamp(0.15rem,0.6vh,0.5rem)] font-[family-name:var(--font-titular)] text-[clamp(7px,min(1.5vh,2.1vw),1rem)] font-black tracking-[0.18em] text-white/80 uppercase">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
