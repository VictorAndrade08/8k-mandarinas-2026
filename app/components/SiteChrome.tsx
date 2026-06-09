"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const FULLSCREEN_ROUTES = new Set<string>(["/"]);

export function ConditionalHeader() {
  const pathname = usePathname();
  if (FULLSCREEN_ROUTES.has(pathname)) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (FULLSCREEN_ROUTES.has(pathname)) return null;
  return <Footer />;
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreen = FULLSCREEN_ROUTES.has(pathname);
  return (
    <main className={`${fullscreen ? "" : "pt-8"} relative z-10`}>
      {children}
    </main>
  );
}
