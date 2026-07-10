// Cloudflare Pages Function — GET /api/verificar-cedula?cedula=XXXX
// Responde si la cédula ya está inscrita (para bloquear duplicados en el form).

const CORS = { "Access-Control-Allow-Origin": "*" };

export async function onRequestGet({ request, env }) {
  const cedula = new URL(request.url).searchParams.get("cedula")?.trim() || "";
  if (!cedula || !env.DB) {
    return Response.json({ exists: false }, { headers: CORS });
  }
  const row = await env.DB.prepare(
    "SELECT nombres, apellidos FROM inscripciones WHERE cedula = ? LIMIT 1"
  ).bind(cedula).first();

  return Response.json(
    row
      ? { exists: true, datos: { nombre: `${row.nombres} ${row.apellidos}`.trim() } }
      : { exists: false },
    { headers: CORS }
  );
}
