"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Paracaídas de toda la app. Si un componente revienta en tiempo de ejecución,
 * Next.js aísla el fallo aquí en vez de dejar la pantalla en blanco.
 *
 * Importa especialmente en /inscripcion: una excepción a mitad del formulario
 * dejaba al corredor mirando una página vacía, sin saber si su pago entró. El
 * progreso sigue guardado en localStorage, así que "Intentar de nuevo" lo
 * devuelve donde estaba.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sin servicio de errores conectado: al menos queda en la consola del
    // navegador de quien lo sufre y en el `digest` que Next asigna.
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-[32px] border border-black/10 bg-white px-8 py-12 text-center text-black shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <h1 className="font-bebas text-[34px] leading-tight tracking-wide uppercase sm:text-[42px]">
          Algo salió mal
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-black/70">
          Se rompió esta sección, no el resto del sitio. Si estabas llenando la
          inscripción, tus datos siguen guardados en este dispositivo.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF2D7C] px-7 py-3.5 text-xs font-bold tracking-[0.15em] text-white uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gray-300 px-7 py-3.5 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-all duration-300 hover:border-[#FF6B1A] hover:text-[#FF6B1A]"
          >
            Ir al inicio
          </Link>
        </div>

        <p className="mt-8 border-t border-gray-100 pt-6 text-xs text-black/50">
          ¿Se repite?{" "}
          <a
            href="https://wa.me/593995102378"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#FF6B1A] underline underline-offset-4"
          >
            Escríbenos por WhatsApp
          </a>
          {error.digest ? (
            <>
              {" "}
              y pásanos este código:{" "}
              <span className="font-mono text-black/70">{error.digest}</span>
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
