import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";

import {
  ConditionalHeader,
  ConditionalFooter,
  MainWrapper,
} from "./components/SiteChrome";
import BottomNav from "./components/BottomNav";

// ==============================
// Tipografía
// ==============================
// Una sola familia para todo el sitio. Antes había cinco (Geist, Geist Mono,
// Montserrat, Bebas Neue y Barlow Condensed) y tres de ellas se cargaban con
// @import desde la CDN de Google dentro de un <style>, lo que bloquea el render.
//
// Antes era Poppins para todo. Poppins es una geométrica correcta y por eso está
// en media web: aparece por su nombre en las listas de "tipografías que delatan
// una plantilla" (docs/30-REGLAS-ANTI-IA.md, reglas 2 y 47). El arte oficial
// tampoco es geométrico puro — el PSD tira de Cocogoose Pro para los titulares,
// que es una grotesca ancha y muy pesada, y esas son de pago.
//
// Archivo es lo que más se le acerca de lo gratuito: una grotesca dibujada para
// señalética y prensa, con formas más rectas y menos "burbuja" que Poppins.
// Aguanta bien el peso alto sin cerrarse, que es lo que pide un cartel de
// carrera. Y trae itálica de verdad, que la usan los dígitos del contador y los
// titulares del flyer.
//
// Dos cortes, no dos familias distintas:
//   - Archivo Black para los titulares grandes. Es un diseño aparte, más ancho
//     que un Archivo 900 forzado, y da la masa de Cocogoose.
//   - Archivo para todo lo demás, con pesos reales de 400 a 700.
const archivo = Archivo({
  variable: "--font-texto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-titular",
  subsets: ["latin"],
  weight: "400", // Archivo Black solo existe en un peso: el peso ES la fuente.
  display: "swap",
});

// ==============================
// Metadata
// ==============================
export const metadata: Metadata = {
  // Carrera + distancia + ciudad + año: el 29,3 % del tráfico de una web de
  // carrera llega por búsqueda orgánica, y "8k patate" o "carrera patate 2026"
  // son las búsquedas reales (consejo #25 de docs/50-CONSEJOS-CARRERAS.md).
  title: "8K Ruta de las Mandarinas 2026 — Carrera en Patate, Ecuador",
  description:
    "Carrera 8K en Patate, Tungurahua · Sábado 29 de agosto de 2026, salida 08h00 · Inscripción $20, categorías desde los 8 años — Sitio oficial",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // El auto-zoom de iOS se evita con inputs de 16px o más, no bloqueando el zoom:
  // maximumScale/userScalable impedían ampliar la página a quien lo necesita (WCAG 1.4.4).
  // Encoge el layout cuando sube el teclado, para que la barra de acción fija
  // quede encima del teclado y no flotando sobre el campo que se está llenando.
  interactiveWidget: "resizes-content",
  themeColor: "#f7771c",
};

// ==============================
// Layout principal
// ==============================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${archivo.variable} ${archivoBlack.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-blanco */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var html = document.documentElement;
                html.classList.add('dark');
                html.style.colorScheme = 'dark';
              } catch (e) {}
            `,
          }}
        />

        {/* color-scheme dark stays */}
        <meta name="color-scheme" content="dark" />
        {/* Precarga del logo del hero, que es el LCP. El informe marcaba 270 ms
            de "retraso de carga del recurso": el navegador no descubría el SVG
            hasta parsear el <body>. Con este preload en el <head> arranca la
            descarga en el primer byte, en paralelo con el HTML. Es lo que ataca
            ese retraso sin inflar el HTML — pegarlo inline serían 55 KB en cada
            página y se llevaría por delante el FCP. */}
        <link
          rel="preload"
          as="image"
          href="/logo-mandarinas-blanco.webp"
          fetchPriority="high"
        />
        {/* La mandarina del logo. El .ico lleva de 16 a 256px dentro para que el
            navegador elija; el apple-touch va con fondo blanco porque iOS no
            respeta la transparencia al ponerlo en la pantalla de inicio. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon-192.png"
          type="image/png"
          sizes="192x192"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body
        className={`relative min-h-screen overflow-x-hidden bg-[#1c0710] text-white antialiased`}
      >
        {/* CAPAS DE FONDO */}
        <div
          className="pointer-events-none fixed inset-0 -z-40"
          style={{ background: "#1c0710" }}
        />
        <div
          className="pointer-events-none fixed inset-0 -z-30"
          style={{
            backgroundImage: `
              linear-gradient(135deg,
                #f7771c 0%,
                #f7771c 30%,
                #ee374b 60%,
                #c51850 85%,
                #c51850 100%
              )
            `,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: 0.95,
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 -z-20"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55)),
              radial-gradient(1200px 650px at 18% 22%, rgba(255,255,255,0.12), transparent 60%),
              radial-gradient(1000px 600px at 62% 18%, rgba(0,0,0,0.22), transparent 60%),
              linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 35%),
              linear-gradient(225deg, rgba(0,0,0,0.12) 0%, transparent 40%)
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "soft-light",
            opacity: 0.9,
          }}
        />
        {/* Grano de verdad, no líneas sintéticas: antes esta capa era un
            repeating-linear-gradient de rayas de 1px — el "scanline" que trae
            cualquier plantilla. Ahora es una textura fotográfica de 26 KB en
            mosaico (public/texturas/grano.webp), extraída restando a una foto
            de papel su propia versión desenfocada: ruido sin color, que da el
            tacto que pide docs/AUTENTICIDAD-LOCAL.md (consejo 7) sin teñir
            ningún fondo. */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: "url(/texturas/grano.webp)",
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
            opacity: 0.5,
            mixBlendMode: "overlay",
          }}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 -z-[5]"
          style={{
            height: "38vh",
            background: "#FFFFFF",
            clipPath: "polygon(0 38%, 100% 0%, 100% 100%, 0% 100%)",
            boxShadow: "0 -18px 60px rgba(0,0,0,0.35)",
            opacity: 0.92,
          }}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 -z-[4]"
          style={{
            height: "18vh",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0.02))",
            clipPath: "polygon(0 70%, 100% 25%, 100% 100%, 0% 100%)",
            opacity: 0.55,
            transform: "translateY(10px)",
          }}
        />

        <ConditionalHeader />
        {/* El <Toaster/> de sonner vivía aquí, así que la librería entraba en el
            JS de las seis páginas cuando el único que enseña avisos es el
            formulario de inscripción. Se ha movido a FormInscripcion.tsx. */}
        <MainWrapper>{children}</MainWrapper>
        <ConditionalFooter />

        {/* Hueco para la barra inferior (solo móvil), o taparía el final del
            footer. Reserva su altura + la franja de gestos del teléfono. */}
        <div
          className="h-[calc(64px+env(safe-area-inset-bottom))] lg:hidden"
          aria-hidden="true"
        />
        <BottomNav />
      </body>
    </html>
  );
}
