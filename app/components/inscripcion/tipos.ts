/**
 * Tipos del formulario de inscripción.
 *
 * Viven fuera del componente para que se puedan leer sin bajar por 2.000 líneas
 * de JSX, y para que las piezas del formulario los compartan sin importarse
 * entre ellas.
 */

/** Lo que promete devolver functions/api/inscribir.js */
export interface RespuestaInscribir {
  status?: "success" | "error";
  message?: string;
  file_url?: string;
  /** Código de inscripción legible (MAND-XXXXXX) que genera el servidor. */
  codigo?: string;
}

export interface FormDataState {
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
  // --- Campos anti-fraude, para que validar el pago no sea una investigación ---
  es_titular: string; // "si" o "no"
  nombre_titular_cuenta: string; // Nombre de quien pagó realmente
  num_comprobante: string; // El ID de la transacción
  fecha_pago: string;
  comprobante: File | null;
}

/**
 * El progreso guardado en localStorage.
 *
 * Todo opcional a propósito: lo escribió una versión anterior del formulario, o
 * el propio usuario a mano. Nada de lo que salga de aquí puede darse por bueno
 * sin comprobarlo — de hecho `selectedPrice` no se usa para cobrar justamente
 * por esto; el precio lo decide el servidor.
 */
export interface ProgresoGuardado {
  step?: number;
  selectedCategory?: string;
  selectedPrice?: number;
  acceptTerms?: boolean;
  metodoPago?: string;
  formData?: Partial<FormDataState>;
}

export interface Category {
  name: string;
  price: number;
  desc: string;
  icon: React.ReactNode;
}

/**
 * Cómo dice el corredor que pagó. Es un tipo cerrado y no un string: si mañana
 * alguien escribe "transferencía" con tilde en un sitio, el paso 3 deja de
 * pintar el bloque del banco y nadie se entera hasta que llegan las quejas.
 */
export type MetodoPago = "transferencia" | "qr";
