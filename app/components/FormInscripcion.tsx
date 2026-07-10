"use client";

import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Trash2,
  Landmark,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Info,
  HelpCircle,
  Zap,
  Medal,
  Crown,
  Accessibility,
  RefreshCcw,
  Search,
  ArrowRight,
  ShieldCheck, // Icono agregado para la seguridad
  FileText,    // Icono agregado para el comprobante
  Copy,        // Para copiar datos de pago
  QrCode       // Pago con QR (deúna! / Pichincha)
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";

// --- Interfaces Actualizadas ---
interface FormDataState {
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

// Corredor en SVG con extremidades (brazos/piernas) que se mueven como al correr
const RunnerIcon = ({ size = 44 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="runner-svg"
    aria-hidden="true"
  >
    {/* cabeza */}
    <circle className="head" cx="14.5" cy="4.5" r="2.9" fill="currentColor" stroke="none" />
    {/* torso (inclinado hacia adelante) */}
    <line x1="13.6" y1="7.6" x2="11" y2="15" />
    {/* brazos (pivote en el hombro) */}
    <line className="arm arm-back" x1="13" y1="8.6" x2="8.5" y2="11" />
    <line className="arm arm-front" x1="13" y1="8.6" x2="17.5" y2="10.5" />
    {/* piernas (pivote en la cadera) */}
    <line className="leg leg-back" x1="11" y1="15" x2="6.5" y2="22" />
    <line className="leg leg-front" x1="11" y1="15" x2="16" y2="21.5" />
  </svg>
);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141820] border border-white/10 w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2"
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
            {type === "error" && <AlertCircle size={36} />}
            {type === "warning" && <AlertCircle size={36} />}
            {type === "success" && <CheckCircle2 size={36} />}
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1C2029] border border-[#FF6B1A]/30 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,107,26,0.18)] relative animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-[#FF6B1A]/10 text-[#FF6B1A] rounded-full flex items-center justify-center">
            <RefreshCcw size={40} />
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

// --- Modal de Descuento (Tercera Edad 65+) ---
const DiscountModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: (isSenior: boolean) => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1C2029] border border-[#FF6B1A]/30 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,107,26,0.18)] relative animate-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-[#FF6B1A]/10 text-[#FF6B1A] rounded-full flex items-center justify-center animate-bounce">
            <HelpCircle size={44} />
          </div>

          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white uppercase mb-3 font-barlow">
              ¿Aplica descuento?
            </h3>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-barlow">
              ¿Eres una persona de la <strong className="text-white">Tercera Edad</strong> (65 años o más)?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2 font-barlow">
            <button
              onClick={() => onConfirm(true)}
              className="py-5 px-6 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition flex flex-col items-center justify-center gap-1 shadow-lg"
            >
              <span>SÍ, tengo 65+</span>
              <span className="text-sm md:text-base text-green-700 font-bold">Pagas $18</span>
            </button>

            <button
              onClick={() => onConfirm(false)}
              className="py-5 px-6 bg-[#0F1218] border border-white/10 text-white font-bold text-lg rounded-xl hover:bg-[#1A1E29] hover:border-white/30 transition flex flex-col items-center justify-center gap-1"
            >
              <span>NO, tengo 60–64</span>
              <span className="text-sm md:text-base text-gray-400 font-medium">Pagas $23</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  // Modal de descuento tercera edad (categoría Leyenda 60+)
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<Category | null>(null);

  // Selección
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "qr">("transferencia");
  
  // Archivo
  const [previewName, setPreviewName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  // Refs
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const didMount = useRef(false);

  // Form Data Inicial (Agregamos los campos por defecto)
  const initialFormData: FormDataState = {
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
    { name: "Élite Pro 8K", price: 23, desc: "Menores de 40 años", icon: <Zap size={24} /> },
    { name: "Máster", price: 23, desc: "40–64 años", icon: <Medal size={24} /> },
    { name: "Leyenda", price: 18, desc: "65 años en adelante", icon: <Crown size={24} /> },
    { name: "Discapacidad", price: 18, desc: "Todas las edades", icon: <Accessibility size={24} /> },
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

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat.name);
    setSelectedPrice(cat.price);
    setStep(2);
  };

  // Confirmación del descuento de tercera edad (65+) → $18
  const handleDiscountConfirm = (isSenior: boolean) => {
    if (pendingCategory) {
      setSelectedCategory(pendingCategory.name);
      setSelectedPrice(isSenior ? 18 : pendingCategory.price);
      setStep(2);
    }
    setDiscountModalOpen(false);
    setPendingCategory(null);
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

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      if (files && files[0]) {
        const file = files[0];
        if (file.size > 10_000_000) {
          showAlert("Archivo muy pesado", "El archivo no debe superar los 10MB.");
          return;
        }
        setFormData((f) => ({ ...f, [name]: file }));
        setPreviewName(file.name);
        return;
      }
      setFormData((f) => ({ ...f, [name]: value }));
    },
    [errors, formData.nombres, formData.apellidos]
  );

  const clearFile = useCallback(() => {
    setFormData((f) => ({ ...f, comprobante: null }));
    setPreviewName("");
  }, []);

  const validateStep2 = () => {
    const requiredFields: (keyof FormDataState)[] = [
      "cedula", "nombres", "apellidos", "ciudad", "email", "telefono", "edad", "genero",
    ];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const f of requiredFields) {
      if (!formData[f]) {
        newErrors[f] = "Este campo es obligatorio";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // Validaciones del Paso 3 (Anti-Fraude)
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validar Número de comprobante (Fundamental para evitar mirar la foto)
    if (!formData.num_comprobante || formData.num_comprobante.length < 4) {
        newErrors["num_comprobante"] = "Ingresa al menos los últimos 4 dígitos.";
        isValid = false;
    }
    // Validar fecha
    if (!formData.fecha_pago) {
        newErrors["fecha_pago"] = "La fecha es obligatoria.";
        isValid = false;
    }
    // Validar nombre del titular si seleccionó "No es mía"
    if (formData.es_titular === "no" && (!formData.nombre_titular_cuenta || formData.nombre_titular_cuenta.length < 3)) {
        newErrors["nombre_titular_cuenta"] = "Si no es tu cuenta, necesitamos el nombre del dueño para encontrar el pago.";
        isValid = false;
    }
    // Validar foto
    if (!formData.comprobante) {
        showAlert("Falta Comprobante", "Debes subir la foto o PDF del pago.");
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const checkUserExists = async () => {
    if (!formData.cedula || formData.cedula.length < 6) return false;
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

  const handleCedulaBlur = () => {
    if (formData.cedula.length >= 10) {
      checkUserExists();
    }
  };

  const submitForm = async () => {
    if (submitting) return;
    
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

  // Validación en vivo: reglas por campo
  const fieldValidators: Partial<Record<keyof FormDataState, (v: string) => boolean>> = {
    cedula: (v) => v.replace(/\D/g, "").length >= 6,
    nombres: (v) => v.trim().length >= 2,
    apellidos: (v) => v.trim().length >= 2,
    ciudad: (v) => v.trim().length >= 2,
    telefono: (v) => v.replace(/\D/g, "").length >= 7,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  };
  const isFieldValid = (name: keyof FormDataState) => {
    const rule = fieldValidators[name];
    const val = formData[name] ? String(formData[name]) : "";
    return rule ? rule(val) : false;
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

  const renderInputField = (
    name: keyof FormDataState,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    placeholder: string = "",
    onBlur?: () => void,
    autoComplete?: string,
    inputMode?: "text" | "numeric" | "email" | "tel" | "decimal"
  ) => (
    <div className="relative group">
      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow">
        {icon} {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={formData[name] ? String(formData[name]) : ""}
          onChange={handleInput}
          onBlur={onBlur}
          placeholder={placeholder || `Ingresa tu ${label.toLowerCase()}...`}
          className={`
            w-full bg-[#0F1218] border rounded-xl
            px-5 py-4 pr-12
            text-white text-lg md:text-xl placeholder-gray-600
            outline-none transition-all font-barlow
            ${errors[name]
              ? "border-red-500/50 focus:border-red-500"
              : isFieldValid(name)
              ? "border-green-500/40 focus:border-green-500"
              : "border-white/10 focus:border-[#FF6B1A] hover:border-white/20"}
          `}
        />
        {isFieldValid(name) && !errors[name] && (
          <CheckCircle2
            size={22}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none animate-in fade-in zoom-in-75 duration-200"
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1 font-medium font-barlow">
          <AlertCircle size={16} /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-transparent text-white px-3 py-6 md:px-4 md:py-12 flex justify-center items-start">
      
      {/* INYECCIÓN DE FUENTES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .runner-svg .leg, .runner-svg .arm, .runner-svg .head { transform-box: view-box; }
        .runner-svg .head { transform-origin: 14.5px 4.5px; animation: headBob 0.34s ease-in-out infinite; }
        .runner-svg .leg-front { transform-origin: 11px 15px; animation: legA 0.34s ease-in-out infinite; }
        .runner-svg .leg-back  { transform-origin: 11px 15px; animation: legB 0.34s ease-in-out infinite; }
        .runner-svg .arm-front { transform-origin: 13px 8.6px; animation: armA 0.34s ease-in-out infinite; animation-delay: -0.085s; }
        .runner-svg .arm-back  { transform-origin: 13px 8.6px; animation: armB 0.34s ease-in-out infinite; animation-delay: -0.085s; }
        @keyframes legA { 0%, 100% { transform: rotate(34deg); } 50% { transform: rotate(-28deg); } }
        @keyframes legB { 0%, 100% { transform: rotate(-28deg); } 50% { transform: rotate(34deg); } }
        @keyframes armA { 0%, 100% { transform: rotate(-42deg); } 50% { transform: rotate(38deg); } }
        @keyframes armB { 0%, 100% { transform: rotate(38deg); } 50% { transform: rotate(-42deg); } }
        @keyframes headBob { 0%, 100% { transform: translateY(-0.6px); } 50% { transform: translateY(0.9px); } }
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
      <DiscountModal
        isOpen={discountModalOpen}
        onConfirm={handleDiscountConfirm}
        onCancel={() => { setDiscountModalOpen(false); setPendingCategory(null); }}
      />
      <ResumeModal
        isOpen={resumeModalOpen}
        step={resumeStep}
        onResume={resumeSaved}
        onNew={startFreshInscription}
      />
      {/* Contenedor Principal */}
      <div ref={componentRef} className="w-full max-w-7xl mx-auto bg-[#1C2029]/80 backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
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
                <div className="flex items-center justify-between mb-3 font-barlow">
                    <span className="text-base sm:text-lg text-gray-300 font-bold uppercase tracking-wider">Paso {step} de 4</span>
                    <span className="text-white font-bold uppercase text-base sm:text-lg">{stepsLabels[step-1]}</span>
                </div>
                <div className="relative w-full h-2.5 bg-white/10 rounded-full mt-1">
                    <div className="h-full bg-[#FF6B1A] rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: `${(step / 4) * 100}%` }}
                    >
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-[#FF6B1A] shadow-[0_5px_16px_rgba(0,0,0,0.55)] ring-2 ring-[#FF6B1A]/50">
                        <RunnerIcon size={34} />
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
                      {completed ? <CheckCircle2 size={24} /> : stepNum}
                    </div>
                    <div>
                      <p className={`text-xl font-bold uppercase tracking-wider ${active ? "text-white" : "text-gray-400"}`}>{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="hidden md:block mt-16 md:mt-0 text-base text-gray-400 relative z-10 font-medium font-barlow">
            © 2026 8K Ruta de las Mandarinas. <br/> Patate, Ecuador.
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
                <div className="text-right">
                  <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-widest font-bold block">Total</span>
                  <span className="text-[#FF6B1A] font-black text-2xl md:text-3xl leading-none">${selectedPrice}</span>
                </div>
              </div>
            )}

            {/* --- PASO 1: CATEGORÍA --- */}
            {step === 1 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-bebas">Selecciona tu Categoría</h1>
                <p className="text-gray-300 mb-6 md:mb-8 text-lg md:text-xl leading-relaxed font-barlow">
                  Elige la categoría en la que vas a competir.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 font-barlow">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat)}
                      className="group relative bg-[#0F1218] border border-white/10 p-6 md:p-7 rounded-2xl text-left hover:border-[#FF6B1A] hover:bg-[#1A1E29] transition-all duration-200 active:scale-[0.98] h-full flex flex-col justify-between shadow-md"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#FF6B1A]/20 text-gray-400 group-hover:text-[#FF6B1A] transition-colors">
                             {cat.icon}
                           </div>
                           <span className="font-bold text-xl md:text-2xl text-white group-hover:text-[#FF6B1A] transition-colors leading-tight">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-white/5 text-sm md:text-base px-3 py-1 rounded-lg text-gray-200 font-mono font-bold block border border-white/5">
                            ${cat.price}
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
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-2 font-bebas">Tus Datos Personales</h1>
                <p className="text-gray-400 text-base md:text-lg mb-8 font-barlow">Solo toma 2 minutos. Guardamos tu avance por si necesitas volver.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-8">
                  <div className="md:col-span-2">
                    {renderInputField("cedula", "Cédula o Pasaporte", <CreditCard size={20} />, "text", "", handleCedulaBlur, "off", "numeric")}
                  </div>
                  {renderInputField("nombres", "Nombres", <User size={20} />, "text", "", undefined, "given-name", "text")}
                  {renderInputField("apellidos", "Apellidos", <User size={20} />, "text", "", undefined, "family-name", "text")}
                  {renderInputField("ciudad", "Ciudad", <Landmark size={20} />, "text", "", undefined, "address-level2", "text")}
                  {renderInputField("telefono", "Teléfono", <Phone size={20} />, "tel", "", undefined, "tel", "tel")}
                  <div className="md:col-span-2">
                    {renderInputField("email", "Correo Electrónico", <Mail size={20} />, "email", "", undefined, "email", "email")}
                    {emailSuggestion && (
                      <button
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, email: emailSuggestion }))}
                        className="mt-2 text-sm md:text-base text-[#FF6B1A] hover:text-[#FF2D7C] font-bold font-barlow flex items-center gap-1"
                      >
                        <Info size={15} /> ¿Quisiste decir <span className="underline">{emailSuggestion}</span>? Tócalo para corregir.
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow"><User size={20} /> Edad</label>
                    <input name="edad" type="text" inputMode="numeric" autoComplete="off" value={formData.edad} onChange={handleInput} placeholder="Ej: 25" className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg md:text-xl outline-none focus:border-[#FF6B1A] font-barlow" />
                  </div>

                  <div>
                    <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow"><User size={20} /> Género</label>
                    <select name="genero" value={formData.genero} onChange={handleInput} className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg md:text-xl outline-none focus:border-[#FF6B1A] appearance-none font-barlow">
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#0F1218] p-5 md:p-6 rounded-2xl border border-white/5 mb-8">
                   <label className="flex items-start gap-4 cursor-pointer">
                    <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-[#FF6B1A]" />
                    <span className="text-base md:text-lg text-gray-300 leading-relaxed font-barlow">
                      Acepto los <a href="/terminos" target="_blank" className="text-[#FF6B1A] underline font-bold hover:text-[#FF2D7C]">Términos y Condiciones</a> y declaro estar apto físicamente.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 font-barlow">
                  <button onClick={() => setStep(1)} className="px-6 md:px-10 py-5 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 flex items-center gap-2 text-lg md:text-xl">
                    <ChevronLeft size={24} /> Atrás
                  </button>
                  <button onClick={async () => {
                      if (!acceptTerms) {
                        showAlert("Atención", "Debes aceptar los términos y condiciones.", "warning");
                        return;
                      }
                      if (validateStep2()) {
                        const exists = await checkUserExists();
                        if (!exists) setStep(3);
                      }
                    }} 
                    className="flex-1 bg-white text-black py-5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-lg md:text-xl shadow-lg"
                  >
                    Siguiente <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* --- PASO 3: PAGO (MEJORADO: VERIFICACIÓN FÁCIL) --- */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-bebas">Validación de Pago</h1>

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
                    <Landmark size={22} /> Transferencia
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
                    <div className="bg-[#FF6B1A]/20 p-4 rounded-full text-[#FF6B1A]"><Landmark size={32} /></div>
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
                      <span className="text-gray-300 font-bold text-2xl md:text-3xl">Total a pagar:</span>
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
                            {renderInputField("num_comprobante", "Núm. Comprobante (Últimos dígitos)", <FileText size={20}/>, "text", "Ej: 123456", undefined, "off", "numeric")}
                            <p className="text-xs text-gray-500 mt-2 font-barlow ml-1">Escribe el número de documento de la transferencia. Esto nos permite buscarlo en el banco sin abrir la imagen.</p>
                        </div>

                         {/* 2. Fecha (Ayuda a filtrar) */}
                        <div className="md:col-span-1">
                            {renderInputField("fecha_pago", "Fecha de Transferencia", <Calendar size={20}/>, "date")}
                        </div>

                        {/* 3. Titular de la Cuenta (Evita confusión de nombres) */}
                        <div className="md:col-span-2 bg-[#0F1218] p-5 rounded-xl border border-white/10">
                            <label className="text-base font-bold text-gray-300 uppercase tracking-wide mb-3 block font-barlow">¿La cuenta bancaria es tuya?</label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-[#FF6B1A] transition">
                                    <input type="radio" name="es_titular" value="si" checked={formData.es_titular === "si"} onChange={handleInput} className="accent-[#FF6B1A] w-5 h-5"/>
                                    <span className="font-barlow text-lg">Sí, es mía</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-[#FF6B1A] transition">
                                    <input type="radio" name="es_titular" value="no" checked={formData.es_titular === "no"} onChange={handleInput} className="accent-[#FF6B1A] w-5 h-5"/>
                                    <span className="font-barlow text-lg">No, prestada/familiar</span>
                                </label>
                            </div>

                            {/* Si NO es titular, pedimos el nombre real */}
                            {formData.es_titular === "no" && (
                                <div className="animate-in slide-in-from-top-2 fade-in">
                                    {renderInputField("nombre_titular_cuenta", "Nombre del Dueño de la Cuenta", <User size={20}/>, "text", "Ej: Juan Pérez (Mi papá)")}
                                    <p className="text-xs text-yellow-500 mt-2 font-barlow flex items-center gap-1"><Info size={12}/> Importante: Si no pones este nombre, no podremos encontrar tu pago en el banco.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 pt-6 border-t border-white/10">
                  <label className="text-base md:text-lg font-bold text-gray-300 mb-3 block uppercase tracking-wide font-barlow">Adjuntar Comprobante (Foto/PDF)</label>
                  {!previewName ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-[#FF6B1A] hover:bg-[#FF6B1A]/5 transition-all bg-[#0F1218]">
                      <UploadCloud className="w-12 h-12 md:w-16 md:h-16 mb-2 text-gray-400" />
                      <p className="text-sm md:text-lg text-gray-400 font-barlow">Toca aquí para subir tu archivo</p>
                      <input type="file" name="comprobante" accept="image/*,application/pdf" onChange={handleInput} className="hidden" />
                    </label>
                  ) : (
                     <div className="flex items-center justify-between bg-[#FF6B1A]/10 p-5 rounded-2xl border border-[#FF6B1A]/30">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <CheckCircle2 className="text-green-500 shrink-0" size={28} />
                        <span className="text-base md:text-xl text-gray-200 truncate font-bold">{previewName}</span>
                      </div>
                      <button onClick={clearFile} className="text-red-400 p-3 hover:bg-red-500/10 rounded-xl transition"><Trash2 size={24} /></button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 font-barlow">
                  <button onClick={() => setStep(2)} className="px-6 md:px-10 py-5 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 flex items-center gap-2 text-lg md:text-xl">
                     Atrás
                  </button>
                  <button onClick={submitForm} disabled={submitting} className="flex-1 bg-[#FF6B1A] hover:bg-[#E55104] text-white py-5 rounded-xl font-bold shadow-[0_0_20px_#FF6B1A50] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg md:text-xl">
                    {submitting ? "Finalizando..." : "Confirmar Inscripción"}
                  </button>
                </div>
              </div>
            )}

            {/* --- PASO 4: RESUMEN FINAL --- */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 fade-in py-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_#22c55e40]">
                  <CheckCircle2 size={64} />
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
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><CreditCard size={12} /> Cédula</p>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Mail size={12} /> Email</p>
                        <p className="text-gray-200 truncate text-lg" title={formData.email}>{formData.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Calendar size={12} /> Edad</p>
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
                       <FaWhatsapp size={26}/> Enviar comprobante por WhatsApp
                    </a>

                    <a
                      href="/verificar"
                      className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-barlow text-base md:text-lg mt-1"
                    >
                       <Search size={20}/> Ver estado de mi inscripción
                    </a>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white underline-offset-4 font-barlow text-base md:text-lg mt-2"
                    >
                        <RefreshCcw size={16} /> Registrar a otra persona
                    </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}