# 100 mejoras para que /verificar no parezca hecha con IA · 26-ago-2026

Investigación pedida el 26 de agosto de 2026 sobre **una sola pantalla**: la de
consulta de inscripción (`/verificar`). Ordenada de mayor a menor impacto.

Complementa a [`30-REGLAS-ANTI-IA.md`](./30-REGLAS-ANTI-IA.md), que son reglas
generales del sitio: aquí no se repiten, se aplican a esta página concreta y se
añade lo que ha cambiado en el consenso desde entonces.

## Nota honesta sobre las fuentes

Se pidió expresamente Reddit y foros. **Reddit bloquea el rastreador que uso**,
así que no he podido leer los hilos directamente y no voy a citar hilos que no
he abierto. Lo que sí se ha leído son recopilaciones de 2026 que resumen ese
consenso (Shuffle, 925studios, sikora.software, AXE-WEB, Originality.AI) y
fuentes primarias de investigación de usabilidad (Baymard, Nielsen Norman
Group). Donde algo viene del consenso de foros y no de un estudio, se dice.

**Lo nuevo de 2026 respecto a la nota anterior del proyecto:**

- El "AI tell" ya no es solo el degradado morado: se ha estandarizado la
  descripción en **cuatro señales juntas — degradado morado, tipografía Inter,
  cuatro tarjetas en rejilla y estados hover mínimos** (Shuffle, ene-2026).
- **El espacio en blanco excesivo pasa a ser la señal nº1** en las
  recopilaciones nuevas: no es blanco deliberado, es relleno — "en un monitor de
  27 pulgadas parece que al diseñador se le acabó el contenido y dejó el
  padding" (925studios, 2026).
- El diagnóstico de fondo: la IA **no diseña, predice el patrón más frecuente**;
  produce "la media de internet" (Medium/AXE-WEB). Lo que delata no es un
  elemento, es la ausencia de decisiones.
- **El dark glassmorphism es ahora tendencia mayoritaria**, lo que lo convierte
  en cliché: encima "es invisible sobre negro sólido" y se lo acusa de romper
  contrastes (Medium, DEV, 2026).
- Baymard: **borrar lo que el usuario escribió tras un error es de los fallos
  más dañinos**, y recomienda **4–7 mensajes de error distintos** por campo
  complejo en vez de uno genérico.
- NN/G: los usuarios **escanean, no leen** — formatear para escaneo mejoró la
  usabilidad un **58%**; y hay 6 guías propias para _status trackers_, que es
  exactamente lo que esta página es.

---

## Qué es esta pantalla (y por qué eso manda)

No es una landing: es un **status tracker** (NN/G) — alguien que ya pagó y
quiere saber si está dentro. Eso cambia las prioridades: aquí no hay que
persuadir, hay que **responder rápido, con certeza y sin adornos**. La mitad de
lo que la hace parecer generada es que está diseñada como si fuera una landing
de producto.

## Lo que esta página hace hoy, verificado en el código

Antes de la lista, lo que se puede comprobar abriendo el archivo — no es
opinión:

- Los colores se llaman `brandPurple` y `brandPink` **y el propio comentario
  dice que el nombre "viene del clon del 10K de Ambato"**. Literalmente una
  plantilla heredada.
- `bebasClassName = "font-bebas"`, una fuente que el sitio ya no usa (ahora es
  Archivo). Estilo huérfano.
- El **código de barras del ticket es decorativo** y el QR se genera en
  `api.qrserver.com` metiendo cédula y nombre en la URL de un tercero.
- El ticket cae a **`"PRE-ORDER"`** —en inglés— cuando no hay ID.
- Los acentos de las columnas son `border-purple-500` y `border-pink-500`: dos
  colores que no significan nada y que no están en los tokens de la marca.

---

## TOP 100, de mayor a menor impacto

### Estructura: dejar de ser una landing (1–12)

1. **Quitar la columna izquierda de marketing.** Logo gigante + titular +
   párrafo + tres datos (8K / Ago 29 / Patate) es el patrón hero-de-landing. El
   que llega aquí ya se inscribió: no hay que venderle la carrera otra vez.
