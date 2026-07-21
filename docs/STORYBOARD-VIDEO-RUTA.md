# Storyboard — vídeo de la sección "La Ruta"

Para generar con Higgsfield cuando haya créditos. El primer vídeo (el fondo de
marca, `public/video/fondo-marca.mp4`) costó 8 de 10 créditos, así que este hay
que planificarlo antes de gastarlo: **no hay margen para repetir**.

## La decisión de fondo: gráfico, no fotorrealista

El vídeo NO debe intentar parecer metraje real de Patate.

Dos razones. La primera es que ya tienes metraje real: `8k-promo.mp4` está
grabado en el valle de verdad. Un plano generado de "corredores entre montañas"
puesto al lado del real solo consigue que el real parezca menos real.

La segunda es que el recorrido es un dato, no una estampa. Sale del oficio
N°0084 sellado por el GAD: Patate Gardens → Hilario Torres → E. Dávila →
Escalinata de la Fe → García Moreno → Vicente Rocafuerte → Naciones Unidas → vía
a San Jorge → Quinta → Chalpi → Eloy Alfaro → Manuel Zapater → Juan León Mera →
Av. Ambato → Estadio Municipal. Un vídeo inventado de un pueblo genérico
contradice ese trabajo.

Así que: **animación gráfica en los colores de la marca**, con el mismo lenguaje
del flyer (montañas en línea, degradado magenta → coral → naranja). Eso no
finge nada y encaja con lo que ya hay.

## Los planos

**Plano 1 · 0-2s — El valle en línea**
Silueta de cordillera en trazo fino burdeos sobre el degradado de marca. Cámara
muy lenta de izquierda a derecha. Nada más entra en cuadro.

**Plano 2 · 2-5s — El recorrido se dibuja**
Una línea naranja brillante se traza sola sobre la cordillera, de izquierda a
derecha, con dos o tres curvas. Es el gesto que cuenta la carrera: hay un
principio, un camino y un final.

**Plano 3 · 5-8s — Los dos extremos**
La línea termina. Dos puntos laten suavemente: uno donde empezó, otro donde
acaba. Sin texto — los rótulos "Patate Gardens" y "Estadio Municipal" se ponen
en HTML encima, que así se pueden corregir y los lee un buscador.

## El prompt

```
Minimal 2D motion graphic loop, flat vector style, no photorealism.
Background: smooth diagonal gradient from deep magenta #C51850 through coral
#EE374B into warm orange #F7771C. Foreground: a thin dark burgundy line-art
mountain range across the lower half, drawn like a single continuous pen
stroke. A bright orange glowing line draws itself slowly from left to right
across the mountains, tracing a winding path with two gentle curves, leaving a
soft glow trail. At the end two small circular markers pulse gently, one at
each end of the path. Subtle film grain. Calm, slow, deliberate motion.
Absolutely no text, no letters, no numbers, no logos, no people, no buildings,
no recognizable real-world locations.
```

## El comando

```bash
higgsfield generate create veo3_1_lite \
  --prompt "<el prompt de arriba, en una línea>" \
  --duration 8 \
  --aspect-ratio 16:9
```

Luego `higgsfield generate wait <id>` devuelve la URL.

## Después de generarlo: limpiar SIEMPRE

El primer vídeo salió con dos defectos que el prompt ya prohibía y el modelo
metió igual: **bordes de película falsos** y **texto inventado** abajo a la
izquierda ("CS185D", "CS374B"). Hay que revisarlo fotograma a fotograma y
recortar:

```bash
# Ver 4 fotogramas repartidos
ffmpeg -i generado.mp4 -vf "select='eq(n\,0)+eq(n\,60)+eq(n\,120)+eq(n\,180)',scale=400:-1,tile=2x2" -frames:v 1 frames.png

# Recortar bordes y comprimir para web
ffmpeg -i generado.mp4 -vf "crop=1180:640:50:30,scale=1280:-2" \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -an -movflags +faststart \
  public/video/ruta.mp4
```

Con esos ajustes el fondo de marca quedó en **284 KB** para 8 segundos. Cualquier
cosa por encima de ~500 KB hay que volver a comprimirla: este sitio pesa 780 KB
en móvil y un vídeo pesado se lo come entero.

Y el póster, que es lo que se ve mientras carga:

```bash
ffmpeg -i public/video/ruta.mp4 -vf "select=eq(n\,0),scale=640:-2" -frames:v 1 poster.png
```

## Cómo montarlo en la página

Igual que el fondo del hero (`HeroCountdown.tsx`): `muted`, `playsInline`,
`loop`, `preload="none"` y **solo en escritorio**. En móvil va únicamente el
póster — ahí ya se decidió una vez y por buenas razones: son 284 KB que no se
descarga alguien con datos móviles en Patate.
