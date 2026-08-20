# Notas Animaciones Solo Desktop — 8K Ruta de las Mandarinas 2026

> Guardado: 19 de agosto de 2026. Técnica correcta: NO detectar "móvil" con JavaScript ni asumir mouse por el ancho — activar el movimiento solo con `@media (hover: hover) and (pointer: fine)`. El estado estático es la experiencia principal; el móvil recibe una interfaz quieta, rápida y fácil de tocar.

## Regla base (Top 1–20)

Estático primero · animaciones solo desktop vía hover+pointer fine · CSS, nunca JS ("use client" jamás por animación) · nada de window.innerWidth, listeners de resize/scroll ni librerías · contenido visible sin animación · no retrasar título ni CTA · NO animar el LCP ni fondos grandes en bucle · cortas, transform/opacity, sin tocar layout · sin infinitas sin propósito · medir PageSpeed después.

## El patrón

```css
@media (hover: hover) and (pointer: fine) {
  .desktop-motion {
    animation: enter-up 500ms ease-out both;
  }
  .desktop-motion:hover {
    transform: translateY(-2px);
  }
}
```

En móvil la clase no anima porque la regla exige hover y puntero preciso. `min-width` solo NO basta (tablets grandes y laptops táctiles engañan); si acaso, combinar ancho + hover + pointer.

## Catálogo por sección

- **Hero:** entrada suave de texto · escalonado de fecha-lugar-precio · CTA corto · subrayado de enlaces · línea del recorrido · zoom mínimo de foto SOLO en hover · nunca todo a la vez ni la imagen principal.
- **CTA:** elevación 2–3 px · cambio de fondo · anillo de foco · compresión al clic · 150–200 ms.
- **Navegación:** subrayado que crece desde un lado · indicador de activa · sin menú animado en móvil.
- **Ruta:** línea con scaleX · puntos que aparecen · zoom mínimo del mapa.
- **Categorías:** elevación leve · borde en hover · escala máx 1.01 · sin rebotes.
- **Kit:** zoom mínimo · entrada escalonada · movimiento por interacción, nunca permanente.

## Recetas

Escalonada con nth-child y delays de 70 ms · foto: overflow-hidden + transition transform 350 ms + hover scale(1.025) · borde animado con ::after (opacity+scale) · línea bajo título con ::after scaleX origin right→left.

## Que no afecte al móvil

Sin transition global, sin `* { will-change }` (MDN: sugerencia puntual, global consume memoria), sin blur/backdrop-filter repetidos, sin animar background-size/box-shadow/gradientes de pantalla completa, sin scale(1.1) en fotos grandes, sin cientos de elementos entrando.

## Reduced motion (además del gate desktop)

`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }`

## Nota Tailwind v4

El variant `hover:` ya solo aplica en dispositivos con hover real — los `hover:` existentes del sitio son desktop-only gratis.

## Las diez para empezar

1. Entrada del texto del hero. 2. CTA con transform y color. 3. Subrayado de navegación. 4. Línea del recorrido (scaleX). 5. Salida/llegada con opacity. 6. Hover mínimo en fotos reales. 7. Elevación leve de categorías. 8. Escalonado de los 4 pasos. 9. Borde en tarjetas. 10. Todo apagado en móvil y con reduced-motion.

## Prueba

build + start → teléfono real → CPU limitada → 4G → Performance/FPS/LCP/INP. CSS no es gratis si anima superficies grandes, blur o layout.
