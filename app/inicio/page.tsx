import dynamic from "next/dynamic";

import Hero from "../components/Hero";
import Publicidad from "../components/Publicidad";
import FloatingCTA from "../components/FloatingCTA";

const SectionLoader = ({ heightClass = "h-64" }) => (
  <div className={`w-full ${heightClass} bg-gray-50/50 animate-pulse`} aria-hidden="true" />
);

const TopGallery = dynamic(() => import("../components/TopGallery"), {
  loading: () => <SectionLoader heightClass="h-[300px] md:h-[400px]" />,
});

const SponsorsStrip = dynamic(() => import("../components/SponsorsStrip"), {
  loading: () => <SectionLoader heightClass="h-20 md:h-24" />,
});

const CountdownStrip = dynamic(() => import("../components/CountdownStrip"), {
  loading: () => <SectionLoader heightClass="h-32 md:h-40" />,
});

const RegistrationOptions = dynamic(() => import("../components/RegistrationOptions"), {
  loading: () => <SectionLoader heightClass="min-h-[500px]" />,
});

const InfoBeforeRace = dynamic(() => import("../components/InfoBeforeRace"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

const ExperienceSection = dynamic(() => import("../components/ExperienceSection"), {
  loading: () => <SectionLoader heightClass="min-h-[600px]" />,
});

const FeaturedStories = dynamic(() => import("../components/FeaturedStories"), {
  loading: () => <SectionLoader heightClass="min-h-[500px]" />,
});

const ReglamentoSection = dynamic(() => import("../components/ReglamentoSection"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

export default function Inicio() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <div className="flex flex-col">
        <Publicidad />
        <Hero />
      </div>

      <TopGallery />

      <SponsorsStrip />

      <section id="countdown">
        <CountdownStrip />
      </section>

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
