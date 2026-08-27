# Notas /verificar sin cara de IA — 8K Ruta de las Mandarinas 2026

> Guardado: 26 de agosto de 2026. Instrucción: "investiga cómo mejorar esta
> parte para que no parezca IA, información actual, de foros, top 100 de mejor a
> peor". La lista completa está en `docs/100-ANTI-IA-VERIFICAR.md`; esta nota es
> qué se decidió y qué se cambió.

## Sobre las fuentes (para que conste)

Se pidió Reddit y foros. **Reddit bloquea el rastreador**, así que los hilos no
se leyeron y no se citan. Lo que se usó: recopilaciones de 2026 que resumen ese
consenso (Shuffle ene-2026, 925studios, sikora.software, AXE-WEB,
Originality.AI) y fuentes primarias de usabilidad (Baymard, Nielsen Norman
Group). Está dicho igual al principio del documento.

## Lo que cambió en el consenso desde `docs/30-REGLAS-ANTI-IA.md`

- El delator ya no es un elemento suelto sino **cuatro juntos**: degradado
  morado, Inter, cuatro tarjetas en rejilla y hover mínimos.
- **El espacio en blanco excesivo pasa a ser la señal nº1.** No es blanco
  deliberado, es relleno.
- El **dark glassmorphism ya es mayoritario**, o sea, ya es cliché.
- Baymard: **borrar lo escrito tras un error** es de los fallos más dañinos, y
  hacen falta **4–7 mensajes de error distintos**, no uno genérico.
- NN/G: esta pantalla no es una landing, es un **status tracker**; y la gente
  **escanea, no lee** (formatear para escaneo: +58% de usabilidad).

## La decisión de fondo

**`/verificar` estaba diseñada como una landing y no lo es.** Quien llega ya se
inscribió y ya pagó: no hay que persuadirlo, hay que responderle. La mitad de lo
que la hacía parecer generada venía de ahí — hero con logo gigante, titular,
párrafo de venta y una fila de tres datos que era el patrón "tres tarjetas"
disfrazado.

## Los delatores que tenía, comprobados en el código

No era opinión, estaba escrito en el archivo:

1. Los colores se llamaban `brandPurple` y `brandPink`, **y el comentario decía
   que el nombre venía del clon del 10K de Ambato**. Una plantilla heredada,
   confesada por escrito.
2. `bebasClassName = "font-bebas"`, una tipografía que el sitio ya no usa.
3. El **código de barras del ticket era decorativo**, dibujado con un patrón
   fijo de divs.
4. El **QR se generaba en `api.qrserver.com` con la cédula y el nombre metidos
   en la URL** — cada consulta mandaba los datos del corredor a un tercero, y el
   código no servía para nada: en la entrega se pide cédula física y
   comprobante, no se escanea.
5. El ticket caía a **`"PRE-ORDER"`**, en inglés.
6. Acentos `border-purple-500` y `border-pink-500`, colores que no están en los
   tokens de la marca y que no significan nada.

## Qué se aplicó

| #          | Cambio                                                                                                                                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1, 3, 5    | Fuera el hero de landing: sin logo gigante en el titular, sin párrafo de venta, sin la fila 8K / Ago 29 / Patate. Queda "Mi inscripción" y una línea                                                                    |
| 5          | Menos relleno y menos radio en la tarjeta; fuera el desenfoque decorativo de la esquina                                                                                                                                 |
| 8, 9       | El campo arranca enfocado y **Enter envía** (antes solo funcionaba el botón)                                                                                                                                            |
| 13         | `brandPurple`/`brandPink` → `NARANJA`/`MAGENTA`                                                                                                                                                                         |
| 14         | Fuera `font-bebas`; se usa la tipografía real de titulares                                                                                                                                                              |
| 15, 19     | Fuera el código de barras decorativo y el `"PRE-ORDER"`. En su lugar, lo que sí hace falta el viernes: cédula y comprobante                                                                                             |
| 17, 18     | **Fuera el QR de `api.qrserver.com`** — adorno inútil que además filtraba datos a un tercero                                                                                                                            |
| 20         | Los acentos de color pasan al naranja de la marca                                                                                                                                                                       |
| 21         | El punto de estado deja de latir                                                                                                                                                                                        |
| 23, 24, 25 | Botón plano de marca, sin degradado ni mayúsculas espaciadas                                                                                                                                                            |
| 32         | Fuera el icono en cuadrado redondeado (el encabezado por defecto de shadcn)                                                                                                                                             |
| 37, 38     | El "no encontrado" deja de ser un callejón: dice las tres causas reales (dígito mal, inscripción por WhatsApp de hace menos de 48 h, pagó otra persona)                                                                 |
| 75, 76, 77 | La ayuda ya no es un enlace pequeño: dice las **dos salidas** — WhatsApp con el mensaje empezado, y **acercarse el viernes 28 al punto de entrega de kits** (Vehicentro, 10h00–17h00) a explicar el problema en persona |

Comprobado en el build real: el campo se enfoca solo, Enter consulta, y **cero
llamadas a `qrserver.com`** en toda la página.

## Lo que NO se hizo (y por qué)

- El resto de los 100. A tres días de la carrera, un rediseño completo de la
  pantalla es más riesgo que beneficio. Las diez primeras son las de más efecto
  por menos riesgo y son las que están hechas.
- **Sigue pendiente lo de fondo**: el ticket todavía se parece más a una tarjeta
  de SaaS que a un dorsal (nº 49). Eso sí es un rediseño, y va después de la
  carrera.
- Medir (nº 95): el sitio no tiene analítica.
