"use client";

import { useEffect, useRef, useState } from "react";
import { STORAGE_KEY } from "./constantes";
import type { FormDataState, MetodoPago, ProgresoGuardado } from "./tipos";

/**
 * Guarda el avance del formulario en localStorage y lo ofrece al volver.
 *
 * Existe porque son cuatro pasos y la gente se va a mitad a buscar el
 * comprobante del banco, o cierra sin querer: sin esto, al volver empezaban de
 * cero y muchos ya no volvían a empezar.
 *
 * Lo que NO se guarda es el archivo del comprobante — un File no cabe en un
 * JSON — así que al retomar el campo aparece vacío. Es lo correcto: la foto
 * sigue en su galería y volver a elegirla es un toque.
 *
 * El precio se guarda pero no se usa para cobrar. Cualquiera puede abrir las
 * DevTools y escribir lo que quiera en localStorage; el precio lo decide
 * functions/api/inscribir.js con su propio catálogo.
 */
export function useProgresoGuardado({
  step,
  selectedCategory,
  selectedPrice,
  acceptTerms,
  metodoPago,
  formData,
  aplicar,
}: {
  step: number;
  selectedCategory: string;
  selectedPrice: number;
  acceptTerms: boolean;
  metodoPago: MetodoPago;
  formData: FormDataState;
  /** Vuelca el progreso guardado en el estado del formulario. */
  aplicar: (guardado: ProgresoGuardado) => void;
}) {
  // Hasta que no se decide si se retoma o se empieza de nuevo, no se guarda
  // nada: si no, el primer render pisaría lo guardado con el formulario vacío.
  const hidratado = useRef(false);
  const guardado = useRef<ProgresoGuardado | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pasoGuardado, setPasoGuardado] = useState(1);

  // 1) Al entrar: si hay avance de verdad, se pregunta.
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(STORAGE_KEY);
      if (crudo) {
        const data = JSON.parse(crudo) as ProgresoGuardado;
        const fd = data.formData || {};
        // "Avance de verdad" y no "existe la clave": haber tocado el paso 1 y
        // salir no es progreso, y preguntar por eso molesta sin aportar.
        const hayAvance =
          (data.step && data.step > 1) ||
          Boolean(fd.cedula || fd.nombres || fd.email || data.selectedCategory);
        if (hayAvance) {
          guardado.current = data;
          // localStorage solo existe en el navegador: el HTML lo genera el build
          // y allí no hay nada guardado. Leerlo durante el render daría un HTML
          // distinto del que pinta el cliente y React se quejaría de hidratación.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPasoGuardado(data.step || 1);
          setModalAbierto(true);
          return; // se espera la decisión antes de guardar nada
        }
      }
    } catch {
      // localStorage puede estar bloqueado (modo privado de Safari, permisos).
      // No poder guardar el avance no es motivo para no dejar inscribirse.
    }
    hidratado.current = true;
  }, []);

  // 2) Guardar ante cualquier cambio.
  useEffect(() => {
    if (!hidratado.current) return;
    if (step >= 4) return; // ya terminó: no hay nada que retomar
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          selectedCategory,
          selectedPrice,
          acceptTerms,
          metodoPago,
          formData: { ...formData, comprobante: undefined },
        })
      );
    } catch {}
  }, [
    step,
    selectedCategory,
    selectedPrice,
    acceptTerms,
    metodoPago,
    formData,
  ]);

  return {
    /** Si hay que enseñar el modal de "tienes una inscripción sin terminar". */
    modalAbierto,
    /** En qué paso se quedó, para nombrarlo en el modal. */
    pasoGuardado,

    /** Continuar donde se quedó. */
    retomar: () => {
      if (guardado.current) aplicar(guardado.current);
      setModalAbierto(false);
      hidratado.current = true;
    },

    /** Empezar de nuevo y descartar lo guardado. */
    empezarDeNuevo: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      guardado.current = null;
      setModalAbierto(false);
      hidratado.current = true;
    },

    /** Borra lo guardado sin tocar el modal (al terminar una inscripción). */
    olvidar: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  };
}
