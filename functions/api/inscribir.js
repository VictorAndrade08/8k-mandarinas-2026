// Cloudflare Pages Function — POST /api/inscribir
// Guarda la inscripción en D1 (env.DB) y el comprobante en R2 (env.BUCKET).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

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
    if (!env.DB) return json({ status: "error", message: "D1 no configurado (binding DB)" }, 500);

    const form = await request.formData();
    const get = (k) => (form.get(k) ?? "").toString().trim();

    const cedula = get("cedula");
    if (!cedula) return json({ status: "error", message: "Falta la cédula." }, 400);

    // Evitar duplicados (misma cédula ya inscrita)
    const existing = await env.DB.prepare(
      "SELECT nombres, apellidos FROM inscripciones WHERE cedula = ? LIMIT 1"
    ).bind(cedula).first();
    if (existing) {
      return json({
        status: "error",
        message: `La cédula ${cedula} ya tiene una inscripción registrada.`,
      }, 409);
    }

    // Subir comprobante a R2 (bucket privado)
    let comprobante_url = "";
    const file = form.get("comprobante");
    if (file && typeof file === "object" && file.size > 0) {
      if (!env.BUCKET) return json({ status: "error", message: "R2 no configurado (binding BUCKET)" }, 500);
      const ext = (file.name?.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const key = `comprobantes/${cedula}-${Date.now()}.${ext}`;
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
      const origin = new URL(request.url).origin;
      comprobante_url = `${origin}/api/comprobante/${key}`;
    }

    await env.DB.prepare(
      `INSERT INTO inscripciones
        (cedula, nombres, apellidos, ciudad, email, telefono, edad, genero,
         categoria, precio, metodo_pago, num_comprobante, fecha_pago,
         es_titular, nombre_titular, comprobante_url, estado, creado_en)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'pendiente', datetime('now'))`
    ).bind(
      cedula,
      get("nombres"),
      get("apellidos"),
      get("ciudad"),
      get("email"),
      get("telefono"),
      parseInt(get("edad"), 10) || null,
      get("genero"),
      get("categoria"),
      parseFloat(get("precio")) || 0,
      get("metodo_pago"),
      get("num_comprobante"),
      get("fecha_pago"),
      get("es_titular"),
      get("nombre_titular_cuenta"),
      comprobante_url
    ).run();

    return json({ status: "success", file_url: comprobante_url });
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("UNIQUE")) {
      return json({ status: "error", message: "Esa cédula ya está registrada." }, 409);
    }
    return json({ status: "error", message: "No se pudo guardar: " + msg }, 500);
  }
}
