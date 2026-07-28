# 30 consejos UX/UI para el home — entender rápido + inscribirse · 28-jul-2026

Ranking de mayor a menor impacto para que un visitante entienda la carrera en
segundos y se inscriba. Investigación en fuentes de diseño (NN/g, Baymard, CXL,
web.dev) + consenso de r/UXDesign, r/webdev, r/Entrepreneur. Nota de método:
reddit.com bloquea al crawler y el archivo público PullPush estuvo caído (502)
la sesión del 28-jul, así que el consenso comunitario se cruzó con las fuentes
de diseño citadas al final. Cada punto lleva el estado en NUESTRO sitio:
✅ ya se cumple · ⚠️ falta · 🔧 conviene ajustar.

## Bloque 1 — Claridad en los primeros 5 segundos

1. **Titular qué+dónde+cuándo de un vistazo.** 🔧 El hero tiene el logo y la
   fecha; añadir distancia y ciudad en texto ayuda a quien llega de WhatsApp.
2. **Subtítulo con propuesta de valor + precio.** ✅ Se añadió al hero:
   "8K · $20 · incluye camiseta, dorsal, chip y medalla".
3. **Imagen de hero real y relevante (no stock).** 🔧 Hoy es ilustración de
   marca; cuando haya foto real de la edición previa, probarla (docs/HERO-IMAGEN.md).
4. **Pasar el test de 5 segundos.** ⚠️ Validar con alguien externo.

## Bloque 2 — Un CTA dominante vs. muchos

5. **UN solo CTA primario "Inscríbete".** ✅ Hero, barra inferior y flotante.
6. **Degradar los CTAs que compiten.** 🔧 Que solo "Inscríbete" sea naranja sólido.
7. **Copy con verbo + valor ("Inscríbete — $20").** 🔧 Considerar el precio en
   el botón.
8. **CTA repetido con ritmo al hacer scroll.** ✅ Tras "cómo inscribirse" y al final.

## Bloque 3 — Confianza

9. **Precio y "qué incluye" visibles.** ✅ Línea de valor junto al CTA.
10. **Legitimidad del organizador (aval).** ⚠️ Falta: quién organiza + oficio/aval.
11. **Cinta de sponsors como prueba social.** ✅ Partners abajo del pliegue.
12. **Número de inscritos / social count.** ✅ "Ya somos +N inscritos" en el hero
    (INSCRITOS_APROX en lib/carrera.ts, total real online + efectivo, se sube a mano).
13. **Galería de fotos reales de ediciones previas.** ✅ Galería; reforzar con más fotos.

## Bloque 4 — Reducir fricción de inscribirse

14. **Formulario mínimo de campos.** 🔧 Pedir solo lo indispensable.
15. **"Cómo inscribirse" en pasos numerados.** ✅ Cuatro pasos claros.
16. **WhatsApp a mano como soporte.** ✅ Sección y botón.
17. **Seguimiento de pago ("Mi pago").** ✅ Con estados.
18. **Inputs móviles correctos (teclado numérico, autofill).** 🔧 Revisar el formulario.

## Bloque 5 — Móvil-first

19. **Barra inferior fija con "Inscríbete" en zona del pulgar.** ✅
20. **Tap targets ≥44px.** ✅ Buen nivel.
21. **Velocidad móvil (LCP) = conversión.** ✅ Hero sin JS en móvil; pendiente Early Hints.
22. **Hero móvil ligero, sin islas pesadas.** ✅ Componente de servidor + islas solo-escritorio.

## Bloque 6 — Urgencia y escasez honestas

23. **Contador de días atado a fecha real.** ✅ 29-ago-2026.
24. **Escasez de cupos solo si es real.** ✅ "cupos limitados" (la organización
    confirma tope real); si se define el número exacto, mostrar "X/500".
25. **Deadline de precio (early bird honesto).** 🔧 Si el precio sube, comunicar
    "$20 hasta el DD-mes, luego $X".

## Bloque 7 — Jerarquía visual y carga cognitiva

26. **Jerarquía tipográfica + contraste del CTA.** ✅ Blanco sobre oscuro.
27. **Un objetivo por sección.** ✅ Se depuró; mantener.
28. **Espacio en blanco y escaneabilidad.** ✅ Aire alrededor del CTA.

## Bloque 8 — Tendencias 2025-2026 (solo las que convierten)

29. **Tipografía grande / expresiva.** ✅ Display negro grande.
30. **Bento grid + glassmorphism con mesura + micro-motion.** 🔧 Bento para
    categorías/kit/mapa; glass solo en nav; micro-interacciones en el CTA.

## Lo aplicado el 28-jul

- Línea de valor en el hero: "8K · $20 · incluye camiseta, dorsal, chip y medalla".
- Prueba social + urgencia en el hero: "Ya somos +300 inscritos · cupos limitados"
  (`INSCRITOS_APROX` en lib/carrera.ts; es el total real online + efectivo).

## Lo más rentable pendiente

1. **Organizador + aval visible** (tip 10) — necesita el texto real.
2. **Foto real en el hero** (tip 3) — cuando exista una buena.
3. **Deadline de precio** (tip 25) — si el precio sube antes de la carrera.

## Fuentes

- NN/g — Scrolling and Attention: https://www.nngroup.com/articles/scrolling-and-attention/
- NN/g — The Fold Manifesto: https://www.nngroup.com/videos/fold-manifesto/
- Baymard — Minimize Form Fields: https://baymard.com/blog/checkout-flow-average-form-fields
- CXL — Above the Fold: https://cxl.com/blog/above-the-fold/
- CXL — Creating Urgency: https://cxl.com/blog/creating-urgency/
- web.dev — Web Vitals: https://web.dev/articles/vitals/
- Kissmetrics — CTA Button Best Practices: https://kissmetrics.io/blog/cta-button-best-practices
- WiserNotify — Social proof statistics: https://wisernotify.com/blog/social-proof-statistics/
- 72Technologies — Tap targets / thumb zones: https://www.72technologies.com/blog/tap-targets-thumb-zones-mobile-ux
- TheeDigital / StudioMeyer — Web design trends 2026
