# 50 consejos para webs de carreras — de mejor a peor · julio 2026

Investigación pedida el 22 de julio de 2026: qué hace buena a una web de
carrera según **corredores reales** (Reddit r/running, r/AdvancedRunning),
la industria (RunSignup RaceTrends 2025, Race Directors HQ, Racecheck) y
los estudios de usabilidad (NN/g, Baymard, WCAG 2.2, Google web.dev).

Nota metodológica: Reddit bloquea el rastreador, así que los hilos se
leyeron completos por el archivo público PullPush (api.pullpush.io). Las
citas textuales de corredores son reales, con sus puntuaciones.

## Cómo leer la columna "8K"

- ✅ el sitio ya lo cumple
- 🔧 corregido el 22-jul-2026 a raíz de esta lista
- 🔶 a medias — se explica por qué
- 📋 falta un dato del organizador (no se inventa)
- 🏢 decisión de negocio del organizador, no de la web
- ⏳ aplica después de la carrera (29 de agosto)

## La lista, de mejor a peor

| #   | Cat.        | Consejo                                                                                                                                 | 8K                                                               |
| --- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | TAREA       | Botón "Inscríbete" visible en la primera pantalla de TODAS las páginas, a 1 clic del formulario (Race Directors HQ)                     | ✅ header + barra inferior móvil                                 |
| 2   | INFO        | Fecha, hora, lugar, distancia y precio visibles sin scroll en la home (NN/g "upfront disclosure")                                       | 🔶 fecha y lugar en el hero; el precio en la primera sección     |
| 3   | MÓVIL       | Diseñar primero para teléfono: 73,7 % de visitas y 62,9 % de transacciones son móviles (RunSignup RaceTrends 2025)                      | ✅                                                               |
| 4   | CONFIANZA   | Precio TOTAL desde el inicio, sin comisiones sorpresa — 40 % abandona por costos extra; en Reddit las llaman "utter bullshit" (Baymard) | ✅ $20 finales, cero comisión                                    |
| 5   | TAREA       | Formulario con el mínimo de campos (~8 ideal; media 11,3) — 17 % abandona por procesos largos (Baymard, NN/g)                           | ✅                                                               |
| 6   | TAREA       | Inscribirse SIN crear cuenta — 18 % abandona si le exigen registro (Baymard)                                                            | ✅ no hay cuentas                                                |
| 7   | TAREA       | Apple Pay / Google Pay además de tarjeta — 34 % pagó así en 2025 (RunSignup)                                                            | 🏢 el pago es transferencia/QR bancario                          |
| 8   | INFO        | Mapa CON perfil de elevación y GPX descargable — "la cantidad de webs sin perfil de elevación da miedo" (r/running, +23)                | 📋 pedir el track GPS al organizador                             |
| 9   | VELOCIDAD   | Core Web Vitals móvil: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 (web.dev)                                                                   | 🔶 optimizado (webp, srcset, fuentes); medir en campo            |
| 10  | CONFIANZA   | Política de reembolso/aplazamiento clara y enlazada antes del pago — 13 % abandona sin ella (Baymard; caso Bubble Run)                  | 🔧 FAQ la responde citando el art. 15                            |
| 11  | INFO        | Página "día de la carrera" con cronograma hora a hora (RunSignup)                                                                       | 🔶 bloque existe; cronograma completo = dato del organizador     |
| 12  | SIMPLICIDAD | Menú corto y consistente; todo a máximo 3 clics (Race Directors HQ)                                                                     | ✅ 4 entradas + CTA                                              |
| 13  | CONFIANZA   | Fotos reales de ediciones anteriores, nunca stock (NN/g)                                                                                | ✅ 24 fotos reales                                               |
| 14  | CONFIANZA   | Reseñas verificables junto al botón de inscripción — 93 % decide con reseñas (Racecheck)                                                | 📋 pedir testimonios reales; no se inventan                      |
| 15  | TAREA       | Tramos de precio con fecha límite y cuenta regresiva — 26 % de inscripciones llega 3 días antes de una subida (RunSignup)               | 🔶 hay countdown; fechas de subida = dato                        |
| 16  | INFO        | Detallar el kit con guía de tallas y foto de la camiseta (r/running)                                                                    | 🔶 lista sí; tallas y foto = dato                                |
| 17  | MÓVIL       | Completar tú mismo una inscripción real desde un teléfono (RunSignup, literal)                                                          | ✅ probado en 390 px y en producción                             |
| 18  | SIMPLICIDAD | Formulario en una columna con etiquetas encima del campo (NN/g)                                                                         | ✅                                                               |
| 19  | TAREA       | Validación en línea campo a campo, conservando lo escrito (NN/g)                                                                        | ✅                                                               |
| 20  | CONFIANZA   | HTTPS y pasarela reconocida mostrada — 19 % no confía su tarjeta (Baymard)                                                              | ✅ HTTPS; cuenta bancaria con titular publicado                  |
| 21  | INFO        | Dirección de salida con enlace a Google Maps + parking (r/running)                                                                      | 🔧 enlace a Maps añadido; parking = dato                         |
| 22  | INFO        | Página de entrega de kits: días, horarios, lugar, documento, si recoge otro (r/running)                                                 | 📋 fecha sin definir — el sitio lo dice tal cual                 |
| 23  | INFO        | FAQ con las preguntas que la gente hace de verdad (¿puedo caminar?, ¿límite?, ¿edad mínima?) (RunSignup, r/running)                     | 🔧 sección nueva en /informacion, 9 respuestas verificadas       |
| 24  | CONTENIDO   | Cero contenido del año pasado — "the website still says..." mata la confianza (r/running)                                               | ✅ limpiado en toda la web                                       |
| 25  | CONTENIDO   | Título SEO con carrera + ciudad + distancia + año — 29,3 % del tráfico es búsqueda orgánica (RunSignup)                                 | 🔧 título y descripción con Patate + fecha                       |
| 26  | MÓVIL       | Objetivos táctiles ≥ 24 px (WCAG 2.2), recomendado 44-48 px (Race Directors HQ)                                                         | ✅ CTAs a 44-52 px                                               |
| 27  | SIMPLICIDAD | Una sola llamada a la acción por pantalla, sin popups (r/running: "sketchy"; NN/g)                                                      | ✅                                                               |
| 28  | VELOCIDAD   | Comprimir y redimensionar todas las fotos (WebP/AVIF) (web.dev)                                                                         | ✅ webp + variantes 240/400                                      |
| 29  | POST        | Resultados el MISMO día, buscables por nombre y dorsal (r/running)                                                                      | ⏳ estructura lista en /ganadores                                |
| 30  | POST        | Fotos gratis etiquetadas por dorsal días después — lo más elogiado en Reddit (Pike's Peek 10k)                                          | ⏳                                                               |
| 31  | POST        | Anunciar la próxima edición y reabrir con descuento al terminar — solo 17,2 % repite (RunSignup)                                        | ⏳                                                               |
| 32  | TAREA       | Emails de "inscripción incompleta" (Race Directors HQ)                                                                                  | 🔶 sin infra de email; el formulario guarda y restaura el avance |
| 33  | TAREA       | Programa de referidos: 3-5 amigos, recompensa $15-20 — genera 7 % de transacciones (RunSignup)                                          | 🏢                                                               |
| 34  | TAREA       | Cupones simples — 6,5 % de inscripciones, ROI > 300 % (RunSignup)                                                                       | 🏢                                                               |
| 35  | INFO        | Puestos de hidratación en el mapa con marca y sabor — "quiero entrenar con lo que habrá" (r/running 1gfxc16)                            | 📋                                                               |
| 36  | INFO        | Resultados de ediciones anteriores enlazados (r/running)                                                                                | ✅ /ganadores                                                    |
| 37  | CONFIANZA   | Contacto con email real, teléfono y nombre del organizador (NN/g; r/running "spidey senses")                                            | 🔶 WhatsApp real; falta email del organizador                    |
| 38  | CONFIANZA   | Footer con términos, privacidad y legales — los sitios falsos "no tienen el legalese" (r/running)                                       | ✅                                                               |
| 39  | CONFIANZA   | Cero faltas de ortografía y cero enlaces rotos (NN/g)                                                                                   | ✅ verificado con Playwright                                     |
| 40  | CONFIANZA   | Moneda, idioma y datos locales coherentes (r/running)                                                                                   | ✅ USD + español en todo                                         |
| 41  | SIMPLICIDAD | Campos opcionales marcados y limitados a 1-2 (NN/g)                                                                                     | 🔶 el formulario está congelado a petición del dueño             |
| 42  | SIMPLICIDAD | Nada de PDF/Word como única fuente del mapa u horarios (LetsRun)                                                                        | ✅ todo HTML; PDF solo como extra                                |
| 43  | MÓVIL       | Tracking/resultados siempre con enlace web visible, no solo app (r/AdvancedRunning)                                                     | ⏳                                                               |
| 44  | INFO        | Plan de contingencia por clima publicado ANTES (r/running; caso Colfax)                                                                 | 🔧 FAQ lo responde citando el art. 15                            |
| 45  | CONTENIDO   | Ruta narrada tramo a tramo con fotos reales (RunSignup; r/running)                                                                      | ✅ /ruta                                                         |
| 46  | SIMPLICIDAD | Contraste ≥ 4,5:1, alt en imágenes, navegación por teclado (WCAG 2.2)                                                                   | ✅                                                               |
| 47  | TAREA       | Entrada económica "sin camiseta" — precios medios subiendo (5K: $31,23 en 2025) (RunSignup)                                             | 🏢                                                               |
| 48  | CONTENIDO   | Formulario "avísame cuando abra la inscripción" — 12 % de los dólares viene del email (RunSignup)                                       | 🏢 requiere infra de email                                       |
| 49  | POST        | Pedir reseñas por email 1-2 días después y publicarlas (Racecheck)                                                                      | ⏳                                                               |
| 50  | VELOCIDAD   | Probar en red celular real, no solo Wi-Fi (Race Directors HQ)                                                                           | 🔶 pendiente probar en 4G tras el deploy                         |

## Qué pedirle al organizador (los 📋)

1. **Track GPS del recorrido** (para perfil de elevación + GPX descargable) — #8
2. **Fecha, lugar y horario de entrega de kits** — #22
3. **Guía de tallas y foto de la camiseta** — #16
4. **Marca de hidratación en ruta** — #35
5. **Email de contacto del comité** — #37
6. **Testimonios reales de corredores de la edición anterior** — #14
7. **Fechas de subida de precio** (si las hay) — #15
8. **Cronograma hora a hora del día de la carrera** — #11

## Fuentes

- RunSignup RaceTrends 2025 (PDF): https://info.runsignup.com/wp-content/uploads/sites/3/2026/02/25-Race-Trends-FOR-ONLINE-compressed-1.pdf
- RunSignup — 4 Ways to Grow Your Race: https://info.runsignup.com/2026/04/10/4-ways-to-grow-your-race/
- RunSignup — Race Website vs Organization Website: https://info.runsignup.com/2026/05/14/race-website/
- Race Directors HQ — How to Design a Race Website: https://www.racedirectorshq.com/read/expert-design-race-website-53/
- Baymard — Cart Abandonment Rate & Reasons: https://baymard.com/lists/cart-abandonment-rate
- Baymard — Checkout Flow Average Form Fields: https://baymard.com/blog/checkout-flow-average-form-fields
- NN/g — The 4 Factors of Trustworthy Design: https://www.nngroup.com/articles/trustworthy-design/
- NN/g — Website Forms Usability: https://www.nngroup.com/articles/web-form-design/
- Google web.dev — Core Web Vitals: https://web.dev/articles/vitals
- Racecheck — análisis del widget de reseñas: https://blog.racecheck.com/deep-dive-performance-analysis-of-the-racecheck-premium-review-widget-3ed49c7e4898
- Reddit r/running — "What is one thing you wish would become a normal part of 5k 10k and Half Marathon events?" (427 comentarios): https://www.reddit.com/r/running/comments/1gfxc16/
- Reddit r/AdvancedRunning — registro de carreras canceladas: https://www.reddit.com/r/AdvancedRunning/comments/fld538/
- Reddit r/AdvancedRunning — qué motiva a inscribirse: https://www.reddit.com/r/AdvancedRunning/comments/2oq3fc/
- CBS News — quejas Bubble Run: https://www.cbsnews.com/minnesota/news/bubble-run-complaints
- WCAG 2.2 (contraste 1.4.3, target size 2.5.8): https://www.w3.org/TR/WCAG22/

Ver también: [`100-CONSEJOS.md`](./100-CONSEJOS.md) ·
[`30-REGLAS-ANTI-IA.md`](./30-REGLAS-ANTI-IA.md) ·
[`AUTENTICIDAD-LOCAL.md`](./AUTENTICIDAD-LOCAL.md) ·
[`REVISION-UX.md`](./REVISION-UX.md)
