# Notas Mapa del Proyecto — 8K Ruta de las Mandarinas 2026

> Guardado: 26 de agosto de 2026. Es la nota de "entender todo": qué es este
> proyecto, cómo está hecho, dónde vive cada dato y qué reglas no obvias hay que
> respetar para no romperlo. Las notas 08–21 cuentan decisiones concretas; esta
> es el mapa que las sostiene.

## 1. Qué es

Sitio oficial de la carrera **8K Ruta de las Mandarinas 2026**.

- **Sábado 29 de agosto de 2026**, salida 08h00 desde **Patate Gardens**.
- Valle de Patate, Tungurahua – Ecuador. 8 km. Meta en el Estadio Municipal.
- Preventa **$20** ($18 para Leyenda y Discapacidad), kit incluido.
- Dominio en vivo: **8krutadelasmandarinas.com** (Cloudflare Pages).
- Historia del repo: primer commit 09-jun-2026, ~180 commits, todo en `main`.

No es solo una landing: **cobra inscripciones de verdad**. Hay dinero, cédulas y
comprobantes de banco de por medio, y por eso casi todas las decisiones raras
del código tienen detrás un incidente real.

## 2. Stack y por qué

- **Next.js 16 (App Router) con `output: "export"`** → el sitio se compila a
  HTML plano en `out/`. No hay servidor de Next en producción.
- **React 19 + TypeScript 6 (`strict` + `noUncheckedIndexedAccess`)**.
- **Tailwind 4** (`app/globals.css`, tokens de marca al inicio del archivo).
- **Cloudflare Pages** sirve `out/` y ejecuta las **Pages Functions** de
  `functions/` sobre Web APIs puras (nada de Node).
- **D1** (SQLite de Cloudflare) para las inscripciones web y **R2** para los
  comprobantes; **Airtable** como CRM del equipo.
- Dependencias de runtime: solo `@phosphor-icons/react` y `sonner`. Nada más.

Ojo: **el README está desactualizado** — habla de Firebase 12, `lucide-react`,
`react-icons`, `react-qr-code` y de una página `/checkadmin`. Nada de eso existe
ya (Firebase se sacó; el `nodejs_compat` de `wrangler.toml` es su último resto).

## 3. Arquitectura — dónde vive cada cosa

```
Navegador
   │
   ├── HTML/CSS/imágenes  ──────────►  out/ servido por Cloudflare Pages
   │
   └── /api/*             ──────────►  functions/api/*.js (Pages Functions)
                                          │
                     ┌────────────────────┼─────────────────────┐
                     ▼                    ▼                     ▼
              D1 "inscripciones"    R2 "comprobantes-8k"   Airtable "CRM 10k"
              (env.DB)              (env.BUCKET)           (fetch + token)
              anti-duplicados       foto del pago          verdad del ESTADO
```

Los cuatro endpoints (`functions/api/`):

| Endpoint                         | Qué hace                                                              |
| -------------------------------- | --------------------------------------------------------------------- |
| `POST /api/inscribir`            | Valida, guarda en D1, sube el comprobante a R2 y copia a Airtable.    |
| `GET /api/verificar-cedula`      | ¿Esta cédula ya está inscrita? (bloquea duplicados en el formulario). |
| `GET /api/consultar-inscripcion` | Lo que lee `/verificar`: **primero Airtable**, D1 de respaldo.        |
| `GET /api/comprobante/<key>`     | Sirve el archivo desde el bucket R2, que es privado.                  |
| `functions/api/_airtable.js`     | Librería, **no** endpoint (Pages no enruta los `_archivos`).          |

**Reparto de responsabilidades, que es lo que más confunde:**

- **D1 es la fuente de verdad de "¿ya se inscribió esta cédula?"** — solo tiene
  a quien pasó por el formulario web.
- **Airtable es la fuente de verdad del ESTADO del pago.** El equipo también
  inscribe a mano (WhatsApp, OSCUS, agencia) y esa gente **no existe en D1**. Si
  `/verificar` solo mirase D1, a un corredor pagado y validado le diría "no
  encontrado".
