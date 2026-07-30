# Línea gráfica al 100% — top 100 (mejor a peor) · 30-jul-2026

Cómo llevar la línea gráfica de los flyers oficiales 2026 a TODO el sitio. Base:
los dos flyers (horizontal e inscripciones) + los tokens ya existentes en
`app/globals.css` + investigación (Refactoring UI, Material 3, W3C Design
Tokens, Carbon, NN/g). Reddit vía PullPush dio poca señal específica; el peso
vino de las fuentes de diseño. Estado en NUESTRA web: ✅ hecho · ⚠️ falta · 🔧 ajustar.

**Diagnóstico:** la línea gráfica YA está en tokens (`--vino/--magenta/--coral/
--naranja`, ahora también `--violeta/--navy`), pero los componentes no la usan
(258 hex a mano, 28+ colores, 14 radios, 32 sombras). Implementarla "al 100%"
= migrar los componentes a los tokens + repetir los recursos del flyer
(degradado cálido, montañas angulares, chips, display condensada).

**Colores muestreados del arte:** naranja `#F7771C`, coral `#EE374B`, magenta
`#C51850`, vino `#780030`, violeta `#6A1F9C` (chips), navy/índigo `#20206E`
(montañas), crema `#FFF6EC`, blanco.

---

## 1. Tokens de color y roles

1. **6 tokens base, prohibir hex suelto.** ✅ Existen; ⚠️ falta prohibirlos (lint).
2. **Separar tokens de referencia vs semánticos (rol).** ✅ Hay `--cta/--acento/--sobre-claro`.
3. **Nombrar roles por función, no apariencia.** 🔧 Reforzar (`--color-surface/on-surface`).
4. **Vino #780030 como color ancla de texto/estructura.** 🔧 Aplicar como cuerpo por defecto.
5. **Rampas 50–950 en OKLCH por color base.** ⚠️ [tendencia] evita que el naranja se apague.
6. **Par "on-color" por cada fondo.** 🔧 crema/blanco sobre vino/magenta/coral; vino sobre crema.
7. **Naranja solo para acento/CTA, nunca grandes áreas de texto.** ✅ Se respeta.
8. **Estados (hover/active/focus) derivados, no hex nuevos.** 🔧 `oklch(from …)`.
9. **Mapa de equivalencias de los 28 colores antes de migrar.** ⚠️ Base del buscar-y-reemplazar.
10. **Tokens de feedback (ok/aviso/error) armonizados.** ✅ Existen `--ok/--aviso/--error`.
11. **Documentar cada token con rol + contraste.** ✅ Comentado en globals.css.
12. **Dejar preparado dark mode con tokens.** 🔧 El sitio ya es oscuro; remapear por rol.

## 2. Degradado y fondo de marca

13. **Degradado diagonal cálido como UN token.** ✅ Se creó `--gradient-brand` + `.bg-brand`.
14. **Ángulo fijo (135°) como constante.** ✅ En el token.
15. **Interpolar el degradado en oklch (sin zona gris).** ⚠️ [tendencia] `in oklch`.
16. **Montañas/chevrons como capa inferior fija.** ✅ En FranjaDatos (SVG violeta+navy).
17. **Stack de fondo: cálido arriba → montañas abajo.** 🔧 Extraer a `<BrandBackdrop/>`.
18. **Degradado solo en zonas ancla (hero, footer, CTA).** ✅ Franja; no en todo el scroll.
19. **Overlay de legibilidad reutilizable sobre el degradado.** 🔧 Token `--scrim`.
20. **Recortar el degradado con montañas vía clip-path/SVG, no PNG.** ✅ SVG.
21. **Variante "plana" del degradado en móvil.** 🔧 2 paradas < 640px.

## 3. Tipografía y escala

22. **Display condensada itálica mayúsculas como token.** ✅ `.font-bebas` (Archivo Black).
23. **Cargar fuentes con next/font + swap.** ✅ Ya se hace en layout.
24. **Compresión horizontal para emular Cocogoose.** 🔧 `scaleX(.92)` en titulares.
25. **Escala tipográfica modular (~1.25) como tokens.** ⚠️ Hoy hay 20+ tamaños sueltos.
26. **Palabra clave del titular en naranja.** 🔧 1 acento por titular.
27. **line-height ajustado en display, holgado en cuerpo.** 🔧 Tokens `--leading-*`.
28. **Mayúsculas+itálica SOLO display; cuerpo normal.** ✅ Mayormente.
29. **letter-spacing por rol.** 🔧 Tokens `--tracking-*`.
30. **Máximo 2 familias.** ✅ Archivo + Archivo Black.

