// Cloudflare Pages Function — GET /api/comprobante/<key>
// Sirve el comprobante desde R2 (el bucket sigue privado; solo con este link se ve).

export async function onRequestGet({ params, env }) {
  if (!env.BUCKET) return new Response("R2 no configurado", { status: 500 });

  const parts = params.path;
  const key = Array.isArray(parts) ? parts.join("/") : String(parts || "");
  if (!key) return new Response("Falta el archivo", { status: 400 });

  const obj = await env.BUCKET.get(key);
  if (!obj) return new Response("Comprobante no encontrado", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("Cache-Control", "private, max-age=3600");
  return new Response(obj.body, { headers });
}
