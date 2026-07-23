# Imágenes por cambiar — anotado el 22 de julio de 2026

El dueño marcó estos puntos para reemplazar la foto por una **imagen
generada de diseño** ("no importa si son de diseño"). Regla que sale de la
investigación de [`50-CONSEJOS-CARRERAS.md`](./50-CONSEJOS-CARRERAS.md)
(consejo #13, NN/g y r/running):

> **Nunca una foto falsa que finja ser real.** Los corredores detectan al
> instante los dorsales inventados y las caras raras de la IA, y eso mata
> la confianza. Lo que sí funciona: **ilustración editorial declarada** —
> se ve intencional, nítida a cualquier tamaño, y nadie la confunde con
> una foto trucha. Sin texto, sin logos, sin dorsales legibles.

Las fotos reales de la edición anterior (640px, se ven suaves en grande)
se conservan en `public/fotos/` — siguen siendo la prueba de que la
carrera existe y varias quedan en la página.

## Los puntos marcados

| #   | Dónde                           | Archivo actual       | Problema                                                         |
| --- | ------------------------------- | -------------------- | ---------------------------------------------------------------- |
| 1   | Home · "Cuatro pasos"           | `corredores-10.webp` | Foto grupal posada, poca relación con "inscribirse", se ve suave |
| 2   | Home · "Así fue la edición"     | `corredores-15.webp` | Repetida (también es el fondo de /informacion), se ve suave      |
| 3   | /ruta · km 0 Salida             | `corredores-04.webp` | Es una foto DEL PODIO — contenido equivocado para "la salida"    |
| 4   | /ruta · km 1 El casco           | `corredores-22.webp` | Se ve suave en grande                                            |
| 5   | /ruta · km 2 Subida a San Jorge | `corredores-09.webp` | Repetida (fondo de InfoBeforeRace en el home)                    |
| 6   | /ruta · km 4 Parte alta         | `corredores-24.webp` | Se ve suave en grande                                            |
| 7   | /ruta · km 6 De vuelta          | `corredores-21.webp` | Es la zona de meta, no la bajada — contenido equivocado          |
| 8   | /ruta · km 8 Meta               | `corredores-01.webp` | Podio con banners de auspiciantes viejos                         |

## El estilo común (va en TODOS los prompts)

Para que las 8 se vean de la misma mano:

```text
Flat editorial illustration, bold simplified shapes, subtle screen-print
grain, limited palette: tangerine orange #F7771C, coral #EE374B, magenta
#C51850, deep wine #780030, cream #FFF6EC, dark plum #1C0710. Setting:
Andean small town of Patate, Ecuador — tiled roofs, white church tower,
green valley, mandarin orchards, distant volcano. Runners wear plain
orange jerseys. No text, no letters, no numbers, no logos, no readable
race bibs, no faces in close-up. Wide landscape composition, 16:9.
```

## Prompts por punto (tema + estilo común)

1. **Home · Cuatro pasos** — `A person sitting at a kitchen table filling
a form on a phone, coffee cup, morning window light with the valley
outside, tangerine on the table` — la sección habla de inscribirse
   desde el teléfono, la imagen debe hablar de eso, no de la meta.
2. **Home · Así fue la edición** — `A wide crowd of runners flooding a
small-town street between tiled-roof houses, spectators on sidewalks
waving, festive morning` — energía de pueblo lleno.
3. **/ruta km 0 · Salida** — `Runners gathered behind a start arch at
dawn in a garden park, stretching and chatting, cool morning mist,
volcano silhouette behind`.
4. **/ruta km 1 · El casco** — `Runners passing under a long outdoor
staircase in a colonial town street, brass band playing on the
sidewalk, confetti, balconies with plants`.
5. **/ruta km 2 · Subida a San Jorge** — `Runners climbing a steep
country road between mandarin orchards, leaning into the slope, long
shadows, valley dropping away behind them`.
6. **/ruta km 4 · Parte alta** — `Lone runners on a high ridge road
above the valley, rows of mandarin trees below, huge sky, volcano on
the horizon` — el punto más alto = el paisaje más grande.
7. **/ruta km 6 · De vuelta** — `Runners descending a curved street back
into town, tiled roofs and church tower below getting closer,
downhill momentum`.
8. **/ruta km 8 · Meta** — `A runner crossing a finish line inside a
small stadium, arms raised, crowd in the stands, tape breaking,
confetti in the air`.

## Reglas de integración

- **Si el contenido de una imagen cambia, cambia el NOMBRE del archivo**
  (kit.webp → kit-personas.webp). Cloudflare Pages sirve los assets con 16
  días de caché y NO deja pisarlo desde `_headers` (verificado con curl el
  22-jul-2026): reemplazar bajo el mismo nombre deja a los navegadores
  enseñando la versión vieja hasta 16 días.

- Guardar en `public/ilustraciones/` como webp, correr
  `node scripts/imagenes.mjs` para las variantes 240/400 y el manifest.
- Al reemplazar, revisar el texto vecino: donde diga "las fotos son de la
  edición anterior" debe seguir siendo verdad o ajustarse (la honestidad
  del sitio no se negocia).
- Generación: Higgsfield Soul (0,12 créditos por imagen) o ChatGPT del
  dueño con estos prompts. **Nunca** con las claves pegadas en el chat
  (están expuestas; hay que revocarlas).
