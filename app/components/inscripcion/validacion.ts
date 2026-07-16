/**
 * Reglas de validación del formulario de inscripción.
 *
 * Funciones puras, sin React: se pueden probar sin montar nada, que es la razón
 * de que vivan aquí y no dentro del componente. Cada una devuelve `null` si el
 * valor es válido, o el mensaje de error que verá el corredor.
 *
 * Ojo: esto es la primera barrera, no la única. El servidor
 * (functions/api/inscribir.js) vuelve a validarlo todo, porque este archivo
 * corre en el navegador y ahí manda el usuario.
 */

import type { FormDataState } from "./tipos";

/**
 * La fecha de hoy en Ecuador (UTC-5), no en UTC.
 *
 * Con `new Date().toISOString()` a secas, entre las 19:00 y medianoche hora
 * local ya estamos en el día siguiente en UTC: el campo "fecha de pago" dejaba
 * elegir mañana durante cinco horas cada tarde, y la regla de "esa fecha todavía
 * no llega" no saltaba.
 */
export const hoyISO = () => {
  const ahora = new Date();
  const ecuador = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
  return ecuador.toISOString().slice(0, 10);
};

/** Celular Ecuador: 0991234567 -> 099 123 4567. El usuario no adivina los espacios. */
export const formatTelefono = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
};

type Regla = (valor: string) => string | null;

/**
 * Documento: se acepta cualquier número, sin exigir formato.
 *
 * Decisión del cliente. Antes se comprobaba el dígito verificador de la cédula
 * ecuatoriana, pero rechazaba a gente con documentos válidos que no encajan en
 * ese molde y frenaba inscripciones. Lo único que se pide es que haya algo
 * escrito.
 *
 * Lo que esto cuesta: la cédula es la clave anti-duplicados de la carrera, así
 * que un número inventado entra igual y ocupa un cupo. Quien valide los pagos lo
 * verá al cruzar el comprobante — es un control humano, no automático.
 */
export const reglas = (
  tipoDocumento: FormDataState["tipo_documento"]
): Partial<Record<keyof FormDataState, Regla>> => ({
  cedula: (v) => {
    const raw = (v || "").trim();
    if (!raw)
      return tipoDocumento === "pasaporte"
        ? "Escribe tu número de pasaporte."
        : "Escribe tu cédula.";
    return null;
  },
  nombres: (v) =>
    v.trim().length >= 2
      ? null
      : `Escribe tu nombre como está en tu ${
          tipoDocumento === "pasaporte" ? "pasaporte" : "cédula"
        }.`,
  apellidos: (v) => (v.trim().length >= 2 ? null : "Escribe tus apellidos."),
  ciudad: (v) => (v.trim().length >= 2 ? null : "¿Desde qué ciudad vienes?"),
  telefono: (v) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "Sin WhatsApp no podemos confirmarte el cupo.";
    if (d.length !== 10) return "El celular tiene 10 dígitos: 099 123 4567.";
    return null;
  },
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? null
      : "Revisa el correo, le falta algo.",
  edad: (v) => {
    if (!v.trim()) return "Escribe tu edad.";
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 8 || n > 99) return "Escribe una edad entre 8 y 99.";
    return null;
  },
  genero: (v) => (v ? null : "Elige una opción."),
  // Acepta alfanumérico: hay bancos que dan comprobantes tipo "TRX-A1B2", y
  // exigir 4 dígitos rechazaba pagos perfectamente válidos.
  num_comprobante: (v) =>
    v.trim().length >= 4
      ? null
      : "Escribe al menos los últimos 4 caracteres del comprobante.",
  fecha_pago: (v) => {
    if (!v) return "¿Qué día hiciste el pago?";
    if (v > hoyISO()) return "Esa fecha todavía no llega.";
    return null;
  },
});
