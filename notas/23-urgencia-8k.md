# Notas Urgencia — 8K Ruta de las Mandarinas 2026

> Guardado: 26 de agosto de 2026, tres días antes de la carrera. Instrucción:
> "que el sitio transmita más urgencia". La investigación completa (100
> estrategias ordenadas por impacto, con fuentes) está en
> `docs/100-URGENCIA.md`; esta nota es lo que se decidió y lo que se hizo.

## El punto de partida

Los datos del CRM del 26-ago: 678 fichas, 579 pagadas y verificadas, 34 que
pidieron los datos y nunca pagaron, ritmo subiendo día a día (50 solo esa
mañana). **La captación no era el problema.** Lo que fallaba era otra cosa.

## Las cuatro decisiones

### 1. El plazo del que habla el sitio: el VIERNES, no el sábado

La salida es el sábado 29 a las 08h00, pero el plazo que decide es el cierre de
la entrega de kits: **viernes 28 a las 17h00 en Vehicentro (Ambato)**, ventana
única. Cae ~15 horas antes, así que aprieta más, y encima explica por qué hay
prisa en vez de solo enseñar un reloj bajando.

Se añadió `FECHA_LIMITE_KIT` a `app/lib/carrera.ts` (fuente única, como todo lo
demás) y el contador del formulario apunta ahí.

### 2. No se inventa ningún cierre de inscripciones

Se pidió un contador hacia un cierre de inscripciones que no va a existir. No se
hizo, y conviene que quede escrito por qué: un plazo falso se descubre solo —el
que vuelve al día siguiente lo ve abierto— y a partir de ahí ningún aviso del
sitio vale. Es la misma regla que ya estaba en el código desde antes
(`ContadorSesion.tsx`: _"lo que dice tiene que ser verdad"_). El plazo del kit
da más urgencia que el inventado y además es cierto.

### 3. Fuera la palabra "preventa"

El precio es el mismo para todos y no va a subir. El paso 1 del formulario decía
_"Precios de preventa. **Suben cuando se cierre la preventa**, así que
inscribirte hoy te sale más barato"_ — una subida que no existe, y que encima
tapaba la urgencia que sí es verdad. Se quitó de las ocho páginas donde salía y
la constante pasó de `PRECIO_PREVENTA` a `PRECIO_GENERAL`.

### 4. Ni cifras de inscritos ni advertencias

Dos cosas se probaron y se retiraron el mismo día, por decisión de la
organización:

- **Las cifras de inscritos.** Se puso "630 inscritos" en el hero y en el
  formulario, y el reparto por categoría ("Leyenda 15, Discapacidad 11"). Fuera
  todo: **no se publica cuánta gente hay dentro**, ni el total ni por categoría.
  Se comunica el "% vendido" del arte oficial y nada más. `INSCRITOS_APROX`
  sigue en `carrera.ts` como referencia interna del equipo, sin pintarse en
  ninguna pantalla — si alguien la vuelve a usar, que lea antes esta nota.
- **"Sin kit no se corre".** Sonaba a amenaza al corredor. Se dice el plazo y
  que la entrega es única, y ya. El argumento de escasez por categoría se
  conserva sin números: Leyenda y Discapacidad son las que menos corredores
  reúnen y reparten los mismos premios.

## Lo que quedó puesto

| Dónde                      | Qué                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| Hero                       | "Últimos días · 90% vendido" + "Última entrega de kits: viernes 28 hasta las 17h00"                |
| Formulario (paso 1)        | El aviso ámbar dice el plazo del kit, ya no la subida de precio                                    |
| Formulario (barra lateral) | `UrgenciaCarrera.tsx`: contador en horas hacia el viernes 17h00                                    |
| Pop-up                     | Tercer botón, a todo el ancho: **"Inscripciones finales · Clic aquí"**                             |
| Categorías                 | Leyenda y Discapacidad como las de menos competencia, sin cifras                                   |
| FAQ                        | Nueva pregunta: "¿Hasta cuándo me puedo inscribir?"                                                |
| Compartir                  | El plazo del kit en el título y la descripción (es lo que se ve en WhatsApp)                       |
| `/verificar`               | Al que no ha pagado: "Falta tu pago" + cuenta + copiar + WhatsApp. Al que sí: recordatorio del kit |

## Dos componentes que estaban muertos

Al tocar esto salió lo de verdad importante: **`PopupFlyer` y `FloatingCTA`
llevaban desde el 18-ago sin funcionar en producción**. Los dos eran
`"use client"` y ese día el home pasó a servirse sin JavaScript
(`scripts/sin-js-home.mjs`), así que React nunca arrancaba: el pop-up no
existía y el botón flotante vivía en el HTML con `opacity-0
pointer-events-none`. Ocho días sin dar un solo error.

Los dos se rehicieron en **JavaScript vainilla con `data-mantener`**, que es el
patrón que ya usaba el contador del hero y lo único que el limpiador respeta.

> **Regla que sale de aquí:** en el home, un componente `"use client"` NO
> funciona. Se comprueba en un segundo — `grep -c "<script" out/index.html`
> tiene que dar el número de islas vainilla que hay puestas. Está también en
> `notas/22-mapa-del-proyecto-8k.md`.

## Lo que no se hizo (y rinde más que el código)

- **Los 34 que no pagaron son $680** y una tarde de WhatsApp. La lista está en
  `por-cobrar-26-ago.csv` (fuera del repo: lleva cédulas y teléfonos).
- **56 pagos sin verificar**, 48 de ese mismo día. Cada hora de retraso es una
  llamada al call center de gente que ya pagó y ve "Pago por verificar".
- **El sitio no tiene analítica.** Todo lo de esta nota se juzga contando
  inscripciones por día en el CRM, antes y después.
