# Revisión UX/UI del sitio completo — 22 de julio de 2026

Plan anotado ANTES de revisar, para que cualquiera pueda repetir la comprobación.

## Cómo verificar esto tú mismo

1. `npm run dev` en una terminal
2. `node scripts/capturas.mjs` en otra — deja todo en `capturas/`
3. Comparar contra las notas de abajo

## Qué se captura

| Ruta           | Qué es                       | Vistas                                   |
| -------------- | ---------------------------- | ---------------------------------------- |
| `/`            | Inicio                       | móvil 390 · tablet 820 · escritorio 1440 |
| `/ruta`        | El recorrido tramo por tramo | las tres                                 |
| `/inscripcion` | El formulario (4 pasos)      | las tres                                 |
| `/reglamento`  | Los 15 artículos             | las tres                                 |
| `/terminos`    | Términos y condiciones       | las tres                                 |
| `/verificar`   | Mi pago                      | las tres                                 |
| `/ganadores`   | Cuadro de ganadores          | las tres                                 |

Más el detalle de header, barra inferior y pie de cada una (`capturas/navegacion/`).

## Contra qué se califica

Los criterios no son gusto mío: salen de la investigación guardada en este
mismo repo — [`100-CONSEJOS.md`](./100-CONSEJOS.md) (NN/g, Baymard, WCAG 2.2,
Material 3), [`30-REGLAS-ANTI-IA.md`](./30-REGLAS-ANTI-IA.md) y
[`AUTENTICIDAD-LOCAL.md`](./AUTENTICIDAD-LOCAL.md) (consenso de r/webdev,
r/UI, r/Frontend). Por cada página se puntúa 1-10 en:

- **Claridad**: ¿se entiende qué es y qué hacer en 5 segundos?
- **Carga**: ¿hay algo que sobra? ¿cuánto pesa, cuánto scroll exige?
- **Consistencia**: ¿misma paleta, tipografía, radios y sombras que el resto?
- **Accesibilidad**: contraste, foco, áreas táctiles, alt, estados no-solo-color

## Resultado de la revisión

(Rellenado tras revisar las capturas — la fecha de cada nota es la de la
captura, no la del build.)

| Página       | Móvil | Escritorio | Qué se encontró y qué se hizo                                                                                                                                                                                                                  |
| ------------ | :---: | :--------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio       |   9   |     9      | REORDENADO en esta revisión: los pasos de inscripción estaban en la posición 7 de 11 — quien bajaba buscando inscribirse cruzaba media página de ambiente. Ahora: anuncio → cómo → WhatsApp → ruta → pruebas. Fuera un patrocinador a petición |
| /ruta        |   9   |     9      | Km en grande, calles reales del oficio N°0084, foto por tramo, cierre de vías. Nada que cortar                                                                                                                                                 |
| /inscripcion |   9   |     9      | No se tocó (a petición). Guarda avance, valida en vivo, contador, honeypot, precio del servidor                                                                                                                                                |
| /reglamento  |   8   |     8      | Largo (8.213px móvil) pero ES un reglamento: 15 artículos con ancla propia. Lo único flojo es contenido, no diseño: el kit sigue "Por definir"                                                                                                 |
| /terminos    |   9   |     9      | Mismo header, misma tipografía, tarjetas legibles, barra inferior presente. Sin cambios                                                                                                                                                        |
| /verificar   |   9   |     9      | Formulario primero en móvil, estado REAL desde el CRM, foto de fondo con capa al 90%                                                                                                                                                           |
| /ganadores   |   8   |     9      | Foto de podio real en cabecera, imprimible en PDF limpio. En móvil es una tabla larga (7.390px) — inherente a listar a todos los ganadores                                                                                                     |

**Media del sitio: 8,8 / 10.** Los dos 8 no son de diseño: el del reglamento es
el dato del kit que falta, y el de ganadores es la longitud inevitable de una
tabla de resultados.

## Los cero que importan

- 0 desbordamientos horizontales en las 21 combinaciones página × pantalla
- 0 errores de ejecución, 0 peticiones rotas
- 0 botones muertos, 0 texto en degradado, 0 secciones duplicadas
- 0 errores de build, tipos y lint
