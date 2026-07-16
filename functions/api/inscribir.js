// Cloudflare Pages Function — POST /api/inscribir
// Guarda la inscripción en D1 (env.DB) y el comprobante en R2 (env.BUCKET).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

// Catálogo autoritativo. El precio se deriva AQUÍ y se ignora el que manda el
// navegador: antes llegaba en el formulario y se insertaba con un parseFloat a
// ciegas, y encima el formulario lo restauraba desde localStorage. Cualquiera
// con las DevTools abiertas podía inscribirse por $0.
//
// Si cambian los precios, se cambian en dos sitios y tienen que cuadrar: aquí y
// en app/lib/carrera.ts (que es lo que ve el corredor). No se pueden importar
// unos de otros — esto corre en el worker y aquello se compila en el cliente.
const CATEGORIAS = {
  "Élite Pro 8K": { precio: 20, edadMin: 8, edadMax: 39 },
  Máster: { precio: 20, edadMin: 40, edadMax: 64 },
  Leyenda: { precio: 18, edadMin: 65, edadMax: 99 },
  Discapacidad: { precio: 18, edadMin: 8, edadMax: 99 },
};

const TIPOS_COMPROBANTE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];
const MAX_COMPROBANTE = 10 * 1024 * 1024; // 10 MB, el mismo límite que promete el formulario

// La cédula ecuatoriana lleva dígito verificador (módulo 10). Validarlo evita
// que entren números inventados en el campo que justamente usamos como clave
// anti-duplicados.
function cedulaEcuatorianaValida(c) {
  if (!/^\d{10}$/.test(c)) return false;
  const provincia = parseInt(c.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  if (parseInt(c[2], 10) > 5) return false;

  const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let v = parseInt(c[i], 10) * coef[i];
    if (v > 9) v -= 9;
    suma += v;
  }
  const verificador = (10 - (suma % 10)) % 10;
  return verificador === parseInt(c[9], 10);
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

export function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB)
      return json(
        { status: "error", message: "D1 no configurado (binding DB)" },
        500
      );

    const form = await request.formData();
    const get = (k) => (form.get(k) ?? "").toString().trim();

    const cedula = get("cedula");
    if (!cedula)
      return json({ status: "error", message: "Falta la cédula." }, 400);

    // ── Validación de entrada ──────────────────────────────────────────────
    // El formulario ya valida todo esto, pero el formulario es opcional: este
    // endpoint acepta CORS "*", así que cualquiera puede postear directamente
    // sin pasar por él.
    const tipoDocumento = get("tipo_documento") || "cedula";
    if (tipoDocumento === "cedula" && !cedulaEcuatorianaValida(cedula)) {
      return json({ status: "error", message: "La cédula no es válida." }, 400);
    }
    if (tipoDocumento === "pasaporte" && cedula.length < 5) {
      return json(
        { status: "error", message: "El pasaporte no es válido." },
        400
      );
    }

    const nombres = get("nombres");
    const apellidos = get("apellidos");
    if (nombres.length < 2 || apellidos.length < 2) {
      return json(
        { status: "error", message: "Faltan nombres o apellidos." },
        400
      );
    }

    const email = get("email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return json({ status: "error", message: "El correo no es válido." }, 400);
    }

    const edad = parseInt(get("edad"), 10);
    if (!Number.isInteger(edad) || edad < 8 || edad > 99) {
      return json({ status: "error", message: "La edad no es válida." }, 400);
    }

    // El precio sale del catálogo, nunca del formulario.
    const categoria = get("categoria");
    const cat = CATEGORIAS[categoria];
    if (!cat) {
      return json({ status: "error", message: "Categoría no válida." }, 400);
    }
    if (edad < cat.edadMin || edad > cat.edadMax) {
      return json(
        {
          status: "error",
          message: `La edad ${edad} no corresponde a la categoría ${categoria}.`,
        },
        400
      );
    }
    const precio = cat.precio;

    // Evitar duplicados (misma cédula ya inscrita)
    const existing = await env.DB.prepare(
      "SELECT nombres, apellidos FROM inscripciones WHERE cedula = ? LIMIT 1"
    )
      .bind(cedula)
      .first();
    if (existing) {
      return json(
        {
          status: "error",
          message: `La cédula ${cedula} ya tiene una inscripción registrada.`,
        },
        409
      );
    }

    // Subir comprobante a R2 (bucket privado)
    let comprobante_url = "";
    let key = "";
    const file = form.get("comprobante");
    if (file && typeof file === "object" && file.size > 0) {
      if (!env.BUCKET)
        return json(
          { status: "error", message: "R2 no configurado (binding BUCKET)" },
          500
        );

      // El formulario ya limita tipo y tamaño, pero eso vive en el navegador y
      // aquí entra cualquiera: sin esto se puede llenar el bucket con lo que sea.
      if (!TIPOS_COMPROBANTE.includes(file.type)) {
        return json(
          {
            status: "error",
            message: "El comprobante debe ser una imagen o un PDF.",
          },
          400
        );
      }
      if (file.size > MAX_COMPROBANTE) {
        return json(
          { status: "error", message: "El comprobante supera los 10 MB." },
          400
        );
      }

      const ext = (file.name?.split(".").pop() || "bin")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      // Nombre aleatorio, no "<cédula>-<timestamp>": esa clave se adivina — con
      // la cédula de alguien solo falta el instante en que pagó — y el endpoint
      // que sirve los comprobantes no pide autenticación. Un UUID no se rifa.
      key = `comprobantes/${crypto.randomUUID()}.${ext}`;
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
      const origin = new URL(request.url).origin;
      comprobante_url = `${origin}/api/comprobante/${key}`;
    }

    try {
      await env.DB.prepare(
        `INSERT INTO inscripciones
          (cedula, nombres, apellidos, ciudad, email, telefono, edad, genero,
           categoria, precio, metodo_pago, num_comprobante, fecha_pago,
           es_titular, nombre_titular, comprobante_url, estado, creado_en)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'pendiente', datetime('now'))`
      )
        .bind(
          cedula,
          nombres,
          apellidos,
          get("ciudad"),
          email,
          get("telefono"),
          edad,
          get("genero"),
          categoria,
          precio, // Del catálogo de arriba, NO de lo que mandó el navegador.
          get("metodo_pago"),
          get("num_comprobante"),
          get("fecha_pago"),
          get("es_titular"),
          get("nombre_titular_cuenta"),
          comprobante_url
        )
        .run();
    } catch (e) {
      // El archivo ya está en R2 y la fila que lo referencia no existe: si no lo
      // borramos aquí, queda un huérfano que nadie va a encontrar nunca.
      if (key && env.BUCKET) {
        try {
          await env.BUCKET.delete(key);
        } catch {
          // Si tampoco se puede borrar, el error que importa es el del INSERT.
        }
      }
      throw e;
    }

    return json({ status: "success", file_url: comprobante_url });
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("UNIQUE")) {
      return json(
        { status: "error", message: "Esa cédula ya está registrada." },
        409
      );
    }
    return json(
      { status: "error", message: "No se pudo guardar: " + msg },
      500
    );
  }
}
