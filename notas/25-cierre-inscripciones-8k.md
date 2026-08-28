# Notas Cierre de Inscripciones — 8K Ruta de las Mandarinas 2026

> Guardado: 27 de agosto de 2026. Instrucción: "cierra las inscripciones, solo
> deja para verificar".

## Por qué se cierra ahora

La entrega de kits es **mañana, viernes 28, de 10h00 a 17h00**, y es la única.
Quien pagara hoy o mañana por la tarde ya no alcanzaría a retirar el suyo, y sin
kit no hay dorsal ni chip. Cobrar por algo que no se puede entregar no es una
venta, es una devolución con pasos extra.

## Cómo está hecho

Una bandera, `INSCRIPCIONES_ABIERTAS` en `app/lib/carrera.ts`, en `false`. Para
reabrir se pone en `true`… **y también en `functions/api/inscribir.js`**, que
lleva su propia copia porque corre en el worker y no puede importar del cliente.
Son los dos únicos sitios que hay que tocar.

### El cierre de verdad está en el servidor

Quitar el formulario no cierra nada: `/api/inscribir` acepta `CORS: *`, así que
cualquiera con las DevTools puede postear sin pasar por la pantalla. Ahora el
endpoint responde **410 Gone** antes de tocar la base de datos. 410 y no 403
porque es lo que significa: esto existía y ya no.

### La ruta /inscripcion no se borra

Ese enlace lleva meses circulando por WhatsApp, está en flyers impresos y en
publicaciones de Instagram que ya no se pueden editar. Un 404 deja a esa gente
pensando que el sitio se cayó. En su lugar enseña un aviso que dice qué pasó y
ofrece las tres salidas: consultar el pago, la guía del corredor y WhatsApp.
Cierra mencionando la 10K de Ambato del 15 de noviembre, que es la siguiente de
la organización.

## Lo que cambió alrededor

- **Todas las llamadas a la acción del sitio apuntan a `/verificar`** — hero,
  header, categorías, FAQ, cómo inscribirse, ruta, información, galería,
  carrera, 404, botón flotante y pop-up. Trece sitios. El texto ya no dice
  "Inscribirme ahora" sino "Ver mi inscripción".
- **La barra inferior del móvil** cambia su última celda de "Inscríbete" a
  **"Guía"** (`/guiacorredor`): la carrera es pasado mañana y el kit se retira
  mañana, esa es la acción que queda.
- **El pop-up** deja de vender: el botón grande pasa de "Inscripciones finales"
  a "Retira tu kit el viernes 28" y lleva a la guía.
- **El pie de página** pierde la entrada "Inscripción" — ya tenía "Mi pago".
- **`SiteChrome`** vuelve a poner header y pie en `/inscripcion`: los quitaba
  porque el formulario traía su propio marco, y ahora es una página corriente
  que necesita poder salir a algún lado.
- **Las pruebas e2e**: las tres que recorrían el formulario (categorías, precios,
  paso a datos personales) se sustituyeron por otras que comprueban lo
  contrario — que el aviso esté, que ofrezca salida y que no quede ni un
  `<input>`. Si se reabre, se recuperan del historial de git en este commit.

## Lo que NO se tocó

- **El formulario sigue en el código** (`FormInscripcion` y toda la carpeta
  `components/inscripcion/`). No se borra: es el trabajo de la edición siguiente
  y volver a escribirlo costaría semanas. Solo está desconectado.
- **`/inscripcion` sigue en la lista `CONSERVAN` de `scripts/sin-js-home.mjs`.**
  Se pensó quitarlo —el aviso no necesita JavaScript y la página pesa 42 KB de
  más— y se dejó a propósito: si alguien reabre las inscripciones y se olvida de
  volver a añadirlo ahí, el formulario aparece pero no funciona, sin dar ningún
  error. Es exactamente el fallo que tuvimos ocho días con el pop-up
  (`notas/23-urgencia-8k.md`). 42 KB en una página que nadie debería visitar
  cuesta menos que ese riesgo.