## 4. Formas: montañas, radios, chips

31. **14 radios → 4–5 tokens.** 🔧 Existen `--radio-chip/--radio/--radio-tarjeta`; aplicarlos.
32. **Radios por rol (chip pill, tarjeta lg, input md).** 🔧
33. **Perfil angular de las montañas como motivo reutilizable.** 🔧 Extraer `<MontanasDivider/>`.
34. **UN ángulo de chevron reutilizado.** 🔧 Token `--angle-mountain`.
35. **Chips de datos como componente único.** ✅ En FranjaDatos; 🔧 extraer `<Chip/>`.
36. **Variantes de chip por color con los mismos tokens.** 🔧 violeta/navy/vino.
37. **Bordes con moderación; superficie+sombra para separar.** 🔧
38. **Un grosor y color de borde.** 🔧 `--borde` ya existe.
39. **Mandarina-brotando-del-8 como recurso controlado.** 🔧 `<Hero8Mark/>`.

## 5. Iconografía

40. **UN set de iconos de línea.** ✅ Phosphor en todo el sitio.
41. **Grosor de trazo por token.** 🔧 `weight`/`strokeWidth` uniforme.
42. **Iconos con currentColor ligado a tokens.** 🔧
43. **Tamaños en escala corta (16/20/24/32).** 🔧
44. **Icono+texto con gap constante.** ✅ `gap-2` habitual.
45. **Acento naranja / informativo vino.** 🔧
46. **Inline + optimizar SVG (montañas, mandarina).** ✅ Montañas inline.

## 6. Sombras / elevación

47. **32 sombras → 4–5 tokens.** 🔧 Existen `--sombra-1/2/3` + `--glow`; aplicarlas.
48. **Sombra de dos capas (ambiental + directa).** 🔧
49. **Sombras tintadas de vino, no negro.** ✅ `rgba(20,3,9,…)`.
50. **Una sola fuente de luz (desde arriba).** 🔧
51. **Elevación ligada a rol.** 🔧 tarjeta md, modal xl, chip none.
52. **+1 nivel de elevación en hover.** 🔧
53. **Sobre el degradado, separar por superficie, no sombra.** ✅

## 7. Espaciado y rejilla

54. **Escala base-4/8 como único vocabulario.** ✅ Tailwind; ⚠️ hay `[13px]` sueltos.
55. **Empezar con más aire y quitar.** 🔧
56. **Tokens de espacio semántico (section/block).** 🔧
57. **Ancho máximo de contenido + contenedor central.** ✅ `max-w-7xl` habitual.
58. **Rejilla de 12 columnas.** 🔧
59. **Gap estándar entre chips/tarjetas/listas.** 🔧
60. **Alinear todo al grid de 4px.** 🔧

## 8. Componentes consistentes

61. **`<Button>` con variantes por rol.** ⚠️ Hoy son clases sueltas repetidas.
62. **CTA primario SIEMPRE naranja, pill, mayúsculas.** ✅ Se cumple visualmente.
63. **6 estados por componente.** 🔧
64. **Un solo `<Card>` para todo.** ⚠️ Hay tarjetas divergentes (radios distintos).
65. **Tarjeta-QR como variante de Card.** 🔧
66. **Badges/chips en un componente con props.** 🔧
67. **Altura/padding de controles con tokens.** 🔧 crítico en el formulario.
68. **Un estilo de foco de marca para todo.** 🔧 anillo naranja global.
69. **Estilos en `@layer components`, no repartidos.** ⚠️
70. _(continúa en fotografía)_

## 9. Fotografía / ilustración

