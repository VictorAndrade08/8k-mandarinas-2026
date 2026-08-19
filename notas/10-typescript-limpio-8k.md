# Notas TypeScript y Frontera Cliente — 8K Ruta de las Mandarinas 2026

> Guardado: 18 de agosto de 2026. Idea central: **reducir la frontera cliente** — no convertir la página completa en cliente por una sola interacción. Home estático; JavaScript solo en inscripción, comprobante y consulta de pago.

## Top 100 (resumen por bloques)

### Prioridad crítica (1–30)

Sin "use client" en page.tsx ni layout.tsx · no convertir el árbol entero en cliente por un botón · componentes interactivos aislados en archivos pequeños · hero, texto, categorías, kit, reglamento resumido y footer como Server Components · sin useState/useEffect para contenido fijo · sin listeners de scroll innecesarios · sin window/document/localStorage/navigator en servidor · sin provider global innecesario · formulario y comprobante en /inscripcion/, consulta en /verificar/ · mapa y galería interactivos fuera del primer render · contador aislado (o fecha estática) · sin librerías de animación/carrusel/chat en el home.

### JavaScript innecesario (31–50)

onScroll que solo cambia clases → fuera · menú móvil → enlaces o `<details>` · acordeones → `<details>/<summary>` · scroll programático → `href="#seccion"` · carruseles → `overflow-x-auto` · tooltips → texto visible · tabs sin datos → secciones · botones que solo navegan → `<a>` · nunca `<div onClick>` como enlace · sin librería para copiar texto (navigator.clipboard solo donde toca) · iconos importados individualmente · sin librería de fechas para una fecha fija · sin gestor global para 5 campos · sin React Query para estático · sin fetch cliente si el servidor puede renderizar.

### Bundle y dependencias (51–80)

@next/bundle-analyzer · revisar qué entra al home · eliminar dependencias sin uso o duplicadas (`npm ls`, `npm dedupe`) · imports específicos · revisar librerías de fechas/iconos/animación/formularios/mapas/carruseles/analítica/validación · cada librería solo en su ruta · dynamic() para pesados bajo el pliegue, NUNCA para el LCP · no importar galería desde el layout ni lógica del formulario desde el home · medir First Load JS por ruta antes y después · no perseguir cifras de bundle sin medir rendimiento real.

### TypeScript (81–100)

`"strict": true` · sin `any` como solución (tipos concretos; `unknown` + comprobación para datos externos) · sin `as any`, `!`, `@ts-ignore` (y si hay excepción, documentarla) · noImplicitAny, strictNullChecks, noImplicitReturns, forceConsistentCasingInFileNames, noEmit para typecheck · tipos para props, respuestas de API y estados de formulario · **validación runtime** (Zod o equivalente) para todo lo que venga del usuario, APIs, archivos y JSON.parse — los tipos solo protegen el código compilado.

## tsconfig mínimo

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Zod para entradas externas

```ts
const registrationSchema = z.object({
  cedula: z.string().regex(/^\d{10}$/),
  nombre: z.string().trim().min(2),
  email: z.string().email(),
  category: z.enum(["elite", "master", "leyenda", "especiales"]),
});
const r = registrationSchema.safeParse(input);
if (!r.success) return { ok: false, errors: r.error.flatten().fieldErrors };
```

## Frontera cliente correcta

- MAL: `"use client"` en la página entera → todo al bundle.
- BIEN: página servidor que importa islas pequeñas; solo `Countdown.tsx` (o similar) lleva `"use client"`.
- Un botón que solo navega es `<a href="/inscripcion/">` — no necesita cliente.

## Errores comunes de useEffect

Calcular en efecto lo que puede calcular el servidor · listeners sin limpiar · fetch duplicado · setState tras desmontar · intervalos sin clear · objetos cambiantes en dependencias · sincronizar estados derivables · eslint-disable en vez de corregir · efectos en componentes que no necesitan cliente · cargar una librería dentro de un efecto. Priorizar la limpieza de los efectos de flujos críticos, no tocar cientos sin medir.

## Build que falla si hay errores

`ignoreBuildErrors: false` (nunca true para "hacer que compile") · scripts: typecheck (`tsc --noEmit`) + lint + build · probar en móvil real.

## Comandos útiles

```bash
rg '"use client"' app
rg 'useEffect|useState|useLayoutEffect' app
rg '\bany\b|as any|@ts-ignore' app
rg 'window|document|localStorage|navigator' app
npm run typecheck && npm run lint && npm run build
```

## Resultado esperado

**Home:** Server Component, sin useState/useEffect/window/document, sin librerías pesadas — idealmente sin JavaScript.
**Inscripción:** cliente solo donde haga falta, validación en cliente y servidor, subida controlada.
**Build:** TypeScript estricto, lint obligatorio, errores nunca ignorados, bundle analizado.
