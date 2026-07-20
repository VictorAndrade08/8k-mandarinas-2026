# 80 reglas para que el sitio no parezca hecho con IA

Consenso de diseñadores (r/webdesign, r/web_design) sobre qué delata un sitio
generado. Lo que se detecta no es "esto lo hizo una IA", sino: componentes por
defecto, ninguna identidad visual, espaciados repetidos, copy genérico, la misma
estructura de siempre y falta de criterio.

Estas reglas mandan sobre [`100-CONSEJOS.md`](./100-CONSEJOS.md) cuando choquen:
los 100 consejos dicen cómo ser consistente, estas 30 evitan que la consistencia
se convierta en plantilla.

1. **No uses la estructura SaaS de siempre** — hero centrado, 3 cards, logos,
   testimonios, pricing, CTA. Es el patrón más repetido.
2. **No dejes la tipografía por defecto.** Inter + Bold + 16px + 24px grita "IA".
3. **No uses siempre esquinas de 24px.** Todo extremadamente redondeado ya es un
   cliché.
4. **No pongas gradientes morado-azul.** Es uno de los "AI tells" más citados.
5. **No abuses del glassmorphism.** Fondos borrosos por todas partes.
6. **No pongas sombras enormes.** Los diseños generados exageran la elevación.
7. **No copies exactamente shadcn/ui.** Muchísimos sitios nuevos son idénticos.
8. **No hagas todos los componentes iguales.** Cada card con el mismo padding,
   el mismo borde y el mismo radio se siente automático.
9. **No uses solo blanco y gris.** Añade personalidad con una paleta propia.
10. **No pongas emojis por todas partes** (🚀✨⚡🔥💡).
11. **No mezcles familias de iconos** (Lucide + Heroicons + FontAwesome juntos).
12. **No centres absolutamente todo.** Los diseños humanos rompen la simetría.
13. **No hagas todas las secciones iguales.** Alterna imagen a la izquierda,
    imagen a la derecha, ancho completo, columnas distintas.
14. **No repitas exactamente el mismo espaciado.** Los humanos crean ritmo.
15. **No uses imágenes genéricas.** El stock y lo generado se detectan enseguida.
16. **No uses texto excesivamente perfecto** ("Revolutionize your workflow",
    "Seamless experience").
17. **No escribas beneficios genéricos.** Especifica datos reales.
18. **No pongas animaciones en TODO.** Scroll reveal en cada elemento, fade up,
    fade left, fade right: cliché.
19. **No abuses de Framer Motion.** Anima solo donde aporte significado.
20. **No pongas botones gigantes.**
21. **No copies la landing de Stripe.**
22. **No uses siempre el mismo ancho.** Rompe la cuadrícula cuando tenga sentido.
23. **No hagas secciones completamente simétricas.** La asimetría controlada
    aporta personalidad.
24. **No uses colores "bonitos" sin identidad.** Construye un sistema de color
    ligado a la marca.
25. **No olvides los detalles pequeños**: microinteracciones, hover, focus,
    transiciones coherentes.
26. **No uses iconos enormes porque sí.** Deben tener un propósito visual.
27. **No dejes el contenido como Lorem Ipsum mejorado.** Redacta pensando en el
    cliente, no en un prompt.
28. **No te quedes con el primer resultado** de Claude, GPT o v0: el primero es
    siempre el más genérico. Iterar y editar a mano es lo que distingue.
29. **No ignores la identidad de marca.** Define antes de diseñar: personalidad,
    tono, tipografía, espaciados, iconografía, fotografías, ilustraciones.
30. **No publiques sin repasarlo a mano.** IA = punto de partida; el diseñador es
    quien toma los cientos de decisiones pequeñas que hacen único el sitio.

## Diseño

31. No uses exactamente el mismo radio en todos los componentes.
32. No hagas que todos los botones sean idénticos.
33. No uses solo tarjetas (cards) para todo.
34. No pongas una cuadrícula perfecta en todas las secciones.
35. No dejes todos los elementos alineados al centro.
36. No uses demasiado espacio vacío solo porque "se ve premium".
37. No pongas un fondo con un gradiente enorme detrás de cada sección.
38. No uses blobs decorativos en todas partes.
39. No abuses de líneas divisorias.
40. No pongas todos los iconos dentro de círculos.

## Tipografía

41. No uses solo dos pesos de fuente.
42. No escribas TODO en Bold.
43. No abuses del tracking (espaciado entre letras).
44. No uses títulos excesivamente largos.
45. No hagas párrafos de una sola línea por estética.
46. No pongas todos los títulos en Title Case si el idioma no lo requiere.
47. No uses 5 fuentes distintas.

## Colores

48. No uses un color para absolutamente todo.
49. No pongas CTAs de colores diferentes sin jerarquía.
50. No uses saturación al 100%.
51. No olvides los estados hover y active.
52. No dependas únicamente del color para indicar acciones.

## UX

