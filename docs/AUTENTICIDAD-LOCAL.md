# Que se sienta hecho por la comunidad de Patate, no por una plantilla

Consenso de r/webdev, r/UI, r/Frontend, r/ClaudeAI y r/vibecoding sobre qué
hace que un sitio se sienta humano. Complementa a
[`30-REGLAS-ANTI-IA.md`](./30-REGLAS-ANTI-IA.md): aquel dice qué NO hacer, este
dice qué SÍ.

## Diagnóstico de partida de este sitio

**Lo que ya funciona:** colores energéticos coherentes con el deporte, contenido
claro y accionable (precios, fechas, mapa), buena estructura móvil, y elementos
auténticos de verdad — fotos reales de la carrera, mapa personalizado, logos de
partners reales.

**Lo que lo hace parecer genérico:** tarjetas y secciones demasiado simétricas
(muchas cards iguales), tipografía "segura", degradados y elementos modernos que
se repiten en miles de sitios de eventos, secciones densas que se sienten
plantilla, y falta de toques asimétricos o humanos.

Para un evento comunitario local, gana mucho con más calidez, imperfecciones
intencionales y autenticidad.

## Los 30, de mayor a menor impacto

1. **Investiga referencias reales primero.** 10-20 sitios de eventos locales,
   running, outdoor de Ecuador. Analiza por qué funcionan. No diseñar en vacío.
2. **Escribe el brief antes de tocar código**: paleta (máx 3 colores + neutros),
   tipografía concreta, bordes, sombras. Y lo prohibido explícitamente.
   → Esto es lo que hacen [`LINEA-GRAFICA.md`](./LINEA-GRAFICA.md) y los tokens
   de `app/globals.css`.
3. **Fotos reales y locales.** Corredores de Patate, mandarinas, los caminos del
   valle. Nada grita "generado" más que el stock.
4. **Asimetría y rupturas intencionales.** Nada de rejillas perfectas de 3 o 4
   tarjetas. Un hero grande con elementos secundarios desiguales. Alterna
   alineaciones.
5. **Tipografía con personalidad.** Evita Inter/Roboto/Poppins por defecto. Un
   display con carácter para titulares + una sans limpia para el cuerpo.
6. **Edita a mano todo lo que salga de una IA.** Nunca publicar en crudo: cambia
   titulares, mete voz local, ajusta espaciados.
7. **Texturas sutiles y grano.** Una capa de ruido bajo, textura de papel o de
   tierra. Menos degradados limpios, más sólidos con un acento radial.
8. **Quita elementos.** Menos animaciones, menos secciones gritando. Uno o dos
   CTA claros por pantalla.
9. **Toques hechos a mano.** Ilustración del mapa dibujada, iconos irregulares,
   trazos tipo boceto para el tema running.
10. **Jerarquía y aire.** Más espacio para respirar, y separar con color sutil en
    vez de bordes y grises por todos lados.
11. **Imperfecciones humanas.** Variación ligera en alineaciones, hovers
    distintos entre sí, copy conversacional.
12. **Prueba en dispositivos reales**, no solo en el navegador de escritorio.
13. **Usa referencias visuales** cuando pidas ayuda a una IA: "adapta este
    estilo a una carrera en Ecuador, no lo copies".
14. **Máximo 3 tonos:** naranja cálido dominante, neutro tierra, un acento vivo.
    Nada de neones.
15. **Accesibilidad y semántica.** Encabezados correctos, alt locales, contraste
    alto. Ayuda al SEO y a que se sienta cuidado.
16. **Microinteracciones útiles, no decorativas.** Un countdown que se sienta
    vivo, un hover en el mapa que resalte el tramo.
17. **Feedback de corredores reales** antes de pulir.
18. **Nada de glassmorphism ni blur excesivo.** Bordes sutiles o elevación con
    sombras de color.
19. **Cuenta la historia del evento** — el aniversario, la comunidad — en
    secciones narrativas.
20. **Prototipa fuera del código** (Figma, papel) y luego exporta.
21. **Elementos temporales y locales:** cuenta regresiva real, clima del valle,
    publicaciones de Instagram reales.
22. **Revisa los anti-patrones:** tarjetas anidadas, testimonios de relleno,
    tramos de precio simétricos.
23. **Mejora la experiencia móvil:** navegación simple, botones grandes para
    inscribirse.
24. **Datos reales y actualizados.** Partners reales, historias reales, cero
    relleno.
25. **Pasa un "de-slop"** con herramientas o revisión dedicada.
26. **Algo único del evento:** una sección "por qué Patate", con fotos de la
    gente.
27. **Variables CSS propias** en vez de los valores por defecto de Tailwind
    repartidos por todas partes.
28. **Manuscritas o script con cuidado** para títulos o detalles temáticos.
29. **Más variación de layout por sección.** No todo hero + tarjetas + pie.
30. **Ignora las modas** que no encajen. Claridad antes que "wow".

## Los 10 que más se repiten en Reddit

1. **Imperfecciones intencionales** (el más votado): líneas irregulares,
   variación sutil de espaciado, asimetría ligera, textura de grano. No
   descuidado — hecho a mano. La IA busca simetría perfecta; eso la delata.
2. **Fotos y recursos reales**, nunca stock.
3. **Boceta a mano primero**, refina después.
4. **Cambia los valores por defecto de raíz**: fuera degradados morado-azul,
   `rounded-2xl` en todo, `shadow-lg` en cada tarjeta, Inter.
5. **Copy con voz humana.** Nada de "en el panorama digital actual". Escribe como
   hablas: entusiasta y local ("corre entre mandarinas y volcanes").
6. **Microinteracciones con propósito.** Una sola cosa imposible de generar ya
   humaniza el sitio entero.
7. **Aire desigual.** Que cada sección respire distinto.
8. **Enseña el detrás de cámaras**: el boceto del mapa, una nota de la
   organización.
9. **Evita los bento grids y los heroes de plantilla.** Inspírate en los carteles
   de carreras locales.
10. **Auditoría de alma:** ¿suena a que lo escribió alguien que quiere esta
    carrera? ¿Se nota que alguien lo cuidó?

## Lo que sale de aquí para este sitio, en orden

1. **[HECHO]** Sistema de color propio atado a la marca, medido del arte oficial
   (consejos 2, 14, 27).
2. **[HECHO]** Radios pequeños y tres niveles de sombra discretos: fuera el
   `rounded-3xl` con glow de 60px (consejos 4 de Reddit, 18).
3. Romper la simetría del home: las secciones de cuatro tarjetas idénticas y el
   eje centrado de arriba abajo (consejos 4, 29).
4. Quitar el `animate-in` de todo y dejarlo donde signifique algo (consejo 8).
5. Textura o grano de fondo en vez de degradados limpios (consejo 7).
6. Sección "por qué Patate" con fotos de la gente del valle (consejo 26).
7. Repasar el copy para que suene a alguien de aquí, no a folleto (consejo 5 de
   Reddit).
