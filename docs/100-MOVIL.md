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

## RESULTADO EN PRODUCCIÓN (22-jul, tras el deploy)

**98 / 98 / 98** en tres corridas — LCP 4,5 s → 2,0-2,2 s, FCP 1,8 s,
CLS 0, TBT 10 ms. De 82 a 98 con los arreglos de arriba.

Para los últimos 2 puntos (LCP < 1,8 s): primero Early Hints en el panel de
Cloudflare (gratis, ~200 ms de CSS); si no alcanza, consejo #8 (titular de
texto como elemento mayor del hero móvil).

## Siguientes balas si producción no llega a 100

1. Consejo #8: hero móvil con TITULAR DE TEXTO como elemento más grande
   (reordenar solo con media queries) — LCP ≈ FCP ≈ verde seguro.
2. Consejo #1/#4: countdown como isla con placeholder determinista.
3. Early Hints en el panel de Cloudflare (Speed → Optimization).

## Ampliación · top 40 y qué se aplicó (24-jul-2026)

Reporte móvil del 24-jul: **80** de rendimiento (LCP lab 4,9 s por el logo del
hero, FCP 1,7 s, TBT 30 ms, CLS 0). Investigación en foros (GitHub Discussions
de Next.js, web.dev, patterns.dev, dev.to, Cloudflare docs) pidiendo top 40 de
mejor a peor con foco en **diferir/eliminar JS de hidratación en móvil**.

### Lo que se aplicó ya

- **Hero como componente de SERVIDOR (técnica 21).** El hero era `"use client"`
  y se hidrataba entero en el móvil aunque ahí es puro contenido estático. Se
  reescribió sin `"use client"`: HTML de servidor con cero JS. Lo interactivo
  —vídeo de fondo y contador vivo, **solo escritorio**— se movió a dos islas
  cliente (`VideoFondoDesktop`, `ContadorDesktop`) que devuelven `null` en
  móvil. En el teléfono no entra ni el vídeo ni el reloj: se pinta el número de
  días estático horneado en el build.
- **Contador estático en móvil.** Sin `setInterval` ni recálculo por segundo.
- **browserslist moderno (técnica 9).** Chrome/Edge≥91, Firefox≥90, Safari≥15.4:
  SWC deja de down-levelar mi código a ES5.

### Pendiente medido

- **Polyfills legacy de Next (13,5 KiB, técnica 8).** Se probó aliasar
  `next/dist/build/polyfills/polyfill-module` a un módulo vacío; en **Turbopack
  no surtió efecto** (el instalador seguía en el chunk). Next los sirve con
  `nomodule`, así que un Chrome moderno no los ejecuta. Reintentar tras subir
  de versión de Next.
- **Early Hints en Cloudflare (técnicas 2 y 29).** Precargar el logo LCP vía
  header `Link` en `_headers` + activar Early Hints en el panel (Speed →
  Optimization). Es la palanca #1 sobre el LCP de 4,9 s. **Lado del dueño.**
- **Right-size del logo LCP (técnica 1).** Se sirve 900×316 y se muestra
  562×197; generar variante a ~1124×394 y recomprimir grano/hero a q≈78.
- **CSS crítico inline (técnica 22).** `beasties/critters` sobre `out/`. Ojo:
  el experimento previo de `inlineCss` global empeoró (ver next.config.ts).

### El ranking completo (40) quedó en el historial del chat del 24-jul.

Resumen de grupos: A) LCP del logo hero (right-size, Early Hints, fetchpriority);
B) eliminar/diferir JS (polyfills, `next/dynamic ssr:false`, hidratación
on-scroll/on-interaction, islas, purgar libs cliente, animaciones CSS);
C) CSS crítico/no bloqueante; D) Cloudflare (Early Hints, Brotli, HTTP/3, apagar
Rocket Loader); E) afinado del árbol de render.
