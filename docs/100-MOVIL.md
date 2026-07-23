# 100/100 en móvil — top 30 y bitácora · 22 de julio de 2026

Investigación (Reddit r/nextjs, r/webdev vía PullPush; csswizardry, web.dev,
DebugBear) + mediciones propias con Lighthouse. Punto de partida real en
producción móvil: **82** — FCP 1,8 s, LCP 4,5 s (la imagen DESCARGA en 520 ms
pero tarda 3,4 s más en PINTAR), TBT 10 ms, CLS 0.

## El top 30, de mejor a peor (resumen operativo)

1. **Matar el mismatch de hidratación del countdown** — un timer prerenderizado
   con hora "congelada" hace que React descarte el DOM del servidor y repinte
   todo; el LCP se re-reporta tras ese repaint. Placeholder determinista +
   misma estructura + `suppressHydrationWarning`.
2. **Cero fade-in/animación de opacidad en el LCP** — el LCP no cuenta hasta la
   opacidad final (csswizardry midió +623 ms por un fade de 500 ms).
3. **El LCP debe existir en el HTML puro** — test con JS desactivado. _Aquí:
   verificado, pinta perfecto sin JS._ ✅
4. **Countdown como isla mínima** hidratada tarde (dynamic + tick confinado).
5. **Critical CSS inline** — _probado DOS veces aquí y EMPEORA (ver bitácora);
   descartado._ ❌
6. **Video fuera del móvil de verdad** — sin `src` en móvil, no `display:none`.
   _Aquí: ya estaba (matchMedia + preload="none")._ ✅
7. **Vigilar la usurpación del LCP** — mirar SIEMPRE qué elemento reporta
   Lighthouse antes de optimizar.
8. **LCP de TEXTO en móvil** — un h1 grande como elemento mayor: LCP ≈ FCP.
   La bala de plata si todo lo demás no llega.
9. **Fuentes con display swap/optional** + preload solo de las del primer
   pantallazo. _next/font ya lo hace aquí._ ✅
10. **Auditoría de preloads: solo UNO para el LCP** — cada preload extra roba
    ancho de banda en la ventana crítica. _Aquí: Next generaba preloads
    automáticos para TODA imagen sin `loading="lazy"` — había 6 compitiendo,
    incluido el fondo del 404 (Next incrusta ese boundary en cada página).
    Arreglado con lazy explícito._ 🔧
11. `decoding` en el LCP: probar sync/async según el caso (aquí async).
12. **Cero scripts de terceros antes del load** (GA con lazyOnload → caso real
    de 100/100). _Aquí: no hay terceros._ ✅
13. **Menos JS total** — bundle analyzer, imports selectivos.
14. **El hero primero en el DOM** — nada antes del LCP en el body. ✅
15. **`content-visibility: auto` en secciones bajo el pliegue** — el primer
    cuadro solo paga el hero. _Aplicado: `.seccion-diferida` en el home._ 🔧
16. **Bajar el coste de paint del primer pantallazo** — sin feTurbulence, blur
    ni blend caros. _Aquí: el grano era un feTurbulence inline — sustituido
    por la textura webp pre-horneada._ 🔧
17. **Menos nodos DOM** (<800 en móvil).
18. **Poster + `<img>` real, nunca background-image** para el hero.
19. **Cero `@import` en CSS.** ✅
20. **Todo del mismo origen en la ruta crítica.** ✅
21. **Caché immutable + Brotli + Early Hints** en Cloudflare. _Parcial: hecho
    _headers; Early Hints se activa en el panel de Cloudflare._
22. **Móvil = estático arriba, interactivo abajo** — la arquitectura con la
    que Astro saca 100 gratis.
23. **lazy + prioridad baja en TODO lo bajo el pliegue.** 🔧
24. Sin polyfills legacy. ✅
25. Srcset con candidato ~1070px para full-width en el viewport de Lighthouse.
26. **Medir los subparts en el entorno real** (DevTools Performance con CPU 4x)
    — deja de adivinar.
27. `contain` + tabular-nums en el countdown para que el tick no invalide
    layout. _Los dígitos ya van en cajas fijas._ ✅
28. Video desktop comprimido + autoplay por JS tras load. ✅
29. **Lighthouse CI como guardarraíl** — más fácil no perder el 100 que
    recuperarlo.
30. Purgar CSS muerto (Coverage tab). _Tailwind ya purga._ ✅

## Bitácora de mediciones (22-jul)

| Cambio                                   | Score local sim. | Nota                                  |
| ---------------------------------------- | :--------------: | ------------------------------------- |
| Punto de partida (prod: 82)              |        73        | LCP sim 10,8 s; render delay 7,5 s    |
| Grano webp (sin feTurbulence) + decoding |        73        | Sin efecto medible en sim; mantiene   |
| lazy en fondos + cv-auto en secciones    |        73        | Preloads 6→4; LCP sim 10,8→8,4        |
| **inlineCss (2ª prueba)**                |      **69**      | FCP 2,3→3,2; LCP 8,4→11,4 — REVERTIDO |
| lazy en fondo del 404 (preload fantasma) |        —         | Preloads 4→3                          |

**Contexto importante:** el servidor local de pruebas es HTTP/1.1 y el
simulador lo castiga de más; producción va por HTTP/2+ en Cloudflare y salió
82 con los mismos archivos que localmente daban 73. La cifra que manda es la
de producción tras el deploy — medir con 3 corridas y quedarse con la mediana
(consejo #26/#29).

## Siguientes balas si producción no llega a 100

1. Consejo #8: hero móvil con TITULAR DE TEXTO como elemento más grande
   (reordenar solo con media queries) — LCP ≈ FCP ≈ verde seguro.
2. Consejo #1/#4: countdown como isla con placeholder determinista.
3. Early Hints en el panel de Cloudflare (Speed → Optimization).
