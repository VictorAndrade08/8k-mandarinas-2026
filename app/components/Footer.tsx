import Link from "next/link";
import Image from "next/image";
import {
  FacebookLogo,
  InstagramLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_SOPORTE } from "../lib/carrera";

// Los patrocinadores no se listan aquí: ya pasan todos por la cinta de logos de
// la home (SPONSOR_LOGOS en SponsorsStrip). Repetirlos en texto era mantener la
// misma lista en dos sitios, y las dos se desincronizan a la primera.

const ENLACES = [
  { href: "/inscripcion/", label: "Inscripción" },
  { href: "/ruta", label: "El recorrido" },
  { href: "/informacion", label: "Información" },
  { href: "/reglamento", label: "Reglamento" },
  // El mismo nombre que en el header y en la barra inferior del móvil: la misma
  // página no puede llamarse de dos maneras según dónde la mires.
  { href: "/verificar", label: "Mi pago" },
  { href: "/terminos", label: "Términos" },
];

const REDES = [
  {
    href: `https://wa.me/${WHATSAPP_SOPORTE}`,
    label: "WhatsApp",
    Icon: WhatsappLogo,
    color: "hover:text-[#25D366]",
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    Icon: InstagramLogo,
    color: "hover:text-[#E1306C]",
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    Icon: FacebookLogo,
    color: "hover:text-[#1877F2]",
  },
];

export default function Footer() {
  return (
    // A sangre, sin tarjeta redondeada ni margen: el resto del sitio va en
    // tarjetas, pero el footer cierra la página y una tarjeta flotando aquí deja
    // ver el fondo naranja por debajo, que se lee como que falta algo.
    // id="site-footer": lo busca FloatingCTA para esconder el botón flotante al
    // llegar aquí. Si se renombra, el botón se queda encima del footer.
    <footer
      id="site-footer"
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#140309] font-sans text-white"
    >
      {/* Una cordillera dibujada a mano como remate, en tinta de marca y muy
          tenue. Es el toque hecho-a-mano del consejo 9 de AUTENTICIDAD-LOCAL:
          un trazo irregular que ninguna plantilla trae. aria-hidden porque es
          puro adorno. */}
      <img
        src="/texturas/montanas-trazo.webp"
        alt=""
        aria-hidden="true"
        width={1000}
        height={180}
        className="pointer-events-none mx-auto -mb-2 h-auto w-full max-w-7xl opacity-25 select-none"
        loading="lazy"
        decoding="async"
      />
      {/* Resplandor de marca, muy sutil: da profundidad sin meter otra caja */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7771c]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-14 text-center sm:py-16">
        {/* Logo desnudo: la versión blanca se sostiene sola sobre este fondo */}
        <Image
          src="/logo-mandarinas-blanco.svg"
          alt="8K Ruta de las Mandarinas"
          width={480}
          height={168}
          className="h-auto w-[min(78vw,420px)] object-contain"
          loading="lazy"
        />

        <p className="mt-5 text-sm tracking-[0.2em] text-white/50 uppercase sm:text-base">
          29 Agosto 2026 · Patate · Ecuador
        </p>

        {/* Enlaces del sitio */}
        <nav
          className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-1"
          aria-label="Enlaces del sitio"
        >
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="inline-flex min-h-[44px] items-center text-sm tracking-[0.12em] text-white/80 uppercase transition-colors duration-200 hover:text-[#f7771c]"
            >
              {e.label}
            </Link>
          ))}
        </nav>

        {/* Redes */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          {REDES.map(({ href, label, Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[44px] items-center gap-2 text-sm tracking-[0.12em] text-white/60 uppercase ${color} transition-colors duration-200`}
            >
              <Icon size={17} /> {label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/60">
          © 2026 Vigop Eventos · Desarrollo web por{" "}
          <span className="text-[#f7771c]/80">Prez Agencia</span>
        </p>
      </div>
    </footer>
  );
}
