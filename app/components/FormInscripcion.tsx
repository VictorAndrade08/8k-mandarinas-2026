"use client";

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
  User,
  IdentificationCard,
  Envelope,
  Trash,
  Bank,
  CheckCircle,
  WarningCircle,
  UploadSimple,
  CaretRight,
  CaretLeft,
  CalendarBlank,
  Cake,
  MapPin,
  GenderIntersex,
  Info,
  SneakerMove,
  Medal,
  Crown,
  Wheelchair,
  ArrowsClockwise,
  MagnifyingGlass,
  ShieldCheck,
  FileText,
  Copy,
  QrCode,
  WhatsappLogo,
  PersonSimpleRun,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// --- Interfaces Actualizadas ---
/** Lo que promete devolver functions/api/inscribir.js */
import {
  CustomModal,
  ResumeModal,
  SoporteReal,
  PasoCategoria,
  reglas,
  formatTelefono,
  hoyISO,
  STORAGE_KEY,
  BANCO,
  type FormDataState,
  type ProgresoGuardado,
  type RespuestaInscribir,
  type Category,
} from "./inscripcion";

// --- COMPONENTE PRINCIPAL ---
export default function InscripcionPage() {
  const [step, setStep] = useState(1);
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

  // --- PERSISTENCIA: que el usuario NO pierda su avance si refresca ---
  const hydrated = useRef(false);
  const savedSnapshot = useRef<ProgresoGuardado | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeStep, setResumeStep] = useState(1);

  // 1) Al entrar: si hay avance real, preguntamos si continúa o empieza de nuevo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as ProgresoGuardado;
        const fd = data.formData || {};
        const hasProgress =
          (data.step && data.step > 1) ||
          Boolean(fd.cedula || fd.nombres || fd.email || data.selectedCategory);
        if (hasProgress) {
          savedSnapshot.current = data;
          // localStorage solo existe en el navegador: el HTML lo genera el build
          // y allí no hay nada guardado. Leerlo durante el render daría un HTML
          // distinto del que pinta el cliente y React se quejaría de hidratación.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setResumeStep(data.step || 1);
          setResumeModalOpen(true);
          return; // esperamos la decisión del usuario antes de guardar
        }
      }
    } catch {}
    hydrated.current = true;
  }, []);

  // Continuar donde se quedó
  const resumeSaved = () => {
    const data = savedSnapshot.current;
    if (data) {
      if (data.formData)
        setFormData((prev) => ({
          ...prev,
          ...data.formData,
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
    }
    setResumeModalOpen(false);
    hydrated.current = true;
  };

  // Empezar una inscripción nueva (descarta lo guardado)
  const startFreshInscription = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    savedSnapshot.current = null;
    setResumeModalOpen(false);
    hydrated.current = true;
  };

  // 2) Guardar progreso ante cualquier cambio (el archivo no se serializa)
  useEffect(() => {
    if (!hydrated.current) return; // no sobrescribir antes de cargar
    if (step >= 4) return; // ya finalizó
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          selectedCategory,
          selectedPrice,
          acceptTerms,
          metodoPago,
          formData: { ...formData, comprobante: undefined },
        })
      );
    } catch {}
  }, [
    step,
    selectedCategory,
    selectedPrice,
    acceptTerms,
    metodoPago,
    formData,
  ]);

  // Función para reiniciar el formulario
  const handleReset = () => {
    setStep(1);
    setFormData(initialFormData);
    setSelectedCategory("");
    setSelectedPrice(0);
    setPreviewName("");
    setUploadedFileUrl("");
    setAcceptTerms(false);
    setErrors({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
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
  const enfocarPrimerError = (
    errs: Record<string, string>,
    orden: string[]
  ) => {
    const primero = orden.find((f) => errs[f]);
    if (!primero) return;
    const el = document.getElementById(primero);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const CAMPOS_PASO_2: (keyof FormDataState)[] = [
    "cedula",
    "nombres",
    "apellidos",
    "ciudad",
    "telefono",
    "email",
    "edad",
    "genero",
  ];

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    CAMPOS_PASO_2.forEach((f) => {
      const msg = validateField(f);
      if (msg) newErrors[f] = msg;
    });
    setErrors(newErrors);
    enfocarPrimerError(newErrors, CAMPOS_PASO_2 as string[]);
    return Object.keys(newErrors).length === 0;
  };

  // Paso 3: los datos que permiten cruzar el pago con el banco sin abrir la foto.
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    (["num_comprobante", "fecha_pago"] as const).forEach((f) => {
      const msg = validateField(f);
      if (msg) newErrors[f] = msg;
    });

    if (
      formData.es_titular === "no" &&
      formData.nombre_titular_cuenta.trim().length < 3
    ) {
      newErrors.nombre_titular_cuenta =
        "Sin este nombre no podemos encontrar tu pago en el banco.";
    }
    if (!formData.comprobante) {
      newErrors.comprobante = "Sube la foto o el PDF del pago para terminar.";
    }

    setErrors(newErrors);
    enfocarPrimerError(newErrors, [
      "num_comprobante",
      "fecha_pago",
      "nombre_titular_cuenta",
    ]);
    return Object.keys(newErrors).length === 0;
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
          "⛔ YA REGISTRADO",
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

    // AGREGAMOS VALIDACIÓN DEL PASO 3 ANTES DE ENVIAR
    if (!validateStep3()) return;

    setSubmitting(true);
    setLoading(true);

    const body = new FormData();
    body.append("categoria", selectedCategory);
    body.append("precio", selectedPrice.toString());
    body.append("metodo_pago", metodoPago);

    (Object.keys(formData) as Array<keyof FormDataState>).forEach((key) => {
      if (key !== "comprobante") {
        const value = formData[key];
        if (value !== null) body.append(key, String(value));
      }
    });

    if (formData.comprobante instanceof File) {
      body.append(
        "comprobante",
        formData.comprobante,
        formData.comprobante.name
      );
    }

    try {
      const res = await fetch("/api/inscribir", {
        method: "POST",
        body,
        cache: "no-store",
      });
      const rawText = await res.text();
      // La respuesta del servidor es un dato externo: se tipa como el contrato
      // que esperamos, no como `any`, para que el compilador avise si alguien
      // lee un campo que la API no promete.
      let json: RespuestaInscribir | null = null;
      try {
        json = rawText ? (JSON.parse(rawText) as RespuestaInscribir) : null;
      } catch {
        json = null;
      }

      setLoading(false);

      if (!res.ok || !json || json.status !== "success") {
        showAlert(
          "Error",
          json?.message ||
            "No se pudo guardar la inscripción. Intenta de nuevo."
        );
        setSubmitting(false);
        return;
      }

      if (json?.file_url) setUploadedFileUrl(String(json.file_url));
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setStep(4);
    } catch {
      setLoading(false);
      showAlert(
        "Error de conexión",
        "Revisa tu internet e inténtalo de nuevo."
      );
    }
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

  const renderInputField = ({
    name,
    label,
    icon,
    type = "text",
    placeholder,
    onBlur,
    autoComplete,
    inputMode,
    enterKeyHint = "next",
    maxLength,
    max,
    hint,
    list,
    autoFocus,
  }: {
    name: keyof FormDataState;
    label: string;
    icon: React.ReactNode;
    type?: string;
    placeholder?: string;
    onBlur?: () => void;
    autoComplete?: string;
    inputMode?: "text" | "numeric" | "email" | "tel" | "decimal";
    enterKeyHint?: "next" | "done" | "send";
    maxLength?: number;
    max?: string;
    hint?: string;
    list?: string;
    autoFocus?: boolean;
  }) => {
    const error = errors[name];
    const ok = isFieldValid(name) && !error;

    // Los iconos de Phosphor pintan con currentColor, así que el color de la etiqueta
    // los arrastra. Al mover la etiqueta según el estado, el icono cambia en sincronía
    // con el borde del input y sin una línea de JS: gris en reposo, naranja al tocarlo,
    // verde cuando el dato sirve, rojo si falla. El error manda sobre el foco.
    const colorEtiqueta = error
      ? "text-red-300"
      : ok
        ? "text-green-400 group-focus-within:text-[#FF6B1A]"
        : "text-gray-200 group-focus-within:text-[#FF6B1A]";

    return (
      <div className="group relative">
        <label
          htmlFor={name}
          className={`font-barlow mb-2 flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-colors duration-150 md:text-base ${colorEtiqueta}`}
        >
          {icon} {label}
        </label>
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            inputMode={inputMode}
            enterKeyHint={enterKeyHint}
            autoComplete={autoComplete}
            maxLength={maxLength}
            max={max}
            list={list}
            autoFocus={autoFocus}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${name}-error` : hint ? `${name}-hint` : undefined
            }
            value={formData[name] ? String(formData[name]) : ""}
            onChange={handleInput}
            onFocus={scrollAlEnfocar}
            onBlur={() => {
              handleBlur(name);
              onBlur?.();
            }}
            placeholder={placeholder}
            className={`font-barlow min-h-[56px] w-full rounded-xl border-2 bg-[#0F1218] px-5 py-4 pr-12 text-lg text-white placeholder-gray-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] md:text-xl ${
              error
                ? "border-red-400 focus-visible:ring-red-400"
                : ok
                  ? "border-green-500/70 focus-visible:ring-green-500"
                  : "border-white/25 hover:border-white/45 focus:border-[#FF6B1A] focus-visible:ring-[#FF6B1A]"
            } `}
          />
          {ok && (
            <CheckCircle
              size={22}
              className="animate-in fade-in zoom-in-75 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-green-500 duration-200"
            />
          )}
          {error && (
            <WarningCircle
              size={22}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-400"
            />
          )}
        </div>
        {error ? (
          <p
            id={`${name}-error`}
            role="alert"
            className="font-barlow mt-2 flex items-start gap-1.5 text-sm font-medium text-red-300 md:text-base"
          >
            <WarningCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </p>
        ) : hint ? (
          <p
            id={`${name}-hint`}
            className="font-barlow mt-2 text-sm text-gray-400"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    // Duotone: borde sólido más un relleno del mismo color al 20%. Es lo que separa
    // esto de un formulario de plantilla, donde los iconos son todos trazo fino gris.
    <IconContext.Provider value={{ weight: "duotone" }}>
      <main className="flex min-h-dvh w-full items-start justify-center bg-transparent px-3 py-6 text-white md:px-4 md:py-12">
        {/* INYECCIÓN DE FUENTES */}
        <style>{`
        
        
      `}</style>

        {/* Modales */}
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
          isOpen={resumeModalOpen}
          step={resumeStep}
          onResume={resumeSaved}
          onNew={startFreshInscription}
        />
        {/* Contenedor Principal */}
        {/* El backdrop-blur solo en desktop: un backdrop-filter crea bloque contenedor
          para los descendientes `position:fixed`, y en móvil eso ancla la barra de
          acción a esta tarjeta (donde el overflow-hidden la recorta) en vez de al viewport. */}
        <div
          ref={componentRef}
          className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-[24px] border border-white/5 bg-[#1C2029]/80 shadow-2xl md:flex-row md:rounded-[32px] md:backdrop-blur-xl"
        >
          {/* --- SIDEBAR / HEADER --- */}
          <div className="relative flex min-w-[300px] flex-col justify-between border-b border-white/5 bg-[#11141A] p-6 md:w-1/3 md:border-r md:border-b-0 md:p-12">
            <div>
              <div className="mb-6 flex items-center gap-4 md:mb-12">
                <img
                  src="/logo-mandarinas-blanco.svg"
                  alt="8K Ruta de las Mandarinas"
                  className="h-20 w-auto object-contain md:h-24"
                />
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
                <div className="relative mt-1 h-2.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#FF6B1A] transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                    style={{ left: `${(step / 4) * 100}%` }}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#FF6B1A] shadow-[0_5px_16px_rgba(0,0,0,0.55)] ring-2 ring-[#FF6B1A]/50">
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
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold transition-all ${active ? `border-[#FF6B1A] bg-[#FF6B1A] text-white` : completed ? "border-green-500 bg-green-500 text-black" : "border-white/20 bg-transparent text-white"}`}
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
              </div>
            </div>

            {/* En móvil esta columna se apila ARRIBA del formulario, así que el soporte
              va al final del contenido (ver <SoporteReal />) y aquí solo en desktop. */}
            <div className="font-barlow relative z-10 mt-16 hidden md:mt-0 md:block">
              <SoporteReal />
            </div>
          </div>

          {/* --- ÁREA DE CONTENIDO --- */}
          <div className="relative min-h-[500px] bg-[#161A23] p-5 md:w-2/3 md:p-14">
            {(loading || verifying) && (
              <div className="animate-in fade-in absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#161A23]/95 backdrop-blur-sm">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#FF6B1A] border-t-transparent" />
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
                <div className="font-barlow mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#FF6B1A]/30 bg-[#0F1218] px-5 py-3.5">
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
                    <span className="text-2xl leading-none font-black text-[#FF6B1A] md:text-3xl">
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
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    goToStep3();
                  }}
                  className="animate-in slide-in-from-bottom-4 fade-in duration-500"
                >
                  <h1 className="font-bebas mb-2 text-4xl font-bold md:text-6xl">
                    Tus Datos Personales
                  </h1>
                  <p className="font-barlow mb-8 text-base text-gray-400 md:text-lg">
                    Son 2 minutos. Guardamos tu avance por si necesitas volver.
                  </p>

                  {/* gap más ancho en móvil: el pulgar es menos preciso que el ratón */}
                  <div className="mb-8 grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
                    <div className="md:col-span-2">
                      {/* Extranjeros sin cédula: el tipo decide teclado, validación y límite. */}
                      <div
                        role="radiogroup"
                        aria-label="Tipo de documento"
                        className="mb-4 grid grid-cols-2 gap-2"
                      >
                        {[
                          {
                            valor: "cedula" as const,
                            texto: "Cédula ecuatoriana",
                          },
                          { valor: "pasaporte" as const, texto: "Pasaporte" },
                        ].map(({ valor, texto }) => (
                          <button
                            key={valor}
                            type="button"
                            role="radio"
                            aria-checked={formData.tipo_documento === valor}
                            onClick={() => {
                              if (formData.tipo_documento === valor) return;
                              // Cambiar de tipo invalida lo escrito: un pasaporte no es una cédula.
                              setFormData((f) => ({
                                ...f,
                                tipo_documento: valor,
                                cedula: "",
                              }));
                              setErrors((prev) => ({ ...prev, cedula: "" }));
                            }}
                            className={`font-barlow min-h-[52px] rounded-xl border-2 px-3 text-base font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] md:text-lg ${
                              formData.tipo_documento === valor
                                ? "border-[#FF6B1A] bg-[#FF6B1A] text-white"
                                : "border-white/15 bg-[#0F1218] text-gray-200 hover:border-white/40"
                            }`}
                          >
                            {texto}
                          </button>
                        ))}
                      </div>

                      {formData.tipo_documento === "pasaporte"
                        ? renderInputField({
                            name: "cedula",
                            label: "Número de Pasaporte",
                            icon: <IdentificationCard size={20} />,
                            placeholder: "Ej: AB1234567",
                            onBlur: handleCedulaBlur,
                            autoComplete: "off",
                            inputMode: "text",
                            maxLength: 15,
                            autoFocus: true,
                            hint: "Tal como aparece en tu pasaporte, con letras si las tiene.",
                          })
                        : renderInputField({
                            name: "cedula",
                            label: "Cédula",
                            icon: <IdentificationCard size={20} />,
                            placeholder: "Ej: 1801234567",
                            onBlur: handleCedulaBlur,
                            autoComplete: "off",
                            inputMode: "numeric",
                            maxLength: 10,
                            autoFocus: true,
                            hint: "Va en tu dorsal. También evita que alguien se inscriba dos veces.",
                          })}
                    </div>

                    {renderInputField({
                      name: "nombres",
                      label: "Nombres",
                      icon: <User size={20} />,
                      placeholder: "Ej: María Fernanda",
                      autoComplete: "given-name",
                      inputMode: "text",
                    })}
                    {renderInputField({
                      name: "apellidos",
                      label: "Apellidos",
                      icon: <User size={20} />,
                      placeholder: "Ej: Pérez Andrade",
                      autoComplete: "family-name",
                      inputMode: "text",
                    })}

                    {/* Sin datalist: era solo una sugerencia, pero el desplegable
                        se abre encima del campo en cuanto tecleas y en móvil
                        estorba más que ayuda. Aquí vienen corredores de todo el
                        país y de fuera, así que la lista nunca iba a estar
                        completa. Se escribe libre y ya. */}
                    {renderInputField({
                      name: "ciudad",
                      label: "Ciudad",
                      icon: <MapPin size={20} />,
                      placeholder: "Ej: Ambato",
                      autoComplete: "address-level2",
                      inputMode: "text",
                    })}

                    {renderInputField({
                      name: "telefono",
                      label: "WhatsApp",
                      icon: <WhatsappLogo size={20} />,
                      type: "tel",
                      placeholder: "Ej: 099 123 4567",
                      autoComplete: "tel",
                      inputMode: "numeric",
                      hint: "Solo para confirmarte el cupo y avisarte del kit.",
                    })}

                    <div className="md:col-span-2">
                      {renderInputField({
                        name: "email",
                        label: "Correo Electrónico",
                        icon: <Envelope size={20} />,
                        type: "email",
                        placeholder: "Ej: tunombre@gmail.com",
                        autoComplete: "email",
                        inputMode: "email",
                        hint: emailSuggestion
                          ? undefined
                          : "Ahí llega tu confirmación. Nada de spam.",
                      })}
                      {emailSuggestion && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((f) => ({
                              ...f,
                              email: emailSuggestion,
                            }))
                          }
                          className="font-barlow mt-2 flex min-h-[48px] items-center gap-1.5 text-left text-sm font-bold text-[#FF6B1A] hover:text-[#FF2D7C] md:text-base"
                        >
                          <Info size={16} className="shrink-0" /> ¿Quisiste
                          decir{" "}
                          <span className="underline">{emailSuggestion}</span>?
                          Tócalo para corregir.
                        </button>
                      )}
                    </div>

                    {renderInputField({
                      name: "edad",
                      label: "Edad",
                      icon: <Cake size={20} />,
                      placeholder: "Ej: 25",
                      autoComplete: "off",
                      inputMode: "numeric",
                      maxLength: 2,
                    })}

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
                            onClick={() => {
                              setFormData((f) => ({ ...f, genero: valor }));
                              setErrors((prev) => ({ ...prev, genero: "" }));
                            }}
                            className={`font-barlow min-h-[56px] rounded-xl border-2 px-2 text-base font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] md:text-lg ${
                              formData.genero === valor
                                ? "border-[#FF6B1A] bg-[#FF6B1A] text-white"
                                : errors.genero
                                  ? "border-red-400 bg-[#0F1218] text-gray-200"
                                  : "border-white/15 bg-[#0F1218] text-gray-200 hover:border-white/40"
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
                          <WarningCircle size={16} className="shrink-0" />{" "}
                          {errors.genero}
                        </p>
                      )}
                    </div>

                    {categoriaNoCuadra && (
                      <div className="font-barlow animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-4 md:col-span-2">
                        <Info
                          size={20}
                          className="mt-0.5 shrink-0 text-yellow-400"
                        />
                        <div className="text-base leading-relaxed text-yellow-50 md:text-lg">
                          Con {edadNum} años te toca{" "}
                          <strong className="text-white">
                            {categoriaSugerida}
                          </strong>
                          , no {selectedCategory}.{" "}
                          <button
                            type="button"
                            onClick={aplicarCategoriaSugerida}
                            className="min-h-[48px] font-bold text-white underline decoration-2 underline-offset-2 hover:text-yellow-300"
                          >
                            Cambiar a {categoriaSugerida} ($
                            {
                              categories.find(
                                (c) => c.name === categoriaSugerida
                              )?.price
                            }
                            )
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`mb-8 rounded-2xl border bg-[#0F1218] p-5 transition-colors md:p-6 ${
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
                        onChange={(e) => {
                          setAcceptTerms(e.target.checked);
                          if (e.target.checked)
                            setErrors((prev) => ({ ...prev, acceptTerms: "" }));
                        }}
                        className="mt-0.5 h-7 w-7 shrink-0 cursor-pointer accent-[#FF6B1A]"
                      />
                      <span className="font-barlow text-base leading-relaxed text-gray-200 md:text-lg">
                        Acepto los{" "}
                        <a
                          href="/terminos"
                          target="_blank"
                          className="font-bold text-[#FF6B1A] underline hover:text-[#FF2D7C]"
                        >
                          Términos y Condiciones
                        </a>{" "}
                        y declaro estar apto físicamente.
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

                  {/* Barra de acción fija en la zona del pulgar. Va con `fixed` y no `sticky`
                    porque la tarjeta contenedora tiene overflow:hidden y ahí sticky no ancla.
                    El padding inferior respeta la barra de gestos del teléfono. */}
                  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#161A23]/95 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
                    <div className="font-barlow flex gap-3">
                      <button
                        type="button"
                        onClick={sinRebote(() => setStep(1))}
                        className="flex min-h-[56px] items-center gap-2 rounded-xl border border-white/15 px-5 text-lg font-bold text-gray-200 transition outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 md:px-10 md:text-xl"
                      >
                        <CaretLeft size={24} /> Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={verifying}
                        className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-white text-lg font-bold text-black shadow-lg transition outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] disabled:opacity-60 md:text-xl"
                      >
                        {verifying ? "Verificando..." : "Siguiente"}{" "}
                        <CaretRight size={24} />
                      </button>
                    </div>
                    <p className="font-barlow mt-2.5 text-center text-sm text-gray-400">
                      Aquí no se cobra nada. El pago va en el siguiente paso.
                    </p>
                  </div>
                </form>
              )}

              {/* --- PASO 3: PAGO (MEJORADO: VERIFICACIÓN FÁCIL) --- */}
              {step === 3 && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
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

                  {/* SELECTOR DE MÉTODO DE PAGO */}
                  <p className="font-barlow mb-3 text-base text-gray-400 md:text-lg">
                    Elige cómo vas a pagar:
                  </p>
                  <div className="font-barlow mb-8 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMetodoPago("transferencia")}
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-bold transition-all md:text-lg ${
                        metodoPago === "transferencia"
                          ? "border-[#FF6B1A] bg-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20"
                          : "border-white/10 bg-[#0F1218] text-gray-300 hover:border-white/30"
                      }`}
                    >
                      <Bank size={22} /> Transferencia
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetodoPago("qr")}
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-bold transition-all md:text-lg ${
                        metodoPago === "qr"
                          ? "border-[#FF6B1A] bg-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20"
                          : "border-white/10 bg-[#0F1218] text-gray-300 hover:border-white/30"
                      }`}
                    >
                      <QrCode size={22} /> QR (deúna!)
                    </button>
                  </div>

                  {metodoPago === "transferencia" && (
                    <div className="font-barlow mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A1E29] to-black p-6 shadow-lg md:p-10">
                      <div className="mb-8 flex items-center gap-5 border-b border-white/10 pb-6">
                        <div className="rounded-full bg-[#FF6B1A]/20 p-4 text-[#FF6B1A]">
                          <Bank size={32} />
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wider text-gray-400 uppercase md:text-base">
                            Institución Financiera
                          </p>
                          <p className="text-2xl font-bold md:text-3xl">
                            {BANCO.entidad}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 text-lg md:text-xl">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-gray-500">
                            Cuenta Corriente:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(BANCO.numero, "Número de cuenta")
                            }
                            className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white transition hover:bg-white/10 active:scale-95"
                            title="Copiar número de cuenta"
                          >
                            {BANCO.numero}
                            <Copy
                              size={16}
                              className="text-gray-400 group-hover:text-[#FF6B1A]"
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
                            onClick={() => copyToClipboard(BANCO.ruc, "RUC")}
                            className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white transition hover:bg-white/10 active:scale-95"
                            title="Copiar RUC"
                          >
                            {BANCO.ruc}
                            <Copy
                              size={16}
                              className="text-gray-400 group-hover:text-[#FF6B1A]"
                            />
                          </button>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                          <div>
                            <span className="block text-2xl leading-tight font-bold text-gray-200 md:text-3xl">
                              Total a pagar:
                            </span>
                            <span className="text-xs font-bold tracking-widest text-[#FFB800] uppercase">
                              Precio de preventa · sin recargos
                            </span>
                          </div>
                          <span className="text-4xl font-black text-[#FF6B1A] md:text-5xl">
                            ${selectedPrice}.00
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- MÉTODO 2: PAGO CON QR (deúna! / Banco Pichincha) --- */}
                  {metodoPago === "qr" && (
                    <div className="font-barlow mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A1E29] to-black p-6 shadow-lg md:p-8">
                      <div className="mb-5 flex items-center gap-4">
                        <div className="rounded-full bg-[#FF6B1A]/20 p-3 text-[#FF6B1A]">
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
                        <strong className="text-white">deúna!</strong>, escanea
                        este código e ingresa el monto{" "}
                        <strong className="text-white">
                          ${selectedPrice}.00
                        </strong>
                        .
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
                        {renderInputField({
                          name: "num_comprobante",
                          label: "Núm. Comprobante",
                          icon: <FileText size={20} />,
                          placeholder: "Ej: 123456",
                          autoComplete: "off",
                          inputMode: "numeric",
                          maxLength: 20,
                          hint: "El número de documento de la transferencia. Con eso lo buscamos en el banco sin abrir tu foto.",
                        })}
                      </div>

                      {/* 2. Fecha (Ayuda a filtrar) */}
                      <div className="md:col-span-1">
                        {renderInputField({
                          name: "fecha_pago",
                          label: "Fecha de Transferencia",
                          icon: <CalendarBlank size={20} />,
                          type: "date",
                          max: hoyISO(),
                        })}
                      </div>

                      {/* 3. Titular de la Cuenta (Evita confusión de nombres) */}
                      <div className="rounded-xl border border-white/10 bg-[#0F1218] p-5 md:col-span-2">
                        <span className="font-barlow mb-3 block text-base font-bold tracking-wide text-gray-200 uppercase">
                          ¿La cuenta bancaria es tuya?
                        </span>
                        <div
                          role="radiogroup"
                          aria-label="¿La cuenta bancaria es tuya?"
                          className="mb-4 grid grid-cols-2 gap-3"
                        >
                          {[
                            { valor: "si", texto: "Sí, es mía" },
                            { valor: "no", texto: "No, prestada" },
                          ].map(({ valor, texto }) => (
                            <button
                              key={valor}
                              type="button"
                              role="radio"
                              aria-checked={formData.es_titular === valor}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  es_titular: valor,
                                  // Si la cuenta es suya, el titular ya lo sabemos del paso anterior.
                                  nombre_titular_cuenta:
                                    valor === "si"
                                      ? `${prev.nombres} ${prev.apellidos}`.trim()
                                      : "",
                                }))
                              }
                              className={`font-barlow min-h-[56px] rounded-xl border-2 px-3 text-base font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1218] md:text-lg ${
                                formData.es_titular === valor
                                  ? "border-[#FF6B1A] bg-[#FF6B1A] text-white"
                                  : "border-white/15 bg-white/5 text-gray-200 hover:border-white/40"
                              }`}
                            >
                              {texto}
                            </button>
                          ))}
                        </div>

                        {/* Si NO es titular, pedimos el nombre real */}
                        {formData.es_titular === "no" && (
                          <div className="animate-in slide-in-from-top-2 fade-in">
                            {renderInputField({
                              name: "nombre_titular_cuenta",
                              label: "Nombre del Dueño de la Cuenta",
                              icon: <User size={20} />,
                              placeholder: "Ej: Juan Pérez (mi papá)",
                              autoComplete: "off",
                              hint: "Sin este nombre no podemos encontrar tu pago en el banco.",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-10 border-t border-white/10 pt-6">
                    <label className="font-barlow mb-3 block text-base font-bold tracking-wide text-gray-200 uppercase md:text-lg">
                      Adjuntar Comprobante (Foto/PDF)
                    </label>
                    {!previewName ? (
                      <label
                        className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-[#0F1218] transition-colors focus-within:ring-2 focus-within:ring-[#FF6B1A] hover:border-[#FF6B1A] hover:bg-[#FF6B1A]/5 md:h-48 ${
                          errors.comprobante
                            ? "border-red-400"
                            : "border-gray-500"
                        }`}
                      >
                        <UploadSimple className="mb-2 h-12 w-12 text-gray-300 md:h-16 md:w-16" />
                        <p className="font-barlow text-base text-gray-300 md:text-lg">
                          Toca aquí para subir tu archivo
                        </p>
                        <p className="font-barlow mt-1 text-sm text-gray-400">
                          Foto o PDF · máximo 10MB
                        </p>
                        <input
                          type="file"
                          name="comprobante"
                          accept="image/*,application/pdf"
                          onChange={handleInput}
                          className="sr-only"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 p-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <CheckCircle
                            className="shrink-0 text-green-500"
                            size={28}
                          />
                          <span className="truncate text-base font-bold text-gray-100 md:text-xl">
                            {previewName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          aria-label="Quitar el archivo"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-red-300 transition outline-none hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash size={24} />
                        </button>
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
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      Tu comprobante es privado: solo lo ve el equipo que valida
                      los pagos.
                    </p>
                  </div>

                  {/* Barra de acción fija en la zona del pulgar. Va con `fixed` y no `sticky`
                    porque la tarjeta contenedora tiene overflow:hidden y ahí sticky no ancla.
                    El padding inferior respeta la barra de gestos del teléfono. */}
                  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#161A23]/95 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
                    <div className="font-barlow flex gap-3">
                      <button
                        type="button"
                        onClick={sinRebote(() => setStep(2))}
                        className="flex min-h-[56px] items-center gap-2 rounded-xl border border-white/15 px-5 text-lg font-bold text-gray-200 transition outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 md:px-10 md:text-xl"
                      >
                        <CaretLeft size={24} /> Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="min-h-[56px] flex-1 rounded-xl bg-[#FF6B1A] text-lg font-bold text-white shadow-[0_0_20px_#FF6B1A50] transition outline-none hover:bg-[#E55104] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
                      >
                        {submitting ? "Enviando..." : "Confirmar Inscripción"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* --- PASO 4: RESUMEN FINAL --- */}
              {step === 4 && (
                <div className="animate-in zoom-in-95 fade-in py-10 text-center duration-500">
                  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-[0_0_50px_#22c55e40] md:h-32 md:w-32">
                    <CheckCircle size={64} />
                  </div>
                  <h1 className="font-bebas mb-6 text-4xl font-bold text-white md:text-6xl">
                    ¡Inscripción Exitosa!
                  </h1>
                  <p className="font-barlow mx-auto mb-10 max-w-2xl px-4 text-lg leading-relaxed text-gray-300 md:text-2xl">
                    Hemos recibido tus datos correctamente. Tu pago será
                    validado en los siguientes{" "}
                    <strong className="text-white">
                      2 a 3 días laborales.
                    </strong>
                  </p>

                  {/* Resumen Completo */}
                  <div className="font-barlow relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0F1218] p-8 text-left shadow-2xl">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#FF2D7C] to-[#FF6B1A]" />

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
                        <p className="text-lg font-bold text-[#FF6B1A] md:text-xl">
                          {selectedCategory}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                          <MapPin size={12} /> Ciudad
                        </p>
                        <p className="text-lg text-gray-200">
                          {formData.ciudad}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          <WhatsappLogo size={12} /> WhatsApp
                        </p>
                        <p className="text-lg text-gray-200">
                          {formData.telefono}
                        </p>
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
                        <p className="text-lg text-gray-200">
                          {formData.edad} años
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 flex items-center gap-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                          <GenderIntersex size={12} /> Género
                        </p>
                        <p className="text-lg text-gray-200">
                          {formData.genero}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 rounded-xl border border-white/5 bg-[#1A1E29] p-5">
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
                        <p className="truncate text-sm text-gray-400">
                          Estado:{" "}
                          <span className="ml-1 rounded bg-yellow-500/10 px-2 py-1 font-bold text-yellow-500">
                            Pendiente de Verificación
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p className="font-barlow max-w-xl text-base text-white/90 md:text-lg">
                      <strong className="text-white">Último paso:</strong>{" "}
                      envíanos tu comprobante por WhatsApp para confirmar tu
                      cupo.
                    </p>
                    <a
                      href={`https://wa.me/593997241804?text=${encodeURIComponent(
                        `Hola, acabo de inscribirme en la 8K Ruta de las Mandarinas 2026. 🎽\n\n` +
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
                      onClick={handleReset}
                      className="font-barlow mt-2 flex items-center gap-2 text-base text-gray-500 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white md:text-lg"
                    >
                      <ArrowsClockwise size={16} /> Registrar a otra persona
                    </button>
                  </div>
                </div>
              )}

              {/* En móvil la barra lateral queda arriba, así que el soporte va aquí abajo.
                Como es el último elemento del scroll, es quien reserva el hueco de la
                barra de acción fija — y solo en los pasos que la tienen. La barra mide
                ~110px más la franja de gestos del teléfono. */}
              <div
                className={`mt-8 border-t border-white/10 pt-6 md:hidden ${
                  step === 2 || step === 3
                    ? "mb-[calc(7rem+env(safe-area-inset-bottom))]"
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
  );
}
