# Prompts de Instagram — línea gráfica 8K Ruta de las Mandarinas

La misma línea de las ilustraciones del sitio (docs/CAMBIO-IMAGENES.md),
adaptada a cada pieza que necesita la cuenta. Funcionan en GPT Image
(ChatGPT / Higgsfield `gpt_image_2`) y en cualquier generador decente.

## Las 3 reglas antes de generar

1. **Sin texto dentro de la imagen.** La IA escribe mal y con errores — y
   un typo mata la confianza (docs/50-CONSEJOS-CARRERAS.md, #39). El
   texto va DESPUÉS, encima, en Canva/Figma con la tipografía de la marca
   (Archivo Black para titulares). Por eso todos los prompts terminan con
   la prohibición de letras.
2. **Formato según destino:**
   - Post de feed: `--aspect-ratio 3:4` (vertical, ocupa más pantalla)
   - Post cuadrado clásico: `--aspect-ratio 1:1`
   - Historia / portada de reel: `--aspect-ratio 9:16`
3. **Deja espacio para el texto.** Cada prompt pide una zona despejada
   (cielo, pared, camino) donde luego va el titular.

## EL BLOQUE DE ESTILO (va al inicio de TODOS los prompts)

```text
Flat editorial illustration, bold simplified shapes, subtle screen-print
grain, limited palette: tangerine orange #F7771C, coral #EE374B, magenta
#C51850, deep wine #780030, cream #FFF6EC, dark plum #1C0710. Setting:
Andean small town of Patate, Ecuador — tiled roofs, white church tower,
green valley, mandarin orchards, distant snow-capped volcano. Runners
wear plain orange jerseys. No text, no letters, no numbers, no logos, no
readable race bibs, no close-up faces.
```

## Los prompts, pieza por pieza

Cada uno = BLOQUE DE ESTILO + esta escena:

### 1. Anuncio de la fecha (post principal)

```text
A single mandarin with two leaves in the center like a rising sun over
the valley and town, rays behind it, runners silhouetted small on a road
below, large empty sky area at the top for a headline.
```

### 2. Cuenta regresiva (falta un mes / una semana / un día)

```text
A runner tying their shoes at dawn on a doorstep, town street still in
early morning shadow, warm light appearing behind the volcano, calm and
focused mood, empty wall space beside the runner for a headline.
```

### 3. Inscripciones abiertas / cómo inscribirse

```text
A person at a warm kitchen table registering on a phone, coffee and a
tangerine on the table, the valley and volcano through the window, clear
empty area in the upper third for a headline.
```

### 4. Categorías y precios

```text
Four runners of different ages side by side on the town street — a
teenager, an adult, an older runner with gray hair, and a wheelchair
athlete — all in orange jerseys, equal footing, celebratory mood, empty
sky above for a headline.
```

### 5. El kit del corredor

```text
Flat-lay seen from above on cream background: plain orange running
shirt, round medal on striped ribbon, blank race bib, running shoes,
small water bottle, two mandarins with leaves, arranged with generous
spacing, empty band at the top for a headline.
```

### 6. Premios

```text
A golden medal with an engraved mandarin hanging in the center, confetti
falling, the town and volcano small at the bottom, radial glow behind
the medal, empty space around it for prize amounts.
```

### 7. La ruta / el recorrido

```text
A winding road drawn as a ribbon from a garden park through the town,
up between mandarin orchards and back down to a small stadium, tiny
runners along the path, bird's-eye view of the valley, volcano at the
horizon, corners left uncluttered for labels.
```

### 8. Aviso de cierre de vías

```text
A calm empty town street at dawn with striped barriers at the corners
and a police officer redirecting a single car, respectful and orderly
mood, tiled roofs, large empty sky for the schedule.
```

### 9. Día de la carrera (post de la mañana)

```text
The start arch at dawn with a crowd of runners stretching behind it,
mist over the valley, first sunlight hitting the volcano peak, festive
tension, empty sky area for a headline.
```

### 10. Resultados / ganadores

```text
Three runners on a simple wooden podium in a small stadium, arms raised,
crowd celebrating in the stands, confetti, the town behind the stadium
wall, empty upper area for names.
```

### 11. Gracias a los auspiciantes

```text
A festive town plaza after the race, runners and families sharing
mandarins at long tables, balloons in orange and magenta, church tower
behind, warm afternoon light, clean band at the bottom for logos.
```

### 12. Historia genérica (fondo 9:16)

```text
Vertical composition: the road climbing between mandarin orchards from
bottom to top, one runner mid-stride at the lower third, the town and
volcano stacked above, big calm sky occupying the upper half for text
overlays.
```

## Cómo generarlos con Higgsfield (lo que usamos para el sitio)

```bash
higgsfield generate create gpt_image_2 \
  --prompt "BLOQUE DE ESTILO + escena" \
  --aspect-ratio 3:4 --quality medium --resolution 1k
```

Costo: ~2 créditos por imagen en calidad media (alta = 7). Las 12 piezas
completas ≈ 24 créditos.

## Referencia

Las 9 ilustraciones ya generadas con esta línea están en
`public/ilustraciones/` — sirven de referencia de estilo si el generador
acepta imagen de referencia (`--image-references`).