- **R2 guarda el comprobante** con nombre aleatorio (UUID), no `cédula-fecha`:
  esa clave se adivinaba y el endpoint que la sirve no pide autenticación.

## 4. El flujo de la inscripción, de punta a punta

1. `/inscripcion` → `app/components/FormInscripcion.tsx` (903 líneas, cliente) +
   las piezas de `app/components/inscripcion/`. Cuatro pasos: categoría → datos
   → pago → final. El progreso se guarda en `localStorage`
   (`useProgresoGuardado`, clave `inscripcion_8k_progreso`) y hay cuenta atrás
   de sesión (`useCuentaAtras`).
2. Antes de enviar consulta `/api/verificar-cedula` para no duplicar.
3. `enviarInscripcion.ts` — **el único punto del sitio por donde salen los datos
   del corredor**. Vive aparte, sin React, con timeout duro de 45 s
   (`AbortController`) para que el spinner no gire eternamente.
4. `POST /api/inscribir` revalida TODO en el servidor (CORS es `*`: cualquiera
   puede postear sin pasar por el formulario), sube el comprobante, inserta en
   D1 con `estado = 'pendiente'` y genera un código legible `MAND-XXXXXX`.
5. Copia a Airtable con `Etapa = "Inscrito Pago x Verificar"`. **Si Airtable
   falla, la inscripción sigue siendo válida** — solo se registra en el log.
6. El equipo cuadra el pago contra el extracto del banco y mueve la `Etapa`.

**El precio SIEMPRE lo decide el servidor.** El formulario lo manda pero
`inscribir.js` lo ignora y lo saca de su propio catálogo: antes llegaba del
navegador y se insertaba con un `parseFloat` a ciegas, restaurado desde
`localStorage` — con las DevTools abiertas uno se inscribía por $0.

**El documento no se valida por formato**, ni en cliente ni en servidor, a
propósito: comprobar el dígito verificador de la cédula ecuatoriana frenaba
inscripciones legítimas. Cliente y servidor tienen que seguir igual de laxos.

## 5. El flujo de la verificación (`/verificar`)

El corredor escribe su cédula → `GET /api/consultar-inscripcion?cedula=…` →
Airtable (o D1 de respaldo) → se pinta el ticket con nombre, categoría, ciudad,
edad, género y **Estado**.

La respuesta es deliberadamente **más pobre** que la tabla: sin email, sin
teléfono, sin enlace al comprobante. Basta una cédula para preguntar y las
cédulas ecuatorianas son secuenciales — lo que se conteste ahí es cosechable en
masa.

**Estados.** El campo real es `Etapa` (singleSelect de Airtable). El mapa
`ETAPA` de `app/verificar/page.tsx` los traduce a lo que ve el corredor:

| `Etapa` en el CRM                                                                   | Se muestra                 | Color              |
| ----------------------------------------------------------------------------------- | -------------------------- | ------------------ |
| `Inscrito Pago x Verificar`                                                         | Pago por verificar         | amarillo           |
| `Inscrito`                                                                          | Pago por verificar         | amarillo           |
| `Inscrito Pago Verificado`                                                          | **Inscripción confirmada** | verde              |
| `Inscripción Finalizada`                                                            | Inscripción confirmada     | verde              |
| `pendiente` / `aprobado` / `rechazado` (los de D1)                                  | ídem                       | —                  |
| `Pago Solicitado`, `Recordatorio`, `Ultimo dia`, `Ultima semana`, `Entrega de kits` | **tal cual, sin traducir** | por palabra suelta |

Una etapa que no esté en el mapa se enseña con el nombre crudo del CRM. Es
intencional (mejor eso que un "En proceso" que no dice nada), pero significa que
el corredor lee jerga interna: hoy, 33 personas en `Pago Solicitado` ven
literalmente eso.

