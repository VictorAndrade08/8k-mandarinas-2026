# Auditoría de línea gráfica — 8K Ruta de las Mandarinas

Capturas: `capturas/movil` (390×844), `capturas/tablet` (820×1180),
`capturas/desktop` (1440×900) y `capturas/navegacion` (header, barra inferior y
pie de cada página). Métricas en `capturas/reporte.json`.

Referencia de marca: `nuevaslineasgraficas/` (flyers oficiales 2026).

---

## 1. La paleta oficial (medida sobre los flyers)

Muestreados píxel a píxel del arte oficial:

| Color             | Hex       | Dónde vive en el flyer                                    |
| ----------------- | --------- | --------------------------------------------------------- |
| Vino / burdeos    | `#780030` | El logo, los chips LUGAR/FECHA/SALIDA. Es el color ancla. |
| Magenta           | `#C51850` | Cuerpo del degradado, zona baja izquierda                 |
| Coral             | `#EE374B` | Zona alta izquierda del degradado                         |
| Naranja mandarina | `#F7771C` | Esquina superior derecha del degradado                    |
| Blanco            | `#FFFFFF` | Toda la titulación                                        |

El degradado oficial va **magenta → coral → naranja** en diagonal
(abajo-izquierda hacia arriba-derecha), con el vino como color sólido para
texto, chips y el logo.

## 2. Lo que hay hoy en la web

| Medida                                        | Estado                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Colores hex escritos a mano en `app/**/*.tsx` | **258**                                                                                                                  |
| Colores distintos                             | **28+**                                                                                                                  |
| Veces que se usan los tokens `--brand-1/2/3`  | **0**                                                                                                                    |
| Radios de esquina distintos                   | **14** (`rounded-full`, `2xl`, `xl`, `lg`, `3xl`, `[16px]`, `[20px]`, `[24px]`, `[28px]`, `[30px]`, `[32px]`, `[40px]`…) |
| Sombras a medida distintas                    | **32**                                                                                                                   |
| Tamaños de texto en px sueltos                | **20+** (`text-[10px]` … `text-[66px]`)                                                                                  |
| Clases de fuente                              | 4 nombres (`font-barlow`, `font-bebas`, `font-sans`, `font-mono`) que apuntan todas a Poppins                            |

**El diagnóstico en una frase:** los tokens de marca existen en
`app/globals.css` pero **no los usa nadie** — cada componente se pintó a mano.
Por eso cada página parece de un sitio distinto.

## 3. Los tres "sitios" que conviven hoy

Se ve claro en las capturas:

- **A — Home**: azul marino `#0F1218` + naranja `#FF6B1A`.
  `capturas/desktop/home-completa.png`
- **B — Reglamento y Términos**: blanco y negro, tarjetas grises, cero color de
  marca salvo el header. Parece un PDF legal.
  `capturas/desktop/reglamento-completa.png`
- **C — Ganadores**: rosa chicle `#FF2D8A` + morado, franja degradada bajo el
  header que no aparece en ninguna otra página.
  `capturas/desktop/ganadores-completa.png`

Y ninguno de los tres es la línea gráfica del flyer (vino + magenta + naranja).

## 4. Problemas concretos de navegación

> Los marcados **[HECHO]** ya están corregidos; el resto sigue pendiente.
> El detalle de en qué consejo se apoya cada arreglo está en
> [`100-CONSEJOS.md`](./100-CONSEJOS.md).

1. **El logo del header no es el del flyer.** En la web el logo es
   morado/naranja; en el arte oficial es vino `#780030`. Es lo primero que se ve
   en las seis páginas.
2. **[HECHO]** "INSCRIBIRME" se salía de su celda en la barra inferior a 390 px.
   Ahora es "Inscríbete", sin `tracking` y con `min-w-0`: entra con margen a
   ambos lados (consejo 88).
3. **[HECHO]** Los iconos de la barra inferior no eran de la misma familia
   visual: el corredor iba en `bold` y el resto en `regular`. Ahora el estilo
   depende solo de si la celda está activa —`fill`— o no —`regular`—
   (consejo 71).
4. **El header naranja de `/ganadores` y `/reglamento`** contra el header blanco
   del home: la misma barra, dos fondos distintos.
5. **[HECHO]** La página activa se marcaba solo con color. Ahora lleva además
   barrita superior e icono relleno en la barra inferior, y subrayado más
   `aria-current="page"` en el header de escritorio (consejos 20 y 22).
6. **[HECHO]** El header decía "VERIFICAR MI PAGO" y la barra inferior "MI
   PAGO" para el mismo destino. Las dos dicen ya "Mi pago" (consejo 10).
   Queda "INFORMACIÓN", que existe arriba y no abajo — aceptable: la barra
   inferior es un subconjunto de 5 celdas (consejo 25).

## 5. Lo que sí está bien (no tocar)

- Cero desbordamiento horizontal en las 18 combinaciones página × pantalla
  (`reporte.json`: `scrollWidth == clientWidth` en todas).
- El tratamiento a sangre ya está aplicado en home, reglamento, términos y
  verificar.
- La barra inferior como única navegación móvil (sin hamburguesa) es la decisión
  correcta y ya está hecha.
- El botón "Consultar Inscripción" de `/verificar` ya usa el degradado
  naranja→magenta: es el único componente que ya habla el idioma del flyer.

---

## 6. Plan de trabajo propuesto

**Paso 1 — Tokens.** Reescribir la paleta de `app/globals.css` con los cinco
colores medidos del flyer, más una escala de radios (3 valores), sombras (3) y
tamaños de texto (7). Nada nuevo se escribe a mano.

**Paso 2 — Sustitución.** Reemplazar los 258 hex por los tokens. `#FF6B1A` →
naranja de marca, `#FF2D7C` → magenta de marca, los azules marinos → una única
superficie oscura derivada del vino.

**Paso 3 — Navegación.** Un solo header (mismo fondo en las seis páginas), logo
vino, barra inferior con iconos de una sola familia y peso, etiquetas iguales
arriba y abajo, "Inscribirme" que quepa.

**Paso 4 — Ganadores y Reglamento.** Traerlas al mismo idioma: mismos titulares,
mismos chips vino, mismas tablas.

**Paso 5 — Volver a capturar** con este mismo script y comparar contra estas
imágenes.
