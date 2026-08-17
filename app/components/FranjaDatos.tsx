// Franja de datos LUGAR / FECHA / SALIDA — el elemento más reconocible del
// flyer oficial, traído a la web. Es componente de SERVIDOR (cero JS): son
// datos fijos. Trae tres piezas de la línea gráfica que faltaban en el sitio:
//   1. El degradado cálido diagonal del flyer (naranja → coral → magenta).
//   2. Los chips/pestañas de datos en violeta y navy (colores muestreados del
//      arte, tokens --violeta y --navy).
//   3. Las montañas angulares del pie (los Andes/Tungurahua estilizados), en
//      dos capas violeta + navy, que son la firma visual de la marca.
// Los valores salen del flyer: Valle de Patate · 29 de agosto · Patate Gardens.

import MontanasDivider from "./MontanasDivider";

const DATOS = [
  { etiqueta: "Lugar", valor: "Valle de Patate", pill: "var(--violeta)" },
  { etiqueta: "Fecha", valor: "29 de agosto", pill: "var(--navy)" },
  {
    etiqueta: "Salida",
    valor: "Patate Gardens",
    nota: "08h00",
    pill: "var(--violeta)",
  },
  {
    etiqueta: "Llegada",
    valor: "Estadio Municipal",
    pill: "var(--navy)",
  },
];

export default function FranjaDatos() {
  return (
    <section
      aria-label="Lugar, fecha, salida y llegada de la carrera"
      className="bg-brand relative w-full overflow-hidden"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
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

      {/* MONTAÑAS ANGULARES — la firma del flyer, ahora componente reutilizable. */}
      <MontanasDivider className="absolute inset-x-0 bottom-0 h-16 sm:h-20 lg:h-24" />
    </section>
  );
}
