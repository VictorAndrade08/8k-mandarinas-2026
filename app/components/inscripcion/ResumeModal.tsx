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
    <div className="animate-in fade-in fixed inset-0 z-[110] flex items-end justify-center bg-black/95 backdrop-blur-md duration-300 sm:items-center sm:p-4">
      <div className="animate-in slide-in-from-bottom-6 sm:zoom-in-95 sm:slide-in-from-bottom-0 relative w-full max-w-lg rounded-t-3xl border border-[#FF6B1A]/30 bg-[#1C2029] p-6 pb-8 shadow-[0_0_50px_rgba(255,107,26,0.18)] sm:rounded-3xl md:p-8">
        <div
          className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-white/25 sm:hidden"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A]">
            <ArrowsClockwise size={40} />
          </div>

          <div>
            <h3 className="font-barlow mb-3 text-3xl font-bold text-white uppercase md:text-4xl">
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
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-5 text-lg font-bold text-white shadow-lg shadow-[#FF6B1A]/20 transition hover:bg-[#E55104]"
            >
              Continuar mi inscripción <ArrowRight size={20} />
            </button>

            <button
              onClick={onNew}
              className="rounded-xl border border-white/10 bg-[#0F1218] px-6 py-4 text-base font-bold text-gray-300 transition hover:bg-[#252A36] hover:text-white"
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
