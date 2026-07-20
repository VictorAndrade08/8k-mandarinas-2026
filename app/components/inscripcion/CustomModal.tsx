"use client";

import {
  X,
  WarningCircle,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";

/**
 * Aviso modal del formulario. Sustituye al alert() nativo: no bloquea el hilo y
 * se puede vestir como el resto del sitio.
 *
 * En móvil sube desde abajo (bottom sheet) porque el pulgar llega ahí; en
 * escritorio se centra.
 */
// --- Componente: Modal de Alertas ---
export const CustomModal = ({
  isOpen,
  title,
  message,
  type = "error",
  actionLabel,
  onAction,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    // En móvil sube desde abajo (bottom sheet); en desktop se centra.
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md duration-200 sm:items-center sm:p-4">
      <div className="animate-in slide-in-from-bottom-6 sm:zoom-in-95 sm:slide-in-from-bottom-0 relative w-full max-w-md rounded-t-3xl border border-white/10 bg-[#200815] p-6 pb-8 shadow-2xl sm:rounded-2xl md:p-8">
        <div
          className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-white/25 sm:hidden"
          aria-hidden="true"
        />
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 flex h-12 w-12 items-center justify-center rounded-xl text-gray-300 transition outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20 ${
              type === "error"
                ? "bg-red-500/20 text-red-500"
                : type === "warning"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-green-500/20 text-green-500"
            }`}
          >
            {type === "error" && <WarningCircle size={36} />}
            {type === "warning" && <WarningCircle size={36} />}
            {type === "success" && <CheckCircle size={36} />}
          </div>
          <h3 className="font-bebas text-3xl font-bold text-white uppercase md:text-4xl">
            {title}
          </h3>
          <p className="font-barlow text-lg leading-relaxed text-gray-300">
            {message}
          </p>

          <div className="mt-2 flex w-full flex-col gap-3">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="font-barlow flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7771c] py-4 text-lg font-bold text-white shadow-lg shadow-[#f7771c]/20 transition hover:bg-[#d2600f] md:text-xl"
              >
                {actionLabel} <ArrowRight size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className={`font-barlow w-full rounded-xl py-4 text-lg font-bold transition md:text-xl ${actionLabel ? "bg-[#331023] text-gray-400 hover:bg-[#471830] hover:text-white" : "bg-white text-black hover:bg-gray-200"}`}
            >
              {actionLabel ? "Cerrar" : "Entendido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
