"use client";

import Link from "next/link";
import React, {
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
// Phosphor en vez de lucide: lucide es el set por defecto de shadcn/v0 y su trazo
// uniforme se reconoce a leguas como plantilla generada. Phosphor tiene pesos y
// remate redondeado, así que la interfaz se ve dibujada por alguien.
import {
  IconContext,
  CheckCircle,
  SneakerMove,
  Medal,
  Crown,
  Wheelchair,
  PersonSimpleRun,
} from "@phosphor-icons/react";
import { toast, Toaster } from "sonner";

// --- Interfaces Actualizadas ---
/** Lo que promete devolver functions/api/inscribir.js */
import {
  CustomModal,
  ResumeModal,
  SoporteReal,
  PasoCategoria,
  PasoDatos,
  useProgresoGuardado,
  useNavegacionPasos,
  enviarInscripcion,
  useCuentaAtras,
  ContadorSesion,
  PasoPago,
  PasoFinal,
  FormularioProvider,
  reglas,
  formatTelefono,
  hoyISO,
  CAMPOS_PASO_2,
  enfocarPrimerError,
  erroresPaso2,
  erroresPaso3,
  type FormDataState,
  type ProgresoGuardado,
  type Category,
} from "./inscripcion";

// --- COMPONENTE PRINCIPAL ---
export default function InscripcionPage() {
  const [step, setStep] = useState(1);
  // Confirmación con diseño (no el alert del navegador) para salir al inicio.
  const [salirAbierto, setSalirAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modals & Links
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "error" as "error" | "success" | "warning",
    actionLabel: undefined as string | undefined,
    onAction: undefined as (() => void) | undefined,
  });

  // Selección
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "qr">(
    "transferencia"
  );

  // Archivo
  const [previewName, setPreviewName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [codigoInscripcion, setCodigoInscripcion] = useState<string>("");

  // Refs
  const componentRef = useRef<HTMLDivElement | null>(null);
  const honeypot = useRef<HTMLInputElement | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const didMount = useRef(false);

  // Form Data Inicial (Agregamos los campos por defecto)
  const initialFormData: FormDataState = {
    tipo_documento: "cedula",
    cedula: "",
    nombres: "",
    apellidos: "",
    ciudad: "",
    email: "",
    telefono: "",
    edad: "",
    genero: "",
    // Nuevos campos
    es_titular: "si",
    nombre_titular_cuenta: "",
    num_comprobante: "",
    fecha_pago: "",
    comprobante: null,
  };

  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  // El botón "atrás" del navegador va al paso anterior, no fuera del formulario.
  useNavegacionPasos(setStep);

  // El avance se guarda solo en localStorage y se ofrece al volver.
  const progreso = useProgresoGuardado({
    step,
    selectedCategory,
    selectedPrice,
    acceptTerms,
    metodoPago,
    formData,
    aplicar: (data: ProgresoGuardado) => {
      if (data.formData)
        setFormData((prev) => ({
          ...prev,
          ...data.formData,
          // El File no se serializa, así que lo guardado nunca lo trae: hay que
          // dejarlo en null explícitamente o quedaría el del render anterior.
          comprobante: null,
        }));
      if (data.step) setStep(data.step);
      if (data.selectedCategory) setSelectedCategory(data.selectedCategory);
      if (typeof data.selectedPrice === "number")
        setSelectedPrice(data.selectedPrice);
      if (typeof data.acceptTerms === "boolean")
        setAcceptTerms(data.acceptTerms);
      if (data.metodoPago === "qr" || data.metodoPago === "transferencia")
        setMetodoPago(data.metodoPago);
    },
  });

  // Cuenta atrás visible en los pasos 2 y 3. Es solo presión visual: al llegar
  // a cero se reinicia sola y en silencio, no caduca nada y no bloquea nada.
  const sesion = useCuentaAtras({ activo: step === 2 || step === 3 });

  // Función para reiniciar el formulario
  const handleReset = () => {
    // La cuenta atrás se acaba aquí: si el límite viejo sobreviviera, la
    // siguiente inscripción arrancaría con el tiempo ya vencido.
    sesion.reiniciar();
    setStep(1);
    setFormData(initialFormData);
    setSelectedCategory("");
    setSelectedPrice(0);
    setPreviewName("");
    setUploadedFileUrl("");
    setAcceptTerms(false);
    setErrors({});
    progreso.olvidar();
    if (componentRef.current) {
      componentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Categorías
  const categories: Category[] = [
    {
      name: "Élite Pro 8K",
      price: 20,
      desc: "Hasta 39 años",
      icon: <SneakerMove size={24} />,
    },
    {
      name: "Máster",
      price: 20,
      desc: "40–64 años",
      icon: <Medal size={24} />,
    },
    {
      name: "Leyenda",
      price: 18,
      desc: "65 años en adelante",
      icon: <Crown size={24} />,
    },
    {
      name: "Discapacidad",
      price: 18,
      desc: "Todas las edades",
      icon: <Wheelchair size={24} />,
    },
  ];

  // --- Efectos ---
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    // Una entrada de historial por paso, para que el "atrás" del navegador
    // retroceda dentro del formulario. Solo al avanzar: si el paso cambió porque
    // el usuario YA dio atrás, apilar otra entrada lo dejaría atrapado — daría
    // atrás y volvería al mismo sitio.
    const enHistorial = (window.history.state as { paso?: number } | null)
      ?.paso;
    if (enHistorial !== step) {
      window.history.pushState({ paso: step }, "");
    }

    if (componentRef.current) {
      const topOffset = 80;
      const elementPosition =
        componentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth",
      });
    }
  }, [step]);

  // --- Lógica del Formulario ---

  const showAlert = (
    title: string,
    message: string,
    type: "error" | "warning" | "success" = "error",
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      actionLabel,
      onAction,
    });
  };

  // Copiar datos de pago al portapapeles (evita errores al transferir)
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  // Un temblor en la mano dispara un segundo toque a los pocos ms. Sin esto, el
  // primer toque cambia de paso y el segundo aterriza sobre lo que haya quedado
  // en ese mismo píxel del paso siguiente (un input, la casilla de términos...).
  const ultimoToque = useRef(0);
  const sinRebote = (fn: () => void) => () => {
    const ahora = Date.now();
    if (ahora - ultimoToque.current < 500) return;
    ultimoToque.current = ahora;
    fn();
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat.name);
    setSelectedPrice(cat.price);
    setStep(2);
  };

  // La categoría se elige en el paso 1 y la edad se escribe en el paso 2. Si no cuadran
  // lo decimos ahí mismo, en vez de que lo descubra un juez el día de la carrera.
  const categoriaPorEdad = (edad: number) => {
    if (isNaN(edad)) return null;
    if (edad < 40) return "Élite Pro 8K";
    if (edad < 65) return "Máster";
    return "Leyenda";
  };

  const edadNum = parseInt(formData.edad, 10);
  const categoriaSugerida = categoriaPorEdad(edadNum);
  // Discapacidad no depende de la edad, así que esa nunca la corregimos.
  const categoriaNoCuadra =
    Boolean(selectedCategory) &&
    selectedCategory !== "Discapacidad" &&
    categoriaSugerida !== null &&
    categoriaSugerida !== selectedCategory &&
    !errors.edad;

  const aplicarCategoriaSugerida = () => {
    const cat = categories.find((c) => c.name === categoriaSugerida);
    if (!cat) return;
    setSelectedCategory(cat.name);
    setSelectedPrice(cat.price);
    toast.success(`Cambiado a ${cat.name} · $${cat.price}`);
  };

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      // Lógica para el titular de la cuenta
      if (name === "es_titular") {
        setFormData((prev) => ({
          ...prev,
          es_titular: value,
          // Si dice que SI es titular, prellenamos con su nombre y apellido
          nombre_titular_cuenta:
            value === "si" ? `${prev.nombres} ${prev.apellidos}` : "",
        }));
        return;
      }

      const files = (e.target as HTMLInputElement).files;

      // Al corregir, el error rojo se va de inmediato; no lo hacemos esperar al blur.
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      if (files && files[0]) {
        const file = files[0];
        const tipoOk =
          file.type.startsWith("image/") || file.type === "application/pdf";
        if (!tipoOk) {
          setErrors((prev) => ({
            ...prev,
            comprobante: "Solo aceptamos foto (JPG, PNG) o PDF.",
          }));
          return;
        }
        if (file.size > 10_000_000) {
          const mb = (file.size / 1_000_000).toFixed(0);
          setErrors((prev) => ({
            ...prev,
            comprobante: `Ese archivo pesa ${mb}MB y el máximo es 10MB. Toma la captura de nuevo.`,
          }));
          return;
        }
        setErrors((prev) => ({ ...prev, comprobante: "" }));
        setFormData((f) => ({ ...f, [name]: file }));
        setPreviewName(file.name);
        return;
      }

      if (name === "telefono") {
        setFormData((f) => ({ ...f, telefono: formatTelefono(value) }));
        return;
      }

      if (name === "cedula") {
        setFormData((f) => ({
          ...f,
          cedula:
            f.tipo_documento === "pasaporte"
              ? value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 15)
              : value.replace(/\D/g, "").slice(0, 10),
        }));
        return;
      }

      setFormData((f) => ({ ...f, [name]: value }));
    },
    [errors]
  );

  const clearFile = useCallback(() => {
    setFormData((f) => ({ ...f, comprobante: null }));
    setPreviewName("");
  }, []);

  // Lleva el cursor al primer campo que falla: en móvil evita que el usuario
  // tenga que cazar el error rojo haciendo scroll.
  const validateStep2 = () => {
    const errs = erroresPaso2(validateField);
    setErrors(errs);
    enfocarPrimerError(errs, CAMPOS_PASO_2 as string[]);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = erroresPaso3(formData, validateField);
    setErrors(errs);
    enfocarPrimerError(errs, [
      "num_comprobante",
      "fecha_pago",
      "nombre_titular_cuenta",
    ]);
    return Object.keys(errs).length === 0;
  };

  const checkUserExists = async () => {
    if (!formData.cedula || formData.cedula.length < 5) return false;
    setVerifying(true);
    try {
      const res = await fetch(
        `/api/verificar-cedula?cedula=${formData.cedula}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setVerifying(false);

      if (json && json.exists) {
        const nombreExistente = json.datos?.nombre || "Usuario";
        showAlert(
          "YA REGISTRADO",
          `La cédula ${formData.cedula} (${nombreExistente}) ya tiene una inscripción activa.`,
          "error",
          "Corregir mi Pago",
          () => (window.location.href = "/verificar")
        );
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error verificando:", e);
      setVerifying(false);
      return false;
    }
  };

  // Consultamos duplicados solo cuando el documento ya está completo. Antes se exigían
  // 10 caracteres, así que un pasaporte de 9 nunca se revisaba.
  const handleCedulaBlur = () => {
    if (validateField("cedula") === null) checkUserExists();
  };

  const goToStep3 = async () => {
    const camposOk = validateStep2();
    if (!acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "Marca la casilla para continuar.",
      }));
      if (camposOk) document.getElementById("acceptTerms")?.focus();
    }
    if (!camposOk || !acceptTerms) return;

    if (await checkUserExists()) return;

    // Casi todos pagan el mismo día que se inscriben: llegan con la fecha puesta.
    setFormData((f) => ({ ...f, fecha_pago: f.fecha_pago || hoyISO() }));
    setStep(3);
  };

  const submitForm = async () => {
    if (submitting) return;

    // Honeypot: un humano nunca ve este campo, así que si viene lleno es un bot.
    // Fingimos éxito para no darle pistas de por qué falló.
    if (honeypot.current?.value) {
      setStep(4);
      return;
    }

    if (!validateStep3()) return;

    setSubmitting(true);
    setLoading(true);

    const resultado = await enviarInscripcion({
      formData,
      categoria: selectedCategory,
      precio: selectedPrice,
      metodoPago,
    });

    setLoading(false);

    if (!resultado.ok) {
      showAlert(resultado.titulo, resultado.mensaje);
      setSubmitting(false);
      return;
    }

    if (resultado.urlComprobante) setUploadedFileUrl(resultado.urlComprobante);
    if (resultado.codigo) setCodigoInscripcion(resultado.codigo);
    // Ya está enviada: lo guardado ya no sirve para retomar nada.
    progreso.olvidar();
    setStep(4);
    setSubmitting(false);
  };
  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  // Las reglas viven en ./inscripcion/validacion.ts: son funciones puras y allí
  // se pueden probar sin montar React. Dependen del tipo de documento, así que
  // se recalculan cuando cambia.
  const fieldRules = useMemo(
    () => reglas(formData.tipo_documento),
    [formData.tipo_documento]
  );

  const validateField = (name: keyof FormDataState, value?: string) =>
    fieldRules[name]?.(
      value ?? (formData[name] ? String(formData[name]) : "")
    ) ?? null;

  const isFieldValid = (name: keyof FormDataState) => {
    const raw = formData[name] ? String(formData[name]) : "";
    return (
      Boolean(raw) && Boolean(fieldRules[name]) && validateField(name) === null
    );
  };

  // El error aparece cuando el cursor sale del campo, nunca mientras teclea.
  const handleBlur = (name: keyof FormDataState) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name) || "" }));
  };

  // Corrector de typos de email (gmail.con -> gmail.com, etc.)
  const emailTypos: Record<string, string> = {
    "gmail.con": "gmail.com",
    "gmail.co": "gmail.com",
    "gmial.com": "gmail.com",
    "gmail.cm": "gmail.com",
    "gmaill.com": "gmail.com",
    "hotmail.con": "hotmail.com",
    "hotmial.com": "hotmail.com",
    "hotmail.co": "hotmail.com",
    "outlook.con": "outlook.com",
    "outlook.co": "outlook.com",
    "yaho.com": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "icloud.con": "icloud.com",
    "live.con": "live.com",
  };
  const emailSuggestion = (() => {
    const e = formData.email.trim().toLowerCase();
    const at = e.indexOf("@");
    if (at < 0) return null;
    const domain = e.slice(at + 1);
    if (emailTypos[domain]) return e.slice(0, at + 1) + emailTypos[domain];
    return null;
  })();

  // El teclado virtual tapa la mitad de abajo. Subimos el campo enfocado para que
  // no quede debajo de él ni oculte su propio mensaje de error.
  const scrollAlEnfocar = (e: React.FocusEvent<HTMLElement>) => {
    if (window.innerWidth >= 768) return;
    const node = e.target;
    setTimeout(
      () => node.scrollIntoView({ block: "center", behavior: "smooth" }),
      300
    );
  };

  return (
    // Duotone: borde sólido más un relleno del mismo color al 20%. Es lo que separa
    // esto de un formulario de plantilla, donde los iconos son todos trazo fino gris.
    // El contexto es lo que permite que los campos y los pasos vivan en sus
    // propios archivos: sin él, cada <CampoTexto> necesitaría seis props que el
    // paso que lo contiene no usa para nada, solo para reenviarlas.
    <FormularioProvider
      value={{
        formData,
        errors,
        esValido: isFieldValid,
        alEscribir: handleInput,
        alSalir: handleBlur,
        alEnfocar: scrollAlEnfocar,
      }}
    >
      <IconContext.Provider value={{ weight: "duotone" }}>
        {/* El Toaster estaba en app/layout.tsx, así que sonner entraba en el JS de
          las seis páginas del sitio y solo se usa aquí: los avisos de "copiado"
          y "categoría cambiada" son de este formulario. */}
        <Toaster position="top-center" richColors closeButton duration={2400} />

        {/* En móvil el fondo va oscuro (el mismo del panel del formulario): sin
          esto, el py-6 de arriba dejaba ver el degradado naranja del layout como
          una franja por encima del form. En md+ vuelve a transparente para que
          la tarjeta flote sobre el naranja, que ahí sí queda bien. */}
        <main className="flex min-h-dvh w-full items-start justify-center bg-[#230a17] py-6 text-white md:bg-transparent md:px-4 md:py-12">
          {/* INYECCIÓN DE FUENTES */}
          <style>{`
        
        
      `}</style>

          {/* Modales */}
          {/* Confirmación de salida con el diseño del sitio (no el alert del
              navegador). Lo prominente es SEGUIR; salir es la opción secundaria.
              Tocar el fondo = quedarse (la acción segura). */}
          {salirAbierto && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="¿Salir de la inscripción?"
              onClick={() => setSalirAbierto(false)}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#200815] p-6 pb-8 shadow-2xl md:p-8"
              >
                <div className="flex flex-col items-center gap-5 text-center">
                  <h3 className="font-bebas text-3xl font-bold text-white uppercase md:text-4xl">
                    ¿Salir de la inscripción?
                  </h3>
                  <p className="font-barlow text-lg leading-relaxed text-gray-300">
                    Tu avance queda guardado en este dispositivo. Puedes volver
                    y continuar cuando quieras.
                  </p>
                  <div className="mt-2 flex w-full flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setSalirAbierto(false)}
                      className="font-barlow w-full rounded-xl bg-[#f7771c] py-4 text-lg font-bold text-white shadow-lg shadow-[#f7771c]/20 transition hover:bg-[#d2600f] md:text-xl"
                    >
                      Seguir con mi inscripción
                    </button>
                    <Link
                      href="/"
                      className="font-barlow w-full rounded-xl bg-[#331023] py-4 text-lg font-bold text-gray-400 transition hover:bg-[#471830] hover:text-white md:text-xl"
                    >
                      Salir al inicio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          <CustomModal
            isOpen={modalState.isOpen}
            title={modalState.title}
            message={modalState.message}
            type={modalState.type}
            actionLabel={modalState.actionLabel}
            onAction={modalState.onAction}
            onClose={() => setModalState({ ...modalState, isOpen: false })}
          />
          <ResumeModal
            isOpen={progreso.modalAbierto}
            step={progreso.pasoGuardado}
            onResume={progreso.retomar}
            onNew={progreso.empezarDeNuevo}
          />
          {/* Contenedor Principal */}
          {/* El backdrop-blur solo en desktop: un backdrop-filter crea bloque contenedor
          para los descendientes `position:fixed`, y en móvil eso ancla la barra de
          acción a esta tarjeta (donde el overflow-hidden la recorta) en vez de al viewport. */}
          <div
            ref={componentRef}
            className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden bg-[#361126]/80 md:flex-row md:rounded-[32px] md:border md:border-white/5 md:shadow-2xl md:backdrop-blur-xl"
          >
            {/* --- SIDEBAR / HEADER --- */}
            <div className="relative flex min-w-[300px] flex-col justify-between border-b border-white/5 bg-[#230a17] p-6 md:w-1/3 md:border-r md:border-b-0 md:p-12">
              <div>
                <div className="mb-6 flex flex-col gap-3 md:mb-12">
                  {/* El logo vuelve al inicio, pero PREGUNTA antes: en medio de
                      la inscripción un clic accidental no debe sacarte. El
                      formulario se autoguarda, así que no se pierde nada, pero
                      la confirmación evita el susto. Debajo va un botón visible
                      "Inicio" para que la salida sea evidente, no adivinada. */}
                  <button
                    type="button"
                    aria-label="Volver al inicio"
                    onClick={() => setSalirAbierto(true)}
                    className="inline-flex w-fit rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#230a17]"
                  >
                    <img
                      src="/logo-mandarinas-blanco.svg"
                      alt="8K Ruta de las Mandarinas — volver al inicio"
                      className="h-20 w-auto object-contain transition-transform hover:scale-[1.03] md:h-24"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalirAbierto(true)}
                    className="font-barlow inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    ← Volver al inicio
                  </button>
                </div>

                {/* BARRA DE PROGRESO (Móvil) */}
                <div className="mb-2 md:hidden">
                  {/* mb-7: el corredor mide 48px y sobresale 24px sobre la barra;
                    con menos separación se monta encima del texto "Paso X de 4". */}
                  <div className="font-barlow mb-7 flex items-center justify-between">
                    <span className="text-base font-bold tracking-wider text-gray-300 uppercase sm:text-lg">
                      Paso {step} de 4
                    </span>
                    <span className="text-base font-bold text-white uppercase sm:text-lg">
                      {stepsLabels[step - 1]}
                    </span>
                  </div>
                  <div className="mb-4">
                    <ContadorSesion
                      texto={sesion.texto}
                      enAviso={sesion.enAviso}
                    />
                  </div>
                  <div className="relative mt-1 h-2.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#f7771c] transition-all duration-500"
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: `${(step / 4) * 100}%` }}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#f7771c] shadow-[0_5px_16px_rgba(0,0,0,0.55)] ring-2 ring-[#f7771c]/50">
                        <PersonSimpleRun size={24} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* LISTA DE PASOS (Desktop) */}
                <div className="font-barlow relative z-10 hidden space-y-8 md:block">
                  {stepsLabels.map((label, index) => {
                    const stepNum = index + 1;
                    const active = step === stepNum;
                    const completed = step > stepNum;
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-5 transition-all duration-300 ${active ? "translate-x-2 opacity-100" : "opacity-40"}`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold transition-all ${active ? `border-[#f7771c] bg-[#f7771c] text-white` : completed ? "border-green-500 bg-green-500 text-black" : "border-white/20 bg-transparent text-white"}`}
                        >
                          {completed ? <CheckCircle size={24} /> : stepNum}
                        </div>
                        <div>
                          <p
                            className={`text-xl font-bold tracking-wider uppercase ${active ? "text-white" : "text-gray-400"}`}
                          >
                            {label}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* El mismo contador que en móvil. Estaba solo dentro del
                      bloque md:hidden de la barra de progreso, así que en
                      escritorio no salía. */}
                  <div className="pt-2">
                    <ContadorSesion
                      texto={sesion.texto}
                      enAviso={sesion.enAviso}
                    />
                  </div>
                </div>
              </div>

              {/* En móvil esta columna se apila ARRIBA del formulario, así que el soporte
              va al final del contenido (ver <SoporteReal />) y aquí solo en desktop. */}
              <div className="font-barlow relative z-10 mt-16 hidden md:mt-0 md:block">
                <SoporteReal />
              </div>
            </div>

            {/* --- ÁREA DE CONTENIDO --- */}
            <div className="relative min-h-[500px] bg-[#2b0d1d] p-5 md:w-2/3 md:p-14">
              {(loading || verifying) && (
                <div className="animate-in fade-in absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#2b0d1d]/95 backdrop-blur-sm">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#f7771c] border-t-transparent" />
                  <p className="font-barlow animate-pulse text-lg font-bold tracking-widest text-white uppercase md:text-xl">
                    {verifying
                      ? "Verificando cédula..."
                      : "Procesando inscripción..."}
                  </p>
                </div>
              )}

              <div className="mx-auto max-w-3xl">
                {/* RESUMEN FIJO DE CATEGORÍA + PRECIO (pasos 2 y 3) */}
                {(step === 2 || step === 3) && selectedCategory && (
                  <div className="font-barlow mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#f7771c]/30 bg-[#200815] px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase md:text-xs">
                        Tu categoría
                      </span>
                      <span className="text-base leading-tight font-bold text-white md:text-lg">
                        {selectedCategory}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase md:text-xs">
                        Total preventa
                      </span>
                      <span className="text-2xl leading-none font-black text-[#f7771c] md:text-3xl">
                        ${selectedPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* --- PASO 1: CATEGORÍA --- */}
                {step === 1 && (
                  <PasoCategoria
                    categorias={categories}
                    onElegir={(cat) =>
                      sinRebote(() => handleCategoryClick(cat))()
                    }
                  />
                )}

                {/* --- PASO 2: DATOS --- */}
                {step === 2 && (
                  <PasoDatos
                    acceptTerms={acceptTerms}
                    onAceptarTerminos={(valor) => {
                      setAcceptTerms(valor);
                      // Al marcar la casilla el error se va solo: dejarlo en
                      // rojo mientras ya está corregido es lo que hace que la
                      // gente vuelva a leerlo buscando qué falta.
                      if (valor)
                        setErrors((prev) => ({ ...prev, acceptTerms: "" }));
                    }}
                    emailSuggestion={emailSuggestion}
                    onUsarEmailSugerido={() => {
                      // emailSuggestion puede ser null (no hay nada que
                      // corregir): sin esta guarda, el campo se vaciaría.
                      if (emailSuggestion)
                        setFormData((f) => ({ ...f, email: emailSuggestion }));
                    }}
                    categoriaSugerida={categoriaSugerida}
                    categoriaNoCuadra={categoriaNoCuadra}
                    edadNum={edadNum}
                    selectedCategory={selectedCategory}
                    onAplicarCategoria={aplicarCategoriaSugerida}
                    onCedulaCompleta={handleCedulaBlur}
                    verificandoCedula={verifying}
                    categorias={categories}
                    onGenero={(valor) => {
                      setFormData((f) => ({ ...f, genero: valor }));
                      setErrors((prev) => ({ ...prev, genero: "" }));
                    }}
                    onAtras={() => sinRebote(() => setStep(1))()}
                    onSiguiente={goToStep3}
                  />
                )}

                {/* --- PASO 3: PAGO (MEJORADO: VERIFICACIÓN FÁCIL) --- */}
                {step === 3 && (
                  <PasoPago
                    metodoPago={metodoPago}
                    onMetodoPago={setMetodoPago}
                    selectedPrice={selectedPrice}
                    loading={loading}
                    honeypot={honeypot}
                    onAtras={() => setStep(2)}
                    onEnviar={() => sinRebote(submitForm)()}
                    onArchivo={handleInput}
                    onQuitarArchivo={clearFile}
                    onCopiar={copyToClipboard}
                    nombreComprobante={previewName}
                    hoyISO={hoyISO}
                    onTitular={(valor) =>
                      setFormData((prev) => ({
                        ...prev,
                        es_titular: valor,
                        // Si la cuenta es suya, el titular ya lo sabemos del
                        // paso anterior y no hay que volver a preguntarlo.
                        nombre_titular_cuenta:
                          valor === "si"
                            ? `${prev.nombres} ${prev.apellidos}`.trim()
                            : "",
                      }))
                    }
                  />
                )}

                {/* --- PASO 4: RESUMEN FINAL --- */}
                {step === 4 && (
                  <PasoFinal
                    selectedCategory={selectedCategory}
                    selectedPrice={selectedPrice}
                    uploadedFileUrl={uploadedFileUrl}
                    codigo={codigoInscripcion}
                    onNuevaInscripcion={handleReset}
                  />
                )}

                {/* En móvil la barra lateral queda arriba, así que el soporte va
                aquí abajo. En los pasos 2 y 3 reserva el hueco de la barra de
                navegación fija (~120px + la franja de gestos del teléfono), para
                que el botón "Siguiente" no tape el último campo ni el soporte. */}
                <div
                  className={`mt-8 border-t border-white/10 pt-6 md:hidden ${
                    step === 2 || step === 3
                      ? "mb-[calc(120px+env(safe-area-inset-bottom))]"
                      : "mb-4"
                  }`}
                >
                  <SoporteReal />
                </div>
              </div>
            </div>
          </div>
        </main>
      </IconContext.Provider>
    </FormularioProvider>
  );
}
