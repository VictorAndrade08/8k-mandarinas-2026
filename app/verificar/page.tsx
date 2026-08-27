"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { srcSetDe } from "../lib/imagen";
import {
  IdentificationCard,
  XCircle,
  CircleNotch,
  X,
  CheckCircle,
  Ticket,
  WhatsappLogo,
  Copy,
  Package,
} from "@phosphor-icons/react";
import { BANCO } from "../components/inscripcion";
import { WHATSAPP_SOPORTE, PRECIO_GENERAL } from "../lib/carrera";

// Colores de la marca, con el nombre del token que les corresponde. Se
// llamaban `brandPurple` y `brandPink` porque venían del clon del 10K de
// Ambato: un nombre heredado de otro evento es la prueba más clara de que una
// pantalla es una plantilla (docs/100-ANTI-IA-VERIFICAR.md, nº 13).
const MAGENTA = "#c51850";
const NARANJA = "#f7771c";

// Cómo se llaman de cara al corredor los estados. Los tres primeros son los de
// D1; el resto son las Etapas del Airtable donde el equipo valida los pagos —
// desde que /api/consultar-inscripcion lee de ahí, es lo que llega de verdad.
// Una etapa nueva que no esté en esta lista se enseña tal cual: mejor un nombre
// de CRM que un "En proceso" que no dice nada.
const ETAPA: Record<string, string> = {
  pendiente: "Pago por verificar",
  aprobado: "Inscripción confirmada",
  rechazado: "Pago rechazado",
  "Inscrito Pago x Verificar": "Pago por verificar",
  "Inscrito Pago Verificado": "Inscripción confirmada",
  "Inscripción Finalizada": "Inscripción confirmada",
  "Entrega de kits": "Inscripción confirmada",
  Inscrito: "Pago por verificar",
  // Las cuatro etapas de seguimiento del CRM. Son gente que pidió los datos y
  // no llegó a pagar; hasta el 26-ago-2026 veían el nombre interno de la etapa
  // ("Pago Solicitado") en su pantalla, que no significa nada para nadie de
  // fuera y encima suena a que ya pagaron. Son 34 personas.
  "Pago Solicitado": "Falta tu pago",
  Recordatorio: "Falta tu pago",
  "Ultimo dia": "Falta tu pago",
  "Ultima semana": "Falta tu pago",
};

/** Las etiquetas de ETAPA que significan "este todavía no ha pagado". */
const FALTA_PAGO = "Falta tu pago";

type VerifyData = {
  record_id?: string | null;
  nombre?: string | null;
  cedula?: string | null;
  celular?: string | null;
  email?: string | null;
  ciudad?: string | null;
  edad?: number | string | null;
  genero?: string | null;
  categorias?: string | null;
  etapa?: string | null;
  valor?: number | string | null;
};