2. **Un solo objeto en pantalla: el campo de cédula.** Una pantalla que hace una
   cosa se lee como hecha a propósito; una que hace tres, como generada.
3. **La fila de tres datos (8K / Ago 29 / Patate) es "las 3 tarjetas"** del
   patrón AI, disfrazada. Fuera de esta página.
4. **Romper la simetría de dos columnas 50/50.** El consenso señala la retícula
   perfecta como delator; una composición asimétrica se lee como decidida.
5. **Recortar el padding.** Es la señal nº1 de 2026. Aquí sobra aire por todos
   lados: la tarjeta puede ocupar la mitad de alto.
6. **Que quepa sin hacer scroll en un móvil**: campo, botón y ayuda.
7. **Resultado en la misma vista, sin salto**: el ticket aparece donde estaba el
   formulario, no debajo.
8. **Enfocar el campo al cargar.** El 100% de quien entra viene a escribir ahí.
9. **Enviar con Enter.** Hoy solo funciona el botón — un formulario que ignora
   Enter se siente a maqueta, no a producto.
10. **Recordar la última cédula consultada** (localStorage): el 80% vuelve a
    mirar lo mismo.
11. **Enlace directo `?cedula=` compartible**, para que el call center lo mande
    resuelto por WhatsApp.
12. **Quitar la marca de agua del hero de fondo detrás de la tarjeta**: dos
    imágenes compitiendo es relleno.

### Los cinco delatores concretos de esta página (13–22)

13. **Renombrar `brandPurple`/`brandPink` a los tokens reales de la marca.** Un
    nombre heredado de otro evento es la prueba de plantilla.
14. **Borrar `font-bebas`**, que no existe ya en el sitio.
15. **Quitar el código de barras decorativo.** Un código que no codifica nada es
    exactamente el tipo de adorno que delata lo generado.
16. **O que el código de barras sea real** (el dorsal), o no está.
17. **Generar el QR en el propio sitio**, no en `api.qrserver.com`: además de
    verse genérico, manda cédula y nombre a un tercero en cada consulta.
18. **Que el QR contenga algo útil** para la entrega de kits, no
    `CEDULA:x|NOMBRE:y`.
19. **Fuera `"PRE-ORDER"`**: una cadena en inglés en un sitio en español es la
    huella del andamiaje.
20. **Quitar los `border-purple-500` / `border-pink-500`** de Categoría y
    Ciudad: color sin significado.
21. **Quitar el `animate-pulse` del punto de estado.** Un estado que ya no
    cambia no debe latir.
22. **Un radio de esquina propio y consistente** (no 32px en todo).

### El botón y el campo (23–34)

23. **Botón de color plano de marca, no degradado naranja→rosa.** El degradado
    en el CTA es de los tells más citados.
24. **Sin `uppercase` + `tracking-widest`** en el botón: es el look "plantilla
    premium".
25. **Texto del botón que diga el resultado**: "Ver mi inscripción" mejor que
    "Consultar Inscripción".
26. **Un solo peso tipográfico dominante**, no bold en todo.
27. **Estado hover/active de verdad.** "Hover states mínimos" está en la lista
    de las cuatro señales de 2026.
28. **Estado de foco visible y de marca** (accesibilidad + se nota que alguien
    lo pensó).
29. **`inputmode="numeric"` ya está; añadir `autocomplete`** y patrón.
30. **Placeholder con un ejemplo local real**, no "Ej: 1801234567" genérico.
31. **El label fuera de mayúsculas con `tracking-widest`**: otro tic de plantilla.
32. **El icono dentro del cuadrado redondeado de la cabecera es el patrón
    shadcn**. O se quita, o se sustituye por algo de la marca (la mandarina).
33. **Botón deshabilitado con motivo escrito**, no solo al 60% de opacidad.
34. **Ancho del campo acorde a lo que se escribe** (10 dígitos), no al 100%.

### Errores y estados vacíos — donde más se nota lo humano (35–48)

35. **No borrar nunca lo que escribió** tras un error (Baymard: de los fallos
    más dañinos).
