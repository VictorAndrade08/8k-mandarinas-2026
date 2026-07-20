"use client";

import { createContext, useContext } from "react";
import type { FormDataState } from "./tipos";

/**
 * Lo que cada campo del formulario necesita saber para pintarse.
 *
 * Va por contexto y no por props porque los pasos 2 y 3 tienen entre los dos
 * catorce campos, y pasarle estas seis cosas a cada uno significaría que cada
 * paso arrastra seis props que no usa, solo para reenviarlas. Es el caso de
 * libro para un contexto: muchos consumidores, un único origen, y nada que
 * cambie por rama.
 */
export interface Formulario {
  formData: FormDataState;
  errors: Partial<Record<keyof FormDataState, string>>;
  /** Si el valor actual del campo pasa sus reglas. Pinta el visto verde. */
  esValido: (name: keyof FormDataState) => boolean;
  // Sin HTMLTextAreaElement: este formulario no tiene ninguno, y añadirlo "por
  // si acaso" obliga al manejador de arriba a aceptar un tipo que no maneja.
  alEscribir: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  alSalir: (name: keyof FormDataState) => void;
  /** Sube el campo por encima del teclado del móvil al enfocarlo. */
  alEnfocar: (e: React.FocusEvent<HTMLElement>) => void;
}

const FormularioContext = createContext<Formulario | null>(null);

export const FormularioProvider = FormularioContext.Provider;

/**
 * Falla a propósito si se usa fuera del proveedor: devolver undefined y dejar
 * que reviente más adentro, en un `formData.cedula` cualquiera, convierte un
 * error de montaje en una caza de media hora.
 */
export function useFormulario(): Formulario {
  const ctx = useContext(FormularioContext);
  if (!ctx) {
    throw new Error(
      "useFormulario() solo funciona dentro de <FormularioProvider>."
    );
  }
  return ctx;
}
