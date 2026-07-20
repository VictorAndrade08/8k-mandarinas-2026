# 100 consejos de línea gráfica, de mayor a menor impacto

Investigación hecha para este sitio (julio 2026) sobre Nielsen Norman Group,
WCAG 2.2, Material Design 3, Apple HIG, Baymard Institute, Refactoring UI y
web.dev. Las fuentes van al final. Están ordenados por impacto: el 1 es el que
más mueve la aguja.

La auditoría de lo que este sitio cumple e incumple está en
[`LINEA-GRAFICA.md`](./LINEA-GRAFICA.md).

## Los que este sitio incumple hoy (verificado sobre el código y las capturas)

| #   | Consejo                                       | Prueba                                                     | Estado    |
| --- | --------------------------------------------- | ---------------------------------------------------------- | --------- |
| 19  | Tokens semánticos en vez de colores literales | 258 hex a mano en `app/**/*.tsx`, 0 usos de `--brand-*`    | parcial   |
| 30  | Dos radios de esquina, no más                 | 14 radios distintos                                        | parcial   |
| 41  | Tres niveles de sombra como máximo            | 32 sombras a medida                                        | parcial   |
| 23  | Escala tipográfica fija de 6-8 tamaños        | 20+ tamaños en px sueltos                                  | pendiente |
| 35  | Paleta sistemática desde un tono clave        | 28 colores elegidos a ojo, tres paletas conviviendo        | hecho     |
| 71  | Iconos de una sola familia y un solo estilo   | Barra inferior: 4 iconos `regular` gris + 1 `bold` blanco  | hecho     |
| 10  | Mismos labels de navegación en todas partes   | Header decía "Verificar mi pago", barra inferior "Mi pago" | hecho     |
| 20  | Indicar la página activa con más que color    | Solo cambiaba el color del texto                           | hecho     |
| 88  | 8px mínimo entre áreas táctiles               | "INSCRIBIRME" tocaba el borde derecho a 390px              | hecho     |

---

