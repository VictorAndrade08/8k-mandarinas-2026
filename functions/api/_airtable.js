// Airtable — el CRM donde el equipo gestiona las inscripciones y valida pagos.
//
// El archivo empieza con guion bajo a propósito: Cloudflare Pages no enruta los
// _archivos, así que esto no es un endpoint, es una librería de los otros dos.
//
// El token vive en los secretos de Pages (wrangler pages secret put) y en
// .dev.vars para local. NUNCA en el código ni con prefijo NEXT_PUBLIC_: así fue
// como la clave anterior de Airtable acabó publicada dentro del JS que descarga
// cualquier visitante, y por eso se arrancó la primera integración.

const API = "https://api.airtable.com/v0";

const configurado = (env) =>
  Boolean(env.AIRTABLE_TOKEN && env.AIRTABLE_BASE_ID && env.AIRTABLE_TABLE_ID);

/**
 * Crea la inscripción en el CRM. Devuelve true/false y NUNCA lanza: si Airtable
 * está caído, la inscripción ya quedó guardada en D1 y el comprobante en R2 —
 * un corredor que pagó no puede recibir un error porque falló la copia al CRM.
 */
export async function crearEnAirtable(env, datos) {
  if (!configurado(env)) return false;

  // Los nombres de campo son EXACTAMENTE los de la tabla "CRM 10k". El género
  // se traduce porque el formulario dice Hombre/Mujer y el CRM
  // Masculino/Femenino; las categorías van tal cual las guarda D1 ("Élite Pro
  // 8K", "Máster"...) — typecast crea la opción en el selector si no existe.
  const GENERO = { Hombre: "Masculino", Mujer: "Femenino", Otro: "Otro" };

  const fields = {
    nombre: `${datos.nombres} ${datos.apellidos}`.trim(),
    cedula: datos.cedula,
    Etapa: "Inscrito Pago x Verificar",
    edad: Number(datos.edad) || null,
    celular: datos.telefono || "",
    categorias: datos.categoria,
    genero: GENERO[datos.genero] || datos.genero || "",
    email: datos.email,
    "Método registro": "Web",
    ciudad: datos.ciudad || "",
    "Numero Comprobante": datos.num_comprobante || "",
    Valor: Number(datos.precio) || 0,
    "Acepta Términos": true,
    // Lo que necesita quien valida el pago contra el extracto del banco, en un
    // solo vistazo y sin abrir la foto.
    Comentarios: [
      datos.metodo_pago ? `Método: ${datos.metodo_pago}` : "",
      datos.fecha_pago ? `Fecha del pago: ${datos.fecha_pago}` : "",
      datos.es_titular === "no"
        ? `PAGÓ OTRA PERSONA — titular de la cuenta: ${datos.nombre_titular_cuenta || "(no dijo)"}`
        : "Pagó desde su propia cuenta",
    ]
      .filter(Boolean)
      .join("\n"),
  };

  if (datos.comprobante_url) {
    fields["Comprobante URL"] = datos.comprobante_url;
    // Adjunto de verdad, no solo el enlace: Airtable descarga la URL y guarda su
    // propia copia, así el equipo ve la foto del pago dentro del CRM.
    fields["Comprobante"] = [{ url: datos.comprobante_url }];
  }

  try {
    const res = await fetch(
      `${API}/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * La Etapa del corredor en el CRM, o null si no está o Airtable no responde.
 *
 * Es lo que hace que /verificar por fin diga la verdad: el equipo cambia la
 * Etapa en Airtable al validar el pago, y el corredor lo ve aquí. Antes el
 * estado vivía solo en D1, donde nada lo actualizaba nunca — todo el mundo veía
 * "Pago por verificar" para siempre, hasta después de pagar y ser aprobado.
 */
export async function etapaDesdeAirtable(env, cedula) {
  if (!configurado(env)) return null;

  // La cédula llega ya reducida a dígitos por quien llama; aun así se vuelve a
  // limpiar aquí porque va interpolada en una fórmula de Airtable.
  const limpia = String(cedula).replace(/\D/g, "");
  if (!limpia) return null;

  try {
    const url =
      `${API}/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}` +
      `?maxRecords=1&fields%5B%5D=Etapa&filterByFormula=` +
      encodeURIComponent(`{cedula}="${limpia}"`);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.records?.[0]?.fields?.Etapa || null;
  } catch {
    return null;
  }
}
