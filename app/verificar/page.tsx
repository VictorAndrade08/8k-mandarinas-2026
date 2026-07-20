"use client";

import React, { useMemo, useState } from "react";
import {
  IdentificationCard,
  XCircle,
  CircleNotch,
  X,
  CheckCircle,
  Ticket,
} from "@phosphor-icons/react";

// Configuración de estilos y fuentes
const brandPink = "#c51850";
// Naranja mandarina. Se sigue llamando "purple" porque el nombre viene del clon
// del 10K de Ambato y está puesto por medio archivo; el color ya es el correcto.
const brandPurple = "#f7771c";

const bebasClassName = "font-bebas";

// Patrón fijo del código de barras decorativo del ticket: true = barra alta.
// Fijo y no aleatorio a propósito — ver el comentario donde se pinta.
const BARRAS = [
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  false,
  true,
  true,
  false,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
];

// Cómo se llaman de cara al corredor los estados que guarda D1. La columna
// `estado` nace en 'pendiente' desde functions/api/inscribir.js.
const ETAPA = {
  pendiente: "Pago por verificar",
  aprobado: "Inscripción confirmada",
  rechazado: "Pago rechazado",
} as const;

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

  return (
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
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
          }}
        />
        <div className="p-10 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3
            className={`text-5xl text-white uppercase ${bebasClassName} mb-4`}
          >
            No Encontrado
          </h3>
          <p className="text-lg leading-relaxed text-white/80">
            No encontramos ninguna inscripción activa con ese número de cédula.{" "}
            <br /> Por favor verifica que esté bien escrito.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/20 px-8 py-4 text-base font-semibold tracking-wide text-white uppercase transition hover:bg-white/10"
            >
              Intentar de nuevo
            </button>
            <a
              href={hrefInscripcion}
              className="flex items-center justify-center rounded-2xl px-8 py-4 text-base font-bold tracking-wide text-white uppercase shadow-[0_0_20px_rgba(197,24,80,0.32)] transition hover:shadow-[0_0_30px_rgba(197,24,80,0.52)] hover:brightness-110"
              style={{
                background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
              }}
            >
              Ir a Inscribirme
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificarPage() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
        etapa:
          ETAPA[d.estado as keyof typeof ETAPA] ?? d.estado ?? "En proceso",
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
    if (
      t.includes("verificado") ||
      t.includes("aprobado") ||
      t.includes("confirmado")
    )
      return "text-[#2bd98a]";
    if (
      t.includes("verificar") ||
      t.includes("pendiente") ||
      t.includes("solicitado")
    )
      return "text-[#ffc53d]";
    if (t.includes("rechazado") || t.includes("finalizada"))
      return "text-[#ff6b6b]";
    return "text-white";
  };

  return (
    <>
      <NotFoundModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* LAYOUT PRINCIPAL — a sangre, sin la tarjeta flotante gigante: el fondo
          oscuro va de borde a borde como el resto del sitio y el contenido se
          centra en max-w-7xl. */}
      <section className="relative w-full overflow-hidden bg-[#140309] px-4 py-12 font-sans sm:px-6 md:py-16 lg:px-8">
        {/* Dos manchas de color para que el fondo no sea un negro plano. Eran
            moradas y latían con animate-pulse: el morado no está en la marca por
            ningún lado —es el color que sale por defecto— y dos círculos de
            800px respirando en bucle es decoración que no cuenta nada
            (docs/30-REGLAS-ANTI-IA.md, reglas 4, 38 y 63). Ahora son del
            degradado del flyer y se están quietas. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-[#c51850]/15 opacity-50 mix-blend-screen blur-[150px]" />
          <div className="absolute right-[-10%] bottom-[-20%] h-[800px] w-[800px] rounded-full bg-[#f7771c]/10 opacity-50 mix-blend-screen blur-[150px]" />
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

            <h1
              className={`text-3xl text-white sm:text-4xl ${bebasClassName} mb-6 uppercase`}
            >
              Verifica tu inscripción
            </h1>

            <p className="mb-10 max-w-lg text-xl leading-relaxed font-normal text-white/80 lg:text-2xl">
              Consulta el estado de tu inscripción, descarga tu ticket digital y
              prepárate para la carrera más importante del año.
            </p>

            {/* Stats */}
            <div className="mt-2 flex w-full flex-wrap justify-center gap-12 border-t border-white/20 pt-10 lg:justify-start">
              <div>
                <p className={`text-4xl ${bebasClassName} text-white`}>8K</p>
                <p className="text-sm font-bold tracking-widest text-white/60 uppercase">
                  Distancia
                </p>
              </div>
              {/* FECHA ACTUALIZADA AQUÍ */}
              <div>
                <p className={`text-4xl ${bebasClassName} text-white`}>
                  Ago 29
                </p>
                <p className="text-sm font-bold tracking-widest text-white/60 uppercase">
                  Fecha
                </p>
              </div>
              <div>
                <p className={`text-4xl ${bebasClassName} text-white`}>
                  Patate
                </p>
                <p className="text-sm font-bold tracking-widest text-white/60 uppercase">
                  Lugar
                </p>
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA (FORMULARIO/TICKET) --- */}
          <div className="order-1 mx-auto flex w-full max-w-lg justify-center lg:order-2 lg:max-w-full lg:justify-end">
            {/* WRAPPER DEL FORMULARIO/TICKET */}
            <div className="w-full max-w-[500px] text-white">
              {!data && (
                <div className="relative overflow-hidden rounded-[40px] border border-white/20 bg-[#1c0713] p-10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-[50px]" />

                  <div className="relative z-10 mb-10 flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 to-black shadow-inner">
                      <IdentificationCard className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-2xl font-bold text-white">
                        Consultar Cédula
                      </h2>
                      <p className="text-base text-white/60">
                        Ingresa tus datos para validar
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="group relative">
                      <label className="mb-2 ml-1 block text-xs font-bold tracking-widest text-white/50 uppercase transition-colors group-focus-within:text-purple-400">
                        Número de Identificación
                      </label>
                      <div className="relative">
                        <input
                          value={cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          placeholder="Ej: 1801234567"
                          inputMode="numeric"
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

                    <button
                      onClick={verify}
                      disabled={loading || !cedulaOk}
                      className="group relative mt-4 w-full overflow-hidden rounded-2xl py-5 text-base font-bold tracking-widest text-white uppercase shadow-lg shadow-purple-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
                      }}
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
                  </div>

                  <div className="relative z-10 mt-10 border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-white/50">
                      ¿Tienes problemas?{" "}
                      <a
                        href="https://wa.me/593995102378"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-white underline decoration-white/50 hover:text-white"
                      >
                        Contáctanos
                      </a>
                    </p>
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
                          background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
                        }}
                      />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-2 text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
                            Participante
                          </p>
                          <h3 className="mb-2 text-3xl leading-tight font-bold text-white">
                            {data.nombre}
                          </h3>
                          <p className="inline-block rounded bg-white/5 px-2 py-0.5 font-mono text-lg tracking-wider text-white/70">
                            {data.cedula}
                          </p>
                        </div>
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CEDULA:${data.cedula}|NOMBRE:${data.nombre}`}
                            alt="QR"
                            className="h-full w-full object-cover"
                          />
                        </div>
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
                            className={`text-5xl ${bebasClassName} ${getStatusColor(data.etapa || "")} flex items-center gap-3`}
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${data.etapa?.toLowerCase().includes("verificado") ? "bg-[#2bd98a]" : "bg-yellow-400"} animate-pulse shadow-[0_0_15px_currentColor]`}
                            />
                            {data.etapa}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Categoría
                          </p>
                          <p className="border-l-2 border-purple-500 pl-3 text-lg font-bold text-white">
                            {data.categorias}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-bold tracking-widest text-white/50 uppercase">
                            Ciudad
                          </p>
                          <p className="border-l-2 border-pink-500 pl-3 text-lg font-bold text-white">
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

                    {/* Footer del Ticket */}
                    <div className="flex items-center justify-between border-t border-white/10 bg-[#1c0713] p-6">
                      <div className="flex flex-col">
                        <span className="mb-1 text-[10px] font-bold tracking-widest text-white/30 uppercase">
                          Ticket ID
                        </span>
                        <span className="font-mono text-sm font-semibold text-white/70">
                          {data.record_id?.slice(-8).toUpperCase() ||
                            "PRE-ORDER"}
                        </span>
                      </div>
                      {/* Código de barras decorativo. Antes las alturas
                                            salían de Math.random() dentro del render, lo que
                                            daba dos problemas: el servidor pintaba unas barras
                                            y el cliente otras (error de hidratación), y la
                                            clase se construía como h-${...}, que Tailwind no
                                            puede leer al compilar — así que no generaba ni
                                            h-full ni h-2/3 y las barras salían sin altura.
                                            Ahora el patrón es fijo y las clases, literales. */}
                      <div className="h-6 opacity-30" aria-hidden="true">
                        <div className="flex h-full items-end gap-[3px]">
                          {BARRAS.map((alta, i) => (
                            <div
                              key={i}
                              className={`w-[2px] bg-white ${alta ? "h-full" : "h-2/3"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-relaxed text-white/40">
                    Presenta este comprobante digital el día de la entrega de
                    kits. Puedes tomar una captura de pantalla.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
