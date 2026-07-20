"use client";

import { useEffect } from "react";

/**
 * Hace que el botón "atrás" del navegador vaya al paso anterior del formulario
 * en vez de sacarte de la página.
 *
 * Los cuatro pasos viven en una sola URL, así que para el navegador todo esto es
 * una única página: al dar atrás en el paso 3 te echaba del formulario entero.
 * Y en el móvil "atrás" no es un botón, es un gesto desde el borde — se hace sin
 * querer constantemente.
 *
 * Los datos no se perdían (siguen en localStorage, ver useProgresoGuardado),
 * pero volver a entrar y reencontrar el sitio es fricción que no hace falta.
 *
 * Se mete una entrada de historial por paso, así que el gesto hace lo que
 * cualquiera espera.
 */
export function useNavegacionPasos(irAlPaso: (paso: number) => void) {
  useEffect(() => {
    // La entrada base. Sin esto, el primer "atrás" desde el paso 2 saldría de la
    // página en vez de volver al 1.
    window.history.replaceState({ paso: 1 }, "");

    const alVolver = (e: PopStateEvent) => {
      const destino = (e.state as { paso?: number } | null)?.paso;
      // Sin paso en el estado, es que estamos saliendo del formulario de verdad
      // (hacia el home, por ejemplo): ahí no estorbamos.
      if (typeof destino !== "number") return;
      irAlPaso(destino);
    };

    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
    // irAlPaso es el setStep de React, que es estable: no hace falta en las
    // dependencias y meterlo reengancharía el listener en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
