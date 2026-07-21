"use client";

import { FileArrowDown } from "@phosphor-icons/react";
import { srcSetDe } from "../lib/imagen";

interface Atleta {
  ubicacion: string;
  nombres: string;
}

interface ActaCategoria {
  titulo: string;
  atletas: Atleta[];
}

// --- COLUMNA IZQUIERDA (HOMBRES Y EXTRAS) ---
const COLUMNA_IZQUIERDA: ActaCategoria[] = [
  {
    titulo: "ÉLITE HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LUIS MIGUEL MASABANDA OJEDA" },
      { ubicacion: "SEGUNDO", nombres: "FABIÁN JIMMY GÓMEZ INSUASTI" },
      { ubicacion: "TERCERO", nombres: "KEVIN ALEXIS ZURITA PINANJOTA" },
      { ubicacion: "CUARTO", nombres: "GERSON DAVID MONTES DE OCA SANTAMARÍA" },
      { ubicacion: "QUINTO", nombres: "DIEGO ARÉVALO" },
    ],
  },
  {
    titulo: "JUVENIL HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "PABLO ANTONIO ÑAUTA PEÑAFIEL" },
      { ubicacion: "SEGUNDO", nombres: "JESSIEL ALEXANDER PAEZ ANAGUANO" },
      { ubicacion: "TERCERO", nombres: "JOSE ALEXANDER CABASCANGO BARZALLO" },
    ],
  },
  {
    titulo: "SÉNIOR 1 HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ALEX JOEL CAIZA PUNINA" },
      {
        ubicacion: "SEGUNDO",
        nombres: "ARIEL ALEJANDRO MONTES DE OCA SANTAMARIA",
      },
      { ubicacion: "TERCERO", nombres: "BRYAM PATRICIO SARI PLAZA" },
    ],
  },
  {
    titulo: "SÉNIOR 2 HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "EDISON PATRICIO ENRIQUEZ MORA" },
      { ubicacion: "SEGUNDO", nombres: "HECTOR MANUEL CAZA PULAMARIN" },
      { ubicacion: "TERCERO", nombres: "JEFFERSON SANTIAGO IMBACUAN PAUCAR" },
    ],
  },
  {
    titulo: "MÁSTER HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "JUAN CRISTOBAL ROUILLON VINTIMILLA" },
      { ubicacion: "SEGUNDO", nombres: "PEDRO MANUEL RAMOS IMBAQUINGO" },
      { ubicacion: "TERCERO", nombres: "SEGUNDO GEOVANNY PASTUÑA ALVARADO" },
    ],
  },
  {
    titulo: "SUPERMASTER HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARCO ANTONIO ALMACHI CÓNDOR" },
      { ubicacion: "SEGUNDO", nombres: "JUAN JOSÉ CAJAS" },
      { ubicacion: "TERCERO", nombres: "LEÓN GERARDO MUÑOZ ILLARES" },
    ],
  },
  {
    titulo: "VILCABAMBA HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARINO COLUMBA COLUMBA" },
      { ubicacion: "SEGUNDO", nombres: "JOSÉ ANTONIO LÓPEZ VILLARREAL" },
      { ubicacion: "TERCERO", nombres: "CÉSAR GERARDO AGUILAR SALAZAR" },
    ],
  },
  {
    titulo: "COLEGIAL HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "BRYAN ALFREDO BAUTISTA TIPÁN" },
      { ubicacion: "SEGUNDO", nombres: "DARWIN ALEXIS LÓPEZ TIBANQUIZA" },
      { ubicacion: "TERCERO", nombres: "DEREK PATRICIO QUINATOA RUMIPAMBA" },
    ],
  },
  {
    titulo: "INTERFUERZAS",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "HENRY PAUL PASTE SHINGÓN" },
      { ubicacion: "SEGUNDO", nombres: "DARWIN STALIN CULQUI SAILEMA" },
      { ubicacion: "TERCERO", nombres: "RONNY FABRICIO SUNTAXI SUNTAXI" },
    ],
  },
  {
    titulo: "SILLA DE CALLE",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ÁNGEL IVÁN FARES SILVA" },
      { ubicacion: "SEGUNDO", nombres: "JONATHAN IVÁN HERRERA BEJARANO" },
      { ubicacion: "TERCERO", nombres: "LUIS PEDRO AGUAYO HARO" },
    ],
  },
];

