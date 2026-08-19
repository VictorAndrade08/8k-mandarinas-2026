# Notas Home Estático — 8K Ruta de las Mandarinas 2026

> Guardado: 18 de agosto de 2026. Idea central: el home debe ser HTML + Tailwind + imágenes, con cero (o mínimo) JavaScript de cliente. La inscripción, el contador y la subida del comprobante sí necesitan lógica — pero viven en sus rutas. Precisión importante: en Next.js "Server Component" no significa cero bytes de JS en el documento (el runtime del framework viaja igual); el objetivo práctico es eliminar el JS del cliente donde no hace falta, no prometer cero absoluto. Para cero real, la alternativa es Astro (HTML estático por defecto, islas solo declaradas).

## Top 100 (resumen por bloques)

### Arquitectura (1–30)

Home estático · sin "use client", useState, useEffect, useLayoutEffect, window, document, localStorage ni fetch de datos en el navegador para el contenido principal · fecha, precio, lugar, categorías, kit y proceso renderizados directamente en HTML · navegación con `<a href>` normales (/inscripcion/, /ruta/, /reglamento/, /informacion/) sin depender del router de cliente · contador fuera del home si requiere JS (o fecha estática) · formulario, mapas interactivos, galerías interactivas, widgets de redes, chats pesados y analítica innecesaria: fuera de la portada.

### Home que vende (31–50)

Nombre arriba · "8K Ruta de las Mandarinas" · Patate, Tungurahua · 29 de agosto de 2026 · Salida 08h00 · Desde $18 · incluye camiseta, dorsal, chip y medalla · "Inscribirme ahora" como primer enlace importante, directo a /inscripcion/, sin necesitar JS · título específico ("Corre 8 km entre las calles y cultivos de Patate") · precio junto al CTA · método de pago, comprobante y validación 2–3 días indicados · WhatsApp como ayuda, no requisito · CTA repetida al final · la CTA nunca dentro de un componente interactivo.

### HTML semántico (51–70)

header · nav aria-label · main id="contenido" · section · un solo h1 · h2 por sección, h3 subsecciones · ul para elementos, ol para los 4 pasos · footer · `<a>` para navegar, `<button>` solo para acciones · nunca div con onClick como botón · sin enlaces sin texto ni iconos como único nombre · aria-label solo cuando el texto visible no basta · alt descriptivo en fotos reales, alt="" en decorativas · sin texto importante dentro de imágenes · contenido principal visible sin JS.

### CSS y Tailwind (71–90)

Tailwind compilado (nunca CDN en producción) · sin clases dinámicas indetectables · colores propios en la config · espaciado constante · contenedor máximo · sin biblioteca de componentes pesada · sin CSS de rutas secundarias en el home · mobile-first desde 320–360 px · una columna en móvil, dos solo con sentido en desktop · sin anchuras/alturas fijas · max-w-* y w-full en botones móviles.

### Imágenes (91–100)

next/image (si Next) con width/height y sizes · flyer comprimido con variante móvil · sin lazy en el LCP · fetchPriority="high" solo en el LCP · lazy en lo inferior · fotos reales · verificar que el móvil no baje imágenes de escritorio.

## Estructura recomendada

Hero → Datos rápidos → Qué incluye → Cómo inscribirse → Categorías y precios → La ruta → Fotos reales → FAQ → CTA final → Footer.
El home NO necesita: contador JS, formulario interactivo, mapa JS, lightbox, chat, carrusel, animaciones complejas, filtros, estado global.

## Si se mantiene Next.js

Sin "use client" en page.tsx ni Provider global · layout sin cliente · Server Components por defecto · `<a>` normales donde no haga falta SPA · sin formulario en el layout · sin librerías client-only en el home · next/image y next/font · medir el JS descargado (First Load JS por ruta).

## Si se quiere cero JS real

Astro + Tailwind (`npm create astro@latest`): HTML estático por defecto, JS solo en islas declaradas. No migrar de inmediato: primero hacer estático el home dentro del proyecto actual y medir.

## Qué SÍ necesita JavaScript (y va en su ruta)

Contador en tiempo real · menú móvil complejo · selector dinámico de categoría · cálculo de edad · subida con progreso · vista previa del comprobante · validación instantánea · consulta del estado de pago · galería y mapa interactivos.

```
/ /ruta/ /reglamento/ /informacion/  →  HTML + CSS
/inscripcion/ /verificar/           →  interacción necesaria
```

## Qué NO usar en el home

React Context · Framer Motion · GSAP · carruseles · lightbox · Mapbox · calendarios dinámicos · formularios completos · chat widgets · videos autoplay · animaciones de fondo · contadores client-side · librerías de iconos completas · componentes UI que convierten la página en Client Component.

## Build

`npm ci && npm run lint && npm run build && npm run start` (o `output: "export"` para estático puro — este proyecto YA usa export; la inscripción vive en Cloudflare Functions, no en Server Actions, así que es compatible).

> **Recomendación final:** no quitar JS de absolutamente todo — quitarlo del home donde no aporta y dejarlo solo donde el usuario necesita una acción dinámica. Portada más rápida, estable y mantenible sin sacrificar inscripción ni comprobante.
