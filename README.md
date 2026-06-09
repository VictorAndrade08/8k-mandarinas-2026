# 10k Independencia de Ambato 2026

Sitio web oficial de la carrera **10k Independencia de Ambato 2026**.

- **Fecha:** Domingo 15 de noviembre de 2026
- **Lugar:** Ambato, Ecuador
- **Distancia:** 10 km

## Stack

- Next.js 16 (App Router, Turbopack, `output: "export"`)
- React 19
- TypeScript 6
- Tailwind CSS 4
- Firebase 12 (inscripciones / verificación)
- Sonner, lucide-react, react-icons, react-qr-code

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build estático

```bash
npm run build
```

Genera la carpeta `out/` lista para hosting estático (Hostinger, cPanel, S3, GitHub Pages, etc.).

## Estructura

- `app/` — App Router de Next.js (páginas e `components/`)
- `public/` — assets estáticos
- `app/inscripcion/` — formulario de inscripción
- `app/verificar/` — verificación de pago/registro
- `app/ganadores/` — resultados y categorías
- `app/reglamento/`, `app/terminos/` — documentos oficiales
- `app/checkadmin/` — panel administrativo

## Configuración de Firebase

Crear un archivo `.env.local` con las credenciales del proyecto de Firebase. Sin estas variables la app arranca en **Modo Offline/Demo** (verás el aviso `⚠️ Firebase no configurado` durante el build).
