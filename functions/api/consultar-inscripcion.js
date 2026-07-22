// Cloudflare Pages Function — GET /api/consultar-inscripcion?cedula=XXXX
// Devuelve la inscripción real desde D1 para la página /verificar.
//
// Existe porque /verificar leía de Airtable con una API key con prefijo
// NEXT_PUBLIC_, que en un build estático acaba en texto plano dentro del JS que
// descarga cualquiera. Aquí la base solo se toca desde el servidor.
//
// Devuelve deliberadamente MENOS de lo que guarda la tabla: ni email, ni
// teléfono, ni el enlace al comprobante. Basta una cédula para preguntar, y las
// cédulas ecuatorianas son secuenciales — lo que se responda aquí es lo que se
// puede cosechar en masa. Con el nombre y el estado el corredor ya confirma que
// su pago entró, que es para lo que existe la página.

import { consultarEnAirtable } from "./_airtable.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      // Sin caché: un pago recién aprobado tiene que verse al instante, y el
      // resultado es distinto para cada cédula.
      "Cache-Control": "no-store",
      ...CORS,
    },
  });

export function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) {
      // Sin base no se inventa una respuesta: se dice que el servicio no está.
      // El fallback "de demo" que tenía esta página enseñaba un corredor
      // ficticio como APROBADO a cualquiera que escribiera un número.
      return json(
        { status: "error", message: "Servicio no disponible temporalmente." },
        503
      );
    }

    const cedula = (
      new URL(request.url).searchParams.get("cedula") || ""
    ).replace(/\D/g, "");

    if (cedula.length < 6 || cedula.length > 15) {
      return json({ status: "error", message: "Cédula no válida." }, 400);
    }

    // EL CRM ES LA BASE DE LA CONSULTA. Ahí está todo el mundo: los que se
    // inscriben por la web (se copian al momento) y los que el equipo mete a
    // mano por WhatsApp, OSCUS o la agencia — que en D1 no existen. D1 queda de
    // respaldo por si Airtable no responde o la cédula aún no está copiada.
    const delCRM = await consultarEnAirtable(env, cedula);
    if (delCRM) return json({ status: "found", datos: delCRM });

    const fila = await env.DB.prepare(
      `SELECT nombres, apellidos, ciudad, edad, genero, categoria, precio, estado
         FROM inscripciones
        WHERE cedula = ?
        LIMIT 1`
    )
      .bind(cedula)
      .first();

    if (!fila) return json({ status: "not_found" });

    return json({
      status: "found",
      datos: {
        nombre: `${fila.nombres ?? ""} ${fila.apellidos ?? ""}`.trim(),
        cedula,
        ciudad: fila.ciudad ?? null,
        edad: fila.edad ?? null,
        genero: fila.genero ?? null,
        categoria: fila.categoria ?? null,
        valor: fila.precio ?? null,
        estado: fila.estado ?? "pendiente",
      },
    });
  } catch (e) {
    return json(
      {
        status: "error",
        message: "No se pudo consultar: " + String(e?.message || e),
      },
      500
    );
  }
}
