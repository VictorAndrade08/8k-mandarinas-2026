"use client";

import { useEffect, useState } from "react";
import { VIDEO_FONDO_SRC, VIDEO_FONDO_POSTER } from "../lib/carrera";

// Vídeo de fondo — SOLO escritorio. Isla separada para que el hero sea un
// componente de servidor (cero JS). En móvil no monta nada: el fondo del hero
// en el teléfono es la ilustración estática que pinta el servidor. Aquí el
// `autoPlay` obligaba a descargar 2,4 MB aunque estuviera oculto por CSS; al
// devolver null hasta confirmar escritorio, el móvil ni pide el vídeo.
export default function VideoFondoDesktop() {
  const [esEscritorio, setEsEscritorio] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEsEscritorio(mq.matches);
    const alCambiar = () => setEsEscritorio(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  if (!esEscritorio) return null;

  return (
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
  );
}
