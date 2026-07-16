import dynamic from "next/dynamic";

import HeroCountdown from "./components/HeroCountdown";
import Publicidad from "./components/Publicidad";
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

const RegistrationOptions = dynamic(
  () => import("./components/RegistrationOptions"),
  {
    loading: () => <SectionLoader heightClass="min-h-[500px]" />,
  }
);

const InfoBeforeRace = dynamic(() => import("./components/InfoBeforeRace"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

const ExperienceSection = dynamic(
  () => import("./components/ExperienceSection"),
  {
    loading: () => <SectionLoader heightClass="min-h-[600px]" />,
  }
);

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

      <Publicidad />
      <Hero />

      <TopGallery />
      <SponsorsStrip />

      <section id="inscripciones">
        <RegistrationOptions />
      </section>

      <section id="info">
        <InfoBeforeRace />
      </section>

      <ExperienceSection />
      <FeaturedStories />

      <section id="reglamento">
        <ReglamentoSection />
      </section>

      <FloatingCTA />
    </main>
  );
}
