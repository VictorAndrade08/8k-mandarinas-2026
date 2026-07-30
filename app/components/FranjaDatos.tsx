// Franja de datos LUGAR / FECHA / SALIDA — el elemento más reconocible del
// flyer oficial, traído a la web. Es componente de SERVIDOR (cero JS): son
// datos fijos. Trae tres piezas de la línea gráfica que faltaban en el sitio:
//   1. El degradado cálido diagonal del flyer (naranja → coral → magenta).
//   2. Los chips/pestañas de datos en violeta y navy (colores muestreados del
//      arte, tokens --violeta y --navy).
//   3. Las montañas angulares del pie (los Andes/Tungurahua estilizados), en
//      dos capas violeta + navy, que son la firma visual de la marca.
// Los valores salen del flyer: Valle de Patate · 29 de agosto · Patate Gardens.

const DATOS = [
  { etiqueta: "Lugar", valor: "Valle de Patate", pill: "var(--violeta)" },
  { etiqueta: "Fecha", valor: "29 de agosto", pill: "var(--navy)" },
  {
    etiqueta: "Salida",
    valor: "Patate Gardens",
    nota: "08h00",
    pill: "var(--violeta)",
  },
];

export default function FranjaDatos() {
  return (
    <section
      aria-label="Lugar, fecha y salida de la carrera"
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(115deg, #f7771c 0%, #ee374b 48%, #c51850 100%)",
      }}
    >
      {/* Patrón geométrico tenue del flyer (esquinas): puro CSS, sin peso. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, #fff 0 2px, transparent 3px), radial-gradient(circle at 88% 12%, #fff 0 2px, transparent 3px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 sm:pt-12 sm:pb-28 lg:pb-32">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {DATOS.map((d) => (
            <div
              key={d.etiqueta}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <span
                className="font-bebas inline-flex items-center rounded-md px-4 py-1.5 text-lg font-black tracking-[0.18em] text-white uppercase shadow-[0_6px_16px_rgba(20,3,9,0.35)] sm:text-xl"
                style={{ background: d.pill }}
              >
                {d.etiqueta}
              </span>
              <span className="font-bebas mt-2 text-2xl leading-none font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-3xl md:text-4xl">
                {d.valor}
              </span>
              {d.nota && (
                <span className="font-barlow mt-1 text-sm font-bold tracking-[0.15em] text-white/90 uppercase">
                  Hora: {d.nota}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MONTAÑAS ANGULARES — la firma del flyer. Dos capas de chevrons: violeta
          detrás, navy delante. SVG a sangre, preserveAspectRatio none para que
          estire a lo ancho como una cordillera. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full sm:h-20 lg:h-24"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <polygon
          fill="var(--violeta)"
          points="0,120 0,70 210,30 380,78 560,26 770,80 980,34 1200,82 1440,40 1440,120"
        />
        <polygon
          fill="var(--navy)"
          points="0,120 0,96 240,58 470,100 700,54 940,102 1180,60 1440,98 1440,120"
        />
      </svg>
    </section>
  );
}