36. **4–7 mensajes de error distintos**, no uno genérico (Baymard): cédula
    corta, con letras, no encontrada, servicio caído, sin internet, pago aún no
    cargado, cédula de otra persona.
37. **"No encontrado" no puede ser un callejón**: decir qué hacer (¿te
    inscribiste por WhatsApp? ¿hace menos de 48 h?).
38. **Distinguir "no existe" de "aún no está cargada"**. Hoy son lo mismo y son
    problemas opuestos.
39. **El error dice el siguiente paso, no la causa técnica.**
40. **Nada de "Error de conexión. Inténtalo de nuevo"** a secas: es la frase por
    defecto del andamiaje.
41. **Un estado de carga honesto** ("Buscando en el sistema…") en vez del
    spinner genérico.
42. **Si tarda más de 3 s, decirlo.**
43. **Reintento con un clic**, sin volver a escribir.
44. **`aria-live` en el resultado** — ya está en el error; falta en el éxito.
45. **El foco salta al resultado** al aparecer.
46. **Mensajes en la voz de la organización**, no de un producto SaaS: "no te
    encontramos" antes que "No se pudo completar la solicitud".
47. **Escribir para escanear** (NN/G, +58% de usabilidad): frases cortas, dato
    primero.
48. **Nada de signos de exclamación de más ni emojis** en los estados.

### El ticket (49–62)

49. **Que parezca un dorsal, no una tarjeta de SaaS.** La marca ya tiene un
    lenguaje gráfico (flyer, montañas, degradado cálido): usarlo aquí.
50. **El nombre y el estado son lo único grande.** Lo demás es apoyo.
51. **Quitar el "Ticket ID"** si no sirve para nada en la entrega.
52. **Añadir lo que sí hace falta el viernes**: qué llevar y hasta qué hora.
53. **Los cuatro datos (categoría, ciudad, edad, género) en una lista sobria**,
    no en una rejilla de tarjetas iguales.
54. **La edad y el género no aportan nada aquí** — se pueden quitar.
55. **Un solo color de acento** en todo el ticket.
56. **Sombra contenida**, no `0 40px 100px`.
57. **Los recortes semicirculares del ticket están bien**: es de lo poco con
    personalidad. Reforzarlo (troquelado, línea de puntos real).
58. **Preparar el ticket para pantallazo**: es como se va a usar de verdad.
59. **Y para impresión** (`@media print`), que hay quien lo lleva en papel.
60. **Que el ticket se vea igual de bien en claro que en oscuro** si alguien lo
    captura y lo manda.
61. **Nada de "descarga tu ticket digital"** si no se descarga nada.
62. **Fecha y hora de la consulta** en el ticket: da veracidad.

### Contenido con el que ninguna IA puede rellenar (63–74)

63. **Fotos reales de la entrega de kits del año pasado** en esta página.
64. **El nombre de la persona que atiende** en Vehicentro.
65. **Una foto del punto de entrega** para que se reconozca al llegar.
66. **Un mapa estático del punto**, no incrustado.
67. **El horario escrito como se dice aquí** ("de 10 a 5 de la tarde").
68. **Frases de la organización, no de manual**: cómo lo dirían por WhatsApp.
69. **Los patrocinadores reales al pie** — no logos genéricos.
70. **Decir cuántos días tarda la validación** (2–3) donde se ve el estado.
71. **Explicar qué significa cada estado en una línea**, sin jerga del CRM.
72. **Firmar la página**: "8K Ruta de las Mandarinas · Patate, Ecuador".
73. **Un detalle local que nadie generaría** (la mandarina, el Tungurahua al
    fondo, el sello del GAD).
74. **Errores de escritura humanos NO** — pero sí giros locales.

### Ayuda y salida (75–84)

75. **La ayuda no es un enlace pequeño al pie.** Quien no encuentra su pago está
    nervioso: la salida tiene que ser visible.