// --- MODAL DE NO ENCONTRADO ---
function NotFoundModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const hrefInscripcion = "/inscripcion#formulario";

  // Portal a <body>: dentro de <main> (contexto de apilamiento z-10) el
  // header z-50 quedaba POR ENCIMA del modal y lo cortaba — el mismo problema
  // ya resuelto así en CustomModal y en el visor de la galería.
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <div
        className="animate-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/10 bg-[#1c0713] shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* La línea gráfica también en el error: la ilustración de la salida
            como cabecera, en vez del círculo rojo de alarma. No aparecer no
            es una emergencia — es "revisa el número o inscríbete". */}
        <div className="relative h-32 w-full overflow-hidden" aria-hidden>
          <img
            src="/ilustraciones/salida.webp"
            srcSet={srcSetDe("/ilustraciones/salida.webp")}
            sizes="512px"
            alt=""
            className="h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c0713] via-[#1c0713]/25 to-transparent" />
        </div>
        <div className="p-10 pt-8 text-center">
          <h3 className="mb-4 font-[family-name:var(--font-titular)] text-4xl text-white uppercase">
            No te encontramos
          </h3>
          {/* Un "no encontrado" no puede ser un callejón: si esta pantalla no
              dice qué hacer, la persona se queda con la duda de si perdió el
              dinero (docs/100-ANTI-IA-VERIFICAR.md, nº 37 y 38). */}
          <p className="text-left text-base leading-relaxed text-white/80">
            No hay ninguna inscripción con ese número. Suele ser por una de
            estas tres cosas:
          </p>
          <ul className="mt-3 space-y-2 text-left text-base leading-relaxed text-white/70">
            <li>· Un dígito mal escrito. Vuelve a mirarlo.</li>
            <li>
              · Te inscribiste hace menos de 48 horas por WhatsApp y todavía no
              te hemos cargado al sistema.
            </li>
            <li>· Pagó otra persona y la inscripción está a su nombre.</li>
          </ul>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Revisar el número
            </button>
            <a
              href={hrefInscripcion}
              className="flex items-center justify-center rounded-2xl bg-[#c51850] px-8 py-4 text-base font-bold text-white transition hover:brightness-110"
            >
              Quiero inscribirme
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function VerificarPage() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [data, setData] = useState<VerifyData | null>(null);
  // Sustituye al alert() nativo que había: bloquea el hilo y desentona con el
  // resto de la interfaz.
  const [error, setError] = useState<string | null>(null);

  const cedulaClean = useMemo(() => cedula.replace(/\D+/g, ""), [cedula]);
  const cedulaOk = cedulaClean.length >= 6 && cedulaClean.length <= 15;

  const verify = async () => {
    if (!cedulaOk) return;

    setLoading(true);
    setData(null);
    setError(null);

    try {
      // Contra nuestra propia función, no contra Airtable: la API key de
      // Airtable llevaba prefijo NEXT_PUBLIC_ y en un build estático eso
      // significa publicarla en el JS que descarga cualquier visitante.
      const res = await fetch(
        `/api/consultar-inscripcion?cedula=${encodeURIComponent(cedulaClean)}`,
        { cache: "no-store" }
      );
      const json = await res.json();

      if (json.status === "not_found") {
        setModalOpen(true);
        return;
      }

      if (!res.ok || json.status !== "found" || !json.datos) {
        // Si algo falla, se dice. Antes había un modo demo que ante la falta de
        // configuración devolvía un corredor inventado marcado como APROBADO —
        // y como la config nunca existió, era lo único que veía la gente.
        setError(
          json.message ||
            "No pudimos consultar tu inscripción. Inténtalo en un momento."
        );
        return;
      }

      const d = json.datos;
      setData({
        record_id: d.cedula,
        nombre: d.nombre || "Participante",
        cedula: d.cedula ?? cedulaClean,
        ciudad: d.ciudad ?? "No especificada",
        edad: d.edad ?? null,
        genero: d.genero ?? null,
        categorias: d.categoria ?? "General",
        etapa: ETAPA[d.estado as string] ?? d.estado ?? "En proceso",
        valor: d.valor ?? null,
      });
    } catch {
      setError("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (text: string) => {
    const t = String(text).toLowerCase();
    // "confirmad" sin la última letra: el texto real es "Inscripción
    // confirmada", en femenino, y buscando "confirmado" no coincidía nunca.
    // Nadie lo vio en meses porque hasta conectar Airtable ninguna inscripción
    // llegaba a aprobada.
    if (
      t.includes("verificado") ||
      t.includes("aprobado") ||
      t.includes("confirmad")
    )
      return "text-[#2bd98a]";
    if (
      t.includes("verificar") ||
      t.includes("pendiente") ||
      t.includes("solicitado") ||
      t.includes("falta")
    )
      return "text-[#ffc53d]";
    if (t.includes("rechazado")) return "text-[#ff6b6b]";
    return "text-white";
  };

  return (
    <>
      <NotFoundModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* LAYOUT PRINCIPAL — a sangre, sin la tarjeta flotante gigante: el fondo
          oscuro va de borde a borde como el resto del sitio y el contenido se
          centra en max-w-7xl. */}
      {/* pt corto: SiteChrome ya reserva los ~168px del header (HUECO_HEADER);
          sumarle otro pt-20 aplastaba el contenido en móvil. El pb-28 deja
          sitio para la barra inferior fija (lg:hidden), que tapaba el titular
          y las estadísticas al final de la página. */}
      <section className="relative w-full overflow-hidden bg-[#140309] px-4 pt-2 pb-28 font-sans sm:px-6 md:pt-10 lg:px-8 lg:pb-16">
        {/* FOTO DE FONDO: la llegada, que es de lo que va esta página. Antes
            eran dos manchas de color sobre negro plano.

            La capa oscura al 90% no es decoración: encima va un formulario con
            texto blanco, y sobre las zonas claras de la foto se perdería. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src="/ilustraciones/meta.webp"
            srcSet={srcSetDe("/ilustraciones/meta.webp")}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[#140309]/90" />
        </div>

        {/* Grid de Contenido. En móvil el formulario va PRIMERO (order-1): quien
            entra a "Mi pago" quiere teclear su cédula, no bajar por el hero. En
            lg+ vuelve al orden hero-izquierda / formulario-derecha. */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* --- COLUMNA IZQUIERDA (TEXTO/HERO) --- */}
          <div className="order-2 flex flex-col items-center text-center text-white lg:order-1 lg:items-start lg:text-left">
            {/* El logo en vez de un titular gigante: llegaba a text-9xl y se
                  comía la pantalla entera, y encima leía "8K Ruta de las de
                  Patate", que ni siquiera está bien escrito. El logo dice lo
                  mismo, mejor, y en la tipografía real de la marca. */}
            {/* hidden en móvil: el header ya trae el logo y aquí, con el hero
                  debajo del formulario, un segundo logo grande sobra. En lg+
                  vuelve, que ahí es el hero de la columna izquierda. */}
            <img
              src="/logo-mandarinas-blanco.svg"
              alt="8K Ruta de las Mandarinas"
              className="mb-7 hidden h-auto w-[min(82vw,420px)] object-contain drop-shadow-2xl lg:block"
            />

            {/* Sin titular gigante, sin párrafo de venta y sin la fila de
                tres datos (8K / Ago 29 / Patate): esta pantalla no es una
                landing, es un buscador de estado. Quien llega aquí YA se
                inscribió — no hay que venderle la carrera otra vez, y esa fila
                de tres era el patrón "tres tarjetas" disfrazado
                (docs/100-ANTI-IA-VERIFICAR.md, nº 1, 3 y 5). */}
            <h1 className="mb-4 font-[family-name:var(--font-titular)] text-3xl text-white uppercase sm:text-4xl">
              Mi inscripción
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-white/70">
              Escribe tu cédula y te decimos en qué estado está tu pago.
            </p>
          </div>

          {/* --- COLUMNA DERECHA (FORMULARIO/TICKET) --- */}
          <div className="order-1 mx-auto flex w-full max-w-lg justify-center lg:order-2 lg:max-w-full lg:justify-end">
            {/* WRAPPER DEL FORMULARIO/TICKET */}
            <div className="w-full max-w-[500px] text-white">
              {/* Menos aire y menos radio en la tarjeta: el relleno excesivo
                  es la señal nº1 de 2026 de "esto lo generó algo", y el
                  desenfoque decorativo de la esquina no aportaba nada
                  (docs/100-ANTI-IA-VERIFICAR.md, nº 5). */}
              {!data && (
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#1c0713] p-6 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.6)] sm:p-8">
                  {/* Sin el icono metido en un cuadrado redondeado: es el
                      encabezado por defecto de shadcn y se reconoce a leguas
                      (docs/100-ANTI-IA-VERIFICAR.md, nº 32). Un título y una
                      línea, que es lo que hace falta. */}
                  <div className="relative z-10 mb-7 flex items-center gap-3">
                    <IdentificationCard className="h-7 w-7 shrink-0 text-[#f7771c]" />
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Consulta tu estado
                      </h2>
                      <p className="text-sm text-white/60">
                        Con el número de cédula con el que te inscribiste
                      </p>
                    </div>
                  </div>

                  {/* <form> de verdad: hasta hoy solo se podía enviar con el
                      botón, y un formulario que ignora Enter se siente a
                      maqueta, no a producto (nº 9). */}
                  <form
                    className="relative z-10 space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!loading && cedulaOk) verify();
                    }}
                  >
                    <div className="group relative">
                      <label className="mb-2 ml-1 block text-xs font-bold tracking-widest text-white/50 uppercase transition-colors group-focus-within:text-purple-400">
                        Número de Identificación
                      </label>
                      <div className="relative">
                        <input
                          value={cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          placeholder="1801234567"
                          inputMode="numeric"
                          autoComplete="off"
                          enterKeyHint="search"
                          // El 100% de quien abre esta página viene a escribir
                          // aquí: no tiene sentido hacerle dar un toque más.
                          autoFocus
                          className="w-full rounded-2xl border border-white/20 bg-[#230a17] px-5 py-5 pl-5 text-xl font-medium text-white shadow-inner transition-all placeholder:text-white/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                        <div className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2">
                          {cedulaOk ? (
                            <CheckCircle className="h-6 w-6 text-[#2bd98a]" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white/20" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Color plano de marca, sin degradado ni mayúsculas
                        espaciadas: el CTA con degradado es de los tics más
                        señalados de lo generado, y el texto dice el resultado
                        ("ver mi inscripción"), no la acción del sistema
                        ("consultar"). (docs/100-ANTI-IA-VERIFICAR.md, 23–25.) */}
                    <button
                      type="submit"
                      disabled={loading || !cedulaOk}
                      className="mt-4 w-full rounded-2xl bg-[#c51850] py-4 text-base font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <CircleNotch className="h-6 w-6 animate-spin" />
                        ) : (
                          <Ticket className="h-6 w-6" />
                        )}
                        {loading ? "Buscando..." : "Consultar Inscripción"}
                      </span>
                    </button>

                    {/* role="alert" para que un lector de pantalla lo anuncie
                                        al aparecer: si no, quien no ve la pantalla se queda
                                        esperando un resultado que ya falló. */}
                    {error && (
                      <p
                        role="alert"
                        className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                      >
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}
                  </form>

                  {/* AYUDA DE VERDAD. Antes decía "¿Tienes problemas?
                      Contáctanos" con un enlace a WhatsApp y ya: quien tiene un
                      problema con su pago no sabe si le van a contestar, ni qué
                      escribir, ni que puede ir en persona. Ahora se dicen las
                      dos salidas y el WhatsApp lleva el mensaje empezado —el
                      número de teléfono sale de WHATSAPP_SOPORTE
                      (app/lib/carrera.ts), que estaba escrito a mano aquí. */}
                  <div className="relative z-10 mt-10 border-t border-white/10 pt-8">
                    <p className="text-sm font-bold text-white">
                      ¿Algo no cuadra con tu pago o tu inscripción?
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      Escríbenos y cuéntanos qué pasó, o acércate el{" "}
                      <strong className="font-semibold text-white/85">
                        viernes 28 al punto de entrega de kits
                      </strong>{" "}
                      — Vehicentro (Ficoa, Ambato), Av. los Guaytambos y La
                      Delicia, de 10h00 a 17h00 — y lo resolvemos ahí mismo.
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(
                        "Hola, tengo un problema con mi inscripción de la 8K Ruta de las Mandarinas. Mi cédula es: "
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25D366]/20"
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      Explicar mi problema por WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {data && (
                <div className="animate-in fade-in zoom-in-95 relative w-full duration-500">
                  <button
                    onClick={() => {
                      setData(null);
                      setCedula("");
                    }}
                    className="absolute -top-12 right-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-wider text-white/50 uppercase transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" /> Nueva Consulta
                  </button>

                  {/* TICKET VISUAL - MÁS GRANDE */}
                  <div className="relative w-full overflow-hidden rounded-[32px] border border-white/20 bg-[#230a17] shadow-[0_40px_100px_-20px_rgba(247,119,28,0.32)]">
                    {/* Header del Ticket */}
                    <div className="relative overflow-hidden border-b border-dashed border-white/10 bg-[#2b0d1d] p-8">
                      <div
                        className="absolute top-0 left-0 h-1.5 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${NARANJA}, ${MAGENTA})`,
                        }}
                      />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                            Participante
                          </p>
                          <h3 className="mb-2 text-3xl leading-tight font-bold text-white">
                            {data.nombre}
                          </h3>
                          <p className="inline-block rounded bg-white/5 px-2 py-0.5 font-mono text-lg tracking-wider text-white/70">
                            {data.cedula}
                          </p>
                        </div>
                        {/* Aquí había un QR generado en api.qrserver.com con
                            la CÉDULA Y EL NOMBRE metidos en la URL: cada
                            consulta mandaba los datos del corredor a un tercero
                            y el código no servía para nada —en la entrega de
                            kits se pide la cédula física y el comprobante, no
                            se escanea nada—. Un adorno que además filtra datos
                            es exactamente lo que delata una pantalla generada
                            (docs/100-ANTI-IA-VERIFICAR.md, nº 17 y 18). */}
                      </div>
                      <div className="absolute -bottom-4 -left-4 z-20 h-8 w-8 rounded-full border-t border-r border-white/20 bg-[#140309]" />
                      <div className="absolute -right-4 -bottom-4 z-20 h-8 w-8 rounded-full border-t border-l border-white/20 bg-[#140309]" />
                    </div>

                    {/* Body del Ticket */}
                    <div className="bg-[#230a17] p-8 pt-10">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                        <div className="col-span-2">
                          <p className="mb-2 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Estado
                          </p>
                          <div
                            className={`font-[family-name:var(--font-titular)] text-4xl ${getStatusColor(data.etapa || "")} flex items-center gap-3`}
                          >
                            {/* El punto toma el color del texto (bg-current):
                                data.etapa ya es la etiqueta traducida
                                ("Inscripción confirmada"), que nunca contiene
                                "verificado" — buscándolo ahí, una inscripción
                                aprobada salía en verde con el punto amarillo. */}
                            {/* Sin animate-pulse: un estado que ya no va a
                                cambiar mientras se mira no debe latir. */}
                            <span className="h-3 w-3 rounded-full bg-current" />
                            {data.etapa}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Categoría
                          </p>
                          <p className="border-l-2 border-[#f7771c] pl-3 text-lg font-bold text-white">
                            {data.categorias}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Ciudad
                          </p>
                          <p className="border-l-2 border-[#f7771c] pl-3 text-lg font-bold text-white">
                            {data.ciudad}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Edad
                          </p>
                          <p className="text-lg font-medium text-white">
                            {data.edad ? `${data.edad} Años` : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Género
                          </p>
                          <p className="text-lg font-medium text-white">
                            {data.genero || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pie del ticket. Antes llevaba un "Ticket ID" que
                        no sirve para nada en la entrega —y que caía a
                        "PRE-ORDER", en inglés, cuando no había id— y un código
                        de barras DECORATIVO, dibujado con un patrón fijo de
                        divs. Un código que no codifica nada es el tipo de
                        adorno que delata lo generado; en su sitio va lo que sí
                        hace falta el viernes (nº 15, 19 y 52). */}
                    <div className="border-t border-white/10 bg-[#1c0713] px-8 py-5">
                      <p className="text-xs leading-relaxed text-white/50">
                        Para retirar el kit el viernes 28 en Vehicentro hay que
                        presentar la{" "}
                        <strong className="text-white/75">cédula</strong> y el{" "}
                        <strong className="text-white/75">
                          comprobante del pago
                        </strong>
                        . Esta pantalla no los reemplaza: llévalos.
                      </p>
                    </div>
                  </div>

                  {/* QUÉ HACER AHORA. Hasta el 26-ago-2026 esta página
                      terminaba aquí: te decía tu estado y te dejaba solo. Para
                      quien no ha pagado eso es un callejón sin salida —son 34
                      personas que pidieron los datos por WhatsApp y nunca
                      transfirieron— y para quien sí pagó, la duda que queda es
                      cuándo y dónde recoge el kit. Las dos respuestas van aquí,
                      que es donde ya está mirando. */}
                  {data.etapa === FALTA_PAGO ? (
                    <div className="mt-6 rounded-2xl border border-[#ffc53d]/40 bg-[#ffc53d]/[0.07] p-6">
                      <h4 className="text-lg font-bold text-white">
                        Tu cupo está apartado, falta el pago
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                        Transfiere{" "}
                        <strong className="text-white">
                          ${data.valor || PRECIO_GENERAL}
                        </strong>{" "}
                        a esta cuenta y mándanos la foto del comprobante por
                        WhatsApp. Con eso quedas dentro.
                      </p>

                      <dl className="mt-4 space-y-2 rounded-xl bg-black/25 p-4 text-sm">
                        {[
                          ["Banco", BANCO.entidad],
                          [`Cuenta ${BANCO.tipo.toLowerCase()}`, BANCO.numero],
                          ["Titular", BANCO.titular],
                          ["RUC", BANCO.ruc],
                        ].map(([etiqueta, valor]) => (
                          <div
                            key={etiqueta}
                            className="flex items-baseline justify-between gap-3"
                          >
                            <dt className="text-white/50">{etiqueta}</dt>
                            <dd className="font-mono font-bold text-white">
                              {valor}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {/* Copiar la cuenta entera de un toque: nadie transcribe
                          diez dígitos sin equivocarse, y un dígito mal es un
                          pago que alguien tiene que rastrear a mano. */}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(
                              `${BANCO.entidad}\nCuenta ${BANCO.tipo.toLowerCase()}: ${BANCO.numero}\nTitular: ${BANCO.titular}\nRUC: ${BANCO.ruc}\nValor: $${data.valor || PRECIO_GENERAL}.00`
                            )
                            .then(() => setCopiado(true));
                          setTimeout(() => setCopiado(false), 2500);
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                      >
                        <Copy size={18} />
                        {copiado ? "¡Copiado!" : "Copiar datos de la cuenta"}
                      </button>

                      <a
                        href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(
                          `Hola, soy ${data.nombre} (cédula ${data.cedula}). Ya hice el pago de la 8K y les mando el comprobante.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                      >
                        <WhatsappLogo size={20} weight="fill" />
                        Enviar mi comprobante por WhatsApp
                      </a>

                      <p className="mt-3 text-xs leading-relaxed text-white/60">
                        El kit se entrega el{" "}
                        <strong className="text-white/85">
                          viernes 28, de 10h00 a 17h00
                        </strong>
                        , en Vehicentro (Ficoa, Ambato). Es la única entrega.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.04] p-6">
                      <h4 className="flex items-center gap-2 text-lg font-bold text-white">
                        <Package size={22} className="text-[#f7771c]" />
                        Retira tu kit el viernes 28
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                        De <strong className="text-white">10h00 a 17h00</strong>{" "}
                        en <strong className="text-white">Vehicentro</strong>{" "}
                        (Ficoa, Ambato) — Av. los Guaytambos y La Delicia. Lleva
                        tu <strong className="text-white">cédula</strong> y el{" "}
                        <strong className="text-white">comprobante</strong> del
                        pago. El kit que no se retira en ese horario se pierde.
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-white/45">
                        Presenta este comprobante digital el día de la entrega.
                        Puedes tomar una captura de pantalla.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
