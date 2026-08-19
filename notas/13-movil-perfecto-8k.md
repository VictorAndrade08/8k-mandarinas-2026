# Notas Móvil Perfecto — 8K Ruta de las Mandarinas 2026

> Guardado: 19 de agosto de 2026. Objetivo: fácil de leer, tocar, navegar e inscribirse con conexión móvil lenta. Home ligero; JavaScript solo en /inscripcion/ y /verificar/. Métricas: corregir LCP móvil 5,0 s; conservar INP 139 ms y CLS 0 (metas: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1).

## Top 100 (resumen por bloques)

### Prioridad máxima (1–20)

Home con contenido principal sin JS · una sola CTA "Inscribirme ahora" en el primer pantallazo · fecha/lugar/hora/distancia/precio arriba · una columna · sin scroll horizontal · probar en teléfono real y el flujo completo en móvil · el botón enlaza a /inscripcion/ · avance guardado al salir a transferir · usable con una mano, controles al alcance del pulgar · botones grandes y separados · texto cómodo · nada crítico en carruseles · sin popups que tapen ni permisos al cargar.

### Hero y venta (21–40)

Título "8K Ruta de las Mandarinas" + Patate + 29 de agosto de 2026 + Salida 08h00 + Desde $18 + incluye camiseta/dorsal/chip/medalla · foto REAL, no IA · hero no excesivamente alto · precio sin desplazarse · CTA visible bajo la información, repetida tras el proceso y al final, siempre con el mismo texto · botón con contraste, casi todo el ancho en móvil, con estado de carga y deshabilitado al enviar · nunca "Más información" como acción principal ni botón de solo icono.

### Navegación (41–60)

Header sencillo, logo contenido · "Inscribirme" en la navegación · enlaces HTML normales · foco visible · menú que no tape la CTA ni se corte en 320 px · sin librería de menú para pocos enlaces · <details>/<summary> si se quiere evitar JS · barra inferior fija solo si aporta y sin tapar botones · respetar el área segura (notch) · probar vertical, horizontal, botón Atrás, abrir en pestaña nueva, cero 404.

### Tipografía (61–80)

≥16 px el cuerpo · párrafos no anchos (max-width) · line-height cómodo · contraste alto (nunca naranja claro pequeño sobre blanco) · jerarquía clara · sin todo-mayúsculas en párrafos · pocas tipografías, con next/font · legible con brillo bajo · títulos cortos (no 5 líneas) · cuerpo alineado a la izquierda · sin texto dentro de imágenes ni pegado a los bordes · listas para precios y beneficios · revisar con zoom del navegador.

### Touch y formularios (81–100)

Áreas táctiles cómodas y separadas ("Atrás" nunca pegado a "Continuar") · campos de ancho completo con etiquetas encima (no solo placeholder) · type=email / type=tel / autocomplete · conservar datos tras error, error junto al campo y foco al primer error · pegar la cédula · no borrar al cambiar de paso · "Paso 1 de 4" · comprobante con cámara, vista previa, formatos y tamaño, estado de carga · confirmación con código y estado.

## Estructura móvil

Hero → fecha·lugar·hora·precio → qué incluye → [Inscribirme ahora] → 4 pasos → categorías y precios → ruta → FAQ → [Inscribirme ahora]. Nunca reglamento completo, partners o galería grande antes del primer botón.

## Responsive por rango

- **320–390:** una columna, botones full-width, logo pequeño legible, imagen 100%, padding ~16 px, sin tablas horizontales ni tarjetas de 4 columnas.
- **414–767:** una columna; datos en cuadrícula de 2 si conviene.
- **768–1023:** dos columnas en hero; formulario limitado.
- **Desktop:** hero de 2 columnas, max-w-6xl/7xl, texto limitado, imagen grande solo si se muestra grande.

## Velocidad móvil (orden de corrección)

Flyer sobredimensionado → descubrimiento tardío del LCP → sizes → compresión flyer/hero → CSS bloqueante → JS innecesario → galerías/mapas/contador demasiado pronto → fuentes pesadas → terceros → probar en 4G lento.

## Accesibilidad

Contraste 4,5:1 (3:1 en grande) · foco visible · errores no solo por color · etiquetas reales · orden lógico · teclado externo · prefers-reduced-motion respetado · sin animaciones obligatorias · lector de pantalla.

## Pruebas reales

Android económico y moderno, iPhone antiguo y moderno, Chrome y Safari móvil, Wi-Fi y 4G lento, incógnito y caché vacía. Medir: tiempo hasta título y botón, menú, toque, imagen, teclado sobre el campo, subida del comprobante, volver del banco, confirmación, y que el home funcione sin JavaScript.

## Definición de "perfecta"

HTML visible sin JS · responsive desde 320 px · sin scroll horizontal · CTA clara · precio visible · imágenes optimizadas · LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 · contraste correcto · teclado funcional · formulario separado del home · pruebas en dispositivos reales.