## 6. Mapa de páginas

| Ruta           | Qué es                                                                                                                                | ¿JS?   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `/`            | Home. Hero con contador, franja de datos, flyer, cómo inscribirse, categorías, mapa, vídeo, galería, sponsors, info, reglamento, FAQ. | **No** |
| `/inscripcion` | El formulario de 4 pasos. Sin header ni footer (trae su propio marco).                                                                | Sí     |
| `/verificar`   | Consulta del estado + ticket digital.                                                                                                 | Sí     |
| `/ganadores`   | Actas de la edición anterior + botón de imprimir/PDF.                                                                                 | Sí     |
| `/ruta`        | El recorrido tramo por tramo (fuente: oficio N°0084 sellado por el GAD).                                                              | No     |
| `/informacion` | Fecha, hora, lugar, categorías, kit, premios, cierre de vías.                                                                         | No     |
| `/reglamento`  | Reglamento oficial (los premios están en el artículo 13).                                                                             | No     |
| `/terminos`    | Política de privacidad.                                                                                                               | No     |
| `/galeria`     | 24 fotos reales de la edición anterior, mosaico CSS.                                                                                  | No     |
| `/carrera`     | La traducción del diseño Ruvent (nota 21). **No es el home**, convive aparte.                                                         | No     |

`SiteChrome.tsx` decide header/footer por ruta; `BottomNav` es la barra móvil.

## 7. Dónde están los datos (y las tres copias del precio)

`app/lib/carrera.ts` es **la fuente única** de fecha, precios, categorías,
premios, WhatsApp, vídeos e `INSCRITOS_APROX` / `CUPOS_VENDIDOS_PCT` (estos dos
se suben a mano). Existe porque el precio llegó a decir $23 en el formulario,
$30 en la landing y $20 en el reglamento.

Pero el precio vive en **tres sitios que hay que cuadrar a mano**:

1. `app/lib/carrera.ts` — lo que ve el corredor en las páginas informativas.
2. `app/components/FormInscripcion.tsx` — su propia copia para el formulario.
3. `functions/api/inscribir.js` — el catálogo **autoritativo**, el que cobra.
   No puede importar de los otros dos: corre en el worker, no en el cliente.

Los datos del banco (Pichincha, cuenta, titular, RUC) están en
`app/components/inscripcion/constantes.ts`, con botón de copiar porque nadie
transcribe diez dígitos sin equivocarse.

## 8. Reglas no obvias del proyecto

- **El home se sirve SIN JavaScript.** `scripts/sin-js-home.mjs` corre después
  de `next build` y borra los `<script>` de los HTML exportados. Solo conservan
  JS `/inscripcion`, `/verificar` y `/ganadores` (lista `CONSERVAN` del script).
  Se salvan el JSON-LD y lo marcado con `data-mantener` (el contador vainilla y
  el pop-up de los flyers).
  → Por eso el home importa sus secciones **normal, no con `next/dynamic`**: sin
  runtime de cliente los placeholders se quedaban congelados para siempre.
  → Y por eso **un componente `"use client"` en el home NO FUNCIONA en
  producción**: su marcado se pinta en el servidor, pero React nunca arranca, así
  que nada que dependa de `useState`/`useEffect` llega a pasar. Si el home
  necesita comportamiento, es JavaScript vainilla marcado con `data-mantener`.
  Se comprueba en un segundo: `grep -c "<script" out/index.html` tiene que dar
  exactamente el número de islas vainilla que hay puestas.
- **Si cambia el contenido de una imagen, cambia el NOMBRE del archivo.**
  Cloudflare no deja pisar el `Cache-Control` de los binarios: siguen saliendo
  con 16 días. Reemplazar `kit.webp` en el sitio dejó a medio mundo viendo la
  versión vieja (22-jul-2026). Está en `public/_headers` y en `docs/CAMBIO-IMAGENES.md`.
