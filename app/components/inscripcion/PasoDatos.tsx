"use client";

import {
  Cake,
  CaretLeft,
  CaretRight,
  Envelope,
  IdentificationCard,
  Info,
  MapPin,
  User,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { CampoTexto } from "./CampoTexto";
import { useFormulario } from "./contexto";
import { MINUTOS_SESION } from "./useCuentaAtras";
import type { Category } from "./tipos";

/**
 * Paso 2: quién eres.
 *
 * Es el paso más largo del formulario y el que más gente abandona, así que todo
 * lo que hay aquí está para quitar fricción: el teclado correcto por campo, la
 * corrección de correos mal escritos (gmail.con), el aviso si la edad no cuadra
 * con la categoría elegida y la comprobación de si esa cédula ya se inscribió,
 * que se hace al salir del campo y no al final.
 */
export function PasoDatos({
  acceptTerms,
  onAceptarTerminos,
  emailSuggestion,
  onUsarEmailSugerido,
  categoriaSugerida,
  categoriaNoCuadra,
  edadNum,
  selectedCategory,
  onAplicarCategoria,
  onCedulaCompleta,
  verificandoCedula,
  categorias,
  onGenero,
  onAtras,
  onSiguiente,
}: {
  acceptTerms: boolean;
  onAceptarTerminos: (valor: boolean) => void;
  /** El correo corregido ("gmail.com" cuando escribió "gmail.con"), o "". */
  emailSuggestion: string | null;
  onUsarEmailSugerido: () => void;
  /** La categoría que le tocaría por su edad, si no es la que eligió. */
  categoriaSugerida: string | null;
  /** Si la edad escrita no encaja con la categoría elegida en el paso 1. */
  categoriaNoCuadra: boolean;
  edadNum: number;
  selectedCategory: string;
  onAplicarCategoria: () => void;
  /** Al salir de la cédula: comprueba si ya hay una inscripción con ese número. */
  onCedulaCompleta: () => void;
  /** Mientras se consulta si esa cédula ya está inscrita. */
  verificandoCedula: boolean;
  categorias: Category[];
  onGenero: (valor: string) => void;
  onAtras: () => void;
  onSiguiente: () => void;
}) {
  const { formData, errors } = useFormulario();

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSiguiente();
      }}
      className="animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <h1 className="font-bebas mb-2 text-4xl font-bold md:text-6xl">
        Tus Datos Personales
      </h1>
      <p className="font-barlow mb-8 text-base text-gray-400 md:text-lg">
        Son 2 minutos. Ten a mano el comprobante del pago: la sesión dura{" "}
        {MINUTOS_SESION} minutos.
      </p>

      {/* gap más ancho en móvil: el pulgar es menos preciso que el ratón */}
      <div className="mb-8 grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
        <div className="md:col-span-2">
          {/* Solo cédula: se quitó el selector Cédula/Pasaporte. El
            tipo_documento se queda en "cedula" por defecto, así que
            la validación sigue igual sin tocar nada más. */}
          <CampoTexto
            name="cedula"
            label="Cédula"
            icon={<IdentificationCard size={20} />}
            placeholder="Ej: 1801234567"
            onBlur={onCedulaCompleta}
            autoComplete="off"
            inputMode="numeric"
            maxLength={10}
            autoFocus
            hint="Va en tu dorsal. También evita que alguien se inscriba dos veces."
          />
        </div>

        <CampoTexto
          name="nombres"
          label="Nombres"
          icon={<User size={20} />}
          placeholder="Ej: María Fernanda"
          autoComplete="given-name"
          inputMode="text"
        />
        <CampoTexto
          name="apellidos"
          label="Apellidos"
          icon={<User size={20} />}
          placeholder="Ej: Pérez Andrade"
          autoComplete="family-name"
          inputMode="text"
        />

        {/* Sin datalist: era solo una sugerencia, pero el desplegable
          se abre encima del campo en cuanto tecleas y en móvil
          estorba más que ayuda. Aquí vienen corredores de todo el
          país y de fuera, así que la lista nunca iba a estar
          completa. Se escribe libre y ya. */}
        <CampoTexto
          name="ciudad"
          label="Ciudad"
          icon={<MapPin size={20} />}
          placeholder="Ej: Ambato"
          autoComplete="address-level2"
          inputMode="text"
        />

        <CampoTexto
          name="telefono"
          label="WhatsApp"
          icon={<WhatsappLogo size={20} />}
          type="tel"
          placeholder="Ej: 099 123 4567"
          autoComplete="tel"
          inputMode="numeric"
          hint="Solo para confirmarte el cupo y avisarte del kit."
        />

        <div className="md:col-span-2">
          <CampoTexto
            name="email"
            label="Correo Electrónico"
            icon={<Envelope size={20} />}
            type="email"
            placeholder="Ej: tunombre@gmail.com"
            autoComplete="email"
            inputMode="email"
            hint={
              emailSuggestion
                ? undefined
                : "Ahí llega tu confirmación. Nada de spam."
            }
          />
          {emailSuggestion && (
            <button
              type="button"
              onClick={onUsarEmailSugerido}
              className="font-barlow mt-2 flex min-h-[48px] items-center gap-1.5 text-left text-sm font-bold text-[#f7771c] hover:text-[#c51850] md:text-base"
            >
              <Info size={16} className="shrink-0" /> ¿Quisiste decir{" "}
              <span className="underline">{emailSuggestion}</span>? Tócalo para
              corregir.
            </button>
          )}
        </div>

        <CampoTexto
          name="edad"
          label="Edad"
          icon={<Cake size={20} />}
          placeholder="Ej: 25"
          autoComplete="off"
          inputMode="numeric"
          maxLength={2}
        />

        {/* 3 opciones: tarjetas a la vista en vez de un <select> nativo */}
        <div>
          <span className="font-barlow mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-gray-200 uppercase md:text-base">
            <User size={20} /> Género
          </span>
          <div
            role="radiogroup"
            aria-label="Género"
            className="grid grid-cols-3 gap-2"
          >
            {[
              { valor: "Masculino", texto: "Hombre" },
              { valor: "Femenino", texto: "Mujer" },
              { valor: "Otro", texto: "Otro" },
            ].map(({ valor, texto }) => (
              <button
                key={valor}
                type="button"
                role="radio"
                aria-checked={formData.genero === valor}
                onClick={() => onGenero(valor)}
                className={`font-barlow min-h-[56px] rounded-xl border-2 px-2 text-base font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] md:text-lg ${
                  formData.genero === valor
                    ? "border-[#f7771c] bg-[#f7771c] text-white"
                    : errors.genero
                      ? "border-red-400 bg-[#200815] text-gray-200"
                      : "border-white/15 bg-[#200815] text-gray-200 hover:border-white/40"
                }`}
              >
                {texto}
              </button>
            ))}
          </div>
          {errors.genero && (
            <p
              role="alert"
              className="font-barlow mt-2 flex items-center gap-1.5 text-sm font-medium text-red-300 md:text-base"
            >
              <WarningCircle size={16} className="shrink-0" /> {errors.genero}
            </p>
          )}
        </div>

        {categoriaNoCuadra && (
          <div className="font-barlow animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-4 md:col-span-2">
            <Info size={20} className="mt-0.5 shrink-0 text-yellow-400" />
            <div className="text-base leading-relaxed text-yellow-50 md:text-lg">
              Con {edadNum} años te corresponde{" "}
              <strong className="text-white">{categoriaSugerida}</strong>, no{" "}
              {selectedCategory}.{" "}
              <button
                type="button"
                onClick={onAplicarCategoria}
                className="min-h-[48px] font-bold text-white underline decoration-2 underline-offset-2 hover:text-yellow-300"
              >
                Cambiar a {categoriaSugerida} ($
                {categorias.find((c) => c.name === categoriaSugerida)?.price})
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`mb-8 rounded-2xl border bg-[#200815] p-5 transition-colors md:p-6 ${
          errors.acceptTerms ? "border-red-400" : "border-white/10"
        }`}
      >
        <label
          htmlFor="acceptTerms"
          className="flex cursor-pointer items-start gap-4"
        >
          <input
            id="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => onAceptarTerminos(e.target.checked)}
            className="mt-0.5 h-7 w-7 shrink-0 cursor-pointer accent-[#f7771c]"
          />
          <span className="font-barlow text-base leading-relaxed text-gray-200 md:text-lg">
            Acepto los{" "}
            <a
              href="/terminos"
              target="_blank"
              className="font-bold text-[#f7771c] underline hover:text-[#c51850]"
            >
              Términos y Condiciones
            </a>{" "}
            y declaro estar apto físicamente.{" "}
            <strong>
              Una vez concluida la inscripción no se aceptan cambios ni
              devoluciones de dinero.
            </strong>
          </span>
        </label>
        {errors.acceptTerms && (
          <p
            role="alert"
            className="font-barlow mt-3 flex items-center gap-1.5 text-sm font-medium text-red-300 md:text-base"
          >
            <WarningCircle size={16} className="shrink-0" />{" "}
            {errors.acceptTerms}
          </p>
        )}
      </div>

      {/* Los botones van en el flujo, no clavados abajo. Iban con
      `fixed` para caer en la zona del pulgar, pero en móvil se
      quedaban encima del contenido todo el rato y tapaban el final
      del formulario mientras se rellenaba. */}
      {/* Barra de navegación fija abajo en móvil: "Siguiente" siempre
        a un toque, sin bajar hasta el fondo a buscarlo. En md+ vuelve
        al flujo. El hueco que reserva lo pone el div de soporte del
        final (pb-40 en móvil), para que no tape el último campo. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#2b0d1d]/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0 md:pt-6 md:backdrop-blur-none">
        {/* La microcopia va ARRIBA de los botones: si va debajo queda
          pegada al borde y en teléfonos con barra de gestos se corta.
          Encima, además, se lee antes de tocar "Siguiente". */}
        <p className="font-barlow mb-2.5 text-center text-xs text-gray-400 md:mb-3 md:text-sm">
          El pago se realiza por transferencia bancaria en el siguiente paso.
        </p>
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
            disabled={verificandoCedula}
            className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-white text-lg font-bold text-black shadow-lg transition outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] disabled:opacity-60 md:text-xl"
          >
            {verificandoCedula ? "Verificando..." : "Siguiente"}{" "}
            <CaretRight size={24} />
          </button>
        </div>
      </div>
    </form>
  );
}
