"use client";

import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
// Phosphor en vez de lucide: lucide es el set por defecto de shadcn/v0 y su trazo
// uniforme se reconoce a leguas como plantilla generada. Phosphor tiene pesos y
// remate redondeado, así que la interfaz se ve dibujada por alguien.
import {
  IconContext,
  User,
  IdentificationCard,
  Envelope,
  Phone,
  Trash,
  Bank,
  CheckCircle,
  WarningCircle,
  UploadSimple,
  X,
  CaretRight,
  CaretLeft,
  CalendarBlank,
  MapPin,
  Info,
  Lightning,
  Medal,
  Crown,
  Wheelchair,
  ArrowsClockwise,
  MagnifyingGlass,
  ArrowRight,
  ShieldCheck,
  FileText,
  Copy,
  QrCode,
  WhatsappLogo,
  PersonSimpleRun,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// --- Interfaces Actualizadas ---
interface FormDataState {
  // Los extranjeros no tienen cédula ecuatoriana: el tipo cambia teclado y validación.
  tipo_documento: "cedula" | "pasaporte";
  cedula: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  email: string;
  telefono: string;
  edad: string;
  genero: string;
  // --- NUEVOS CAMPOS PARA VERIFICACIÓN FÁCIL (Anti-Fraude) ---
  es_titular: string; // "si" o "no"
  nombre_titular_cuenta: string; // Nombre de quien pagó realmente
  num_comprobante: string; // El ID de la transacción
  fecha_pago: string;
  comprobante: File | null;
}

interface Category {
  name: string;
  price: number;
  desc: string;
  icon: React.ReactNode;
}

// Clave para guardar el progreso del formulario (no perder datos al refrescar)
const STORAGE_KEY = "inscripcion_8k_progreso";

// Celular Ecuador: 0991234567 -> 099 123 4567. El usuario no tiene que adivinar los espacios.
const formatTelefono = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
};

// Solo sugerencias para el datalist: el campo sigue aceptando cualquier ciudad.
const CIUDADES = [
  "Ambato", "Patate", "Píllaro", "Baños", "Pelileo", "Quito", "Riobamba",
  "Latacunga", "Guayaquil", "Cuenca", "Salcedo", "Puyo",
];

const hoyISO = () => new Date().toISOString().slice(0, 10);

