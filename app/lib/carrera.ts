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
export const VIDEO_SRC = "/video/8k-promo-v2.mp4";
export const VIDEO_POSTER = "/video/8k-promo-v2-poster.webp";

/**
 * Recorte del promo para el fondo del contador: 22s en bucle, sin audio y a menor
 * bitrate porque va detrás de un degradado y ruido. 2,4 MB en vez de 8,4.
 * Arranca en el segundo 8 a propósito: los primeros segundos del promo rotulan
 * "27 de agosto" y la carrera es el 29.
 */
export const VIDEO_FONDO_SRC = "/video/8k-hero.mp4";
export const VIDEO_FONDO_POSTER = "/video/8k-hero-poster.webp";

/** Sábado 29 de agosto de 2026, 08:00 en Ecuador (GMT-5). Salida en Patate Gardens. */
export const FECHA_CARRERA = "2026-08-29T08:00:00-05:00";

/** Preventa. Tercera edad (65+) y discapacidad ya llevan su descuento aplicado. */
export const PRECIO_PREVENTA = 20;
export const PRECIO_DESCUENTO = 18;

/**
 * Inscritos aproximados que enseña el hero como prueba social. Es el total
 * REAL que maneja la organización: los pagos online (Airtable/D1) MÁS los que
 * se inscriben en efectivo y aún no se han pasado al sistema. Se actualiza a
 * mano aquí conforme sube. Redondea hacia abajo para no exagerar de más.
 */
export const INSCRITOS_APROX = 300;

/** WhatsApp de soporte al corredor. */
export const WHATSAPP_SOPORTE = "593995102378";

/**
 * Premios económicos por categoría, en dólares. Solo se enseñan en el artículo
 * 13 del reglamento.
 *
 * Están aquí y no dentro de app/reglamento/page.tsx por lo mismo que el resto de
 * este archivo: los datos de la carrera se escriben en un solo sitio. El precio
 * de inscripción llegó a decir tres cosas distintas en tres páginas por tenerlo
 * repartido.
 */
export const PREMIOS = [
  { categoria: "Élite Pro 8K", primero: 120, segundo: 100, tercero: 80 },
  { categoria: "Máster", primero: 80, segundo: 60, tercero: 40 },
  { categoria: "Leyenda", primero: 80, segundo: 60, tercero: 40 },
  { categoria: "Discapacidad", primero: 80, segundo: 60, tercero: 40 },
] as const;

/**
 * Las cuatro categorías con sus edades y precios. Es la tabla canónica para
 * las páginas informativas (/informacion y quien venga después).
 *
 * OJO: el formulario de inscripción (FormInscripcion.tsx) y el catálogo del
 * servidor (functions/api/inscribir.js) llevan su propia copia de estos datos
 * — el del servidor A PROPÓSITO, porque no puede importar código del cliente.
 * Si cambia una edad o un precio, hay que cuadrar los tres sitios.
 */
export const CATEGORIAS = [
  { nombre: "Élite Pro 8K", edades: "Hasta 39 años", precio: PRECIO_PREVENTA },
  { nombre: "Máster", edades: "De 40 a 64 años", precio: PRECIO_PREVENTA },
  {
    nombre: "Leyenda",
    edades: "65 años en adelante",
    precio: PRECIO_DESCUENTO,
  },
  {
    nombre: "Discapacidad",
    edades: "Sin límite de edad",
    precio: PRECIO_DESCUENTO,
  },
] as const;
