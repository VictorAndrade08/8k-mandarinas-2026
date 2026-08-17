import type { FormDataState, MetodoPago, RespuestaInscribir } from "./tipos";

/**
 * Manda la inscripción a functions/api/inscribir.js.
 *
 * Vive aparte y sin nada de React a propósito: es el único punto del sitio donde
 * salen los datos del corredor y la foto de su comprobante hacia el servidor.
 * Estaba en medio de un componente de 900 líneas, y el día que un pago falle
 * hay que poder leer esto entero sin nada alrededor.
 *
 * No decide nada de la interfaz: devuelve qué pasó y quien llama se encarga de
 * enseñarlo.
 */

/** Cuánto se espera antes de cortar. Ver el porqué en el comentario de abajo. */
const TIMEOUT_MS = 45000;

export type ResultadoEnvio =
  | { ok: true; urlComprobante: string; codigo: string }
  | { ok: false; titulo: string; mensaje: string };

export async function enviarInscripcion({
  formData,
  categoria,
  precio,
  metodoPago,
}: {
  formData: FormDataState;
  categoria: string;
  precio: number;
  metodoPago: MetodoPago;
}): Promise<ResultadoEnvio> {
  const body = new FormData();
  body.append("categoria", categoria);
  // El precio se manda pero el servidor lo IGNORA: lo deriva de su propio
  // catálogo. Va aquí solo para que quede en el registro lo que vio el corredor.
  body.append("precio", precio.toString());
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
    // Timeout duro: sin esto, si la conexión del móvil se cae o el servidor
    // tarda subiendo el comprobante, el fetch se queda PENDIENTE para siempre y
    // el spinner "Procesando..." gira sin fin. Con AbortController se corta a los
    // 45s y se cae al catch con un mensaje claro. Si por un caso raro el
    // servidor sí llegó a guardar, al reintentar salta el aviso de "cédula ya
    // registrada", que le confirma al corredor que quedó dentro.
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), TIMEOUT_MS);
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
    // La respuesta del servidor es un dato externo: se tipa como el contrato que
    // esperamos, no como `any`, para que el compilador avise si alguien lee un
    // campo que la API no promete. Y se parsea a mano porque un 502 de Cloudflare
    // devuelve HTML, y res.json() reventaría con un error que no dice nada.
    let json: RespuestaInscribir | null = null;
    try {
      json = rawText ? (JSON.parse(rawText) as RespuestaInscribir) : null;
    } catch {
      json = null;
    }

    if (!res.ok || !json || json.status !== "success") {
      return {
        ok: false,
        titulo: "Error",
        mensaje:
          json?.message ||
          "No se pudo guardar la inscripción. Intenta de nuevo.",
      };
    }

    return {
      ok: true,
      urlComprobante: json.file_url ? String(json.file_url) : "",
      codigo: json.codigo ? String(json.codigo) : "",
    };
  } catch (e) {
    const seAgotoElTiempo =
      e instanceof DOMException && e.name === "AbortError";
    return {
      ok: false,
      titulo: "Error de conexión",
      // "No se cobró nada" en los dos casos, y a propósito: el cobro pasa por el
      // banco, fuera del sitio. Quien ve este mensaje acaba de subir un
      // comprobante y lo primero que piensa es si le han quitado el dinero.
      mensaje: seAgotoElTiempo
        ? "La conexión tardó demasiado y se canceló. No se cobró nada: revisa tu internet e inténtalo otra vez."
        : "Revisa tu internet e inténtalo de nuevo. No se cobró nada.",
    };
  }
}
