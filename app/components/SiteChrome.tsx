"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const FULLSCREEN_ROUTES = new Set<string>(["/", "/inscripcion"]);

// Normaliza el slash final ("/inscripcion/" -> "/inscripcion")
const isFullscreen = (pathname: string) =>
  FULLSCREEN_ROUTES.has(pathname.replace(/\/+$/, "") || "/");

export function ConditionalHeader() {
  const pathname = usePathname();
  if (isFullscreen(pathname)) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (isFullscreen(pathname)) return null;
  return <Footer />;
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreen = isFullscreen(pathname);
  return (
    <main className={`${fullscreen ? "" : "pt-8"} relative z-10`}>
      {children}
    </main>
  );
}
