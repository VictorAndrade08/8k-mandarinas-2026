# Notas Animaciones CSS sin JS — 8K Ruta de las Mandarinas 2026

> Guardado: 19 de agosto de 2026. Sí se puede animar el home sin JavaScript: pocas animaciones, ligeras, que no retrasen el contenido. Regla técnica: animar SOLO transform y opacity, nunca layout, y respetar prefers-reduced-motion. will-change solo puntual y medido, jamás global.

## Top 100 (resumen por bloques)

### Prioridad máxima (1–30)

Home sin JS de interacción · animaciones en CSS · el contenido visible aunque no corran · no ocultar el título ni retrasar la CTA · NO animar el LCP · animar transform y opacity; evitar width/height/top/left/margin/padding/font-size/box-shadow continuo/blur en superficies grandes/imagen de pantalla completa · cortas y con una sola dirección visual · prefers-reduced-motion respetado · sin parallax obligatorio ni autoplay · sin animación en cada elemento ni librería para un fade · probar en teléfono económico y medir después.

### Catálogo para este home (31–50)

Aparición suave de título/subtítulo/datos · entrada ligera del botón y la foto real · movimiento sutil de una línea inspirada en la ruta · scroll horizontal nativo de fotos · hover en desktop, press en móvil · foco con cambio de color · subrayado animado de enlaces · línea que crece bajo un título (scaleX) · paso que cambia de color al hover · tarjeta de categoría que eleva un poco · zoom mínimo de imagen en desktop · medalla que aparece a escala pequeña · hoja decorativa que se mueve UNA vez · grano estático con opacidad leve · colores por estado, no en bucle.

## Recetas CSS

- **Entrada del hero:** keyframes de opacity 0→1 + translateY(12px→0), 500 ms ease-out both, en el TEXTO (no en la imagen LCP), escalonada con delays de 60–160 ms — la CTA aparece rápido.
- **Hover del botón:** transition transform/background 160 ms; hover -2px; active 0.
- **Línea de recorrido:** transform-origin left, scaleX(0→1) en 700 ms — identidad sin mapa pesado.
- **Subrayado de enlaces:** ::after con scaleX 0→1, origin right→left, 180 ms.
- **Galería:** overflow-x auto + scroll-snap-type x mandatory + overscroll-behavior contain; flex-basis 85%, snap-align center.
- **Reduced motion (global):**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Scroll sin JS

Scroll nativo · scroll-behavior smooth con moderación · scroll-snap para galerías · animation-timeline: view() solo como mejora progresiva con fallback · nunca listeners de scroll, getBoundingClientRect por frame, ni estado de React durante el scroll · probar Safari y Chrome móvil.

## Identidad, no plantilla

Animar la línea del recorrido real, un patrón de hojas de foto real, la medalla en la sección del kit · foto real protagonista · PROHIBIDO: blobs animados, gradientes morado-azul, brillo en todos los botones, esfera 3D, mismo fade en todo, tarjetas flotando, texto que rebota, emojis animados, contador parpadeante, "live" falso, partículas · cada movimiento se explica por una acción o historia — lo que no se pueda explicar, se elimina.

## Rendimiento

No animar el LCP · nada de GSAP/Framer/Lottie/Three.js/canvas/video para efectos simples · pocos elementos animados a la vez · will-change solo puntual (nunca `* { will-change }`) · CPU/GPU en un teléfono · PageSpeed tras cada grupo de cambios · metas LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1.

## Sistema recomendado (el aplicado)

Hero: entrada suave del texto · CTA: hover/active corto · Ruta: línea que se dibuja una vez · Pasos: entrada escalonada ligera · Kit: zoom mínimo desktop · Galería: desplazamiento nativo CSS · Enlaces: subrayado corto · Móvil: menos movimiento · Reduced motion: el contenido aparece directo.

## Tailwind

Clases completas, nunca construidas dinámicamente (`animate-delay-${x}` no compila) · keyframes en el CSS global o @theme.
