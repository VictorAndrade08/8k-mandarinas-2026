"use client";

import { ArrowRight, ArrowsClockwise } from "@phosphor-icons/react";

/**
 * Se ofrece al volver si quedó una inscripción a medias en este dispositivo.
 *
 * Existe porque el formulario son cuatro pasos y la gente se va a buscar el
 * comprobante del banco a mitad: sin esto, al volver empezaban de cero.
 */
// --- Modal: Retomar inscripción guardada ---
export const ResumeModal = ({
  isOpen,
  step,
  onResume,
  onNew,
}: {
  isOpen: boolean;
  step: number;
  onResume: () => void;
  onNew: () => void;
}) => {
  if (!isOpen) return null;
  const labels = ["Categoría", "Datos", "Pago", "Final"];

  return (
    // Centrado en TODAS las pantallas: antes iba anclado abajo en móvil (estilo
    // bottom-sheet) y la barra del navegador le tapaba los botones. Como es un
    // diálogo de decisión —no un panel deslizable— centrarlo se lee mejor y no
    // pelea con el chrome del teléfono.
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md duration-300"
    >
      <div className="animate-in zoom-in-95 fade-in relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#f7771c]/30 bg-[#361126] p-6 shadow-[0_0_50px_rgba(247,119,28,0.18)] duration-300 sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f7771c]/10 text-[#f7771c]">
            <ArrowsClockwise size={40} />
          </div>

          <div>
            <h3
              id="resume-title"
              className="font-barlow mb-3 text-2xl font-bold text-white uppercase sm:text-3xl md:text-4xl"
            >
              Tienes una inscripción sin terminar
            </h3>
            <p className="font-barlow text-lg leading-relaxed text-gray-300 md:text-xl">
              Guardamos tu avance en el{" "}
              <strong className="text-white">
                Paso {step} ({labels[step - 1] || "Datos"})
              </strong>
              . ¿Quieres continuar donde te quedaste?
            </p>
          </div>

          <div className="font-barlow mt-2 grid w-full grid-cols-1 gap-3">
            <button
              onClick={onResume}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#f7771c] px-6 py-5 text-lg font-bold text-white shadow-lg shadow-[#f7771c]/20 transition hover:bg-[#d2600f]"
            >
              Continuar mi inscripción <ArrowRight size={20} />
            </button>

            <button
              onClick={onNew}
              className="rounded-xl border border-white/10 bg-[#200815] px-6 py-4 text-base font-bold text-gray-300 transition hover:bg-[#471830] hover:text-white"
            >
              Empezar una nueva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Un sitio de estafa nunca tiene a quién reclamarle. Este bloque va en la barra
// lateral en desktop y al final del contenido en móvil (donde la lateral se apila arriba).