76. **Dos salidas: el WhatsApp y el punto físico** del viernes. _(Aplicado hoy.)_
77. **El WhatsApp con el mensaje ya escrito**, incluida la cédula. _(Aplicado.)_
78. **Decir cuándo contestan** ("de 9 a 18 h").
79. **Un teléfono que se pueda marcar**, no solo WhatsApp.
80. **Si el pago está sin verificar, decir desde cuándo** y cuándo se revisará.
81. **Si falta el pago, la cuenta ahí mismo.** _(Aplicado hoy.)_
82. **Botón de copiar con confirmación visible.** _(Aplicado.)_
83. **Enlace a /informacion para lo demás**, no repetir todo aquí.
84. **Volver a consultar otra cédula sin recargar** — ya existe, hacerlo visible.

### Detalles finos (85–94)

85. **Números tabulares** en cédula y ticket.
86. **La cédula en grupos legibles** (`1801-234-567`) al mostrarla.
87. **Transiciones cortas (120–180 ms) y solo donde hay cambio de estado.**
88. **Respetar `prefers-reduced-motion`.**
89. **Contraste comprobado** sobre el degradado cálido (el naranja claro no
    llega a 4.5:1 con blanco — ya está el token `--scrim` para eso).
90. **Nada de blur de fondo en móvil**: cuesta y no aporta.
91. **Que la tarjeta no "flote" con 3 sombras superpuestas.**
92. **Tipografía de la marca en los números grandes**, no la de sistema.
93. **Un `<title>` propio de la página** con el nombre de la carrera.
94. **Que el enlace compartido por WhatsApp enseñe algo útil** en la vista
    previa.

### Lo último, y aun así conviene (95–100)

95. **Medir cuánta gente consulta y cuántas veces**: sin datos esto es opinión.
96. **Guardar los "no encontrado"** para saber a quién le falta cargarse.
97. **Probarla con una persona de 65 años** (categoría Leyenda existe).
98. **Probarla con datos móviles lentos**, no en wifi.
99. **Revisarla el sábado a las 6 de la mañana**, que es cuando se va a usar de
    verdad.
100.  **Escribir en `notas/` qué se cambió y qué pasó.**

---

## Qué se aplicó el 26-ago-2026

Las diez de abajo, más la 14, 19, 20, 21, 32 y 38. El detalle de cada una y lo
que se dejó fuera está en `notas/24-verificar-anti-ia-8k.md`, que es la
bitácora.

## Las 10 que yo haría primero

1, 5, 9, 13, 15, 17, 23, 35, 37, 76.

Son las que más cambian la percepción por menos riesgo a tres días de la
carrera: quitar la columna de landing y el aire sobrante, arreglar Enter y el
foco, borrar los nombres y adornos heredados del clon, sacar el QR de un
tercero, plano en vez de degradado en el botón, y que los errores dejen de ser
un callejón.

**Fuentes:** [Shuffle — Why Do Most AI-Generated Websites Look the Same (ene-2026)](https://shuffle.dev/blog/2026/01/why-do-most-ai-generated-websites-look-the-same/) · [925studios — AI Slop Web Design Guide (2026)](https://www.925studios.co/blog/ai-slop-web-design-guide) · [Mateusz Sikora — Top 10 Signs a Website Was Built by AI](https://sikora.software/blog/ai-website-design) · [AXE-WEB — Why AI Websites All Look the Same](https://axe-web.com/insights/ai-website-design-sameness/) · [Originality.AI — How to Identify AI-Generated Websites](https://originality.ai/blog/how-to-identify-ai-generated-websites) · [Baymard — Order Tracking & Returns UX Benchmark](https://baymard.com/blog/2024-benchmark-order-tracking-and-returns) · [Baymard — Order Tracking UX: 6 Key Details](https://baymard.com/blog/integrate-tracking-info) · [Baymard — Accounts & Self-Service UX Research](https://baymard.com/research/self-service) · [NN/G — Status Trackers: 6 Guidelines](https://www.nngroup.com/videos/status-trackers/) · [NN/G — Transactional Email and Confirmations](https://www.nngroup.com/reports/ecommerce-transactional-email-confirmation-message/) · [Dark Glassmorphism 2026 (Medium)](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f) · [10 UX Writing Principles 2026](https://www.parallelhq.com/blog/ux-writing-best-practices)