// --- COLUMNA DERECHA (MUJERES Y EXTRAS) ---
const COLUMNA_DERECHA: ActaCategoria[] = [
  {
    titulo: "ÉLITE MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "CARMEN AMELIA TOAQUIZA IZA" },
      { ubicacion: "SEGUNDO", nombres: "MARÍA BALVINA PASTUÑA ALVARADO" },
      { ubicacion: "TERCERO", nombres: "MARY ZENEIDA GRANJA PILA" },
      { ubicacion: "CUARTO", nombres: "JESSICA MARGOTH PAGUAY GUAMÁN" },
      { ubicacion: "QUINTO", nombres: "DIANA JUDITH LANDI ANDRADE" },
    ],
  },
  {
    titulo: "JUVENIL MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "VALERIA ESTEFANÍA SANGOQUIZA VÁSQUEZ" },
      { ubicacion: "SEGUNDO", nombres: "LESLY TATIANA PAUCAR ATI" },
      { ubicacion: "TERCERO", nombres: "SCARLET ISABELA MENDOZA FLORES" },
    ],
  },
  {
    titulo: "SÉNIOR 1 MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LEYDI CARMEN RAURA GALLO" },
      { ubicacion: "SEGUNDO", nombres: "DAMARIS DANIELA DÍAZ CALDERÓN" },
      { ubicacion: "TERCERO", nombres: "PAULA ANDREA JARA ANDRADE" },
    ],
  },
  {
    titulo: "SÉNIOR 2 MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "DENISSE CRISTINA CUASPUD PALCHUCÁN" },
      { ubicacion: "SEGUNDO", nombres: "SUSANA CONSUELO QUINTEROS ESPÍN" },
      { ubicacion: "TERCERO", nombres: "GINA MELANEA ORDÓÑEZ ILLARES" },
    ],
  },
  {
    titulo: "MÁSTER MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ROSA ALVA CHACHA CHACHA" },
      { ubicacion: "SEGUNDO", nombres: "SILVIA ALEXANDRA PAREDES YUCAILLA" },
      { ubicacion: "TERCERO", nombres: "MÓNICA MARÍA CAJAMARCA ILLESCAS" },
    ],
  },
  {
    titulo: "SUPERMASTER MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARÍA NATIVIDAD CHACHIPANTA QUISHPE" },
      { ubicacion: "SEGUNDO", nombres: "MIRYAN LUCINDA JÁCOME SILVA" },
      { ubicacion: "TERCERO", nombres: "GRACIELA TARCILA MOROCHO MORA" },
    ],
  },
  {
    titulo: "VILCABAMBA MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARCIA SUSANA CHILIQUINGA PORRAS" },
      { ubicacion: "SEGUNDO", nombres: "LUCILA MUÑOZ HIDALGO" },
      {
        ubicacion: "TERCERO",
        nombres: "PATRICIA DE LOS ÁNGELES SORIA TRELLES",
      },
    ],
  },
  {
    titulo: "COLEGIAL MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LARISSA ANABEL CHIMBO PORRAS" },
      { ubicacion: "SEGUNDO", nombres: "CANDY MACARENA LEDESMA FLORES" },
      { ubicacion: "TERCERO", nombres: "SOFÍA MAGALY YUGCHA TOAPANTA" },
    ],
  },
  {
    titulo: "INTELECTUAL Y VISUAL",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "SIXTO ROMÁN MORETA CRIOLLO" },
      { ubicacion: "SEGUNDO", nombres: "MAYCOL JOEL BAÑO PACHECO" },
      { ubicacion: "TERCERO", nombres: "JIMMY FABRICIO CAICEDO CASTILLO" },
    ],
  },
];

