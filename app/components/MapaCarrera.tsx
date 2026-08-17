/**
 * El mapa de la carrera, dibujado en SVG — no una imagen exportada.
 *
 * Por qué así y no con IA ni con el arte del flyer:
 * - los nombres de las calles son texto de verdad: nítidos en cualquier
 *   pantalla, seleccionables, y sin el riesgo de que un generador escriba
 *   "Rocafurte";
 * - la tipografía es la del sitio (hereda las fuentes de la página);
 * - pesa ~4 KB contra los ~100 KB del webp, y se repinta gratis en retina.
 *
 * El trazado replica la topología del mapa oficial del flyer (misma fuente
 * que el oficio N°0084): salida en Patate Gardens, H. Torres, E. Dávila,
 * G. Moreno, V. Rocafuerte, N. Unidas, vía San Jorge, el lazo por el Vivero
 * El Mirador y Finca San José, E. Alfaro, Juan León Mera y la Av. Ambato
 * hasta el Estadio. Es un croquis del recorrido, no un plano a escala — igual
 * que el original.
 */

// La ruta en orden de carrera, como polilínea. Coordenadas calcadas de la
// geometría del mapa oficial (mismas esquinas, mismas proporciones).
const RUTA = [
  [250, 505], // Salida — Patate Gardens
  [214, 540],
  [251, 600],
  [324, 585],
  [315, 570], // H. Torres
  [332, 446], // E. Dávila
  [339, 387], // G. Moreno
  [339, 333], // V. Rocafuerte ↔ N. Unidas
  [509, 293], // vía San Jorge
  [663, 225],
  [877, 162], // punto más lejano
  [840, 90], // Vivero El Mirador
  [715, 41],
  [626, 9],
  [501, 23],
  [464, 81],
  [442, 149], // Finca San José
  [420, 153],
  [324, 122], // E. Alfaro
  [287, 140],
  [192, 113],
  [129, 90],
  [63, 122],
  [41, 189],
  [52, 243], // Juan León Mera
  [339, 243],
  [339, 333], // de nuevo por V. Rocafuerte
  [335, 338],
  [7, 342], // Meta — Estadio Municipal
]
  .map((p) => p.join(","))
  .join(" ");

// Etiquetas de calle: cursiva gris con halo blanco, como en un mapa de
// verdad. Las diagonales van rotadas sobre su propio punto.
const CALLES: {
  texto: string;
  x: number;
  y: number;
  rot?: number;
  ancla?: "start" | "middle" | "end";
}[] = [
  { texto: "H. Torres", x: 302, y: 520, rot: -75 },
  { texto: "E. Dávila", x: 352, y: 468, ancla: "start" },
  { texto: "G. Moreno", x: 352, y: 392, ancla: "start" },
  { texto: "V. Rocafuerte", x: 326, y: 292, rot: -90 },
  { texto: "N. Unidas", x: 258, y: 326 },
  { texto: "Av. Ambato", x: 82, y: 326 },
  { texto: "Juan León Mera", x: 160, y: 232 },
  { texto: "Vía San Jorge", x: 545, y: 272, rot: -19 },
  { texto: "E. Alfaro", x: 95, y: 78, rot: -28 },
  { texto: "E. Alfaro", x: 250, y: 108, rot: 10 },
  { texto: "Finca San José", x: 430, y: 108 },
  { texto: "Vivero El Mirador", x: 700, y: 100 },
];

export default function MapaCarrera() {
  return (
    <div className="rounded-[18px] border border-gray-200 bg-white p-5 sm:p-8">
      {/* Cabecera del mapa: qué es y de dónde a dónde. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-barlow text-xs font-bold tracking-[0.2em] text-[#b83f00] uppercase">
            Recorrido oficial · 8 km
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-titular)] text-[26px] leading-none text-gray-900 uppercase sm:text-[34px]">
            Mapa <span className="text-[#d2600f]">de la carrera</span>
          </h3>
        </div>
        <div className="font-barlow flex flex-col gap-1.5 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#2bd98a]"
            />
            <strong className="text-gray-900">Salida:</strong> Patate Gardens ·
            08h00
          </p>
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c51850]"
            />
            <strong className="text-gray-900">Meta:</strong> Estadio Municipal
            de Patate
          </p>
        </div>
      </div>

      <svg
        viewBox="-18 -30 940 680"
        className="mt-6 h-auto w-full"
        role="img"
        aria-label="Croquis del recorrido: salida en Patate Gardens, por Hilario Torres, E. Dávila, García Moreno y Vicente Rocafuerte; Naciones Unidas y la vía a San Jorge hasta el Vivero El Mirador; regreso por Finca San José, Eloy Alfaro y Juan León Mera; y la Av. Ambato hasta el Estadio Municipal."
      >
        <defs>
          {/* El mismo degradado de marca del flyer: naranja → coral → magenta
              siguiendo la dirección de la carrera. */}
          <linearGradient id="ruta-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#f7771c" />
            <stop offset="0.5" stopColor="#ee374b" />
            <stop offset="1" stopColor="#c51850" />
          </linearGradient>
        </defs>

        {/* Sombra suave debajo del trazo para despegarlo del blanco. */}
        <polyline
          points={RUTA}
          fill="none"
          stroke="#78003014"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={RUTA}
          fill="none"
          stroke="url(#ruta-grad)"
          strokeWidth="9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Salida y meta. El halo blanco separa el punto del trazo. */}
        <g>
          <circle cx="250" cy="505" r="11" fill="#fff" />
          <circle cx="250" cy="505" r="7.5" fill="#2bd98a" />
          <circle cx="7" cy="342" r="11" fill="#fff" />
          <circle cx="7" cy="342" r="7.5" fill="#c51850" />
        </g>

        {/* Nombres de calles y sectores. paint-order pinta primero el halo
            blanco y encima la letra: legible aunque cruce el trazo. */}
        <g
          className="font-barlow"
          fontSize="16"
          fontStyle="italic"
          fontWeight="600"
          fill="#6b7280"
          stroke="#ffffff"
          strokeWidth="4"
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {CALLES.map((c) => (
            <text
              key={`${c.texto}-${c.x}`}
              x={c.x}
              y={c.y}
              textAnchor={c.ancla ?? "middle"}
              transform={c.rot ? `rotate(${c.rot} ${c.x} ${c.y})` : undefined}
            >
              {c.texto}
            </text>
          ))}
        </g>

        {/* Rótulos de salida y meta, en negrita de marca. */}
        <g
          className="font-barlow"
          fontSize="17"
          fontWeight="700"
          stroke="#ffffff"
          strokeWidth="4"
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          <text x="250" y="480" textAnchor="middle" fill="#0f766e">
            Salida
          </text>
          <text x="16" y="372" textAnchor="start" fill="#c51850">
            Meta
          </text>
        </g>
      </svg>

      <p className="font-barlow mt-4 text-xs text-gray-400">
        Croquis del recorrido según el oficio N°0084 del GAD de Patate. No está
        a escala.
      </p>
    </div>
  );
}
