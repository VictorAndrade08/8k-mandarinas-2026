// Datos de la carrera en un solo sitio.
//
// Están aquí porque duplicarlos ya salió caro: el precio llegó a decir $23 en el
// formulario, $30 en la landing y $20 en el reglamento, y el panel cuadraba los pagos
// del banco contra un valor que nadie cobraba. Si un dato de estos cambia, se cambia
// aquí y no hay que ir a buscarlo por seis archivos.

/**
 * Promo "8K JULIO" servido desde /public: recorrido por el valle, el Tungurahua y
 * Patate. El original venía en 1080p a 53 MB; esto es 720p a 8 MB, y aun así solo
 * se descarga cuando el visitante pulsa play.
 */
export const VIDEO_SRC = "/video/8k-promo.mp4";
export const VIDEO_POSTER = "/video/8k-promo-poster.webp";

/**
 * Recorte del promo para el fondo del contador: 22s en bucle, sin audio y a menor
 * bitrate porque va detrás de un degradado y ruido. 2,4 MB en vez de 8,4.
 * Arranca en el segundo 8 a propósito: los primeros segundos del promo rotulan
 * "27 de agosto" y la carrera es el 29.
 */
export const VIDEO_FONDO_SRC = "/video/8k-fondo.mp4";
export const VIDEO_FONDO_POSTER = "/video/8k-fondo-poster.webp";

/** Sábado 29 de agosto de 2026, 08:00 en Ecuador (GMT-5). Salida en Patate Gardens. */
export const FECHA_CARRERA = "2026-08-29T08:00:00-05:00";

/** Preventa. Tercera edad (65+) y discapacidad ya llevan su descuento aplicado. */
export const PRECIO_PREVENTA = 20;
export const PRECIO_DESCUENTO = 18;

/** WhatsApp de soporte al corredor. */
export const WHATSAPP_SOPORTE = "593995102378";
