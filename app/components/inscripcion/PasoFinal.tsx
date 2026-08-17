"use client";

import {
  ArrowsClockwise,
  Cake,
  CheckCircle,
  Envelope,
  GenderIntersex,
  IdentificationCard,
  MagnifyingGlass,
  MapPin,
  Medal,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useFormulario } from "./contexto";
import { srcSetDe } from "../../lib/imagen";

/**
 * Paso 4: la pantalla de "ya está".
 *
 * Repite todos los datos que se enviaron a propósito. Es lo último que ve el
 * corredor y lo que va a mirar si algo no cuadra dentro de tres días, así que
 * tiene que poder comprobar de un vistazo que su cédula y su correo están bien
 * escritos — sin volver a entrar ni escribir a nadie.
 */
export function PasoFinal({
  selectedCategory,
  selectedPrice,
  uploadedFileUrl,
  codigo,
  onNuevaInscripcion,
}: {
  selectedCategory: string;
  selectedPrice: number;
  /** URL del comprobante ya subido a R2. Vacía si el corredor no adjuntó nada:
      en ese caso el mensaje de WhatsApp le pide que lo mande él. */
  uploadedFileUrl: string;
  /** Código de inscripción (MAND-XXXXXX) que devolvió el servidor. Vacío si la
      respuesta vino de una versión anterior del backend. */
  codigo: string;
  /** Vacía el formulario para inscribir a otra persona desde el mismo móvil. */
  onNuevaInscripcion: () => void;
}) {
  const { formData } = useFormulario();

  return (
    <div className="animate-in zoom-in-95 fade-in relative overflow-hidden rounded-2xl py-10 text-center duration-500">
      {/* Corredores de verdad detrás del "ya estás dentro". Es lo último que ve
          quien acaba de pagar $20: un fondo liso lo deja frío. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <img
          src="/fotos/corredores-13.webp"
          srcSet={srcSetDe("/fotos/corredores-13.webp")}
          sizes="(max-width: 768px) 100vw, 800px"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        {/* 92%: aquí van la cédula y el correo del corredor para que los repase.
            Si no se leen bien, la pantalla no sirve para nada. */}
        <div className="absolute inset-0 bg-[#200815]/92" />
      </div>

      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-[0_0_50px_#2bd98a40] md:h-32 md:w-32">
        <CheckCircle size={64} />
      </div>
      <h1 className="font-bebas mb-6 text-4xl font-bold text-white md:text-6xl">
        ¡Inscripción Exitosa!
      </h1>
      <p className="font-barlow mx-auto mb-10 max-w-2xl px-4 text-lg leading-relaxed text-gray-300 md:text-2xl">
        Hemos recibido tus datos correctamente. Tu pago será validado en los
        siguientes <strong className="text-white">2 a 3 días laborales.</strong>
      </p>

      {/* Resumen Completo */}
      <div className="font-barlow relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#200815] p-8 text-left shadow-2xl">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#c51850] to-[#f7771c]" />

        <div className="mb-8 grid grid-cols-2 gap-6 text-base md:text-lg">
          <div className="col-span-2 mb-2 border-b border-white/5 pb-6">
            <p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Nombre Completo
            </p>
            <p className="text-2xl font-bold text-white capitalize md:text-3xl">
              {formData.nombres} {formData.apellidos}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <IdentificationCard size={12} /> Cédula
            </p>
            <p className="font-mono text-lg text-gray-200 md:text-xl">
              {formData.cedula}
            </p>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <Medal size={12} /> Categoría
            </p>
            <p className="text-lg font-bold text-[#f7771c] md:text-xl">
              {selectedCategory}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <MapPin size={12} /> Ciudad
            </p>
            <p className="text-lg text-gray-200">{formData.ciudad}</p>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
              <WhatsappLogo size={12} /> WhatsApp
            </p>
            <p className="text-lg text-gray-200">{formData.telefono}</p>
          </div>

          <div className="col-span-2">
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <Envelope size={12} /> Email
            </p>
            <p
              className="truncate text-lg text-gray-200"
              title={formData.email}
            >
              {formData.email}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <Cake size={12} /> Edad
            </p>
            <p className="text-lg text-gray-200">{formData.edad} años</p>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              <GenderIntersex size={12} /> Género
            </p>
            <p className="text-lg text-gray-200">{formData.genero}</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Valor
            </p>
            <p className="text-lg font-bold text-[#f7771c] md:text-xl">
              ${selectedPrice}.00
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Fecha de envío
            </p>
            <p className="text-lg text-gray-200">
              {new Date().toLocaleDateString("es-EC", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-xl border border-white/5 bg-[#331023] p-5">
          <div className="shrink-0 rounded-lg bg-white p-2">
            <img
              alt="QR"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.cedula || "8K")}`}
              className="h-20 w-20"
            />
          </div>
          <div className="overflow-hidden">
            <p className="mb-1 text-sm font-bold text-gray-500 uppercase">
              Comprobante de Inscripción
            </p>
            {codigo && (
              <p className="mb-1 font-mono text-xl font-bold text-white">
                {codigo}
              </p>
            )}
            <p className="truncate text-sm text-gray-400">
              Estado:{" "}
              <span className="ml-1 rounded bg-yellow-500/10 px-2 py-1 font-bold text-yellow-500">
                Pendiente de Verificación
              </span>
            </p>
            <p className="mt-2 text-sm leading-snug text-gray-500">
              Guarda tu número de cédula: con él consultas tu estado en
              cualquier momento.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-barlow max-w-xl text-base text-white/90 md:text-lg">
          <strong className="text-white">Último paso:</strong> envíanos tu
          comprobante por WhatsApp para confirmar tu cupo.
        </p>
        <a
          href={`https://wa.me/593997241804?text=${encodeURIComponent(
            `Hola, acabo de inscribirme en la 8K Ruta de las Mandarinas 2026. 🎽\n\n` +
              (codigo ? `Código: ${codigo}\n` : "") +
              `Nombre: ${formData.nombres} ${formData.apellidos}\n` +
              `Cédula: ${formData.cedula}\n` +
              `Categoría: ${selectedCategory}\n` +
              `Valor: $${selectedPrice}\n\n` +
              (uploadedFileUrl
                ? `📎 Mi comprobante de pago:\n${uploadedFileUrl}`
                : `Adjunto mi comprobante de pago.`)
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-barlow inline-flex items-center gap-3 rounded-full bg-[#25D366] px-10 py-5 text-lg font-bold text-white shadow-[0_0_30px_rgba(37,211,102,0.4)] transition hover:scale-105 hover:bg-[#1EBE57] md:text-xl"
        >
          <WhatsappLogo size={26} /> Enviar comprobante por WhatsApp
        </a>

        <a
          href="/verificar"
          className="font-barlow mt-1 inline-flex items-center gap-2 text-base text-gray-300 transition-colors hover:text-white md:text-lg"
        >
          <MagnifyingGlass size={20} /> Ver estado de mi inscripción
        </a>

        <button
          onClick={onNuevaInscripcion}
          className="font-barlow mt-2 flex items-center gap-2 text-base text-gray-500 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white md:text-lg"
        >
          <ArrowsClockwise size={16} /> Registrar a otra persona
        </button>
      </div>
    </div>
  );
}
