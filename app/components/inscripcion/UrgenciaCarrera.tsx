"use client";

import { useEffect, useState } from "react";
import { Fire } from "@phosphor-icons/react";
import { FECHA_CARRERA, CUPOS_VENDIDOS_PCT } from "../../lib/carrera";

/**
 * "Últimos días" + las horas que faltan, dentro del formulario.
 *
 * Está para meter prisa, igual que <ContadorSesion />. La diferencia es QUÉ
 * cuenta, y eso no es un detalle:
 *
 *   - NO cuenta hacia un cierre de inscripciones. No se van a cerrar, y un
 *     reloj que promete un cierre que nunca llega es mentira dos veces: la
 *     primera al que se apura por nada, y la segunda cuando alguien vuelve al
 *     día siguiente, ve que sigue abierto y aprende que aquí los avisos no
 *     valen. Es el mismo criterio que ya está escrito en ContadorSesion.tsx
 *     ("lo que dice tiene que ser verdad") y en useCuentaAtras.ts.
 *
 *   - Cuenta hacia la SALIDA de la carrera, que es un hecho: sábado 29 de
 *     agosto a las 08h00 (FECHA_CARRERA). Ese plazo es real, no lo pone nadie,
 *     y aprieta solo — a quien duda le queda lo que le queda, esté el
 *     formulario abierto o no.
 *
 * En HORAS y no en días a propósito: "faltan 69 h" empuja y "faltan 2 días" no,
 * y las dos frases dicen lo mismo. El porcentaje vendido sale de
 * CUPOS_VENDIDOS_PCT (app/lib/carrera.ts), que es el número que maneja la
 * organización y se actualiza a mano ahí — no se inventa aquí.
 */

const pad = (n: number) => String(n).padStart(2, "0");

type Restante = { horas: number; minutos: number; segundos: number } | null;

function calcular(): Restante {
  const ms = new Date(FECHA_CARRERA).getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    // Horas TOTALES, sin dividir en días: es lo que da la sensación de plazo.
    horas: Math.floor(ms / 3_600_000),
    minutos: Math.floor(ms / 60_000) % 60,
    segundos: Math.floor(ms / 1000) % 60,
  };
}

export function UrgenciaCarrera() {
  // Arranca vacío y se llena al montar. El sitio se exporta estático: si el
  // primer render calculara la hora, el HTML llevaría dentro el instante del
  // BUILD y React se quejaría del desajuste al hidratar (y el corredor vería
  // un número viejo hasta el primer tic).
  const [restante, setRestante] = useState<Restante>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
    setRestante(calcular());
    // Se recalcula contra Date.now() en cada tic en vez de restar un segundo:
    // si el móvil bloquea la pantalla, los intervalos se frenan y un contador
    // que va restando se queda atrasado minutos.
    const id = setInterval(() => setRestante(calcular()), 1000);
    return () => clearInterval(id);
  }, []);

  // Ya se corrió: no queda plazo del que hablar y una cuenta atrás en cero es
  // ruido. Mientras no ha montado tampoco se pinta nada, así el hueco no salta.
  if (!montado) return null;

  return (
    <div className="font-barlow rounded-xl border border-[#f7771c]/40 bg-gradient-to-r from-[#f7771c]/15 to-[#c51850]/15 px-3.5 py-3">
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#ffc53d] uppercase">
        <Fire size={16} weight="fill" className="shrink-0" aria-hidden="true" />
        Últimos días · {CUPOS_VENDIDOS_PCT}% vendido
      </p>

      {restante ? (
        <>
          {/* aria-hidden en los dígitos y la frase completa en un sr-only: un
              lector de pantalla leyendo "69 : 33 : 12" cada segundo es
              inservible. Sin aria-live, además, para que no interrumpa. */}
          <p
            className="mt-1.5 flex items-baseline gap-1.5 text-white"
            aria-hidden="true"
          >
            <span className="text-2xl leading-none font-black tabular-nums">
              {restante.horas}
            </span>
            <span className="text-xs font-bold text-white/60">h</span>
            <span className="text-2xl leading-none font-black tabular-nums">
              {pad(restante.minutos)}
            </span>
            <span className="text-xs font-bold text-white/60">m</span>
            <span className="text-2xl leading-none font-black tabular-nums">
              {pad(restante.segundos)}
            </span>
            <span className="text-xs font-bold text-white/60">s</span>
          </p>
          <p className="sr-only">
            Faltan {restante.horas} horas para la salida.
          </p>
          {/* Qué es ese número. Sin esto parece el reloj de un cierre — que es
              justo lo que NO es. */}
          <p className="mt-0.5 text-[11px] leading-snug font-semibold text-white/70">
            para la salida en Patate · sábado 29, 08h00
          </p>
        </>
      ) : (
        <p className="mt-1.5 text-sm font-bold text-white">
          Hoy se corre en Patate · salida 08h00
        </p>
      )}
    </div>
  );
}
