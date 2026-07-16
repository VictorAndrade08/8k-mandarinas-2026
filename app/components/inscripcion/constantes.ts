/**
 * Datos fijos del formulario de inscripción.
 *
 * Están aquí y no dentro del componente para que se puedan leer de un vistazo:
 * los precios y la cuenta del banco son lo que más se consulta y lo que más
 * duele si se desincroniza.
 */

/** Clave del progreso en localStorage (no perder los datos al refrescar). */
export const STORAGE_KEY = "inscripcion_8k_progreso";

/**
 * Cuenta para las transferencias.
 *
 * Se muestran con botón de copiar porque nadie transcribe diez dígitos a mano
 * sin equivocarse, y un dígito mal es un pago que alguien tiene que rastrear.
 *
 * Si esto cambia, se cambia aquí: antes el número y el RUC estaban escritos a
 * mano dentro del JSX, repetidos en el texto visible y en el botón de copiar —
 * dos sitios donde uno se actualiza y el otro no.
 */
export const BANCO = {
  entidad: "Banco Pichincha",
  tipo: "Corriente",
  numero: "3148516004",
  titular: "Diego Mantilla",
  ruc: "1802796829-001",
} as const;
