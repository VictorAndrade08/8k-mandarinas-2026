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
      datos.codigo ? `Código: ${datos.codigo}` : "",
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
 * Quita del nombre las etiquetas internas que el equipo escribe entre
 * paréntesis para organizar la mesa de entrega de kits: "(SORTEO – TARDE)",
 * "(INFLUENCER – PRIORIDAD)", "(AMIGO MANDARINA – TARDE)".
 *
 * Sirven puertas adentro y NO deben salir en el ticket del corredor: a nadie le
 * tiene que aparecer en pantalla que entró por sorteo o por cortesía, y
 * "PRIORIDAD" en el nombre de unos y no de otros es una conversación que no
 * queremos tener en la cola.
 *
 * Solo se recorta el paréntesis FINAL y solo si lleva una de esas palabras: hay
 * gente cuyo nombre lleva paréntesis por otros motivos y no se le toca.
 */
const ETIQUETAS_INTERNAS =
  /\s*\((?=[^)]*(?:SORTEO|INFLUENCER|AMIGO MANDARINA|PRIORIDAD|CORTES[ÍI]A|TARDE))[^)]*\)\s*$/i;

function limpiarNombre(nombre) {
  return (
    String(nombre || "Participante")
      .replace(ETIQUETAS_INTERNAS, "")
      .trim() || "Participante"
  );
}

/**
 * La inscripción del corredor tal y como está en el CRM, o null si no está o
 * Airtable no responde.
 *
 * El CRM es LA base de la consulta, no un adorno: el equipo también inscribe
 * gente a mano ahí —por WhatsApp, en OSCUS, por la agencia— y esa gente no
 * existe en D1. Si /verificar solo mirase D1, a esos corredores les diría "no
 * encontrado" con la inscripción pagada y validada.
 *
 * Devuelve el MISMO recorte mínimo que la consulta de D1: ni email, ni
 * teléfono, ni el enlace al comprobante. Basta una cédula para preguntar y las
 * cédulas son secuenciales — lo que se responda aquí es cosechable en masa.
 */
export async function consultarEnAirtable(env, cedula) {
  if (!configurado(env)) return null;

  // La cédula llega ya reducida a dígitos por quien llama; aun así se vuelve a
  // limpiar aquí porque va interpolada en una fórmula de Airtable.
  const limpia = String(cedula).replace(/\D/g, "");
  if (!limpia) return null;

  try {
    const campos = [
      "nombre",
      "ciudad",
      "edad",
      "genero",
      "categorias",
      "Valor",
      "Etapa",
    ]
      .map((c) => `fields%5B%5D=${encodeURIComponent(c)}`)
      .join("&");
    const url =
      `${API}/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}` +
      `?maxRecords=1&${campos}&filterByFormula=` +
      encodeURIComponent(`{cedula}="${limpia}"`);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.records?.[0]?.fields;
    if (!f) return null;

    return {
      nombre: limpiarNombre(f.nombre),
      cedula: limpia,
      ciudad: f.ciudad ?? null,
      edad: f.edad ?? null,
      genero: f.genero ?? null,
      categoria: f.categorias ?? null,
      valor: f.Valor ?? null,
      estado: f.Etapa || "pendiente",
    };
  } catch {
    return null;
  }
}
