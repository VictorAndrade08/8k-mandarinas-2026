import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

import {
  ConditionalHeader,
  ConditionalFooter,
  MainWrapper,
} from "./components/SiteChrome";
import { Toaster } from "sonner";

// ==============================
// Fuentes
// ==============================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// ==============================
// Metadata
// ==============================
export const metadata: Metadata = {
  title: "8K Ruta de las Mandarinas 2026",
  description: "8K Ruta de las Mandarinas · Sábado 29 de agosto de 2026 — Sitio oficial",
};

// Evita el auto-zoom de iOS al abrir el teclado en los inputs (mejor UX móvil)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B1A",
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
      className="dark"
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
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${montserrat.variable}
          antialiased
          min-h-screen
          text-white
          bg-[#1A0A0F]
          relative
          overflow-x-hidden
        `}
      >
        {/* CAPAS DE FONDO */}
        <div
          className="fixed inset-0 -z-40 pointer-events-none"
          style={{ background: "#1A0A0F" }}
        />
        <div
          className="fixed inset-0 -z-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(135deg,
                #FF8C1A 0%,
                #FF6B1A 30%,
                #FF4E5A 60%,
                #FF2D7C 85%,
                #B8186A 100%
              )
            `,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: 0.95,
          }}
        />
        <div
          className="fixed inset-0 -z-20 pointer-events-none"
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
          className="fixed inset-0 -z-10 pointer-events-none"
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
          className="fixed inset-x-0 bottom-0 -z-[5] pointer-events-none"
          style={{
            height: "38vh",
            background: "#FFFFFF",
            clipPath: "polygon(0 38%, 100% 0%, 100% 100%, 0% 100%)",
            boxShadow: "0 -18px 60px rgba(0,0,0,0.35)",
            opacity: 0.92,
          }}
        />
        <div
          className="fixed inset-x-0 bottom-0 -z-[4] pointer-events-none"
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
      </body>
    </html>
  );
}