53. No ocultes información importante detrás de acordeones.
54. No hagas scroll infinito donde no aporta valor.
55. No pongas modales para todo.
56. No obligues al usuario a registrarse demasiado pronto.
57. No ocultes precios sin motivo.
58. No uses carruseles automáticos.
59. No reproduzcas videos automáticamente con sonido.
60. No hagas que cada clic abra una nueva pestaña.

## Animaciones

61. No animes todos los elementos al entrar.
62. No pongas parallax en toda la página.
63. No uses partículas flotando sin propósito.
64. No hagas que todo rebote.
65. No pongas loaders innecesarios.
66. No hagas transiciones lentas (>400 ms) para acciones comunes.

## Contenido

67. No escribas frases vacías ("Innovamos el futuro", "Llevamos tu negocio al
    siguiente nivel").
68. No inventes estadísticas.
69. No uses testimonios falsos.
70. No pongas fotos de personas claramente generadas por IA sin indicarlo.
71. No llenes el sitio de palabras clave (keyword stuffing).
72. No uses listas interminables de beneficios sin explicar cómo se consiguen.

## Componentes

73. No copies exactamente el Hero de Linear.
74. No copies el Footer de Vercel.
75. No copies la Navbar de Stripe.
76. No copies el Pricing de Tailwind UI.
77. No copies la Landing de Framer.

## Código

78. No dejes clases de Tailwind desordenadas y repetidas.
79. No dejes componentes de más de 300-400 líneas sin dividir.
80. No dejes imports, estados, funciones o dependencias que nunca se usan.

### Señales técnicas que delatan código generado

Variables llamadas `data`, `item`, `value`, `temp`, `result` en todo el
proyecto · componentes gigantes que hacen demasiadas cosas · el mismo JSX
repetido en vez de un componente reutilizado · archivos de cientos de líneas
sin separación lógica · comentarios que describen lo obvio (`// Render button`)
· `console.log` olvidados · `TODO` sin resolver · `any` en TypeScript por
comodidad · hooks con demasiadas dependencias · lógica de negocio mezclada con
la interfaz · funciones llamadas `handleClick`, `processData`, `fetchData` ·
varias formas distintas de resolver el mismo problema en el mismo proyecto ·
componentes creados y nunca usados · valores mágicos en CSS (`margin-top: 37px`)
· librerías importadas que no se usan.

### El patrón que más repiten los desarrolladores

La diferencia entre una web que "parece IA" y una que no es el nivel de edición
humana: personalizar el sistema de diseño en vez de aceptar el generado, ajustar
espaciados y composición para crear ritmo, escribir contenido específico del
negocio, usar imágenes e iconografía coherentes con la marca, eliminar
componentes y efectos que no aportan, y mantener consistencia en tipografía,
colores y comportamiento.

---

## Dónde incumple este sitio (verificado en las capturas)

| Regla | Qué pasa aquí                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3     | 14 radios distintos, y la mayoría muy redondeados (`rounded-3xl`, `[32px]`, `[40px]`)                                                               |
| 5     | `backdrop-blur` en header, barra inferior, modales y varias tarjetas                                                                                |
| 6     | 32 sombras a medida, muchas con glows de 50-60px                                                                                                    |
| 8     | Las cuatro tarjetas de "Todo lo que necesitas saber" y las cuatro de "Explora la experiencia" son idénticas entre sí y casi idénticas entre bloques |
| 12    | El home es una columna centrada de arriba abajo                                                                                                     |
| 13    | Casi todas las secciones son "título centrado + rejilla de 4 tarjetas"                                                                              |
| 14    | El mismo `py-12 md:py-16` repetido sección tras sección                                                                                             |
| 18    | `animate-in fade-in slide-in-from-bottom` en prácticamente todo                                                                                     |
| 24    | 28 colores elegidos a ojo, ninguno atado a los tokens de marca                                                                                      |
| 31    | El mismo problema que la regla 3: 14 radios, sin sistema                                                                                            |
| 38    | Blobs de fondo en el hero, en `/verificar` y en varias secciones del home                                                                           |
| 40    | Los iconos de las tarjetas de "Todo lo que necesitas" van todos en círculo                                                                          |
| 42    | `app/globals.css` sube la escala de pesos entera: `font-normal` pesa 600 y `font-bold` pesa 900. El sitio entero está en negrita                    |
| 43    | `tracking-[0.08em]`, `tracking-widest` y `tracking-wide` repartidos por casi todos los titulares y etiquetas                                        |
| 79    | `FormInscripcion.tsx` tiene ~1850 líneas                                                                                                            |

## Lo que este sitio ya hace bien

- **15 y 17**: las fotos son de ediciones reales de la carrera y los datos son
  reales (recorrido calle por calle, precios por categoría, cuenta bancaria).
- **11**: una sola familia de iconos (Phosphor).
- **10**: no hay emojis decorativos.
- **16 y 27**: el copy está escrito para corredores de Patate, no en inglés de
  plantilla.
- **1**: no hay testimonios ni pricing en cards de SaaS.
