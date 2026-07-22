import dynamic from "next/dynamic";

import HeroCountdown from "./components/HeroCountdown";
import MapaRuta from "./components/MapaRuta";
import Hero from "./components/Hero";
import FloatingCTA from "./components/FloatingCTA";

const SectionLoader = ({ heightClass = "h-64" }) => (
  <div
    className={`w-full ${heightClass} animate-pulse bg-gray-50/50`}
    aria-hidden="true"
  />
);

// Todo lo que va por debajo del contador se carga aparte: quien entra ve la cuenta
// atrás de inmediato y el resto llega mientras baja.
const TopGallery = dynamic(() => import("./components/TopGallery"), {
  loading: () => <SectionLoader heightClass="h-[300px] md:h-[400px]" />,
});

const SponsorsStrip = dynamic(() => import("./components/SponsorsStrip"), {
  loading: () => <SectionLoader heightClass="h-20 md:h-24" />,
});

const Publicidad = dynamic(() => import("./components/Publicidad"), {
  loading: () => <SectionLoader heightClass="h-64" />,
});

const AyudaWhatsApp = dynamic(() => import("./components/AyudaWhatsApp"), {
  loading: () => <SectionLoader heightClass="h-40" />,
});

const ComoInscribirse = dynamic(() => import("./components/ComoInscribirse"), {
  loading: () => <SectionLoader heightClass="min-h-[420px]" />,
});

const InfoBeforeRace = dynamic(() => import("./components/InfoBeforeRace"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

const FeaturedStories = dynamic(() => import("./components/FeaturedStories"), {
  loading: () => <SectionLoader heightClass="min-h-[500px]" />,
});

const ReglamentoSection = dynamic(
  () => import("./components/ReglamentoSection"),
  {
    loading: () => <SectionLoader heightClass="min-h-[400px]" />,
  }
);

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* La cuenta atrás va primero: es lo que trae a la gente y lo que la hace
          inscribirse. */}
      <HeroCountdown />

      {/* El flyer oficial. Se quitó en la pasada de simplicidad por repetir la
          fecha y el precio, y se repuso a petición: es el arte de la campaña y
          se quiere ver en el sitio. El texto de la imagen no lo lee Google —
          los datos que importan siguen también en HTML por todo el home. */}
      <Publicidad />
      {/* El mapa arriba del todo: es lo que más se pregunta y hasta ahora no
          estaba en ningún sitio. */}
      <MapaRuta />
      <Hero />

      <TopGallery />
      <SponsorsStrip />

      {/* Los cuatro pasos ANTES de las dos opciones de inscripción: quien duda
          de inscribirse por internet duda porque no sabe qué le van a pedir.
          Contestar eso primero es lo que hace que llegue al formulario. */}
      <ComoInscribirse />

      {/* Antes aquí había otra sección entera de dos tarjetas: "Inscríbete
          online" (los mismos pasos y el mismo botón que la sección de arriba,
          otra vez) y "Hazlo por WhatsApp". Solo el WhatsApp aportaba algo
          propio, y cabe en una franja. */}
      <AyudaWhatsApp />

      <section id="info">
        <InfoBeforeRace />
      </section>

      {/* Los premios NO se enseñan aquí: viven en el artículo 13 del reglamento
          y ahí se quedan. Se probó ponerlos en el inicio y se quitó a petición.
          Los valores siguen en app/lib/carrera.ts, que es de donde los lee el
          reglamento. */}

      {/* Aquí iba <ExperienceSection />: repetía las mismas tres cosas que
          InfoBeforeRace —la ruta, las categorías y el kit— y sus cuatro botones
          solo hacían alert("🚀 ¡Próximamente disponible!"). Dos rejillas de
          cuatro tarjetas iguales seguidas, y la segunda sin llevar a ningún
          sitio. Está en el historial de git si hace falta recuperarla. */}
      <FeaturedStories />

      <section id="reglamento">
        <ReglamentoSection />
      </section>

      <FloatingCTA />
    </main>
  );
}
