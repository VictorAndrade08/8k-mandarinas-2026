# Notas Galería — 8K Ruta de las Mandarinas 2026

> Guardado: 20 de agosto de 2026. Patrón central: miniaturas ligeras en la cuadrícula, la foto grande SOLO cuando alguien la abre, y variantes por dispositivo. Calidad no es entregar el original a todos: es nitidez al tamaño real de vista, y la máxima solo bajo demanda.

## Arquitectura correcta (1–20)

Nunca los originales en la galería · thumb + medium + large por foto, original fuera de producción · primer render solo miniaturas · la grande al abrir (nunca ambas a la vez) · nada de 4K en tarjetas ni original como fondo CSS · ni 30 fotos grandes en el HTML inicial · paginar (6–12 al inicio, "ver más") · el home enseña una selección editorial de 4–8; la completa vive en /galeria/ · el home queda enfocado en inscripción · sin lightbox pesado en el home.

## Variantes (21–40)

thumb 320–480 · medium 768–1024 · large 1280–1600 · original solo si se ofrece descarga · tamaños del layout real, sin variantes de sobra · recortes móviles solo si cambia la composición · WebP mayoría, AVIF a prueba en grandes, JPEG solo como fallback necesario, SVG para gráficos, nunca PNG para fotos · nunca recomprimir comprimidos: partir del master · sin EXIF en web · rotación y color ANTES de crear variantes.

## Calidad visual (41–60)

Evaluar al tamaño real de muestra, no al 100% de zoom · revisar rostros, camisetas, dorsales, medallas, letras, hojas, cielos y sombras · más calidad en kit, texto y primeros planos; más compresión en fondos decorativos · no recortar hasta destruir contexto · relación de aspecto coherente por sección · sin deformar (width/height compatibles) · object-cover fotos, object-contain flyers · sin filtros pesados sobre fotos comprimidas.

## Lazy y prioridad (61–80)

lazy en todo lo fuera del primer viewport, NUNCA en el LCP · prioridad solo para UNA imagen · no precargar 10 fotos · placeholder con espacio reservado (width/height, CLS 0) · decoding async en grandes bajo el fold · loading="lazy" basta (sin librería de observers) · lightbox solo si se necesita y montado bajo demanda (dynamic), nunca para el LCP · en modal: solo la foto seleccionada; si se precargan vecinas, máximo una a cada lado; desmontar al cerrar, sin listeners colgados.

## UI (81–100)

Cuadrícula simple, sin carruseles automáticos · fotos con contexto y orden narrativo (Salida, Ruta, Meta, Kit, Edición anterior) · sin 20 casi iguales: selección que cuenta la historia (Patate amplio, inicio, trayecto, llegada, kit, comunidad) · sin bordes/sombras exageradas · abrir claro · alt descriptivo · foto activa no solo por color · controles grandes en modal, cierre con Escape/click fuera/botón.

## Tamaños prácticos

Miniatura móvil 320–480 (15–50 KiB) · miniatura desktop 480–640 (30–90) · ampliada móvil 768–1024 (80–180) · ampliada desktop 1280–1600 (150–350) · hero según layout (100–250) · flyer con texto (80–200). Orientativos: follaje y multitud piden más que un cielo limpio.

## Galería estática sin JavaScript

Miniatura como <a href="foto-grande"> target=_blank: el navegador abre la grande, sin lightbox ni scripts — primera versión perfecta. O <picture> con sources AVIF/WebP + srcset/sizes.

## Estructura ideal

Home: 4–8 miniaturas → [Ver todas las fotos] → /galeria/ con carga diferida → modal solo al abrir.

## Aplicado hoy (20-08-2026)

- Nueva página /galeria/: cuadrícula 2/3 columnas con las 24 fotos reales de la edición anterior — miniaturas con srcset (240/400 del pipeline) y lazy; cada una enlaza al archivo completo. Cero JavaScript (entra al limpiador de scripts). CTA al final.
- El home mantiene la cinta como muestra + enlace "Ver todas las fotos".
- Banners v3 del arte nuevo de Facebook: escritorio 1600w (118 KiB) y móvil vertical 900w (98 KiB) con la entrega de kit en Vehicentro — reemplazan al v2 caducado ("preventa hasta 31 julio").
- Originales conservados fuera de producción en Escritorio/fotos-8k-facebook.
