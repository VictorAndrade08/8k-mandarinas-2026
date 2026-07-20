"use client";

import { useEffect, useRef, useState } from "react";

/** Cuánto dura la sesión de inscripción. */
export const MINUTOS_SESION = 15;

/** A partir de aquí el contador se pone en rojo y avisa. */
export const MINUTOS_AVISO = 2;

const CLAVE_LIMITE = "inscripcion_limite";

/**
 * Cuenta atrás para completar la inscripción.
 *
 * Está para meter prisa, no para castigar: al llegar a cero NO se borra nada.
 * Se avisa y se puede continuar de un toque, que renueva el tiempo.
 *
 * Se hizo primero borrando el formulario y se descartó a propósito. Este paso le
 * pide al corredor que se vaya a la app del banco, transfiera, saque la captura
 * y vuelva — eso pasa de quince minutos con facilidad, más aún en la categoría
 * Leyenda, que es de 65 años en adelante. Un reloj que borra convierte a quien
 * SÍ está pagando en quien vuelve y se encuentra el formulario vacío. La prisa
 * la da ver el reloj bajar; el borrado no añadía urgencia, solo abandono.
 *
 * El instante límite se guarda en localStorage y NO se reinicia al recargar: si
 * cada F5 diera quince minutos nuevos, el contador no contaría nada. La
 * contrapartida es real y hay que saberla — quien se va a la app del banco a
 * hacer la transferencia y tarda más de quince minutos, vuelve y se encuentra el
 * formulario vacío.
 *
 * Se apaga solo en el paso 4: ahí ya está enviada y no hay nada que caducar.
 */
export function useCuentaAtras({
  activo,
  alExpirar,
}: {
  /** Si el reloj debe correr (pasos 2 y 3). */
  activo: boolean;
  alExpirar: () => void;
}) {
  const [segundos, setSegundos] = useState<number | null>(null);
  // Cambia al renovar, para que el efecto vuelva a leer el límite nuevo.
  const [generacion, setGeneracion] = useState(0);
  // En un ref y no en el estado: el efecto de abajo no debe volver a montarse
  // cada vez que el padre redibuje con otra función.
  const expirar = useRef(alExpirar);
  useEffect(() => {
    expirar.current = alExpirar;
  }, [alExpirar]);

  useEffect(() => {
    // Cuando el reloj no corre NO se borra el límite. Se probó y estaba mal: al
    // recargar, el formulario vuelve al paso 1 mientras se pregunta si retomas,
    // y ese paso por el 1 borraba el límite. Resultado: recargar regalaba quince
    // minutos nuevos y el contador se podía saltar recargando.
    //
    // El límite se borra en los dos momentos en que de verdad se acaba la
    // sesión: al expirar (aquí abajo) y al reiniciar el formulario, que llama a
    // reiniciar(). Si no se borrara en ninguno de los dos, al volver al paso 2
    // se leería un límite ya vencido y expiraría en bucle.
    if (!activo) return;

    // Se lee lo guardado antes de crear uno nuevo: si no, volver al paso 2
    // desde el 3 regalaría quince minutos más.
    let limite = Number(localStorage.getItem(CLAVE_LIMITE) || 0);
    if (!limite || Number.isNaN(limite)) {
      limite = Date.now() + MINUTOS_SESION * 60_000;
      try {
        localStorage.setItem(CLAVE_LIMITE, String(limite));
      } catch {}
    }

    const tic = () => {
      const restan = Math.max(0, Math.round((limite - Date.now()) / 1000));
      setSegundos(restan);
      if (restan === 0) expirar.current();
    };

    tic();
    // Se calcula contra Date.now() en cada tic y no restando uno: si el móvil
    // bloquea la pantalla, los intervalos se ralentizan o se paran, y un
    // contador que resta de uno en uno se quedaría atrasado minutos.
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [activo, generacion]);

  // Se deriva de `activo` en vez de guardarse un null en el estado: poner el
  // estado a null dentro del efecto provoca un render en cascada, y aquí no
  // hace falta — si el reloj no corre, no hay segundos que enseñar y punto.
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
    /** Se acabó el tiempo (pero los datos siguen ahí). */
    expirada: visibles === 0,

    /** Otros quince minutos, sin tocar lo que ya escribió. */
    renovar: () => {
      const nuevo = Date.now() + MINUTOS_SESION * 60_000;
      try {
        localStorage.setItem(CLAVE_LIMITE, String(nuevo));
      } catch {}
      setSegundos(MINUTOS_SESION * 60);
      // El intervalo sigue leyendo el `limite` viejo por cierre, así que se
      // fuerza a que el efecto se rehaga cambiando la generación.
      setGeneracion((g) => g + 1);
    },

    /** Borra el límite: al reiniciar el formulario o al terminarlo. */
    reiniciar: () => {
      try {
        localStorage.removeItem(CLAVE_LIMITE);
      } catch {}
    },
  };
}