// --- Componente: Modal de Alertas ---
const CustomModal = ({
  isOpen,
  title,
  message,
  type = "error",
  actionLabel,
  onAction,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    // En móvil sube desde abajo (bottom sheet); en desktop se centra.
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141820] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 pb-8 md:p-8 shadow-2xl relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 sm:slide-in-from-bottom-0">
        <div className="sm:hidden mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-white/25" aria-hidden="true" />
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition w-12 h-12 flex items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col items-center text-center gap-6">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
              type === "error"
                ? "bg-red-500/20 text-red-500"
                : type === "warning"
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-green-500/20 text-green-500"
            }`}
          >
            {type === "error" && <WarningCircle size={36} />}
            {type === "warning" && <WarningCircle size={36} />}
            {type === "success" && <CheckCircle size={36} />}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white uppercase font-bebas">
            {title}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed font-barlow">{message}</p>
          
          <div className="flex flex-col w-full gap-3 mt-2">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="w-full py-4 bg-[#FF6B1A] hover:bg-[#E55104] text-white font-bold text-lg md:text-xl rounded-xl transition font-barlow flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20"
              >
                {actionLabel} <ArrowRight size={20}/>
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full py-4 font-bold text-lg md:text-xl rounded-xl transition font-barlow ${actionLabel ? 'bg-[#1A1E29] text-gray-400 hover:text-white hover:bg-[#252A36]' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {actionLabel ? 'Cerrar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Modal: Retomar inscripción guardada ---
const ResumeModal = ({
  isOpen,
  step,
  onResume,
  onNew,
}: {
  isOpen: boolean;
  step: number;
  onResume: () => void;
  onNew: () => void;
}) => {
  if (!isOpen) return null;
  const labels = ["Categoría", "Datos", "Pago", "Final"];

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1C2029] border border-[#FF6B1A]/30 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 pb-8 md:p-8 shadow-[0_0_50px_rgba(255,107,26,0.18)] relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 sm:slide-in-from-bottom-0">
        <div className="sm:hidden mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-white/25" aria-hidden="true" />
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-[#FF6B1A]/10 text-[#FF6B1A] rounded-full flex items-center justify-center">
            <ArrowsClockwise size={40} />
          </div>

          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white uppercase mb-3 font-barlow">
              Tienes una inscripción sin terminar
            </h3>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-barlow">
              Guardamos tu avance en el <strong className="text-white">Paso {step} ({labels[step - 1] || "Datos"})</strong>. ¿Quieres continuar donde te quedaste?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full mt-2 font-barlow">
            <button
              onClick={onResume}
              className="py-5 px-6 bg-[#FF6B1A] hover:bg-[#E55104] text-white font-bold text-lg rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20"
            >
              Continuar mi inscripción <ArrowRight size={20} />
            </button>

            <button
              onClick={onNew}
              className="py-4 px-6 bg-[#0F1218] border border-white/10 text-gray-300 hover:text-white hover:bg-[#252A36] font-bold text-base rounded-xl transition"
            >
              Empezar una nueva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Un sitio de estafa nunca tiene a quién reclamarle. Este bloque va en la barra
// lateral en desktop y al final del contenido en móvil (donde la lateral se apila arriba).
const SoporteReal = () => (
  <div className="font-barlow">
    <a
      href="https://wa.me/593995102378"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 min-h-[48px] text-base text-gray-200 hover:text-white font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] rounded-lg"
    >
      <WhatsappLogo size={20} className="text-[#25D366]" />
      ¿Algún problema? Escríbenos
    </a>
    <p className="text-sm text-gray-400 mt-1 font-medium">
      © 2026 8K Ruta de las Mandarinas · Patate, Ecuador.
    </p>
  </div>
);

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
    onAction: undefined as (() => void) | undefined
  });

  // Selección
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "qr">("transferencia");
  
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
  const savedSnapshot = useRef<any>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeStep, setResumeStep] = useState(1);

  // 1) Al entrar: si hay avance real, preguntamos si continúa o empieza de nuevo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const fd = data.formData || {};
        const hasProgress =
          (data.step && data.step > 1) ||
          Boolean(fd.cedula || fd.nombres || fd.email || data.selectedCategory);
        if (hasProgress) {
          savedSnapshot.current = data;
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
      if (data.formData) setFormData((prev) => ({ ...prev, ...data.formData, comprobante: null }));
      if (data.step) setStep(data.step);
      if (data.selectedCategory) setSelectedCategory(data.selectedCategory);
      if (typeof data.selectedPrice === "number") setSelectedPrice(data.selectedPrice);
      if (typeof data.acceptTerms === "boolean") setAcceptTerms(data.acceptTerms);
      if (data.metodoPago === "qr" || data.metodoPago === "transferencia") setMetodoPago(data.metodoPago);
    }
    setResumeModalOpen(false);
    hydrated.current = true;
  };

  // Empezar una inscripción nueva (descarta lo guardado)
  const startFreshInscription = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
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
  }, [step, selectedCategory, selectedPrice, acceptTerms, metodoPago, formData]);

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
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (componentRef.current) {
        componentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Categorías
  const categories: Category[] = [
    { name: "Élite Pro 8K", price: 20, desc: "Menores de 40 años", icon: <Lightning size={24} /> },
    { name: "Máster", price: 20, desc: "40–64 años", icon: <Medal size={24} /> },
    { name: "Leyenda", price: 18, desc: "65 años en adelante", icon: <Crown size={24} /> },
    { name: "Discapacidad", price: 18, desc: "Todas las edades", icon: <Wheelchair size={24} /> },
  ];

  // --- Efectos ---
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (componentRef.current) {
      const topOffset = 80;
      const elementPosition = componentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth",
      });
    }
  }, [step]);

  // --- Lógica del Formulario ---

  const showAlert = (title: string, message: string, type: "error" | "warning" | "success" = "error", actionLabel?: string, onAction?: () => void) => {
    setModalState({ isOpen: true, title, message, type, actionLabel, onAction });
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
        setFormData(prev => ({
            ...prev, 
            es_titular: value,
            // Si dice que SI es titular, prellenamos con su nombre y apellido
            nombre_titular_cuenta: value === "si" ? `${prev.nombres} ${prev.apellidos}` : "" 
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
        const tipoOk = file.type.startsWith("image/") || file.type === "application/pdf";
        if (!tipoOk) {
          setErrors((prev) => ({ ...prev, comprobante: "Solo aceptamos foto (JPG, PNG) o PDF." }));
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
              ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15)
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
  const enfocarPrimerError = (errs: Record<string, string>, orden: string[]) => {
    const primero = orden.find((f) => errs[f]);
    if (!primero) return;
    const el = document.getElementById(primero);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const CAMPOS_PASO_2: (keyof FormDataState)[] = [
    "cedula", "nombres", "apellidos", "ciudad", "telefono", "email", "edad", "genero",
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

    if (formData.es_titular === "no" && formData.nombre_titular_cuenta.trim().length < 3) {
      newErrors.nombre_titular_cuenta = "Sin este nombre no podemos encontrar tu pago en el banco.";
    }
    if (!formData.comprobante) {
      newErrors.comprobante = "Sube la foto o el PDF del pago para terminar.";
    }

    setErrors(newErrors);
    enfocarPrimerError(newErrors, ["num_comprobante", "fecha_pago", "nombre_titular_cuenta"]);
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
          () => window.location.href = '/verificar'
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
      setErrors((prev) => ({ ...prev, acceptTerms: "Marca la casilla para continuar." }));
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
      body.append("comprobante", formData.comprobante, formData.comprobante.name);
    }

    try {
      const res = await fetch(
        "/api/inscribir",
        { method: "POST", body, cache: "no-store" }
      );
      const rawText = await res.text();
      let json: any = null;
      try { json = rawText ? JSON.parse(rawText) : null; } catch { json = null; }

      setLoading(false);

      if (!res.ok || !json || json.status !== "success") {
        showAlert("Error", json?.message || "No se pudo guardar la inscripción. Intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      if (json?.file_url) setUploadedFileUrl(String(json.file_url));
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setStep(4);

    } catch (err) {
      setLoading(false);
      showAlert("Error de conexión", "Revisa tu internet e inténtalo de nuevo.");
    }
    setSubmitting(false);
  };

  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  // Cada regla devuelve null si el dato sirve, o el texto exacto que verá el corredor.
  const fieldRules: Partial<Record<keyof FormDataState, (v: string) => string | null>> = {
    cedula: (v) => {
      const raw = v.trim();
      // Un pasaporte extranjero puede ser alfanumérico o solo dígitos (el de EE.UU. son 9),
      // así que ahí no aplicamos la regla de los 10 dígitos de la cédula ecuatoriana.
      if (formData.tipo_documento === "pasaporte") {
        if (!raw) return "Escribe tu número de pasaporte.";
        if (raw.length < 5) return "Ese pasaporte parece muy corto.";
        return null;
      }
      if (!raw) return "Escribe tu cédula.";
      const d = raw.replace(/\D/g, "");
      if (d.length !== 10) return `La cédula tiene 10 dígitos, escribiste ${d.length}.`;
      return null;
    },
    nombres: (v) =>
      v.trim().length >= 2
        ? null
        : `Escribe tu nombre como está en tu ${formData.tipo_documento === "pasaporte" ? "pasaporte" : "cédula"}.`,
    apellidos: (v) => (v.trim().length >= 2 ? null : "Escribe tus apellidos."),
    ciudad: (v) => (v.trim().length >= 2 ? null : "¿Desde qué ciudad vienes?"),
    telefono: (v) => {
      const d = v.replace(/\D/g, "");
      if (!d) return "Sin WhatsApp no podemos confirmarte el cupo.";
      if (d.length !== 10) return "El celular tiene 10 dígitos: 099 123 4567.";
      return null;
    },
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Revisa el correo, le falta algo.",
    edad: (v) => {
      if (!v.trim()) return "Escribe tu edad.";
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 8 || n > 99) return "Escribe una edad entre 8 y 99.";
      return null;
    },
    genero: (v) => (v ? null : "Elige una opción."),
    num_comprobante: (v) =>
      v.replace(/\D/g, "").length >= 4 ? null : "Escribe al menos los últimos 4 dígitos.",
    fecha_pago: (v) => {
      if (!v) return "¿Qué día hiciste el pago?";
      if (v > hoyISO()) return "Esa fecha todavía no llega.";
      return null;
    },
  };

  const validateField = (name: keyof FormDataState, value?: string) =>
    fieldRules[name]?.(value ?? (formData[name] ? String(formData[name]) : "")) ?? null;

  const isFieldValid = (name: keyof FormDataState) => {
    const raw = formData[name] ? String(formData[name]) : "";
    return Boolean(raw) && Boolean(fieldRules[name]) && validateField(name) === null;
  };

  // El error aparece cuando el cursor sale del campo, nunca mientras teclea.
  const handleBlur = (name: keyof FormDataState) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name) || "" }));
  };

  // Corrector de typos de email (gmail.con -> gmail.com, etc.)
  const emailTypos: Record<string, string> = {
    "gmail.con": "gmail.com", "gmail.co": "gmail.com", "gmial.com": "gmail.com",
    "gmail.cm": "gmail.com", "gmaill.com": "gmail.com", "hotmail.con": "hotmail.com",
    "hotmial.com": "hotmail.com", "hotmail.co": "hotmail.com", "outlook.con": "outlook.com",
    "outlook.co": "outlook.com", "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com",
    "icloud.con": "icloud.com", "live.con": "live.com",
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
    setTimeout(() => node.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
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
          className={`text-sm md:text-base font-bold uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow transition-colors duration-150 ${colorEtiqueta}`}
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
            aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
            value={formData[name] ? String(formData[name]) : ""}
            onChange={handleInput}
            onFocus={scrollAlEnfocar}
            onBlur={() => {
              handleBlur(name);
              onBlur?.();
            }}
            placeholder={placeholder}
            className={`
              w-full bg-[#0F1218] border-2 rounded-xl
              px-5 py-4 pr-12 min-h-[56px]
              text-white text-lg md:text-xl placeholder-gray-500
              outline-none transition-colors font-barlow
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23]
              ${error
                ? "border-red-400 focus-visible:ring-red-400"
                : ok
                ? "border-green-500/70 focus-visible:ring-green-500"
                : "border-white/25 hover:border-white/45 focus:border-[#FF6B1A] focus-visible:ring-[#FF6B1A]"}
            `}
          />
          {ok && (
            <CheckCircle
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none animate-in fade-in zoom-in-75 duration-200"
            />
          )}
          {error && (
            <WarningCircle
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none"
            />
          )}
        </div>
        {error ? (
          <p
            id={`${name}-error`}
            role="alert"
            className="text-red-300 text-sm md:text-base mt-2 flex items-start gap-1.5 font-medium font-barlow"
          >
            <WarningCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </p>
        ) : hint ? (
          <p id={`${name}-hint`} className="text-gray-400 text-sm mt-2 font-barlow">
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
    <main className="min-h-dvh w-full bg-transparent text-white px-3 py-6 md:px-4 md:py-12 flex justify-center items-start">
      
      {/* INYECCIÓN DE FUENTES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
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
      <div ref={componentRef} className="w-full max-w-7xl mx-auto bg-[#1C2029]/80 md:backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- SIDEBAR / HEADER --- */}
        <div className="bg-[#11141A] p-6 md:p-12 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative min-w-[300px]">
          <div>
            <div className="flex items-center gap-4 mb-6 md:mb-12">
               <img
                 src="/logo-mandarinas-blanco.svg"
                 alt="8K Ruta de las Mandarinas"
                 className="h-20 md:h-24 w-auto object-contain"
               />
            </div>

            {/* BARRA DE PROGRESO (Móvil) */}
            <div className="md:hidden mb-2">
                {/* mb-7: el corredor mide 48px y sobresale 24px sobre la barra;
                    con menos separación se monta encima del texto "Paso X de 4". */}
                <div className="flex items-center justify-between mb-7 font-barlow">
                    <span className="text-base sm:text-lg text-gray-300 font-bold uppercase tracking-wider">Paso {step} de 4</span>
                    <span className="text-white font-bold uppercase text-base sm:text-lg">{stepsLabels[step-1]}</span>
                </div>
                <div className="relative w-full h-2.5 bg-white/10 rounded-full mt-1">
                    <div className="h-full bg-[#FF6B1A] rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: `${(step / 4) * 100}%` }}
                    >
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#FF6B1A] shadow-[0_5px_16px_rgba(0,0,0,0.55)] ring-2 ring-[#FF6B1A]/50">
                        <PersonSimpleRun size={24} aria-hidden="true" />
                      </span>
                    </div>
                </div>
            </div>

            {/* LISTA DE PASOS (Desktop) */}
            <div className="hidden md:block space-y-8 relative z-10 font-barlow">
              {stepsLabels.map((label, index) => {
                const stepNum = index + 1;
                const active = step === stepNum;
                const completed = step > stepNum;
                return (
                  <div key={index} className={`flex items-center gap-5 transition-all duration-300 ${active ? "opacity-100 translate-x-2" : "opacity-40"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2 ${active ? `bg-[#FF6B1A] border-[#FF6B1A] text-white` : completed ? "bg-green-500 border-green-500 text-black" : "bg-transparent border-white/20 text-white"}`}>
                      {completed ? <CheckCircle size={24} /> : stepNum}
                    </div>
                    <div>
                      <p className={`text-xl font-bold uppercase tracking-wider ${active ? "text-white" : "text-gray-400"}`}>{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* En móvil esta columna se apila ARRIBA del formulario, así que el soporte
              va al final del contenido (ver <SoporteReal />) y aquí solo en desktop. */}
          <div className="hidden md:block mt-16 md:mt-0 relative z-10 font-barlow">
            <SoporteReal />
          </div>
        </div>

        {/* --- ÁREA DE CONTENIDO --- */}
        <div className="p-5 md:p-14 md:w-2/3 bg-[#161A23] relative min-h-[500px]">
          
          {(loading || verifying) && (
            <div className="absolute inset-0 z-50 bg-[#161A23]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-in fade-in">
              <div className="w-16 h-16 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-bold animate-pulse tracking-widest uppercase text-lg md:text-xl font-barlow">
                {verifying ? "Verificando cédula..." : "Procesando inscripción..."}
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto">

            {/* RESUMEN FIJO DE CATEGORÍA + PRECIO (pasos 2 y 3) */}
            {(step === 2 || step === 3) && selectedCategory && (
              <div className="flex items-center justify-between gap-3 mb-6 rounded-2xl bg-[#0F1218] border border-[#FF6B1A]/30 px-5 py-3.5 font-barlow">
                <div className="flex flex-col">
                  <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-widest font-bold">Tu categoría</span>
                  <span className="text-base md:text-lg font-bold text-white leading-tight">{selectedCategory}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-widest font-bold block">Total preventa</span>
                  <span className="text-[#FF6B1A] font-black text-2xl md:text-3xl leading-none">${selectedPrice}</span>
                </div>
              </div>
            )}

            {/* --- PASO 1: CATEGORÍA --- */}
            {step === 1 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-bebas">Selecciona tu Categoría</h1>

                <div className="flex items-start gap-3 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-3.5 mb-5 font-barlow">
                  <Lightning size={20} className="text-[#FFB800] shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg text-yellow-50 leading-relaxed">
                    <strong className="text-white">Precios de preventa.</strong> Suben cuando se
                    cierre la preventa, así que inscribirte hoy te sale más barato.
                  </p>
                </div>

                <p className="text-gray-300 mb-6 md:mb-8 text-lg md:text-xl leading-relaxed font-barlow">
                  Elige en cuál vas a competir. Son 2 minutos y no pedimos tarjeta: pagas por
                  transferencia o QR y subes el comprobante.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 font-barlow">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={sinRebote(() => handleCategoryClick(cat))}
                      className="group relative bg-[#0F1218] border border-white/10 p-6 md:p-7 rounded-2xl text-left hover:border-[#FF6B1A] hover:bg-[#1A1E29] transition-all duration-200 active:scale-[0.98] h-full flex flex-col justify-between shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#FF6B1A]/20 text-gray-400 group-hover:text-[#FF6B1A] transition-colors">
                             {cat.icon}
                           </div>
                           <span className="font-bold text-xl md:text-2xl text-white group-hover:text-[#FF6B1A] transition-colors leading-tight">{cat.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="bg-white/5 text-base md:text-lg px-3 py-1 rounded-lg text-white font-mono font-bold block border border-white/10">
                            ${cat.price}
                          </span>
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-[#FFB800] mt-1">
                            Preventa
                          </span>
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-gray-400 group-hover:text-gray-300 pl-11">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- PASO 2: DATOS --- */}
            {step === 2 && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  goToStep3();
                }}
                className="animate-in slide-in-from-bottom-4 duration-500 fade-in pb-28 md:pb-0"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-2 font-bebas">Tus Datos Personales</h1>
                <p className="text-gray-400 text-base md:text-lg mb-8 font-barlow">
                  Son 2 minutos. Guardamos tu avance por si necesitas volver.
                </p>

                {/* gap más ancho en móvil: el pulgar es menos preciso que el ratón */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 md:gap-y-8 md:gap-x-8 mb-8">
                  <div className="md:col-span-2">
                    {/* Extranjeros sin cédula: el tipo decide teclado, validación y límite. */}
                    <div role="radiogroup" aria-label="Tipo de documento" className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { valor: "cedula" as const, texto: "Cédula ecuatoriana" },
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
                            setFormData((f) => ({ ...f, tipo_documento: valor, cedula: "" }));
                            setErrors((prev) => ({ ...prev, cedula: "" }));
                          }}
                          className={`min-h-[52px] rounded-xl border-2 px-3 font-bold text-base md:text-lg font-barlow transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] ${
                            formData.tipo_documento === valor
                              ? "bg-[#FF6B1A] border-[#FF6B1A] text-white"
                              : "bg-[#0F1218] border-white/15 text-gray-200 hover:border-white/40"
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

                  {renderInputField({
                    name: "ciudad",
                    label: "Ciudad",
                    icon: <Bank size={20} />,
                    placeholder: "Ej: Ambato",
                    autoComplete: "address-level2",
                    inputMode: "text",
                    list: "ciudades",
                  })}
                  <datalist id="ciudades">
                    {CIUDADES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>

                  {renderInputField({
                    name: "telefono",
                    label: "WhatsApp",
                    icon: <Phone size={20} />,
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
                      hint: emailSuggestion ? undefined : "Ahí llega tu confirmación. Nada de spam.",
                    })}
                    {emailSuggestion && (
                      <button
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, email: emailSuggestion }))}
                        className="mt-2 min-h-[48px] text-left text-sm md:text-base text-[#FF6B1A] hover:text-[#FF2D7C] font-bold font-barlow flex items-center gap-1.5"
                      >
                        <Info size={16} className="shrink-0" /> ¿Quisiste decir{" "}
                        <span className="underline">{emailSuggestion}</span>? Tócalo para corregir.
                      </button>
                    )}
                  </div>

                  {renderInputField({
                    name: "edad",
                    label: "Edad",
                    icon: <CalendarBlank size={20} />,
                    placeholder: "Ej: 25",
                    autoComplete: "off",
                    inputMode: "numeric",
                    maxLength: 2,
                  })}

                  {/* 3 opciones: tarjetas a la vista en vez de un <select> nativo */}
                  <div>
                    <span className="text-sm md:text-base font-bold text-gray-200 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow">
                      <User size={20} /> Género
                    </span>
                    <div role="radiogroup" aria-label="Género" className="grid grid-cols-3 gap-2">
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
                          className={`min-h-[56px] rounded-xl border-2 px-2 font-bold text-base md:text-lg font-barlow transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23] ${
                            formData.genero === valor
                              ? "bg-[#FF6B1A] border-[#FF6B1A] text-white"
                              : errors.genero
                              ? "bg-[#0F1218] border-red-400 text-gray-200"
                              : "bg-[#0F1218] border-white/15 text-gray-200 hover:border-white/40"
                          }`}
                        >
                          {texto}
                        </button>
                      ))}
                    </div>
                    {errors.genero && (
                      <p
                        role="alert"
                        className="text-red-300 text-sm md:text-base mt-2 flex items-center gap-1.5 font-medium font-barlow"
                      >
                        <WarningCircle size={16} className="shrink-0" /> {errors.genero}
                      </p>
                    )}
                  </div>

                  {categoriaNoCuadra && (
                    <div className="md:col-span-2 flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-4 font-barlow animate-in fade-in slide-in-from-top-2">
                      <Info size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                      <div className="text-base md:text-lg text-yellow-50 leading-relaxed">
                        Con {edadNum} años te toca <strong className="text-white">{categoriaSugerida}</strong>, no{" "}
                        {selectedCategory}.{" "}
                        <button
                          type="button"
                          onClick={aplicarCategoriaSugerida}
                          className="underline decoration-2 underline-offset-2 font-bold text-white hover:text-yellow-300 min-h-[48px]"
                        >
                          Cambiar a {categoriaSugerida} ($
                          {categories.find((c) => c.name === categoriaSugerida)?.price})
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`bg-[#0F1218] p-5 md:p-6 rounded-2xl border mb-8 transition-colors ${
                    errors.acceptTerms ? "border-red-400" : "border-white/10"
                  }`}
                >
                  <label htmlFor="acceptTerms" className="flex items-start gap-4 cursor-pointer">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (e.target.checked) setErrors((prev) => ({ ...prev, acceptTerms: "" }));
                      }}
                      className="mt-0.5 w-7 h-7 shrink-0 accent-[#FF6B1A] cursor-pointer"
                    />
                    <span className="text-base md:text-lg text-gray-200 leading-relaxed font-barlow">
                      Acepto los{" "}
                      <a
                        href="/terminos"
                        target="_blank"
                        className="text-[#FF6B1A] underline font-bold hover:text-[#FF2D7C]"
                      >
                        Términos y Condiciones
                      </a>{" "}
                      y declaro estar apto físicamente.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p
                      role="alert"
                      className="text-red-300 text-sm md:text-base mt-3 flex items-center gap-1.5 font-medium font-barlow"
                    >
                      <WarningCircle size={16} className="shrink-0" /> {errors.acceptTerms}
                    </p>
                  )}
                </div>

                {/* Barra de acción fija en la zona del pulgar. Va con `fixed` y no `sticky`
                    porque la tarjeta contenedora tiene overflow:hidden y ahí sticky no ancla.
                    El padding inferior respeta la barra de gestos del teléfono. */}
                <div className="fixed inset-x-0 bottom-0 z-40 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#161A23]/95 backdrop-blur-md border-t border-white/10 shadow-[0_-8px_24px_rgba(0,0,0,0.45)] md:static md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none md:shadow-none">
                  <div className="flex gap-3 font-barlow">
                    <button
                      type="button"
                      onClick={sinRebote(() => setStep(1))}
                      className="px-5 md:px-10 min-h-[56px] rounded-xl border border-white/15 hover:bg-white/5 transition font-bold text-gray-200 flex items-center gap-2 text-lg md:text-xl outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <CaretLeft size={24} /> Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={verifying}
                      className="flex-1 bg-white text-black min-h-[56px] rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-lg md:text-xl shadow-lg disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23]"
                    >
                      {verifying ? "Verificando..." : "Siguiente"} <CaretRight size={24} />
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2.5 font-barlow">
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
                className="animate-in slide-in-from-right-8 duration-500 fade-in pb-28 md:pb-0"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-bebas">Validación de Pago</h1>

                {/* Trampa para bots: invisible y fuera del recorrido de tabulación.
                    Nadie que use el sitio de verdad puede llenarlo. */}
                <input
                  ref={honeypot}
                  type="text"
                  name="apellido_materno"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />

                {/* SELECTOR DE MÉTODO DE PAGO */}
                <p className="text-gray-400 text-base md:text-lg mb-3 font-barlow">Elige cómo vas a pagar:</p>
                <div className="grid grid-cols-2 gap-3 mb-8 font-barlow">
                  <button
                    type="button"
                    onClick={() => setMetodoPago("transferencia")}
                    className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 font-bold text-base md:text-lg transition-all ${
                      metodoPago === "transferencia"
                        ? "bg-[#FF6B1A] border-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20"
                        : "bg-[#0F1218] border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    <Bank size={22} /> Transferencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodoPago("qr")}
                    className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 font-bold text-base md:text-lg transition-all ${
                      metodoPago === "qr"
                        ? "bg-[#FF6B1A] border-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20"
                        : "bg-[#0F1218] border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    <QrCode size={22} /> QR (deúna!)
                  </button>
                </div>

                {metodoPago === "transferencia" && (
                <div className="bg-gradient-to-br from-[#1A1E29] to-black border border-white/10 rounded-2xl p-6 md:p-10 mb-8 shadow-lg font-barlow">
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/10">
                    <div className="bg-[#FF6B1A]/20 p-4 rounded-full text-[#FF6B1A]"><Bank size={32} /></div>
                    <div>
                      <p className="text-sm md:text-base text-gray-400 uppercase tracking-wider mb-1">Institución Financiera</p>
                      <p className="font-bold text-2xl md:text-3xl">Banco Pichincha</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-lg md:text-xl">
                    <div className="flex justify-between items-center gap-3">
                        <span className="text-gray-500">Cuenta Corriente:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("3148516004", "Número de cuenta")}
                          className="group inline-flex items-center gap-2 font-mono text-white bg-white/5 hover:bg-white/10 active:scale-95 px-3 py-2 rounded-lg border border-white/10 transition"
                          title="Copiar número de cuenta"
                        >
                          3148516004
                          <Copy size={16} className="text-gray-400 group-hover:text-[#FF6B1A]" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tipo:</span>
                        <span className="text-right text-white font-medium">Corriente</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500">Titular:</span>
                      <span className="text-right text-white max-w-[200px] leading-tight">Diego Mantilla</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                        <span className="text-gray-500">RUC:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1802796829-001", "RUC")}
                          className="group inline-flex items-center gap-2 font-mono text-white bg-white/5 hover:bg-white/10 active:scale-95 px-3 py-2 rounded-lg border border-white/10 transition"
                          title="Copiar RUC"
                        >
                          1802796829-001
                          <Copy size={16} className="text-gray-400 group-hover:text-[#FF6B1A]" />
                        </button>
                    </div>
                     <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
                      <div>
                        <span className="text-gray-200 font-bold text-2xl md:text-3xl block leading-tight">Total a pagar:</span>
                        <span className="text-[#FFB800] text-xs uppercase tracking-widest font-bold">Precio de preventa · sin recargos</span>
                      </div>
                      <span className="text-[#FF6B1A] font-black text-4xl md:text-5xl">${selectedPrice}.00</span>
                    </div>
                  </div>
                </div>
                )}

                {/* --- MÉTODO 2: PAGO CON QR (deúna! / Banco Pichincha) --- */}
                {metodoPago === "qr" && (
                <div className="bg-gradient-to-br from-[#1A1E29] to-black border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-lg font-barlow">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-[#FF6B1A]/20 p-3 rounded-full text-[#FF6B1A]"><QrCode size={28} /></div>
                    <div>
                      <p className="text-sm md:text-base text-gray-400 uppercase tracking-wider mb-1">Opción rápida</p>
                      <p className="font-bold text-2xl md:text-3xl">Paga con QR (deúna!)</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg mb-6">
                    Desde la app de tu banco o <strong className="text-white">deúna!</strong>, escanea este código e ingresa el monto <strong className="text-white">${selectedPrice}.00</strong>.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/qr-pichincha.png"
                      alt="Código QR para pago con deúna! y Banco Pichincha a nombre de Diego David Mantilla Villavicencio"
                      className="w-full max-w-[360px] h-auto rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      loading="lazy"
                    />
                  </div>
                </div>
                )}

                {/* --- SECCIÓN ANTI-FRAUDE Y VERIFICACIÓN --- */}
                <div className="space-y-6 mb-10">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                        <ShieldCheck size={20}/>
                        <h3 className="text-xl font-bold font-bebas tracking-wide uppercase">Datos para Verificación Rápida</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="md:col-span-2 bg-[#0F1218] p-5 rounded-xl border border-white/10">
                            <span className="text-base font-bold text-gray-200 uppercase tracking-wide mb-3 block font-barlow">¿La cuenta bancaria es tuya?</span>
                            <div role="radiogroup" aria-label="¿La cuenta bancaria es tuya?" className="grid grid-cols-2 gap-3 mb-4">
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
                                          valor === "si" ? `${prev.nombres} ${prev.apellidos}`.trim() : "",
                                      }))
                                    }
                                    className={`min-h-[56px] rounded-xl border-2 px-3 font-bold text-base md:text-lg font-barlow transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1218] ${
                                      formData.es_titular === valor
                                        ? "bg-[#FF6B1A] border-[#FF6B1A] text-white"
                                        : "bg-white/5 border-white/15 text-gray-200 hover:border-white/40"
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

                <div className="mb-10 pt-6 border-t border-white/10">
                  <label className="text-base md:text-lg font-bold text-gray-200 mb-3 block uppercase tracking-wide font-barlow">Adjuntar Comprobante (Foto/PDF)</label>
                  {!previewName ? (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-36 md:h-48 border-2 border-dashed rounded-2xl cursor-pointer hover:border-[#FF6B1A] hover:bg-[#FF6B1A]/5 transition-colors bg-[#0F1218] focus-within:ring-2 focus-within:ring-[#FF6B1A] ${
                        errors.comprobante ? "border-red-400" : "border-gray-500"
                      }`}
                    >
                      <UploadSimple className="w-12 h-12 md:w-16 md:h-16 mb-2 text-gray-300" />
                      <p className="text-base md:text-lg text-gray-300 font-barlow">Toca aquí para subir tu archivo</p>
                      <p className="text-sm text-gray-400 font-barlow mt-1">Foto o PDF · máximo 10MB</p>
                      <input type="file" name="comprobante" accept="image/*,application/pdf" onChange={handleInput} className="sr-only" />
                    </label>
                  ) : (
                     <div className="flex items-center justify-between gap-3 bg-[#FF6B1A]/10 p-4 rounded-2xl border border-[#FF6B1A]/30">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <CheckCircle className="text-green-500 shrink-0" size={28} />
                        <span className="text-base md:text-xl text-gray-100 truncate font-bold">{previewName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        aria-label="Quitar el archivo"
                        className="text-red-300 w-12 h-12 shrink-0 flex items-center justify-center hover:bg-red-500/10 rounded-xl transition outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash size={24} />
                      </button>
                    </div>
                  )}
                  {errors.comprobante && (
                    <p role="alert" className="text-red-300 text-sm md:text-base mt-2 flex items-center gap-1.5 font-medium font-barlow">
                      <WarningCircle size={16} className="shrink-0" /> {errors.comprobante}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-3 font-barlow flex items-start gap-1.5">
                    <ShieldCheck size={16} className="shrink-0 mt-0.5 text-gray-400" />
                    Tu comprobante es privado: solo lo ve el equipo que valida los pagos.
                  </p>
                </div>

                {/* Barra de acción fija en la zona del pulgar. Va con `fixed` y no `sticky`
                    porque la tarjeta contenedora tiene overflow:hidden y ahí sticky no ancla.
                    El padding inferior respeta la barra de gestos del teléfono. */}
                <div className="fixed inset-x-0 bottom-0 z-40 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#161A23]/95 backdrop-blur-md border-t border-white/10 shadow-[0_-8px_24px_rgba(0,0,0,0.45)] md:static md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none md:shadow-none">
                  <div className="flex gap-3 font-barlow">
                    <button
                      type="button"
                      onClick={sinRebote(() => setStep(2))}
                      className="px-5 md:px-10 min-h-[56px] rounded-xl border border-white/15 hover:bg-white/5 transition font-bold text-gray-200 flex items-center gap-2 text-lg md:text-xl outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <CaretLeft size={24} /> Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#FF6B1A] hover:bg-[#E55104] text-white min-h-[56px] rounded-xl font-bold shadow-[0_0_20px_#FF6B1A50] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg md:text-xl outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#161A23]"
                    >
                      {submitting ? "Enviando..." : "Confirmar Inscripción"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* --- PASO 4: RESUMEN FINAL --- */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 fade-in py-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_#22c55e40]">
                  <CheckCircle size={64} />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-bebas">¡Inscripción Exitosa!</h1>
                <p className="text-gray-300 mb-10 px-4 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto font-barlow">
                  Hemos recibido tus datos correctamente. Tu pago será validado en los siguientes <strong className="text-white">2 a 3 días laborales.</strong>
                </p>

                {/* Resumen Completo */}
                <div className="bg-[#0F1218] border border-white/10 rounded-2xl p-8 text-left max-w-2xl mx-auto mb-10 relative overflow-hidden shadow-2xl font-barlow">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D7C] to-[#FF6B1A]" />
                   
                   <div className="grid grid-cols-2 gap-6 text-base md:text-lg mb-8">
                      <div className="col-span-2 pb-6 mb-2 border-b border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Nombre Completo</p>
                        <p className="text-2xl md:text-3xl font-bold text-white capitalize">{formData.nombres} {formData.apellidos}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><IdentificationCard size={12} /> Cédula</p>
                        <p className="font-mono text-gray-200 text-lg md:text-xl">{formData.cedula}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><User size={12} /> Categoría</p>
                        <p className="font-bold text-[#FF6B1A] text-lg md:text-xl">{selectedCategory}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><MapPin size={12} /> Ciudad</p>
                        <p className="text-gray-200 text-lg">{formData.ciudad}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Phone size={12} /> Teléfono</p>
                        <p className="text-gray-200 text-lg">{formData.telefono}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Envelope size={12} /> Email</p>
                        <p className="text-gray-200 truncate text-lg" title={formData.email}>{formData.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><CalendarBlank size={12} /> Edad</p>
                        <p className="text-gray-200 text-lg">{formData.edad} años</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><User size={12} /> Género</p>
                        <p className="text-gray-200 text-lg">{formData.genero}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5 bg-[#1A1E29] p-5 rounded-xl border border-white/5">
                     <div className="bg-white p-2 rounded-lg shrink-0">
                        <img 
                          alt="QR" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.cedula || "8K")}`} 
                          className="w-20 h-20"
                        />
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-sm text-gray-500 mb-1 font-bold uppercase">Comprobante de Inscripción</p>
                       <p className="text-sm text-gray-400 truncate">Estado: <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded ml-1">Pendiente de Verificación</span></p>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-white/90 text-base md:text-lg font-barlow max-w-xl">
                      <strong className="text-white">Último paso:</strong> envíanos tu comprobante por WhatsApp para confirmar tu cupo.
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
                      className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-full font-bold hover:bg-[#1EBE57] transition shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 text-lg md:text-xl font-barlow"
                    >
                       <WhatsappLogo size={26}/> Enviar comprobante por WhatsApp
                    </a>

                    <a
                      href="/verificar"
                      className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-barlow text-base md:text-lg mt-1"
                    >
                       <MagnifyingGlass size={20}/> Ver estado de mi inscripción
                    </a>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white underline-offset-4 font-barlow text-base md:text-lg mt-2"
                    >
                        <ArrowsClockwise size={16} /> Registrar a otra persona
                    </button>
                </div>
              </div>
            )}

            {/* En móvil la barra lateral queda arriba, así que el soporte va aquí abajo.
                mb-24 lo levanta por encima de la barra de acción fija. */}
            <div className="md:hidden mt-10 mb-24 pt-6 border-t border-white/10">
              <SoporteReal />
            </div>

          </div>
        </div>
      </div>
    </main>
    </IconContext.Provider>
  );
}