70. **Tratamiento de color de marca uniforme en fotos.** 🔧 overlay vino 15–25%.
71. **Degradado como duotono en fotos clave.** ⚠️ [tendencia].
72. **Relaciones de aspecto estándar por contexto.** 🔧
73. **Imágenes optimizadas y responsivas.** ✅ srcset propio + webp.
74. **Mismo radio/recorte de marca en imágenes.** 🔧
75. **Ilustración vectorial angular > stock.** ✅ Ilustraciones propias.
76. **Estados vacíos con ilustración de marca.** 🔧

## 10. Motion / microinteracciones

77. **Duraciones y easings tokenizados.** 🔧 `--ease-brand/--dur-*`.
78. **Entrada consistente (fade+rise) al scroll.** 🔧 IntersectionObserver.
79. **Microinteracción del CTA (lift + brillo).** ✅ hover en botones.
80. **Shift lento del degradado en el hero.** ⚠️ [tendencia] respetar reduced-motion.
81. **Respetar prefers-reduced-motion SIEMPRE.** 🔧 añadir el bloque global.
82. **Mandarina "brotando" como microanimación.** 🔧
83. **Transiciones de estado con el mismo easing.** 🔧

## 11. Accesibilidad del color

84. **AA (4.5:1) en texto sobre cada parada del degradado.** 🔧 el punto más claro manda.
85. **Crema/blanco solo sobre vino/magenta/coral, no sobre naranja.** 🔧
86. **Scrim/overlay bajo el texto sobre el degradado.** ✅ La franja usa drop-shadow.
87. **No informar solo con color.** ✅ Se cumple (icono+texto en estados).
88. **3:1 en componentes e iconos.** 🔧
89. **Foco visible ≥3:1 contra el fondo.** 🔧
90. **Chequeo de contraste en CI.** ⚠️ axe-core/Playwright.
91. **Modo alto contraste / forced-colors.** ⚠️ [tendencia].
92. **Validar percepción real (APCA/OKLCH), no solo WCAG 2.** ⚠️ [tendencia].

## 12. Migrar sin romper

93. **TODOS los tokens en `@theme` de Tailwind v4.** 🔧 parte están en `:root`; subir a `@theme`.
94. **Inventariar deuda antes de tocar (grep hex/radios/sombras).** ⚠️
95. **Migrar por buscar-y-reemplazar guiado por el mapa.** ⚠️
96. **Lint que prohíba hex arbitrarios.** ⚠️ frena la reaparición de deuda.
97. **Migrar en lotes por dominio (color → radios → sombras → tipografía).** 🔧
98. **Alias temporales de tokens viejos durante la transición.** 🔧
99. **Página `/estilos` (living styleguide).** ⚠️ fuente de verdad.
100.  **Exportar tokens en formato W3C DTCG (`tokens.json`).** ⚠️ [tendencia] portable a Figma.

---

## Lo aplicado el 30-jul

- Tokens `--violeta (#6a1f9c)` y `--navy (#20206e)` muestreados del arte.
- `--gradient-brand` (degradado cálido 135°) + utilidad `.bg-brand`.
- `FranjaDatos`: banda LUGAR/FECHA/SALIDA con degradado, chips violeta/navy y
  las **montañas angulares** del flyer (SVG, dos capas). Debajo del hero.

## Plan de implementación por lotes (recomendado)

1. **Fundaciones** (bajo riesgo): tokens en `@theme`, `--gradient-brand`,
   `<MontanasDivider/>`, `<Chip/>`, `--scrim`, easings/duraciones.
2. **Componentes**: `<Button>` y `<Card>` únicos → migrar home a ellos.
3. **Color**: mapa de equivalencias + buscar-y-reemplazar de hex por tokens,
   página por página (deploy preview entre lotes).
4. **Pulido**: motion de marca, contraste AA sobre el degradado, `/estilos`.

## Fuentes

- Refactoring UI: https://www.refactoringui.com/
- Material 3 — Design tokens: https://m3.material.io/foundations/design-tokens/overview
- W3C Design Tokens: https://tr.designtokens.org/format/
- Carbon — Color tokens: https://carbondesignsystem.com/elements/color/tokens/
- NN/g — Consistency & Standards: https://www.nngroup.com/articles/maintain-consistency-standards/
- web.dev — Color contrast: https://web.dev/articles/color-contrast
- MDN — oklch(): https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- Tailwind v4 — Theme: https://tailwindcss.com/docs/theme
