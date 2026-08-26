# 100 estrategias de urgencia — 8K Ruta de las Mandarinas · 26-ago-2026

Investigación pedida el 26 de agosto de 2026: **cómo hacer que el sitio transmita
urgencia** faltando 3 días para la carrera. Fuentes: Race Roster ("Creating a
Sense of Urgency: Boosting Event Registration in the Final 30–60 Days"), el
RaceTrends Report 2025 vía RunSignup, Swoogo ("How To Tackle Late Event
Registrations"), ACTIVE Network, RaceID, y la literatura de CRO sobre escasez y
prueba social (Cialdini; recopilaciones de abmatic, Bird, peasy). Se cruzan con
`docs/30-UX-CONVERSION.md` y `docs/50-CONSEJOS-CARRERAS.md`.

**Los tres números de la investigación que mandan aquí:**

1. **El 26% de todas las inscripciones de una carrera entran en los 3 días
   previos a una subida de precio o a un cierre** (RaceTrends 2025). Estamos
   exactamente en esa ventana, y el sitio no la estaba usando.
2. Un contador sube la conversión entre un 5% y un 30%, **pero solo si el plazo
   se percibe como real**. La urgencia falsa tiene rendimientos decrecientes:
   la gente aprende a ignorarla.
3. "Solo quedan X" sube la intención de compra ~22%; escasez + popularidad
   juntas, entre 25% y 45%.

**Los datos REALES de esta carrera (CRM, 26-ago):** 678 fichas · 579 pagadas y
verificadas · 630 corredores dentro · 90% vendido · 34 sin pagar ($680) · Leyenda
15 inscritos y Discapacidad 11 · entrega de kits el viernes 28 de 10h00 a 17h00,
ventana única · salida sábado 29, 08h00.

> **La regla que no se rompe.** Todo lo de esta lista tiene que ser verdad. Ya
> está escrito en el propio código (`ContadorSesion.tsx`: _"lo que dice tiene que
> ser verdad; prometer un castigo que no llega enseña a la gente a no hacer caso
> del siguiente aviso"_). Un cierre inventado se descubre solo: el que vuelve
> mañana lo ve abierto. Las 12 estrategias del final están en la lista
> precisamente para NO usarlas.

---

## A. Las 10 que más mueven aquí (1–10) — aplicadas hoy

1. **Cambiar el plazo del que se habla: del sábado al VIERNES 17h00.** La salida
   es el sábado, pero el plazo que decide es el cierre de la entrega de kits:
   ventana única, y sin kit no hay dorsal ni chip. Cae ~15 h antes y además
   explica por qué hay prisa. Es el "registration close" de la estadística nº1.
2. **Contador vivo hacia ese plazo, no hacia la carrera.** En el hero, en el
   formulario y en el aviso del home.
3. **Decir el número de inscritos, no solo el porcentaje.** "630 corredores ya
   están inscritos" es prueba social dura; "90% vendido" es escasez. Juntas es
   el combo del 25–45%. El sitio tenía el número en el código _sin usarlo_ y
   desactualizado en 340 desde julio.
4. **Nombrar lo que se pierde, no lo que se gana.** "Sin kit no se corre" pesa
   más que "inscríbete ya". Aversión a la pérdida.
5. **Poner el plazo donde ya está mirando el que duda**: hero, categorías, FAQ y
   la barra inferior del móvil — no en una sección nueva que hay que buscar.
6. **Rescatar al que dijo que sí y no pagó.** 34 personas, $680, todas con
   teléfono. `/verificar` ahora les dice "Falta tu pago" con la cuenta, botón de
   copiar y WhatsApp con el mensaje escrito.
7. **Escasez por categoría, sin cifras.** Leyenda y Discapacidad son las que
   menos corredores reúnen y reparten los mismos premios ($80/$60/$40): ahí se
   sube al podio con menos competencia. Se dice el hecho, no el número (ver 3).
8. **Contestar "¿hasta cuándo puedo inscribirme?" antes de que la pregunten.**
   Es la pregunta de estos tres días y no estaba en la FAQ.
9. **Un aviso fijo y estrecho arriba del todo**, con el contador, en todas las
   páginas públicas. Se ve sin bajar y no tapa nada.
10. **Recordatorio del kit a los que YA pagaron.** No vende, pero evita el
    no-show, que es el otro agujero de estos días: 630 pagados y una sola
    ventana de entrega.

## B. Plazos y contadores (11–25)

11. Un solo plazo protagonista en toda la web: dos relojes compiten y ninguno
    aprieta.
12. El contador en horas totales, no en días: "29 h" empuja, "1 día" no.
13. Debajo del contador, siempre qué pasa al llegar a cero. Un reloj sin
    consecuencia es decoración.
14. Cambiar el texto según se acerca: "esta semana" → "mañana" → "hoy hasta las
    17h00".
15. Dígitos tabulares para que no bailen; el baile distrae del mensaje.
16. Recalcular contra la hora real en cada tic (un contador que resta se atrasa
    cuando el móvil bloquea la pantalla) y en zona horaria de Ecuador.
17. Que el contador exista sin JavaScript o que no exista: el número de días
    puede venir del servidor.
18. Al pasar el plazo, el contador cambia de mensaje, no se queda en 00:00:00.
19. Fechas absolutas junto a las relativas: "viernes 28, 17h00" y no solo
    "quedan 29 h".
20. La hora de cierre siempre con la ciudad ("Ambato"), que es donde se retira.
21. Nada de temporizadores que se reinician al recargar: es la señal más clara
    de que el plazo es de mentira.
22. El contador de sesión del formulario (15 min) NO se toca: no caduca nada y
    está documentado así. Dos urgencias distintas, cada una en su sitio.
23. Contador también en el correo/WhatsApp de confirmación, no solo en la web.
24. Avisar del plazo dos veces: a 5–7 días y a 1–2 días (los envíos que más
    convierten, según RaceTrends).
25. Cada subida de precio es un evento de marketing en sí mismo: si hay
    escalado, se anuncia; si no lo hay, no se insinúa.

## C. Escasez (26–40)

26. Escasez de CUPO solo si hay cupo máximo de verdad y se puede enseñar.
27. Escasez de TIEMPO cuando no hay tope de aforo: es el caso de esta carrera.
28. Escasez de KIT: tallas de camiseta que se agotan — es real y es concreto.
29. Escasez por categoría (Leyenda, Discapacidad) con el número exacto.
30. "Quedan pocos" sin número no lo cree nadie; con número, sube ~22%.
31. Nunca bajar un contador de cupos a mano para simular ventas.
32. Si el cupo se agota de verdad, decirlo y abrir lista de espera: la escasez
    cumplida vale para la edición siguiente.
33. Enseñar lo que ya no se puede conseguir (una talla agotada, un plazo
    cumplido) da credibilidad a lo que sí queda.
34. Escasez geográfica: "última entrega en Ambato, no hay entrega en Patate".
35. Escasez de servicio: el equipo que valida pagos no trabaja de madrugada del
    viernes al sábado. Decirlo es honesto y aprieta.
36. Una sola ventana de entrega es en sí misma la escasez más fuerte: repetirlo.
37. No inventar "X personas viendo esta página": es el clásico de plantilla y en
    un pueblo se nota.
38. La escasez se enseña, no se grita: un dato pequeño y exacto convence más que
    un banner rojo.
39. Escasez sin prueba social es sospecha; siempre juntas.
40. Cuando algo se agota de verdad, tacharlo en vez de borrarlo.

## D. Prueba social (41–55)

41. ~~El número de inscritos, arriba y en grande.~~ Descartada aquí (ver 3):
    esta carrera no publica cifras de inscritos. Vale para otras.
42. Si se publica un número, actualizarlo de verdad; uno congelado se nota y
    desactiva el efecto — el del sitio llevaba en 340 desde julio.
43. Y redondearlo hacia abajo: exagerar cuesta más de lo que da.
44. ~~Inscritos por ciudad~~ — misma decisión que 41.
45. Fotos reales de la edición anterior — ya están, 24 en la galería.
46. Los patrocinadores como aval institucional (OSCUS, Vehicentro, GAD).
47. Caras y nombres de corredores reales antes que ilustraciones.
48. Testimonios cortos con nombre y ciudad; los anónimos no valen.
49. Enseñar el acta de resultados de la edición pasada: prueba de que la carrera
    existe y se organiza bien.
50. "Se corre desde hace X ediciones" en vez de "la mejor carrera".
51. ~~Contadores de inscritos por categoría~~ — misma decisión que 41.
52. ~~Compartir el ritmo ("50 inscritos solo hoy")~~ — misma decisión que 41.
    Sirve puertas adentro para decidir, no para publicar.
53. Reseñas de la edición anterior en la misma página del formulario.
54. Prueba social en el paso 1 del formulario, no solo en el home: ahí es donde
    se abandona.
55. El pico de tráfico como argumento en redes, no en la web.

## E. Precio y valor (56–65)

56. Si hay preventa, con fecha de fin visible. Sin fecha no significa nada — por
    eso aquí se quitó la palabra: el precio es el mismo para todos y no sube.
57. Si el precio no va a subir, no decir que sube. Se descubre y quema.
58. Comparar contra el valor del kit (camiseta + dorsal + chip + medalla).
59. Los premios económicos ($120/$100/$80 en Élite) como parte del retorno.
60. Descuento de grupo con plazo: 4+ corredores hasta el jueves.
61. "$18 para Leyenda y Discapacidad" al lado del precio normal, no escondido.
62. Precio por kilómetro ($2,50/km) para que el número se sienta pequeño.
63. Sin cobros ocultos; decir que el sitio no procesa cobros baja el miedo.
64. El precio siempre junto al CTA, nunca a un clic.
65. Nada de "descuento solo hoy" si mañana sigue: es el mismo pecado del 57.

## F. Copy y jerarquía (66–78)

66. Verbos de plazo en los titulares: "hasta", "antes de", "queda".
67. La consecuencia primero: "Sin kit no se corre", después el detalle.
68. Segunda persona: "tu kit", "tu cupo", "tu comprobante".
69. Frases cortas en los avisos de urgencia; una idea por línea.
70. El CTA dice lo que pasa después ("Inscribirme ahora"), no "Enviar".
71. Números en dígitos (630, 29 h): se leen más rápido que en letra.
72. Un solo color de alarma en todo el sitio (el ámbar `#ffc53d`), o deja de
    significar alarma.
73. Nada de rojo parpadeante ni MAYÚSCULAS gritadas: parece estafa.
74. El aviso de urgencia se puede cerrar; uno que no se cierra se odia.
75. Mismo mensaje en web, WhatsApp y redes el mismo día.
76. Título y descripción de la página con el plazo: es lo que se ve al
    compartir el enlace por WhatsApp, que es como se difunde esta carrera.
77. El texto del enlace compartido pesa más que el de la página: cuidarlo.
78. Evitar el "¡No te lo pierdas!" genérico; decir qué se pierde exactamente.

## G. Formulario e inscripción (79–88)

79. Urgencia dentro del formulario, no solo antes: ahí es donde se abandona.
80. Prueba social en el paso 1 (630 dentro) para pasar del "¿y si no?".
81. Guardar el progreso — ya lo hace — y decirlo: quita el miedo a empezar.
82. Menos campos = menos abandono; cada campo es una oportunidad de irse.
83. Los datos del banco copiables de un toque: un dígito mal es un pago perdido.
84. Confirmación inequívoca al terminar, con código legible (MAND-XXXXXX).
85. Decir cuánto tarda la validación (2–3 días) antes de que lo pregunten.
86. Camino alternativo visible por WhatsApp para quien no se fía de la web.
87. Recuperación del abandono: quien empezó y no terminó merece un mensaje.
88. El formulario nunca debe caducar de verdad: se puede meter prisa sin castigo.

## H. Después del "sí" (89–94)

89. `/verificar` como cobrador, no como consulta: al que le falta pagar, la
    cuenta y el WhatsApp ahí mismo.
90. Traducir la jerga del CRM: "Pago Solicitado" no significa nada fuera.
91. Recordatorio del kit a los pagados, con qué llevar y hasta qué hora.
92. El ticket digital descargable/capturable: da sensación de "ya estoy dentro".
93. Pedir que compartan que se inscribieron; cada uno arrastra a alguien.
94. Al pasar el plazo, ofrecer WhatsApp antes de que paguen en vano.

## I. Operación (95–100)

95. Verificar los pagos rápido: 56 esperando el 26-ago, 48 de ese mismo día.
    Cada hora de retraso es una llamada al call center.
96. Llamar a los 34 que no pagaron ANTES de tocar nada más: es lo único de esta
    lista que se cobra hoy.
97. Anotar el `Valor` en el CRM siempre: hay 26 fichas pagadas sin importe.
98. Cerrar las fichas con etapa vacía (9): nadie sabe si pagaron.
99. Medir: sin analítica, todo esto es opinión. Al menos contar inscripciones
    por día antes y después.
100.  Escribir en una nota qué se aplicó y qué pasó. La edición que viene empieza
      aquí.

---

## Las que NO se aplican (y por qué se escriben)

Se dejan por escrito para que nadie las proponga otra vez creyendo que son
buenas ideas:

- ✗ Contador hacia un cierre de inscripciones que no va a existir.
- ✗ Temporizador que se reinicia al recargar la página.
- ✗ "Solo quedan 3 cupos" sin cupo real.
- ✗ "12 personas viendo esto ahora mismo".
- ✗ Descuento "solo hoy" que sigue mañana.
- ✗ Precios tachados que nunca se cobraron.
- ✗ Testimonios inventados o fotos de banco de imágenes como si fueran de aquí.
- ✗ Pop-up que no se puede cerrar o con la X escondida.
- ✗ Casillas premarcadas.
- ✗ Escasez de talla falsa para empujar a otra.
- ✗ Avisos que interrumpen a quien está escribiendo en el formulario.
- ✗ Amenazar con borrar el formulario si tarda: ya se probó y se descartó
  (`useCuentaAtras.ts`) — convertía al que estaba pagando en el que vuelve y
  encuentra todo vacío.

## Pendientes (decisión del equipo)

- **Nº 9 — aviso fijo y estrecho arriba del todo, en las 10 páginas públicas.**
  Es de las de más impacto y no está hecho: toca el layout de todas y a tres
  días de la carrera no daba tiempo a probarlo bien en las diez.
- **Nº 24, 87 — recordatorios a 1–2 días y rescate de abandonos.** Necesitan
  correo o WhatsApp masivo, que no vive en este repositorio.
- **Nº 99 — medición.** El sitio no tiene analítica: todo lo de aquí se juzga
  contando inscripciones por día en el CRM.
- **Nº 3, 41, 44, 51, 52 — cualquier cifra de inscritos.** Descartadas por
  decisión de la organización el 26-ago-2026. No es un olvido: no se publican.
- **Nº 26, 32 — escasez de cupo.** Solo si existe un aforo máximo de verdad.
  Nadie ha dicho cuál es; hasta saberlo, se habla de tiempo y no de cupos.

## Qué se aplicó el 26-ago-2026

| #         | Estrategia                                                  | Dónde                                                          |
| --------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| 1, 2      | Contador al cierre del kit (viernes 17h00), no a la salida  | `UrgenciaCarrera.tsx`, `HeroCountdown.tsx`, `AvisoUrgente.tsx` |
| 3         | 630 inscritos como prueba social                            | `carrera.ts` (dato real), hero y formulario                    |
| 4, 67     | "Sin kit no se corre"                                       | hero, aviso, formulario, FAQ                                   |
| 5, 9      | Aviso fijo con el plazo en todas las páginas públicas       | `AvisoUrgente.tsx`                                             |
| 6, 89, 90 | `/verificar` cobra: cuenta, copiar y WhatsApp               | `verificar/page.tsx`                                           |
| 7, 29     | Escasez real por categoría (Leyenda 15, Discapacidad 11)    | `CategoriasHome.tsx`                                           |
| 8         | "¿Hasta cuándo puedo inscribirme?" en la FAQ                | `FaqHome.tsx`                                                  |
| 10, 91    | Recordatorio del kit a los ya pagados                       | `verificar/page.tsx`                                           |
| 76        | Plazo en el título y la descripción que se ven al compartir | `layout.tsx`                                                   |
| 96        | Lista de los 34 por cobrar                                  | `por-cobrar-26-ago.csv` (fuera del repo)                       |

**Fuentes:** [Race Roster — Creating a Sense of Urgency](https://raceroster.com/articles/creating-a-sense-of-urgency-boosting-event-registration-in-the-final-30-60-days) · [RunSignup — 4 Ways to Grow Your Race](https://info.runsignup.com/2026/04/10/4-ways-to-grow-your-race/) · [Swoogo — How To Tackle Late Event Registrations](https://swoogo.events/blog/how-to-tackle-late-event-registrations/) · [ACTIVE Network — 4 Ways to Boost Race Signups](https://www.activenetwork.com/blog/4-ways-to-boost-race-signups-without-breaking-the-bank) · [RaceID — 3 Ways to Beat Late Registrations](https://raceid.com/organizer/event-marketing/3-ways-to-beat-late-registrations/) · [abmatic — Scarcity and urgency in CRO](https://abmatic.ai/blog/role-of-scarcity-and-urgency-in-conversion-rate-optimization) · [Bird — Scarcity & Urgency for CRO](https://bird.marketing/blog/digital-marketing/guide/conversion-rate-optimization/use-scarcity-urgency-for-cro/) · [peasy — Urgency and Scarcity in Ecommerce](https://www.peasy.nu/blog/the-power-of-urgency-and-scarcity-in-e-commerce)
