"use client";

import {
  Bank,
  CalendarBlank,
  CaretLeft,
  CheckCircle,
  Copy,
  FileText,
  QrCode,
  ShieldCheck,
  Trash,
  UploadSimple,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useMemo } from "react";
import { BANCO } from "./constantes";
import { CampoTexto } from "./CampoTexto";
import { useFormulario } from "./contexto";
import type { MetodoPago } from "./tipos";

/**
 * Paso 3: dónde pagar y cómo demostrar que se pagó.
 *
 * Aquí no se cobra nada: la transferencia se hace en el banco y este paso solo
 * recoge la prueba. Por eso pide el número de comprobante, la fecha y quién es
 * el titular de la cuenta — validar un pago sin esos tres datos es una
 * investigación, y son cientos de inscripciones.
 */
export function PasoPago({
  metodoPago,
  onMetodoPago,
  selectedPrice,
  loading,
  honeypot,
  onAtras,
  onEnviar,
  onArchivo,
  onQuitarArchivo,
  onCopiar,
  onTitular,
  nombreComprobante,
  hoyISO,
}: {
  metodoPago: MetodoPago;
  onMetodoPago: (metodo: MetodoPago) => void;
  selectedPrice: number;
  /** Mientras sube el comprobante: bloquea el botón para no enviar dos veces. */
  loading: boolean;
  /** Campo trampa, invisible. Si un bot lo rellena, el envío se descarta. */
  honeypot: React.RefObject<HTMLInputElement | null>;
  onAtras: () => void;
  onEnviar: () => void;
  onArchivo: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onQuitarArchivo: () => void;
  onCopiar: (texto: string, etiqueta: string) => void;
  /** "si" o "no": si la cuenta desde la que se pagó es del propio corredor. */
  onTitular: (valor: string) => void;
  /** Nombre del archivo ya elegido, o "" si todavía no hay ninguno. */
  nombreComprobante: string;
  /** La fecha de hoy en ISO, como tope del campo de fecha de pago. */
  hoyISO: () => string;
}) {
  const { formData, errors } = useFormulario();

  // Vista previa del comprobante: ver la foto elegida evita subir la captura
  // equivocada (la galería del celular muestra miniaturas casi iguales).
  const comprobante = formData.comprobante;
  const previewUrl = useMemo(
    () =>
      comprobante && comprobante.type.startsWith("image/")
        ? URL.createObjectURL(comprobante)
        : null,
    [comprobante]
  );
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onEnviar();
      }}
      className="animate-in slide-in-from-right-8 fade-in duration-500"
    >
      <h1 className="font-bebas mb-6 text-4xl font-bold md:text-6xl">
        Validación de Pago
      </h1>

      {/* Trampa para bots: invisible y fuera del recorrido de tabulación.
      Nadie que use el sitio de verdad puede llenarlo. */}
      <input
        ref={honeypot}
        type="text"
        name="apellido_materno"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      {/* Recomendación: un solo pago por persona. Evita que alguien pague por
          varios en una sola transferencia — así cada comprobante cuadra con una
          inscripción y no se traban las validaciones. */}
      <div className="font-barlow mb-6 flex items-start gap-3 rounded-2xl border border-[#f7771c]/30 bg-[#f7771c]/10 p-4">
        <span aria-hidden="true" className="text-xl leading-none">
          💡
        </span>
        <p className="text-sm leading-relaxed text-gray-200 md:text-base">
          <strong className="text-white">
            Recomendado: un pago por persona.
          </strong>{" "}
          Si se inscriben varios, que cada quien haga su propia transferencia
          con su comprobante. Un solo pago para varias personas mezcla los datos
          y retrasa la validación.
        </p>
      </div>

      {/* SELECTOR DE MÉTODO DE PAGO */}
      <p className="font-barlow mb-3 text-base text-gray-400 md:text-lg">
        Elige cómo vas a pagar:
      </p>
      <div className="font-barlow mb-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onMetodoPago("transferencia")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-bold transition-all md:text-lg ${
            metodoPago === "transferencia"
              ? "border-[#f7771c] bg-[#f7771c] text-white shadow-lg shadow-[#f7771c]/20"
              : "border-white/10 bg-[#200815] text-gray-300 hover:border-white/30"
          }`}
        >
          <Bank size={22} /> Transferencia
        </button>
        <button
          type="button"
          onClick={() => onMetodoPago("qr")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-bold transition-all md:text-lg ${
            metodoPago === "qr"
              ? "border-[#f7771c] bg-[#f7771c] text-white shadow-lg shadow-[#f7771c]/20"
              : "border-white/10 bg-[#200815] text-gray-300 hover:border-white/30"
          }`}
        >
          <QrCode size={22} /> QR (deúna!)
        </button>
      </div>

      {metodoPago === "transferencia" && (
        <div className="font-barlow mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#331023] to-black p-6 shadow-lg md:p-10">
          <div className="mb-8 flex items-center gap-5 border-b border-white/10 pb-6">
            <div className="rounded-full bg-[#f7771c]/20 p-4 text-[#f7771c]">
              <Bank size={32} />
            </div>
            <div>
              <p className="mb-1 text-sm tracking-wider text-gray-400 uppercase md:text-base">
                Institución Financiera
              </p>
              <p className="text-2xl font-bold md:text-3xl">{BANCO.entidad}</p>
            </div>
          </div>

          <div className="space-y-6 text-lg md:text-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">Cuenta Corriente:</span>
              <button
                type="button"
                onClick={() => onCopiar(BANCO.numero, "Número de cuenta")}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white transition hover:bg-white/10 active:scale-95"
                title="Copiar número de cuenta"
              >
                {BANCO.numero}
                <Copy
                  size={16}
                  className="text-gray-400 group-hover:text-[#f7771c]"
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tipo:</span>
              <span className="text-right font-medium text-white">
                Corriente
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-gray-500">Titular:</span>
              <span className="max-w-[200px] text-right leading-tight text-white">
                {BANCO.titular}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">RUC:</span>
              <button
                type="button"
                onClick={() => onCopiar(BANCO.ruc, "RUC")}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white transition hover:bg-white/10 active:scale-95"
                title="Copiar RUC"
              >
                {BANCO.ruc}
                <Copy
                  size={16}
                  className="text-gray-400 group-hover:text-[#f7771c]"
                />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="block text-2xl leading-tight font-bold text-gray-200 md:text-3xl">
                Total a pagar:
              </span>
              <span className="text-4xl font-black text-[#f7771c] md:text-5xl">
                ${selectedPrice}.00
              </span>
            </div>
            <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-gray-300 md:text-lg">
              💬 En el <strong className="text-white">motivo</strong> de la
              transferencia escribe:{" "}
              <strong className="text-white">8K + tu nombre o cédula</strong>.
              Así tu pago se encuentra de inmediato.
            </p>
            <button
              type="button"
              onClick={() =>
                onCopiar(
                  `${BANCO.entidad}\nCuenta corriente: ${BANCO.numero}\nTitular: ${BANCO.titular}\nRUC: ${BANCO.ruc}\nValor: $${selectedPrice}.00`,
                  "Datos bancarios"
                )
              }
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f7771c]/60 bg-[#f7771c]/10 text-base font-bold text-white transition outline-none hover:bg-[#f7771c]/20 focus-visible:ring-2 focus-visible:ring-[#f7771c] active:scale-[0.99] md:text-lg"
            >
              <Copy size={22} /> Copiar datos bancarios
            </button>
          </div>
        </div>
      )}

      {/* --- MÉTODO 2: PAGO CON QR (deúna! / Banco Pichincha) --- */}
      {metodoPago === "qr" && (
        <div className="font-barlow mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#331023] to-black p-6 shadow-lg md:p-8">
          <div className="mb-5 flex items-center gap-4">
            <div className="rounded-full bg-[#f7771c]/20 p-3 text-[#f7771c]">
              <QrCode size={28} />
            </div>
            <div>
              <p className="mb-1 text-sm tracking-wider text-gray-400 uppercase md:text-base">
                Opción rápida
              </p>
              <p className="text-2xl font-bold md:text-3xl">
                Paga con QR (deúna!)
              </p>
            </div>
          </div>
          <p className="mb-6 text-base text-gray-400 md:text-lg">
            Desde la app de tu banco o{" "}
            <strong className="text-white">deúna!</strong>, escanea este código
            e ingresa el monto{" "}
            <strong className="text-white">${selectedPrice}.00</strong>.
          </p>
          <div className="flex justify-center">
            <img
              src="/qr-pichincha.png"
              alt="Código QR para pago con deúna! y Banco Pichincha a nombre de Diego David Mantilla Villavicencio"
              className="h-auto w-full max-w-[360px] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* --- SECCIÓN ANTI-FRAUDE Y VERIFICACIÓN --- */}
      <div className="mb-10 space-y-6">
        <div className="mb-2 flex items-center gap-2 text-yellow-500">
          <ShieldCheck size={20} />
          <h3 className="font-bebas text-xl font-bold tracking-wide uppercase">
            Datos para Verificación Rápida
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 1. Número de Comprobante (Evita tener que mirar la foto) */}
          <div className="md:col-span-1">
            <CampoTexto
              name="num_comprobante"
              label="Núm. Comprobante"
              icon={<FileText size={20} />}
              placeholder="Ej: 123456"
              autoComplete="off"
              inputMode="numeric"
              maxLength={20}
              hint="El número de documento de la transferencia. Con eso lo buscamos en el banco sin abrir tu foto."
            />
          </div>

          {/* 2. Fecha (Ayuda a filtrar) */}
          <div className="md:col-span-1">
            <CampoTexto
              name="fecha_pago"
              label="Fecha de Transferencia"
              icon={<CalendarBlank size={20} />}
              type="date"
              max={hoyISO()}
            />
          </div>

          {/* 3. Titular de la Cuenta (Evita confusión de nombres). Checkbox en
              vez de dos botones: al marcarlo se rellena solo el nombre del
              titular con el del corredor, y se le ENSEÑA — así ve exactamente
              qué nombre se buscará en el banco y salta a la vista cuando pagó
              otra persona (el caso Kevin: pagos imposibles de encontrar). */}
          <div className="rounded-xl border border-white/10 bg-[#200815] p-5 md:col-span-2">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="checkbox"
                checked={formData.es_titular === "si"}
                onChange={(e) => onTitular(e.target.checked ? "si" : "no")}
                className="mt-0.5 h-7 w-7 shrink-0 cursor-pointer accent-[#f7771c]"
              />
              <span className="font-barlow text-base leading-relaxed font-bold text-gray-200 md:text-lg">
                Sí, soy el dueño de la cuenta desde la que pagué
              </span>
            </label>

            {formData.es_titular === "si" && (
              <p className="font-barlow animate-in fade-in mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-gray-300">
                Titular de la cuenta:{" "}
                <strong className="text-white">
                  {`${formData.nombres} ${formData.apellidos}`.trim() ||
                    "tu nombre del paso anterior"}
                </strong>
                <span className="mt-1 block text-sm text-gray-400">
                  Con este nombre buscaremos tu pago en el banco. Si la cuenta
                  es de otra persona, desmarca la casilla.
                </span>
              </p>
            )}

            {/* Si NO es titular, pedimos el nombre real */}
            {formData.es_titular === "no" && (
              <div className="animate-in slide-in-from-top-2 fade-in">
                <CampoTexto
                  name="nombre_titular_cuenta"
                  label="Nombre del Dueño de la Cuenta"
                  icon={<User size={20} />}
                  placeholder="Ej: Juan Pérez (mi papá)"
                  autoComplete="off"
                  hint="Sin este nombre no podemos encontrar tu pago en el banco."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 border-t border-white/10 pt-6">
        <label className="font-barlow mb-3 block text-base font-bold tracking-wide text-gray-200 uppercase md:text-lg">
          Adjuntar Comprobante (Foto/PDF)
        </label>
        {!nombreComprobante ? (
          <label
            className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-[#200815] transition-colors focus-within:ring-2 focus-within:ring-[#f7771c] hover:border-[#f7771c] hover:bg-[#f7771c]/5 md:h-48 ${
              errors.comprobante ? "border-red-400" : "border-gray-500"
            }`}
          >
            <UploadSimple className="mb-2 h-12 w-12 text-gray-300 md:h-16 md:w-16" />
            <p className="font-barlow text-base text-gray-300 md:text-lg">
              Toca aquí para subir tu archivo
            </p>
            <p className="font-barlow mt-1 text-sm text-gray-400">
              Foto legible o PDF · máximo 10MB
            </p>
            <input
              type="file"
              name="comprobante"
              accept="image/*,application/pdf"
              onChange={onArchivo}
              className="sr-only"
            />
          </label>
        ) : (
          <div className="rounded-2xl border border-[#f7771c]/30 bg-[#f7771c]/10 p-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Vista previa del comprobante que vas a enviar"
                className="mx-auto mb-4 max-h-64 w-auto rounded-xl object-contain"
              />
            )}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 overflow-hidden">
                <CheckCircle className="shrink-0 text-green-500" size={28} />
                <span className="truncate text-base font-bold text-gray-100 md:text-xl">
                  {nombreComprobante}
                </span>
              </div>
              <button
                type="button"
                onClick={onQuitarArchivo}
                aria-label="Quitar el archivo y elegir otro"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-red-300 transition outline-none hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Trash size={24} />
              </button>
            </div>
          </div>
        )}
        {errors.comprobante && (
          <p
            role="alert"
            className="font-barlow mt-2 flex items-center gap-1.5 text-sm font-medium text-red-300 md:text-base"
          >
            <WarningCircle size={16} className="shrink-0" />{" "}
            {errors.comprobante}
          </p>
        )}
        <p className="font-barlow mt-3 flex items-start gap-1.5 text-sm text-gray-400">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gray-400" />
          Tu comprobante es privado: solo lo ve el equipo que valida los pagos.
        </p>
      </div>

      {/* Los botones van en el flujo, no clavados abajo. Iban con
      `fixed` para caer en la zona del pulgar, pero en móvil se
      quedaban encima del contenido todo el rato y tapaban el final
      del formulario mientras se rellenaba. */}
      {/* Barra fija abajo en móvil, igual que el paso 2. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#2b0d1d]/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0 md:pt-6 md:backdrop-blur-none">
        <div className="font-barlow mx-auto flex max-w-3xl gap-3">
          <button
            type="button"
            onClick={onAtras}
            className="flex min-h-[56px] items-center gap-2 rounded-xl border border-white/15 px-5 text-lg font-bold text-gray-200 transition outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 md:px-10 md:text-xl"
          >
            <CaretLeft size={24} /> Atrás
          </button>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[56px] flex-1 rounded-xl bg-[#f7771c] text-lg font-bold text-white shadow-[0_0_20px_#f7771c50] transition outline-none hover:bg-[#d2600f] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
          >
            {loading ? "Enviando inscripción…" : "Confirmar Inscripción"}
          </button>
        </div>
      </div>
    </form>
  );
}
