/**
 * Puerta de entrada de la funcionalidad de inscripción.
 *
 * Todo lo que el resto del sitio necesita de aquí sale por este archivo. Si
 * alguna vez te ves importando un archivo interno de esta carpeta desde fuera,
 * es la señal de que esa pieza no pertenece aquí dentro — o de que le falta
 * salir por esta puerta.
 *
 * Dentro de la carpeta sí se importan entre sí por ruta directa: el barrel es
 * para quien viene de fuera, y usarlo hacia dentro crea ciclos.
 */

export { CustomModal } from "./CustomModal";
export { ResumeModal } from "./ResumeModal";
export { SoporteReal } from "./SoporteReal";
export { PasoCategoria } from "./PasoCategoria";
export { CampoTexto } from "./CampoTexto";
export { useProgresoGuardado } from "./useProgresoGuardado";
export { useNavegacionPasos } from "./useNavegacionPasos";
export { enviarInscripcion } from "./enviarInscripcion";
export { PasoDatos } from "./PasoDatos";
export { PasoPago } from "./PasoPago";
export { PasoFinal } from "./PasoFinal";
export { FormularioProvider, useFormulario } from "./contexto";
export type { Formulario } from "./contexto";

export {
  reglas,
  formatTelefono,
  hoyISO,
  CAMPOS_PASO_2,
  enfocarPrimerError,
  erroresPaso2,
  erroresPaso3,
} from "./validacion";
export { STORAGE_KEY, BANCO } from "./constantes";

export type {
  FormDataState,
  ProgresoGuardado,
  RespuestaInscribir,
  Category,
  MetodoPago,
} from "./tipos";
