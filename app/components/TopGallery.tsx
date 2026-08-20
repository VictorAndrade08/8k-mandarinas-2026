import { srcSetDe } from "../lib/imagen";

type GalleryItem = { src: string; alt: string };

// Fotos oficiales de la carrera, servidas desde /public.
//
// Componente de SERVIDOR: la cinta se mueve con una animación CSS pura, así
// que no necesita ni un byte de JavaScript — condición del home sin scripts.
// El visor a pantalla completa (lightbox) se quitó junto con el JS: un botón
// que no hace nada es peor que no tener botón, así que las fotos son <div>,
// no <button>.
const IMAGES: GalleryItem[] = [
  {
    src: "/fotos/corredores-01.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-02.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-03.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-04.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-05.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-06.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-07.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-08.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-09.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-10.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-11.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-12.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-13.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-14.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-15.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-16.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-17.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-18.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-19.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-20.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-21.webp",
    alt: "Grupo de corredores con su medalla",
  },
  {
    src: "/fotos/corredores-22.webp",
    alt: "Corredores en la salida de Patate",
  },
  {
    src: "/fotos/corredores-23.webp",
    alt: "Podio de premiación de la carrera",
  },
  {
    src: "/fotos/corredores-24.webp",
    alt: "Grupo de corredores con su medalla",
  },
];

export default function TopGallery() {
  // Lista duplicada para que el bucle CSS (translate -50%) empalme sin salto.
  const belt = [...IMAGES, ...IMAGES];

  return (
    <section className="relative w-full overflow-hidden bg-[#230a17] py-5 sm:py-6">
      <div className="relative">
        {/* Gradientes laterales */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#230a17] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#230a17] to-transparent sm:w-20" />

        {/* Carrusel (animación CSS pura; se pausa al pasar el cursor y se
            desactiva con "reducir movimiento") */}
        <div className="overflow-hidden">
          <div
            className="tg-marquee flex gap-4 sm:gap-6"
            style={
              {
                "--tgDuration": "40s",
                "--tgDurationMobile": "25s",
              } as React.CSSProperties
            }
          >
            {belt.map((img, i) => (
              <div
                key={i}
                className="group relative h-[130px] w-[200px] flex-shrink-0 overflow-hidden rounded-[16px] border border-white/10 bg-black sm:h-[170px] sm:w-[260px] md:h-[210px] md:w-[320px]"
              >
                <img
                  src={img.src}
                  srcSet={srcSetDe(img.src)}
                  sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 320px"
                  alt={img.alt}
                  width={640}
                  height={376}
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-[1.025]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* La cinta es la muestra; las 24 completas viven en /galeria (nota
            20: el home enseña una selección y la galería va en su página). */}
        <div className="mt-4 text-center">
          <a
            href="/galeria/"
            className="font-barlow inline-flex min-h-[44px] items-center gap-2 text-sm font-bold tracking-[0.12em] text-white/80 uppercase underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
          >
            Ver todas las fotos
          </a>
        </div>

        <style>{`
            @keyframes tgMarquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .tg-marquee {
              animation: tgMarquee var(--tgDuration, 40s) linear infinite;
              will-change: transform;
            }
            @media (hover: hover) {
              .tg-marquee:hover { animation-play-state: paused; }
            }
            @media (max-width: 640px) {
              .tg-marquee { animation-duration: var(--tgDurationMobile, 25s); }
            }
            @media (prefers-reduced-motion: reduce) {
              .tg-marquee { animation: none; transform: none; }
            }
          `}</style>
      </div>
    </section>
  );
}
