"use client";

import { useEffect, useRef, useState } from "react";

/** Cuánto dura una vuelta del contador. */
export const MINUTOS_SESION = 15;

/** A partir de aquí se pone en rojo. */
export const MINUTOS_AVISO = 2;

const CLAVE_LIMITE = "inscripcion_limite";

/**
 * Cuenta atrás de la inscripción. Está para meter prisa y NADA MÁS.
 *
 * No caduca nada, no borra nada y no bloquea nada: al llegar a cero se reinicia
 * sola y en silencio, y el corredor puede seguir inscribiéndose exactamente
 * igual que antes. Quien está a mitad ni se entera.
 *
 * Se escribió antes de dos maneras peores y las dos se descartaron probándolas:
 *
 *   1. Borrando el formulario al llegar a cero. Este paso le pide al corredor
 *      que se vaya a la app del banco, transfiera, saque la captura y vuelva —
 *      eso pasa de quince minutos con facilidad, más aún en la categoría
 *      Leyenda, que es de 65 años en adelante. Convertía a quien SÍ estaba
 *      pagando en quien vuelve y encuentra el formulario vacío.
 *
 *   2. Avisando con un modal y ofreciendo continuar. Mejor, pero seguía
 *      interrumpiendo a alguien que estaba escribiendo para no decirle nada
 *      útil: un aviso que no exige hacer nada solo enseña a ignorar los avisos.
 *
 * La urgencia la da ver el reloj bajar. Lo demás sobraba.
 *
 * El límite se guarda en localStorage para que no se reinicie en cada recarga y
 * el número que se ve tenga algo que ver con el tiempo que lleva la persona ahí.
 */
export function useCuentaAtras({ activo }: { activo: boolean }) {
  const [segundos, setSegundos] = useState<number | null>(null);
  // El límite vive en un ref, no en el estado: cambia dentro del propio tic y
  // meterlo en el estado reiniciaría el intervalo cada vez.
  const limite = useRef(0);

  useEffect(() => {
    if (!activo) return;

    // Se lee lo guardado antes de crear uno nuevo: si no, ir del paso 2 al 3 y
    // volver regalaría quince minutos, y recargar la página también.
    const guardado = Number(localStorage.getItem(CLAVE_LIMITE) || 0);
    const nuevoLimite = () => {
      const t = Date.now() + MINUTOS_SESION * 60_000;
      try {
        localStorage.setItem(CLAVE_LIMITE, String(t));
      } catch {
        // localStorage bloqueado (modo privado de Safari). El contador sigue
        // funcionando, solo que se reinicia al recargar.
      }
      return t;
    };
    limite.current =
      guardado && !Number.isNaN(guardado) && guardado > Date.now()
        ? guardado
        : nuevoLimite();

    const tic = () => {
      const restan = Math.round((limite.current - Date.now()) / 1000);
      if (restan <= 0) {
        // Vuelta a empezar, sin avisar y sin tocar nada de lo escrito.
        limite.current = nuevoLimite();
        setSegundos(MINUTOS_SESION * 60);
        return;
      }
      setSegundos(restan);
    };

    tic();
    // Se calcula contra Date.now() en cada tic y no restando uno: si el móvil
    // bloquea la pantalla, los intervalos se ralentizan o se paran, y un
    // contador que resta de uno en uno se quedaría atrasado minutos.
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [activo]);

  // Se deriva de `activo` en vez de guardar un null en el estado: poner el
  // estado a null dentro del efecto provoca un render en cascada, y aquí no
  // hace falta — si el reloj no corre, no hay segundos que enseñar.
  const visibles = activo ? segundos : null;

  return {
    segundos: visibles,
    /** Formato mm:ss para enseñarlo. */
    texto:
      visibles === null
        ? ""
        : `${String(Math.floor(visibles / 60)).padStart(2, "0")}:${String(
            visibles % 60
          ).padStart(2, "0")}`,
    enAviso: visibles !== null && visibles <= MINUTOS_AVISO * 60,

    /** Empieza una cuenta nueva. Se llama al reiniciar el formulario. */
    reiniciar: () => {
      try {
        localStorage.removeItem(CLAVE_LIMITE);
      } catch {}
    },
  };
}