- **Nada de `next/image`.** Con `output: "export"` + `images.unoptimized` el
  optimizador no llega a correr. Los tamaños los genera `scripts/imagenes.mjs`
  (sharp) y los sirve `app/lib/imagen.ts` con `srcset` escrito a mano.
- **`experimental.inlineCss`: NO.** Probado dos veces, peor las dos (LCP 8,4 →
  11,4 s). No reactivar sin una tercera medición que diga lo contrario.
- **`overflow-x: clip`, nunca `hidden`, en el `body`.** En iOS Safari `hidden`
  vuelve al body contenedor de scroll y desancla los `position: fixed` — la
  barra inferior se iba flotando a media página.
- **`.seccion-diferida`** (`content-visibility`) hace el "cargar después" sin
  JavaScript: bajo el pliegue no se maqueta hasta que el scroll se acerca.
- **El header es `fixed`**: las páginas sin hero reservan su altura a mano
  (`HUECO_HEADER` en `SiteChrome.tsx`). Si cambia el `pt` del header, cambia ahí.
- **Tipografía: Archivo + Archivo Black**, una sola familia. Poppins salió por
  aparecer en las listas de "fuentes que delatan una plantilla"
  (`docs/30-REGLAS-ANTI-IA.md`). Iconos Phosphor, no lucide, por lo mismo.
- **Paleta muestreada del flyer oficial**, píxel a píxel: `--vino #780030`,
  `--magenta #c51850`, `--coral #ee374b`, `--naranja #f7771c`, más `--violeta`
  y `--navy` (la parte fría). El degradado de marca va en un token, siempre 135°.

## 9. Secretos, entorno y despliegue

- Secretos: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`.
  - En producción: `wrangler pages secret put` (los lee el worker por `env`).
  - En local: `.dev.vars` (para `wrangler pages dev`). `.env.local` es la copia
    de referencia para humanos. **Ninguno se sube al repo.**
  - Nunca con prefijo `NEXT_PUBLIC_`: así acabó la clave anterior de Airtable
    publicada dentro del JS que descarga cualquier visitante.
- Bindings en `wrangler.toml`: `DB` → D1 `inscripciones`, `BUCKET` → R2
  `comprobantes-8k`.
- **Despliegue: automático.** Cloudflare Pages publica cada push a `main`. Nadie
  lo revisa antes.
- Barreras: **husky + lint-staged** en el commit (saltable con `--no-verify`) y
  **GitHub Actions** (`tsc --noEmit`, `eslint`, `npm run build`, `npm audit`
  informativo). Cloudflare **no mira el resultado de CI**: construye por su
  cuenta igualmente.
- Comandos: `npm run dev` · `npm run build` (build + sin-js) · `npm run imagenes`
  · `npm run capturas` (auditoría visual con Playwright) · `npx playwright test`
  (humo sobre `out/` servido en el 4173).

## 10. Estado real del CRM — foto del 26-ago-2026

659 registros en la tabla `CRM 10k` (Airtable):

| Etapa                     | Registros |
| ------------------------- | --------- |
| Inscrito Pago Verificado  | 579       |
| Inscrito Pago x Verificar | 38        |
| Pago Solicitado           | 33        |
| (vacío)                   | 9         |

Por método: Web 591 · WhatsApp 66 · Manual 2.
Por categoría: Élite Pro 8K 492 · Máster 138 · Leyenda 15 · Discapacidad 11.

(`INSCRITOS_APROX` en `carrera.ts` dice 340 — se quedó corto, se actualiza a mano.)

## 11. Recetas de operación

**Consultar una cédula como la ve el corredor:**

```bash
curl -s "https://8krutadelasmandarinas.com/api/consultar-inscripcion?cedula=XXXXXXXXXX"
```

**Confirmar a mano un pago que el equipo ya verificó** (lo que se hizo el
26-ago-2026 con la cédula 1751449412, inscrita por WhatsApp y atascada en
`Pago Solicitado`):

```bash
set -a && . ./.env.local && set +a
# 1) encontrar el record id
curl -s -G "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/$AIRTABLE_TABLE_ID" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  --data-urlencode 'filterByFormula={cedula}="XXXXXXXXXX"'
# 2) moverlo a verificado
curl -s -X PATCH "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/$AIRTABLE_TABLE_ID/recXXXXXXXX" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" -H "Content-Type: application/json" \
  -d '{"fields":{"Etapa":"Inscrito Pago Verificado"}}'
