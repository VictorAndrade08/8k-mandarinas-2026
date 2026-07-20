"use client";

import { Clock, WarningCircle } from "@phosphor-icons/react";

/**
 * El tiempo que queda para terminar la inscripción.
 *
 * Se enseña siempre, no solo cuando queda poco: un contador que aparece de
 * repente a falta de dos minutos asusta más que informa. Y cuando entra en los
 * últimos dos minutos cambia de color y dice explícitamente qué va a pasar,
 * porque perder un formulario lleno sin aviso previo es de las peores cosas que
 * le puedes hacer a alguien que está intentando pagarte.
 */
export function ContadorSesion({
  texto,
  enAviso,
}: {
  /** mm:ss */
  texto: string;
  enAviso: boolean;
}) {
  if (!texto) return null;

  return (
    <div
      className={`font-barlow flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
        enAviso
          ? "border-red-400/50 bg-red-500/10 text-red-200"
          : "border-white/10 bg-white/[0.04] text-gray-300"
      }`}
      // polite y no assertive: que lo lea al terminar la frase que esté
      // leyendo, no interrumpiendo a mitad de un campo.
      aria-live="polite"
    >
      {enAviso ? (
        <WarningCircle size={18} className="shrink-0 text-red-300" />
      ) : (
        <Clock size={18} className="shrink-0" />
      )}
      <span>
        {enAviso ? "Quedan" : "Tienes"}{" "}
        {/* tabular-nums para que los dígitos no bailen al cambiar el segundo */}
        <strong className="font-bold text-white tabular-nums">{texto}</strong>{" "}
        {/* Lo que dice tiene que ser verdad: la sesión caduca, pero los datos NO
            se borran. Prometer un castigo que no llega enseña a la gente a no
            hacer caso del siguiente aviso. */}
        {enAviso
          ? "para terminar tu inscripción"
          : "para completar tu inscripción"}
      </span>
    </div>
  );
}