const TablaActa = ({ categoria }: { categoria: ActaCategoria }) => (
  <div className="mb-6 w-full break-inside-avoid print:mb-4">
    <div className="bg-[#780030] px-2 py-2 print:bg-[#780030] print:text-white">
      <h3 className="text-center font-[family-name:var(--font-titular)] text-[22px] tracking-wider text-white uppercase print:text-white">
        {categoria.titulo}
      </h3>
    </div>
    <div className="border-b-2 border-transparent bg-white">
      <div className="grid grid-cols-[100px_1fr] border-b border-neutral-300 px-4 py-1 font-[family-name:var(--font-titular)] text-[12px] font-bold tracking-wider text-[#780030] uppercase">
        <span>UBICACIÓN</span>
        <span className="text-center">NOMBRES</span>
      </div>
      {categoria.atletas.map((atleta, index) => (
        <div
          key={index}
          className="grid grid-cols-[100px_1fr] items-center border-b border-neutral-200 px-4 py-1.5 last:border-0"
        >
          <span className="font-[family-name:var(--font-titular)] text-[13px] font-bold text-[#780030]">
            {atleta.ubicacion}
          </span>
          <span className="text-center font-[family-name:var(--font-titular)] text-[14px] font-medium text-neutral-800 uppercase">
            {atleta.nombres}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function GanadoresPage() {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <main
      className={`min-h-screen bg-[#f8f8f8] font-sans text-neutral-900 print:bg-white`}
    >
      <style>{`
        @media print {
          /* Configuración estricta de hoja y color */
          @page { size: A4; margin: 10mm; }
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          
          /* Oculta elementos que no se deben imprimir */
          .no-print { display: none !important; }
          header, footer, nav { display: none !important; }

          /* Asegura que el contenedor ocupe el 100% en el PDF */
          #pdf-content { width: 100%; max-width: 100%; margin: 0; padding: 0; }
          
          /* Control exacto del salto de página */
          .page-break { page-break-before: always; break-before: page; }
        }
      `}</style>

      <div
        id="pdf-content"
        className="mx-auto max-w-[1000px] py-8 md:py-12 print:py-0"
      >
        {/* ================= HOJA 1 ================= */}
        <div className="container mx-auto px-4 md:px-8 print:px-0">
          {/* Cabecera con una foto de podio de verdad. Era un título suelto
              sobre blanco, en la página que precisamente celebra a la gente que
              ganó. print:hidden porque esta página se imprime en PDF y una foto
              a sangre se come el tóner sin aportar nada al cuadro. */}
          <div className="relative mb-8 overflow-hidden rounded-[20px] print:mb-4 print:rounded-none">
            <img
              src="/fotos/corredores-05.webp"
              srcSet={srcSetDe("/fotos/corredores-05.webp")}
              sizes="(max-width: 1000px) 100vw, 1000px"
              alt="Podio de la edición anterior de la 8K Ruta de las Mandarinas, en Patate"
              width={640}
              height={376}
              className="h-[190px] w-full object-cover object-center md:h-[260px] print:hidden"
              loading="eager"
              decoding="async"
            />
            {/* Degradado de abajo arriba: el título va encima de la foto y
                necesita fondo oscuro justo detrás de las letras, no en toda la
                imagen. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 print:hidden" />
            <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 p-6 text-center print:static print:p-0">
              <h1 className="font-[family-name:var(--font-titular)] text-4xl leading-tight text-white uppercase md:text-5xl print:text-neutral-950">
                CUADRO FINAL <br />{" "}
                <span className="text-[#f7771c] print:text-neutral-950">
                  DE GANADORES
                </span>
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div className="flex flex-col">
              {COLUMNA_IZQUIERDA.slice(0, 5).map((acta, index) => (
                <TablaActa key={`izq-p1-${index}`} categoria={acta} />
              ))}
            </div>
            <div className="flex flex-col">
              {COLUMNA_DERECHA.slice(0, 5).map((acta, index) => (
                <TablaActa key={`der-p1-${index}`} categoria={acta} />
              ))}
            </div>
          </div>
        </div>

        {/* ================= HOJA 2 ================= */}
        <div className="page-break container mx-auto mt-12 px-4 md:px-8 print:mt-0 print:px-0">
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div className="flex flex-col">
              {COLUMNA_IZQUIERDA.slice(5).map((acta, index) => (
                <TablaActa key={`izq-p2-${index}`} categoria={acta} />
              ))}
            </div>

            <div className="flex flex-col">
              {COLUMNA_DERECHA.slice(5).map((acta, index) => (
                <TablaActa key={`der-p2-${index}`} categoria={acta} />
              ))}

              <div className="mt-4 mb-6 break-inside-avoid">
                <div className="mb-2 inline-block bg-[#c51850] px-3 py-1 font-[family-name:var(--font-titular)] text-xl font-bold text-white italic">
                  COMUNICADO
                </div>
                <p className="font-[family-name:var(--font-titular)] text-[15px] leading-snug text-neutral-800">
                  <span className="font-bold">RECUERDA:</span> La documentación
                  deberá enviarse en formato PDF legible para impresión al
                  WhatsApp <span className="font-bold">0997241804</span> hasta
                  el día 23 de febrero de 2026, hasta las 17 horas.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-[family-name:var(--font-titular)] text-2xl font-bold tracking-wider text-[#c51850]">
                    0997241804
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requisitos Finales */}
          <div className="mt-4 break-inside-avoid border-t border-neutral-300 pt-6">
            <h4 className="mb-3 font-[family-name:var(--font-titular)] text-[16px] font-bold text-neutral-800">
              Se deberán enviar los siguientes requisitos:
            </h4>
            <p className="mb-3 font-[family-name:var(--font-titular)] text-[14px] leading-relaxed text-neutral-700">
              Cédula de identidad legible, información de categoría, ubicación,
              dirección, teléfono y correo electrónico (Primer PDF, documento
              transcrito en computadora). Certificado bancario de entidad
              avalada por el GAD PATATE (Segundo PDF).
            </p>
            <p className="mb-3 font-[family-name:var(--font-titular)] text-[14px] leading-relaxed text-neutral-700">
              En el caso de ser menores de edad, adicionar los documentos del
              representante legal, padre o madre, y cuenta bancaria (Tercer
              PDF).
            </p>
            <p className="font-[family-name:var(--font-titular)] text-[14px] leading-relaxed text-neutral-700">
              Toda la documentación no deberá exceder los 3 PDF.
            </p>
          </div>

          {/* NUEVO BLOQUE: Nota y Plazo de acreditación idéntico a la foto */}
          <div className="mt-6 break-inside-avoid bg-gradient-to-r from-[#f7771c] to-[#c51850] p-4 md:p-6">
            <p className="mb-4 font-[family-name:var(--font-titular)] text-[13px] leading-relaxed text-white">
              <span className="font-bold">Nota:</span> Para las categorías
              Discapacidad visual e intelectual, Silla de calle, Interfuerzas y
              Colegial, se deberá adjuntar la cédula actualizada, FF.AA. y el
              certificado del colegio de la provincia que avalen dichas
              categorías en el tercer PDF.
            </p>
            <p className="font-[family-name:var(--font-titular)] text-[14px] font-bold tracking-wide text-white uppercase">
              EL PLAZO ESTIMADO PARA LA ACREDITACIÓN BANCARIA A LA CUENTA DE LOS
              GANADORES ES DE 90 DÍAS LABORABLES A
            </p>
          </div>
        </div>

        {/* Botón de impresión */}
        <div className="no-print mt-12 flex justify-center border-t border-neutral-200 pt-8 pb-8">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 rounded-xl bg-[#c51850] px-8 py-4 font-[family-name:var(--font-titular)] text-xl font-bold tracking-widest text-white uppercase shadow-lg transition-all duration-300 hover:bg-[#f7771c]"
          >
            <FileArrowDown className="h-6 w-6" />
            Descargar PDF Oficial
          </button>
        </div>
      </div>
    </main>
  );
}
