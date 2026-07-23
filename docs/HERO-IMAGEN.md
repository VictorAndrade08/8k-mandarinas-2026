# Qué imagen va en el hero — investigación y decisión · 23 de julio de 2026

Investigación: qué imagen en el PRIMER PANTALLAZO MÓVIL de una web de carrera
maximiza confianza e inscripciones. Fuentes: NN/g, Baymard, VWO, CXL, guías
de marketing de carreras (Race Roster, Sportstiks) y r/webdev (vía PullPush).

## Top 10, de mejor a peor

1. **Foto real de corredores en ACCIÓN de la edición anterior** — caras
   humanas reales + prueba de que el evento existe. NN/g (eye-tracking):
   las fotos de personas se escrutan como contenido; el stock se ignora.
   VWO/CXL: hasta +38-95 % de conversión con caras reales vs stock.
2. **Foto real de la SALIDA / masa de corredores** — prueba social pura,
   el motor #1 de inscripción en eventos comunitarios.
3. **Foto real de la LLEGADA / celebración** — pico emocional; mejor como
   2ª foto que como fondo del hero.
4. **Foto híbrida: corredores reales + paisaje reconocible de Patate** —
   confianza + pertenencia local. Difícil de producir bien.
5. **Ilustración de marca con corredores estilizados + CTA** — aquí brilla
   la línea gráfica. NN/g ("Handmade Designs"): la ilustración se lee como
   cálida y confiable; LCP casi perfecto, control total de composición.
   PERO no PRUEBA que el evento ocurrió: da afinidad, no evidencia.
6. Foto del pueblo/paisaje SIN gente — bonita pero el ojo la salta.
7. Ilustración + textura + tipografía grande (sin figuras) — branding puro.
8. Collage de varias fotos — fragmenta la atención en móvil, mal LCP.
9. Solo tipografía + color — carga instantánea, cero emoción.
10. **Video autoplay de fondo** — el peor en móvil (NN/g Video Usability):
    distrae del CTA, mata el LCP, problemas de accesibilidad.

## La regla clave

**Para CONFIANZA en un evento local, la foto real gana; para MARCA y
RENDIMIENTO, la ilustración gana.** Foto real cuando ya hay edición anterior
(prueba social) y el objetivo es que un desconocido confíe. Ilustración
cuando no hay fotos usables, el evento es nuevo, o para todo lo que NO es el
primer pantallazo (secciones, kit, recorrido, 404). En ambos casos, el CTA
"Inscríbete" debe ser el elemento de mayor contraste.

## Qué se hizo aquí (23-jul)

El dueño pidió generar. Se aplicó la **opción #5** —ilustración de marca de
corredores en acción— en el hero móvil, por tres razones alineadas con la
evidencia: (1) es la mejor opción NO fotográfica; (2) da LCP y control de
composición perfectos (tercio superior despejado para el logo); (3) mantiene
la coherencia con la línea gráfica del resto del sitio. Las FOTOS REALES de
la edición anterior siguen en la galería y en /ganadores, que es donde
cumplen su función de prueba social.

- Prompt A de esta investigación, generado en 9:16, `public/hero-movil-corredores.webp`
- Solo MÓVIL; en escritorio se mantiene el vídeo de marca
- Degradado ciruela superior para que el logo blanco resalte sobre el cielo crema
- Preload mobile-scoped SOLO en el home (no en el layout)

### Pendiente recomendado por la evidencia

Cuando haya una FOTO REAL buena de corredores en acción de la edición
anterior (nítida, horizontal-recortable a 9:16, con el paisaje detrás),
probarla en el hero móvil A/B contra esta ilustración: la #1 del ranking
supera a la #5 en confianza para inscribir a desconocidos.

## Fuentes

- NN/g — Photos as Web Content: https://www.nngroup.com/articles/photos-as-web-content/
- NN/g — Handmade Designs, The New Trust Signal: https://www.nngroup.com/articles/handmade-designs/
- NN/g — Video Usability: https://www.nngroup.com/articles/video-usability/
- Baymard — Provide Images on a Human Model: https://baymard.com/blog/human-model
- VWO — Do Human Photos Increase Conversions: https://vwo.com/blog/human-landing-page-increase-conversion-rate/
- CXL — Stock Photos vs Real Photos: https://cxl.com/blog/stock-photography-vs-real-photos-cant-use/
- Webflow — Hero image best practices: https://webflow.com/blog/website-hero-image
- Race Roster — Boost Race Registration: https://raceroster.com/articles/5-ways-to-boost-race-registration-via-social-media
- r/webdev — video hero y LCP: https://www.reddit.com/r/webdev/comments/1cz3qse/

Ver también los prompts B (masa de salida) y C (marca pura) en el historial
del chat, listos para generar si se necesitan variantes.