```

Convención del equipo para los inscritos por WhatsApp: **solo se toca `Etapa`**.
`Valor`, `Comentarios` y `Acepta Términos` se dejan vacíos — no se inventan
datos de un pago que no pasó por el formulario. El cambio se ve al instante en
`/verificar` (el endpoint va con `Cache-Control: no-store`).

## 12. Deudas y trampas conocidas

- **README desactualizado** (Firebase, `/checkadmin`, librerías que ya no están).
- **No hay panel de administración.** Todo se gestiona desde Airtable a mano.
- **El esquema de la tabla D1 `inscripciones` no está en el repo** — se creó a
  mano en Cloudflare. Si hay que recrear la base, hay que deducir las columnas
  del `INSERT` de `inscribir.js`.
- **`/verificar` genera el QR del ticket con `api.qrserver.com`**, metiendo
  cédula y nombre en la URL: cada consulta manda esos datos a un tercero. Choca
  con el cuidado que tiene el resto del proyecto con los datos del corredor.
- **33 corredores ven `Pago Solicitado`** (jerga del CRM) en su pantalla, porque
  esa etapa no está en el mapa `ETAPA`.
- **`FloatingCTA` está muerto en el home desde el 18-ago-2026.** Es
  `"use client"` y nace con `opacity-0 pointer-events-none`, esperando a un
  listener de scroll que ya nunca corre: en producción el botón flotante existe
  en el HTML y es invisible para siempre. Le pasaba lo mismo al pop-up del
  flyer, que se rehízo en vainilla el 26-ago-2026. Hay que decidir si el botón
  se pasa a vainilla (como el contador y el pop-up), se resuelve con CSS, o se
  borra.
- **Los polyfills legacy de Next** (13,5 KiB) siguen apareciendo en PageSpeed.
  Van con `nomodule`, así que ningún móvil real los ejecuta. Reintentar al subir
  de versión de Next.
- Archivos sueltos en la raíz que no pintan nada ahí: un MP4 de 7,9 MB, el
  `Movimientos_cuenta_*.xlsx` del banco, `qrPichincha.pdf`, `logo-home.png`.

## 13. Índice de la documentación

- **`notas/`** — bitácora de decisiones, numeradas: 08 cerrar la venta · 09 home
  estático · 10 TypeScript · 11–12 call center · 13 móvil · 14 identidad ·
  15–16 animaciones · 17 alma humana · 18 quitar look AI · 19 imágenes ·
  20 galería · 21 referencia Ruvent · **22 este mapa** · 23 urgencia · 24 /verificar sin cara de IA.
- **`docs/`** — investigación previa a las decisiones: `100-MOVIL.md`
  (rendimiento), `30-REGLAS-ANTI-IA.md`, `50-CONSEJOS-CARRERAS.md`,
  `30-UX-CONVERSION.md`, `LINEA-GRAFICA.md` y `LINEA-GRAFICA-100.md`,
  `CAMBIO-IMAGENES.md`, `HERO-IMAGEN.md`, `AUTENTICIDAD-LOCAL.md`,
  `LIMPIEZA.md`, `REVISION-UX.md`, `PROMPTS-INSTAGRAM.md`,
  `STORYBOARD-VIDEO-RUTA.md`.

> Regla de fondo del repo, la que explica el tono de todos los comentarios: aquí
> hay dinero y datos de personas reales. Cada cosa rara del código está escrita
> porque algo falló antes. Antes de "limpiar" algo que parece innecesario, busca
> el comentario que lo defiende.
