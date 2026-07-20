"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useFormulario } from "./contexto";
import type { FormDataState } from "./tipos";

/**
 * Un campo del formulario: etiqueta, input, visto verde o aviso de error.
 *
 * Era una función `renderInputField` de 130 líneas dentro de FormInscripcion,
 * declarada dentro del propio componente para poder leer el estado por cierre.
 * Eso significaba que ni los pasos podían salir de allí (usan esta función) ni
 * la función podía salir (usa el estado). Ahora el estado llega por contexto y
 * las dos cosas se pueden separar.
 */
export function CampoTexto({
  name,
  label,
  icon,
  type = "text",
  placeholder,
  onBlur,
  autoComplete,
  inputMode,
  enterKeyHint = "next",
  maxLength,
  max,
  hint,
  list,
  autoFocus,
}: {
  name: keyof FormDataState;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  /** Extra al salir del campo, además de validarlo (p. ej. buscar la cédula). */
  onBlur?: () => void;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "decimal";
  enterKeyHint?: "next" | "done" | "send";
  maxLength?: number;
  max?: string;
  hint?: string;
  list?: string;
  autoFocus?: boolean;
}) {
  const { formData, errors, esValido, alEscribir, alSalir, alEnfocar } =
    useFormulario();

  const error = errors[name];
  const ok = esValido(name) && !error;

  // Los iconos de Phosphor pintan con currentColor, así que el color de la
  // etiqueta los arrastra. Al mover la etiqueta según el estado, el icono cambia
  // en sincronía con el borde del input y sin una línea de JS: gris en reposo,
  // naranja al tocarlo, verde cuando el dato sirve, rojo si falla. El error
  // manda sobre el foco.
  const colorEtiqueta = error
    ? "text-red-300"
    : ok
      ? "text-green-400 group-focus-within:text-[#f7771c]"
      : "text-gray-200 group-focus-within:text-[#f7771c]";

  return (
    <div className="group relative">
      <label
        htmlFor={name}
        className={`font-barlow mb-2 flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-colors duration-150 md:text-base ${colorEtiqueta}`}
      >
        {icon} {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          autoComplete={autoComplete}
          maxLength={maxLength}
          max={max}
          list={list}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          value={formData[name] ? String(formData[name]) : ""}
          onChange={alEscribir}
          onFocus={alEnfocar}
          onBlur={() => {
            alSalir(name);
            onBlur?.();
          }}
          placeholder={placeholder}
          className={`font-barlow min-h-[56px] w-full rounded-xl border-2 bg-[#200815] px-5 py-4 pr-12 text-lg text-white placeholder-gray-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] md:text-xl ${
            // El input type="date" en iOS trae un ancho nativo propio y no
            // respeta w-full: se sale por la derecha. appearance-none + min-w-0
            // le quitan ese ancho intrínseco y ya cabe en la tarjeta.
            type === "date"
              ? "min-w-0 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-date-and-time-value]:text-left"
              : ""
          } ${
            error
              ? "border-red-400 focus-visible:ring-red-400"
              : ok
                ? "border-green-500/70 focus-visible:ring-green-500"
                : "border-white/25 hover:border-white/45 focus:border-[#f7771c] focus-visible:ring-[#f7771c]"
          } `}
        />
        {ok && (
          <CheckCircle
            size={22}
            className="animate-in fade-in zoom-in-75 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-green-500 duration-200"
          />
        )}
        {error && (
          <WarningCircle
            size={22}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-400"
          />
        )}
      </div>
      {error ? (
        <p
          id={`${name}-error`}
          role="alert"
          className="font-barlow mt-2 flex items-start gap-1.5 text-sm font-medium text-red-300 md:text-base"
        >
          <WarningCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      ) : hint ? (
        <p
          id={`${name}-hint`}
          className="font-barlow mt-2 text-sm text-gray-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
