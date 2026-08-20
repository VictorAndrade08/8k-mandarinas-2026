# Notas Imágenes de Calidad — 8K Ruta de las Mandarinas 2026

> Guardado: 20 de agosto de 2026. La prioridad no es solo el formato: es entregar la DIMENSIÓN correcta por pantalla, comprimir según el tipo de imagen y cargar solo lo visible. Regla de oro: formato + compresión + tamaño real + variante responsive + prioridad de carga.

## Principios esenciales (1–20)

Optimizar según dónde se muestra · nunca subir el original a producción · redimensionar ANTES de comprimir · nada de imagen desktop en móvil ni móvil ampliada en desktop · srcset y sizes siempre · medir el tamaño renderizado real · conservar originales fuera de producción (carpeta aparte) · nombres claros (formato, ancho, contexto) · sin imágenes de WhatsApp sin revisar · quitar metadata · corregir rotación y recortar antes de comprimir · NUNCA recomprimir un archivo ya comprimido · comparar visualmente antes de publicar.

## Formatos (21–40)

AVIF para fotos grandes si el pipeline lo procesa bien · WebP como moderno práctico (rápido) · JPEG para máxima compatibilidad · PNG solo con transparencia sin pérdida · SVG para logos/iconos · nunca PNG para foto, JPEG para logo transparente ni GIF moderno · comparar AVIF vs WebP por grupo de fotos (AVIF comprime más pero codifica más lento) · calidad 100 casi nunca hace falta · revisar con zoom: texto, rostros, hojas, cielos, texturas.

## Calidad de compresión (41–60)

WebP 75–80 base para fotos · 70–75 fondos decorativos · 80–85 rostros, camiseta, medalla o texto · AVIF ~45–65 de punto de partida · más calidad en LCP y producto/kit; menos en texturas y fondos con overlay · NO comprimir de más carteles/flyers con texto (versión específica de alta calidad) · el texto importante va en HTML, no en imagen · revisar halos en letras, artefactos en degradados, bandas en cielos, detalle en hojas y dorsales.

## Tamaños sugeridos (61–80)

Del diseño real, no inventados: hero móvil full-screen 720–1080 · hero desktop media pantalla 1280–1600 · tarjeta móvil 480–640 · tarjeta desktop 640–960 · miniatura 320–480 · galería abierta 1280–1600 · logo SVG (o raster al ancho real) · textura repetida 128–256 · flyer distinto por breakpoint si cambia composición · recortes sin cortar rostros ni texto · verificar con DevTools/Network qué variante baja el navegador.

## Next.js (81–100)

next/image con width/height y sizes · fill solo con contenedor dimensionado · object-cover fotos, object-contain flyers/logos · fetchPriority="high" SOLO en el LCP (máx 1–2 prioritarias por página) · lazy fuera de pantalla · deviceSizes/imageSizes según breakpoints REALES · remotePatterns para externas · comprobar el srcset generado · PageSpeed tras cada cambio.

> Este proyecto: output export ⇒ el optimizador de Next no corre; las variantes las genera scripts/imagenes.mjs (sharp) y srcSetDe arma el srcset a mano. El mismo estándar, distinto motor.

## Flujo de trabajo

Original → seleccionar/recortar → corregir luz → master de alta calidad → variantes por ancho → WebP/AVIF → revisión visual → next/image + sizes (aquí: srcSetDe) → medir en Network y PageSpeed.

## Herramientas

Squoosh (comparar a mano) · Sharp (automatizar) · ImageMagick (lotes) · ImageOptim (macOS) · TinyPNG (revisando) · Cloudinary/Imgix (bajo demanda) · next/image.

## Objetivos por contexto (iniciales, no absolutos)

Logo/icono SVG: mínimos · miniatura 15–60 KiB · tarjeta 40–150 · galería 80–250 · hero/LCP 100–250 · flyer con texto 80–200 (vigilando nitidez) · textura <20. La calidad se evalúa al tamaño real de muestra.

## Aplicado hoy (20-08-2026) con el material de Facebook

- Banner escritorio: flyer oficial nuevo 2868×1274 → 1600w WebP q80 (banner-inscripciones-v3).
- Banner móvil: flyer vertical actual (kit 28-ago en Vehicentro + premios) 1080×1440 → 900w WebP q80 (post-8k-v3) — reemplaza el de "preventa hasta el 31 de julio", que estaba caducado.
- Originales intactos en Escritorio/fotos-8k-facebook (fuera de producción).
- El flyer "INCLUYE KIT" oficial confirma: camiseta, chip, medalla, souvenir, dorsal, sporty bag, seguro de accidentes e hidratación.
