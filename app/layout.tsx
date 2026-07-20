import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import {
  ConditionalHeader,
  ConditionalFooter,
  MainWrapper,
} from "./components/SiteChrome";
import { Toaster } from "sonner";
import BottomNav from "./components/BottomNav";

// ==============================
// Tipografía
// ==============================
// Una sola familia para todo el sitio. Antes había cinco (Geist, Geist Mono,
// Montserrat, Bebas Neue y Barlow Condensed) y tres de ellas se cargaban con
// @import desde la CDN de Google dentro de un <style>, lo que bloquea el render.
//
// Poppins porque es lo más cercano en Google Fonts a lo que usa el arte oficial:
// el PSD tira de Gilroy-Bold y Brakle (geométricas) y de Cocogoose Pro para los
// titulares. Poppins es geométrica pura como las dos primeras, y a peso 800/900
// da la masa de Cocogoose. Las tres del diseño son de pago — la de Cocogoose es
// literalmente una "Trial".
// Solo los pesos que el sitio usa de verdad.
//
// Iban 6 pesos × 2 estilos = 12 variantes, y next/font las PRECARGA todas en el
// <head>: doce peticiones peleando con el logo del hero, que es el LCP. Miré el
// CSS compilado y el 400 y el 500 no aparecían ni una vez — la escala de pesos
// del sitio arranca en 600 (ver --font-weight-* en globals.css).
//
// La itálica solo la usan los dígitos del contador, así que basta con una.
// Si algún día hace falta otro peso, se añade aquí; pero cada uno son dos
// peticiones más antes de que se pinte nada.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// ==============================
// Metadata
// ==============================
export const metadata: Metadata = {
  title: "8K Ruta de las Mandarinas 2026",
  description:
    "8K Ruta de las Mandarinas · Sábado 29 de agosto de 2026 — Sitio oficial",
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
      className={`dark ${poppins.variable}`}
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
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.02) 0px,
                rgba(255,255,255,0.02) 1px,
                transparent 1px,
                transparent 3px
              )
            `,
            opacity: 0.35,
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
        <Toaster position="top-center" richColors closeButton duration={2400} />
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
