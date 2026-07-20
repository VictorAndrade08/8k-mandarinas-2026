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
  CheckCircle,
  WarningCircle,
  CaretRight,
  CaretLeft,
  Cake,
  MapPin,
  Info,
  SneakerMove,
  Medal,
  Crown,
  Wheelchair,
  WhatsappLogo,
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
  CampoTexto,
  PasoPago,
  PasoFinal,
  FormularioProvider,
  reglas,
  formatTelefono,
  hoyISO,
  STORAGE_KEY,
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

  // --- EL BOTÓN ATRÁS DEL NAVEGADOR RETROCEDE UN PASO, NO SALE DE LA PÁGINA ---
  //
  // Son cuatro pasos dentro de una sola URL, así que para el navegador todo esto
  // es una única página: al dar atrás en el paso 3 te echaba del formulario
  // entero. Y en móvil "atrás" es un gesto, no un botón — se hace sin querer.
  //
  // Metemos una entrada de historial por paso para que el gesto haga lo que
  // cualquiera espera. Los datos no se pierden en ningún caso (siguen en
  // localStorage), pero volver a entrar y reencontrar el sitio es fricción que
  // no hace falta.
  const pasoRef = useRef(step);
  useEffect(() => {
    pasoRef.current = step;
  }, [step]);

  useEffect(() => {
    // La entrada base: sin esto, el primer "atrás" desde el paso 2 saldría de la
    // página en vez de volver al 1.
    window.history.replaceState({ paso: 1 }, "");

    const alVolver = (e: PopStateEvent) => {
      const destino = (e.state as { paso?: number } | null)?.paso;
      // Sin paso en el estado, es que salimos del formulario: no lo estorbamos.
      if (typeof destino !== "number") return;
      setStep(destino);
    };

    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

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
      // Timeout duro: sin esto, si la conexión del móvil se cae o el servidor
      // tarda subiendo el comprobante, el fetch se queda PENDIENTE para siempre
      // y el spinner "Procesando..." gira sin fin. Con AbortController cortamos a
      // los 45s y caemos al catch con un mensaje claro. Si por un caso raro el
      // servidor sí llegó a guardar, al reintentar salta el aviso de "cédula ya
      // registrada", que le confirma que quedó dentro.
      const controlador = new AbortController();
      const idTimeout = setTimeout(() => controlador.abort(), 45000);
      let res: Response;
      try {
        res = await fetch("/api/inscribir", {
          method: "POST",
          body,
          cache: "no-store",
          signal: controlador.signal,
        });
      } finally {
        clearTimeout(idTimeout);
      }
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
    } catch (e) {
      setLoading(false);
      const seAgotoElTiempo =
        e instanceof DOMException && e.name === "AbortError";
      showAlert(
        "Error de conexión",
        seAgotoElTiempo
          ? "La conexión tardó demasiado y se canceló. No se cobró nada: revisa tu internet e inténtalo otra vez."
          : "Revisa tu internet e inténtalo de nuevo. No se cobró nada."
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
            className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden bg-[#361126]/80 md:flex-row md:rounded-[32px] md:border md:border-white/5 md:shadow-2xl md:backdrop-blur-xl"
          >
            {/* --- SIDEBAR / HEADER --- */}
            <div className="relative flex min-w-[300px] flex-col justify-between border-b border-white/5 bg-[#230a17] p-6 md:w-1/3 md:border-r md:border-b-0 md:p-12">
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
                      Son 2 minutos. Guardamos tu avance por si necesitas
                      volver.
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
                          onBlur={handleCedulaBlur}
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
                            onClick={() =>
                              setFormData((f) => ({
                                ...f,
                                email: emailSuggestion,
                              }))
                            }
                            className="font-barlow mt-2 flex min-h-[48px] items-center gap-1.5 text-left text-sm font-bold text-[#f7771c] hover:text-[#c51850] md:text-base"
                          >
                            <Info size={16} className="shrink-0" /> ¿Quisiste
                            decir{" "}
                            <span className="underline">{emailSuggestion}</span>
                            ? Tócalo para corregir.
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
                              onClick={() => {
                                setFormData((f) => ({ ...f, genero: valor }));
                                setErrors((prev) => ({ ...prev, genero: "" }));
                              }}
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
                      className={`mb-8 rounded-2xl border bg-[#200815] p-5 transition-colors md:p-6 ${
                        errors.acceptTerms
                          ? "border-red-400"
                          : "border-white/10"
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
                              setErrors((prev) => ({
                                ...prev,
                                acceptTerms: "",
                              }));
                          }}
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
                        Aquí no se cobra nada. El pago va en el siguiente paso.
                      </p>
                      <div className="font-barlow mx-auto flex max-w-3xl gap-3">
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
                          className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-white text-lg font-bold text-black shadow-lg transition outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-[#f7771c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b0d1d] disabled:opacity-60 md:text-xl"
                        >
                          {verifying ? "Verificando..." : "Siguiente"}{" "}
                          <CaretRight size={24} />
                        </button>
                      </div>
                    </div>
                  </form>
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