1. [ACCESIBILIDAD] Contraste ≥4.5:1 en texto normal y ≥3:1 en texto grande (≥24px, o ≥18.66px bold); verifícalo con un checker en cada par color/fondo del sitio — sin esto el texto simplemente no se lee al sol o en pantallas baratas, y es el fallo más común en webs de carreras (WCAG 2.2, 1.4.3)
2. [NAVEGACIÓN] El CTA principal ("Inscríbete") debe estar visible sin hacer scroll en móvil (dentro de los primeros 100vh) y repetirse al final de la página — el usuario que llega a inscribirse no debe buscar (Guidebook / event landing best practices)
3. [FORMULARIOS] Formulario de inscripción en UNA sola columna, sin campos lado a lado — Baymard: el 16% de sitios usa multi-columna y es causa directa de errores y abandono (Baymard, Form Design)
4. [ACCESIBILIDAD] Todo elemento interactivo con área táctil ≥24×24px CSS (objetivo real recomendado: 44×44px iOS / 48×48px Android) — WCAG 2.2 SC 2.5.8 es AA obligatorio (WCAG 2.2 / Apple HIG / Material 3)
5. [FORMULARIOS] Etiquetas SIEMPRE encima del campo, nunca dentro (placeholder como label) — Baymard: los inline labels fallaron en todos sus tests de usabilidad porque desaparecen al escribir (Baymard, mobile forms)
6. [RENDIMIENTO] LCP <2.5s, INP <200ms, CLS <0.1 en el percentil 75 de usuarios reales; mide con PageSpeed Insights datos de campo, no de laboratorio (web.dev, Core Web Vitals)
7. [COLOR] Máximo 1 color de acento para acciones primarias; ese color se usa SOLO en el CTA principal, nunca en decoración — si todo destaca, nada destaca (Refactoring UI)
8. [CONTENIDO] Qué, cuándo, dónde y precio visibles sobre la línea de flotación: nombre de la carrera, fecha, ciudad, distancias y precio — es lo que el usuario vino a verificar (event landing best practices)
9. [FORMULARIOS] Reduce el formulario a los campos legalmente imprescindibles; >10-15 campos visibles intimidan a los participantes en test (Baymard: 18% abandona por formularios "demasiado largos")
10. [NAVEGACIÓN] La navegación principal debe ocupar la misma posición, mismo orden y mismos labels en el 100% de las páginas — la inconsistencia de ubicación es el fallo de consistencia más caro (NN/g, Consistency and Standards)
11. [TIPOGRAFÍA] Máximo 2 familias tipográficas en todo el sitio (una display + una de texto); una tercera casi nunca aporta (Refactoring UI)
12. [ESPACIADO] Escala de espaciado en múltiplos de 4px (4/8/12/16/24/32/48/64/96), sin valores fuera de escala tipo 13px o 27px — Material 3 usa rejilla de 4dp; Apple, incrementos de 8pt (Material 3 / Apple HIG)
13. [TIPOGRAFÍA] Texto de cuerpo ≥16px en móvil (nunca 14px o menos) — por debajo, iOS hace zoom automático al enfocar inputs y rompe el layout (USWDS / mobile form guidance)
14. [COMPONENTES] Un único componente Botón con 3 variantes definidas (primario, secundario, texto) reutilizado en todo el sitio; audita que no haya 6 botones distintos entre home, inscripción y pago (NN/g, consistencia interna)
15. [FORMULARIOS] Validación inline al salir del campo (on blur), no al enviar — aumenta la finalización ~22%; el 31% de sitios no la tiene (Baymard)
16. [ACCESIBILIDAD] Foco visible en todos los elementos: contorno de ≥2px CSS de grosor y ≥3:1 de contraste entre estado enfocado y no enfocado; nunca `outline: none` sin sustituto (WCAG 2.2, SC 2.4.13 / 1.4.11)
17. [JERARQUÍA] Un único H1 por página que coincida con la promesa del CTA; jerarquía H1>H2>H3 sin saltos de nivel (NN/g, homepage guidelines)
18. [MOVIMIENTO] Respeta `prefers-reduced-motion`: desactiva parallax, autoplay y animaciones de entrada cuando el usuario lo pide (WCAG 2.2, 2.3.3)
19. [COLOR] Define tokens semánticos, no literales: `color-cta`, `color-error`, `color-surface` en lugar de `naranja-500` — el nombre sobrevive al cambio de marca (Smashing Magazine, naming design tokens)
20. [NAVEGACIÓN] Indica siempre dónde está el usuario: el ítem de nav activo con un estado visual distinto (peso + color + subrayado), no solo color (NN/g, "Navigation: You Are Here")
21. [FORMULARIOS] Usa `autocomplete` HTML correcto en cada campo (`given-name`, `family-name`, `email`, `tel`, `bday`, `postal-code`) — rellenar solo es la mayor reducción de fricción móvil que existe
22. [ACCESIBILIDAD] No transmitas información solo con color: los errores de formulario deben tener icono + texto además del rojo (WCAG 2.2, 1.4.1)
23. [TIPOGRAFÍA] Escala tipográfica modular fija de 6-8 tamaños (ej. 12/14/16/18/24/32/48/64), ningún tamaño improvisado — sin valores más cercanos que ~25% entre sí (Refactoring UI)
24. [FORMULARIOS] Auto-rellena los datos que el usuario ya introdujo antes en el mismo flujo (no volver a pedir email en el paso de pago) — WCAG 2.2 SC 3.3.7 Redundant Entry, nivel A
25. [NAVEGACIÓN] Menú principal con 4-7 ítems máximo; si tienes más, agrupa — más de 5 no caben en una barra móvil con targets táctiles válidos (NN/g, mobile navigation patterns)
26. [CONTENIDO] Botones y links empiezan por la palabra con más carga informativa: "Inscribirme al 10K", no "Haz clic aquí" ni "Más info" (NN/g, guideline 34)
27. [FORMULARIOS] Indicador de progreso explícito en formularios multipaso ("Paso 2 de 3") con los pasos nombrados, no numerados a secas — reduce el abandono en pasos intermedios
28. [JERARQUÍA] Jerarquía por tamaño + peso + color, no por tamaño solo; el texto secundario en gris de menor contraste (pero aún ≥4.5:1) en vez de fuente más pequeña (Refactoring UI)
29. [RENDIMIENTO] Reserva espacio con `width`/`height` o `aspect-ratio` en todas las imágenes para CLS 0 — las fotos de carrera son grandes y son la causa #1 de saltos de layout (web.dev)
30. [COMPONENTES] Radio de esquina: elige 2 valores (ej. 8px componentes, 16px tarjetas) y aplícalos como tokens; mezclar 4px, 6px, 10px y 12px es la señal más visible de sitio sin sistema (Refactoring UI)
31. [ESPACIADO] Elementos relacionados más juntos que los no relacionados: la etiqueta a 8px de su input, y 24-32px entre grupos de campos (Ley de proximidad / Refactoring UI)
32. [ACCESIBILIDAD] Todo el flujo de inscripción navegable solo con teclado (Tab/Shift+Tab/Enter), en orden lógico y sin trampas de foco en modales (WCAG 2.2, 2.1.1/2.1.2)
33. [IMÁGENES] Formato WebP o AVIF con `srcset` responsive; nada de JPG de 3000px servidos a un móvil de 390px — típico fallo en galerías de ediciones anteriores
34. [CONTENIDO] Precio total y final visible antes de empezar el formulario, incluidos gastos de gestión — el coste sorpresa es la causa clásica de abandono en el último paso (Baymard, checkout)
35. [COLOR] Paleta sistemática de 5-9 tonos por color base generados desde un tono clave, no colores elegidos a ojo por pantalla — así todos los estados (hover, disabled, borde) son coherentes (Refactoring UI / Material 3 tonal palettes)
36. [NAVEGACIÓN] Logo arriba a la izquierda, siempre enlazando a la home, en todas las páginas — convención externa que el usuario ya trae aprendida (NN/g, guideline 1; Jakob's Law)
37. [FORMULARIOS] Ancho del campo proporcional al dato esperado: DNI corto, email largo, código postal muy corto — Baymard midió vacilación real cuando el ancho no encaja
38. [TIPOGRAFÍA] Longitud de línea de 50-75 caracteres (objetivo 66) en párrafos; limita con `max-width: 65ch` — Baymard: líneas >80 caracteres se saltan un 41% más (Baymard / UXPin)
39. [ACCESIBILIDAD] Contraste ≥3:1 para bordes de inputs, iconos funcionales y estados de componentes (no solo texto) — WCAG 2.2 SC 1.4.11 Non-text Contrast
40. [MOVIMIENTO] Transiciones de 150-300ms para micro-interacciones (hover, apertura de acordeón); >400ms se percibe lento y bloquea la tarea (Material 3 motion)
41. [COMPONENTES] Sistema de elevación con 3 niveles de sombra máximo (nivel 0/1/2), aplicados por token, nunca `box-shadow` inventado por componente (Refactoring UI / Material 3)
42. [CONTENIDO] Un mensaje de error dice qué pasó y cómo arreglarlo: "El DNI debe tener 8 números y una letra", no "Campo inválido" (NN/g, heurística 9)
43. [NAVEGACIÓN] Evita el hamburguesa como única navegación en móvil si la web tiene ≤5 secciones: navegación visible (tabs o barra) siempre gana en descubribilidad — "out of sight, out of mind" (NN/g, mobile navigation)
44. [JERARQUÍA] Un solo CTA primario por pantalla; las acciones secundarias en variante outline o texto — dos botones sólidos del mismo color compiten y bajan conversión (Refactoring UI)
45. [ESPACIADO] Espaciado vertical entre secciones de página consistente y grande (64-96px en desktop, 40-56px en móvil); el mismo valor en todas las secciones de la landing
46. [FORMULARIOS] Teclado móvil correcto por campo: `inputmode="numeric"` para dorsal/DNI, `type="email"`, `type="tel"` — evita que el usuario cambie de teclado 4 veces
47. [ACCESIBILIDAD] El elemento con foco nunca queda tapado por barras fijas, cookie banners o chats flotantes — WCAG 2.2 SC 2.4.11 Focus Not Obscured, nivel AA
48. [IMÁGENES] Todas las imágenes con el mismo tratamiento: mismo radio, mismo ratio de recorte (ej. 16:9 en cards, 1:1 en avatares) y mismo grosor/color de borde (NN/g, consistencia visual)
49. [CONTENIDO] Fecha en formato inequívoco y localizado ("15 de marzo de 2026"), nunca 03/15/26 en un sitio en español (NN/g, consistencia en datos)
50. [RENDIMIENTO] Precarga la fuente principal con `<link rel="preload">` y usa `font-display: swap` — evita el flash de texto invisible sobre el hero
51. [COLOR] Grises con un poco de saturación tomada del color de marca en vez de grises puros #808080 — un gris neutro puro hace que la marca no se sienta en el resto del UI (Refactoring UI)
52. [COMPONENTES] Estados definidos para TODO componente interactivo: default, hover, focus, active, disabled, loading, error — el estado `loading` en el botón de pago evita dobles envíos
53. [FORMULARIOS] No deshabilites el botón de envío hasta que el formulario sea válido: permite pulsarlo y muestra los errores — el botón gris sin explicación deja al usuario atascado (NN/g)
54. [NAVEGACIÓN] Breadcrumbs en páginas internas de más de 2 niveles (Inicio > Carreras > 10K > Reglamento) con el nivel actual no clicable (NN/g)
55. [ACCESIBILIDAD] Textos alternativos descriptivos en imágenes informativas y `alt=""` en las decorativas — el hero de corredores con alt="imagen1" es ruido para lectores de pantalla
56. [TIPOGRAFÍA] Interlineado 1.4-1.6 en texto de cuerpo y 1.1-1.25 en titulares grandes; nunca el mismo line-height para ambos (Refactoring UI)
57. [CONTENIDO] Botón de CTA con verbo en primera persona y resultado claro: "Reservar mi dorsal" en vez de "Enviar" (event landing best practices)
58. [JERARQUÍA] Aplica la regla de contraste de tamaño: entre el H1 y el cuerpo debe haber al menos 2 pasos de la escala tipográfica (ej. 48px vs 16px), no 20px vs 16px
59. [ESPACIADO] Padding interno de botones en escala: 12px/24px (medio) y 16px/32px (grande); no botones con padding distinto según la sección
60. [COMPONENTES] Los modales se cierran con Escape, clic fuera y una X visible ≥44px; el foco entra al modal al abrirse y vuelve al disparador al cerrarse (WCAG / Material 3)
61. [FORMULARIOS] Marca los campos OPCIONALES, no los obligatorios, si la mayoría son obligatorios — invierte la carga visual de asteriscos (NN/g)
62. [RENDIMIENTO] `loading="lazy"` en toda imagen bajo la línea de flotación, pero NUNCA en la imagen del hero (que debe ser `fetchpriority="high"`)
63. [MOVIMIENTO] Nada de autoplay con sonido ni carruseles automáticos en el hero; si hay carrusel, controles visibles y pausa — los usuarios ignoran el contenido rotatorio (NN/g)
64. [ACCESIBILIDAD] Anuncia los cambios dinámicos (errores, "inscripción confirmada") con `aria-live="polite"` o `role="alert"` — si no, el lector de pantalla no se entera
65. [CONTENIDO] Tono de voz uniforme entre home, formulario y mensajes de error/confirmación: si la web tutea, los errores tutean (NN/g, consistencia de contenido)
66. [NAVEGACIÓN] Mecanismo de ayuda (contacto, FAQ, WhatsApp) en la misma posición relativa en todas las páginas del flujo — WCAG 2.2 SC 3.2.6 Consistent Help, nivel A
67. [COLOR] Define color de superficie, de superficie elevada y de borde como tokens separados; no uses `#fff` a pelo repartido por el CSS (Material 3 color roles)
68. [IMÁGENES] Fotos reales de ediciones anteriores de la propia carrera antes que stock genérico — la prueba social visual es el argumento de conversión más fuerte en eventos deportivos
69. [JERARQUÍA] Diseña primero en escala de grises y añade color al final: si la jerarquía no se entiende en gris, el color la está tapando (Refactoring UI)
70. [FORMULARIOS] Selector de fecha de nacimiento con tres campos numéricos o input nativo, nunca tres `<select>` con 100 años de scroll — es el campo que más se atasca en móvil
71. [COMPONENTES] Iconografía de una sola familia y un solo estilo (todos outline o todos filled), mismo grosor de trazo y mismo tamaño de caja (24px) (NN/g, consistencia visual)
72. [ACCESIBILIDAD] Toda acción con arrastre (mapas del recorrido, sliders de talla) debe tener alternativa con un solo puntero — WCAG 2.2 SC 2.5.7 Dragging Movements, nivel AA
73. [CONTENIDO] Fechas límite y precios por tramo en una tabla explícita (inscripción anticipada / general / última hora) con las fechas exactas — evita la duda que frena la compra
74. [ESPACIADO] Márgenes laterales mínimos de 16px en móvil (nunca texto pegado al borde) y contenedor con `max-width` de 1140-1280px en desktop (Apple HIG layout margins)
75. [TIPOGRAFÍA] Máximo 3 pesos por familia (ej. 400/600/800); cada peso extra pesa en la carga y diluye la jerarquía (Refactoring UI)
76. [NAVEGACIÓN] En páginas largas de la landing, ancla la nav interna (sticky) con enlaces a Recorrido / Precios / FAQ y con `scroll-margin-top` para que el título no quede bajo el header
77. [MOVIMIENTO] Feedback inmediato (<100ms) en cada toque: cambio de estado visible al pulsar, aunque la respuesta del servidor tarde (NN/g, heurística 1)
78. [RENDIMIENTO] JS de terceros (píxeles, chats, mapas) cargado con `defer` o tras interacción; un chat widget puede añadir 500ms+ a INP
79. [FORMULARIOS] Guarda el estado del formulario en `localStorage` para que un refresh o un error de red no borre 12 campos ya escritos
80. [COMPONENTES] Los mensajes de estado usan siempre el mismo componente (Alert) con 4 variantes: info, éxito, aviso, error, cada una con su icono fijo
81. [ACCESIBILIDAD] Permite pegar en los campos de email/DNI y no bloquees gestores de contraseñas — WCAG 2.2 SC 3.3.8 Accessible Authentication, nivel AA
82. [JERARQUÍA] Como máximo 3 niveles de importancia visual por sección (primario, secundario, terciario); si necesitas un cuarto, la sección hace demasiadas cosas (Refactoring UI)
83. [CONTENIDO] Elimina las exclamaciones y la jerga de marketing de los titulares; describe el beneficio concreto ("Cierre de inscripciones el 1 de marzo") (NN/g, guidelines 19 y 26)
84. [IMÁGENES] Si pones texto sobre foto, añade una capa de overlay o degradado que garantice el 4.5:1 medido sobre la zona más clara de la imagen, no sobre la media
85. [COLOR] Verifica la paleta en modo oscuro o al menos fija `color-scheme: light` para que el navegador no invierta colores y rompa el contraste del formulario
86. [NAVEGACIÓN] El footer repite la navegación completa + contacto + enlaces legales; en páginas largas es el segundo punto de navegación más usado (NN/g)
87. [FORMULARIOS] Cuando falla el envío, lleva el foco al primer campo con error y muestra un resumen de errores clicable en la parte superior
88. [ESPACIADO] Separación mínima de 8px entre targets táctiles adyacentes (o suficiente para que dos círculos de 24px no se solapen) — WCAG 2.2 SC 2.5.8
89. [COMPONENTES] Cards de distancia (5K/10K/21K) con la misma altura, la misma estructura de contenido y el CTA siempre en la misma posición vertical
90. [MOVIMIENTO] Nada de animaciones que retrasen la aparición del contenido crítico: el hero no debe hacer fade-in de 800ms sobre el CTA principal
91. [TIPOGRAFÍA] Números tabulares (`font-variant-numeric: tabular-nums`) en precios, tiempos y clasificaciones para que las columnas se alineen
92. [CONTENIDO] FAQ con las 8-12 preguntas reales de soporte (¿puedo cambiar el nombre del dorsal?, ¿hay devolución?), no relleno genérico — cada FAQ resuelta es un email menos y una inscripción más
93. [RENDIMIENTO] Presupuesto de peso: <200KB de JS comprimido y <1MB de peso total en la primera vista de la landing de inscripción
94. [IMÁGENES] Mapa del recorrido como imagen estática optimizada + enlace al mapa interactivo, no un iframe pesado cargado por defecto
95. [ACCESIBILIDAD] Idioma declarado (`<html lang="es">`) y `lang` en fragmentos en otro idioma — afecta a la pronunciación del lector de pantalla (WCAG 3.1.1/3.1.2)
96. [COLOR] Documenta un contrato de accesibilidad por token: cada `color-on-X` debe pasar 4.5:1 sobre su `color-X` correspondiente; testéalo en CI (Material 3 color roles)
97. [MOVIMIENTO] Skeleton screens en vez de spinners para cargas >1s de listados (resultados, clasificaciones) — se percibe más rápido
98. [COMPONENTES] Un solo estilo de campo de formulario en todo el sitio: mismo alto (44-48px), mismo borde, mismo radio, mismo foco (NN/g, consistencia interna)
99. [CONTENIDO] Página de confirmación con toda la información accionable (número de dorsal, fecha, ubicación de recogida, botón "añadir al calendario") y no solo "Gracias"
100. [JERARQUÍA] Haz una auditoría anual de consistencia: captura todas las pantallas y busca duplicados de botones, tipos y espaciados; los peores infractores se arreglan primero (NN/g, Consistency and Standards)

---

## Fuentes

- https://www.nngroup.com/articles/consistency-and-standards/
- https://www.nngroup.com/articles/113-design-guidelines-homepage-usability/
- https://www.nngroup.com/articles/mobile-navigation-patterns/
- https://www.nngroup.com/articles/navigation-you-are-here/
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- https://www.w3.org/TR/WCAG22/
- https://baymard.com/learn/form-design
- https://baymard.com/blog/mobile-forms-avoid-inline-labels
- https://baymard.com/blog/line-length-readability
- https://m3.material.io/styles/typography/applying-type
- https://m3.material.io/styles/color/the-color-system/key-colors-tones
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://refactoringui.com/
- https://www.smashingmagazine.com/2024/05/naming-best-practices/
- https://www.alwaystwisted.com/articles/design-token-naming-conventions
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://designsystem.digital.gov/components/typography/
- https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/
- https://www.guidebook.com/post/event-registration-landing-page-tips
