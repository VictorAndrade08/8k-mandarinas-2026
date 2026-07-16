"use client";

import React from "react";
import {
  PRECIO_PREVENTA,
  PRECIO_DESCUENTO,
  WHATSAPP_SOPORTE,
} from "../lib/carrera";

// WhatsApp de la organización para reclamos de resultados. Es distinto del de
// soporte al corredor: este lo atiende el juzgamiento, no inscripciones.
const WHATSAPP_RECLAMOS = "593997241804";

export default function ReglamentoSection() {
  return (
    <section
      id="reglamento"
      className="w-full px-4 py-10 md:py-14 flex justify-center"
    >
      {/* La familia la sirve next/font desde el layout */}
      <style>{`
        .font-bebas {
          font-family: var(--font-poppins), sans-serif;
          font-weight: 800;
        }
      `}</style>

      {/* ✅ MISMO ANCHO QUE EL HEADER */}
      <div
        className="
          w-full max-w-7xl mx-auto
          bg-white
          rounded-[48px]
          border border-black/10
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          px-6 sm:px-10 md:px-16
          py-12 md:py-16
          text-black
        "
      >
        {/* HEADER */}
        <div className="text-center">
          <p className="uppercase tracking-[0.32em] text-xs sm:text-sm text-black/60 font-semibold">
            Información oficial — lectura clara y accesible
          </p>

          <h2
            className="
              mt-4
              text-[40px] sm:text-[54px] lg:text-[66px]
              leading-[1.02]
              uppercase tracking-[0.08em]
              font-bebas"
          >
            Reglamento Oficial
          </h2>

          <p className="mt-3 text-black/70 max-w-3xl mx-auto text-[15px] sm:text-[16px] leading-relaxed">
            8K Ruta de las Mandarinas 2026 — Patate, Tungurahua · Ecuador
          </p>
        </div>

        {/* BODY */}
        {/* 15/16px y no 17/18: el texto va un escalón más grueso que antes en
            todo el sitio, y a 18px un reglamento entero se lee como un muro. */}
        <div className="mt-12 space-y-6 text-[15px] sm:text-[16px] leading-[1.8] text-black/85">
          <ArticleCard id="art-1" title="Artículo 1. Denominación">
            <p>
              La Carrera Atlética <strong>8K Ruta de las Mandarinas</strong> es
              organizada por <strong>Vigop Eventos</strong>, Comité Organizador,
              en colaboración con el GAD Municipal de Patate.
            </p>
          </ArticleCard>

          <ArticleCard id="art-2" title="Artículo 2. Fecha y Hora">
            <p>
              La competencia se llevará a cabo el{" "}
              <strong>sábado 29 de agosto de 2026</strong>, con salida desde{" "}
              <strong>Patate Gardens a las 08h00</strong>. El tiempo máximo para
              completar el recorrido será de <strong>90 minutos</strong>.
            </p>
          </ArticleCard>

          <ArticleCard id="art-3" title="Artículo 3. Participantes">
            <p>
              Podrán participar todos los corredores, tanto nacionales como
              extranjeros, en buen estado de salud y que hayan completado su
              inscripción de manera válida.
            </p>
          </ArticleCard>

          <ArticleCard id="art-4" title="Artículo 4. Distancia y Recorrido">
            {/* El recorrido calle por calle y el cierre de vías salen del oficio
                N°0084 dirigido al alcalde de Patate y sellado por el GAD. Antes
                este artículo decía solo "recorrido escénico por las principales
                calles", que no le sirve de nada a quien viene a correr. */}
            <div className="space-y-4">
              <p>
                La carrera tendrá una distancia de{" "}
                <strong>8 kilómetros</strong>, con un recorrido escénico que
                conecta las principales calles y zonas rurales de Patate,
                rodeadas de cultivos de mandarinas.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                  <p className="text-black/60 text-[13px] uppercase tracking-[0.18em] mb-1">
                    Salida
                  </p>
                  <p className="font-extrabold">Patate Gardens</p>
                  <p className="text-black/70 text-[14px]">08h00</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                  <p className="text-black/60 text-[13px] uppercase tracking-[0.18em] mb-1">
                    Llegada
                  </p>
                  <p className="font-extrabold">Estadio Municipal de Patate</p>
                  <p className="text-black/70 text-[14px]">
                    Tarima, sonido y premiación
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Recorrido oficial</p>
                <p>
                  Salida desde <strong>Patate Gardens</strong>. Se gira a la
                  izquierda a la calle Hilario Torres, luego a la izquierda por la
                  calle E. Dávila, siguen por la calle bajo la Escalinata de la
                  Fe, continúan por la calle García Moreno, giran a la izquierda a
                  la calle Vicente Rocafuerte, a la derecha a la calle Naciones
                  Unidas, giran a la izquierda y suben a la vía a San Jorge hasta
                  el sector de Quinta, circunvalan el sector de Chalpi pasando por
                  los viveros del sector, bajan a la calle Eloy Alfaro tras el
                  colegio Benjamín Araujo, bajan la calle Manuel Zapater frente al
                  colegio Benjamín Araujo, giran a la calle Juan León Mera hasta
                  la calle Vicente Rocafuerte, giran a la izquierda hasta la calle
                  Naciones Unidas y continúan por la <strong>Av. Ambato</strong>{" "}
                  para la recta final hasta el ingreso al{" "}
                  <strong>Estadio Municipal de Patate</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5 space-y-2">
                <p className="font-semibold">Cierre de vías y operativo</p>
                <ul className="list-disc pl-6 space-y-1 text-black/85">
                  <li>
                    Cierre de vías desde las <strong>07h00 hasta las 10h00</strong>.
                    La apertura será progresiva conforme avance la competencia.
                  </li>
                  <li>
                    El control de tránsito estará a cargo de la{" "}
                    <strong>Policía Nacional</strong>, con vallado en todo el
                    trayecto.
                  </li>
                  <li>
                    La <strong>Banda Municipal</strong> estará ubicada en el
                    trayecto de la carrera.
                  </li>
                  <li>
                    La competencia forma parte del programa oficial de Patate en
                    sus festividades.
                  </li>
                </ul>
              </div>
            </div>
          </ArticleCard>

          <ArticleCard id="art-5" title="Artículo 5. Categorías">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-2 text-black/85">
                <div>
                  <strong>Élite Pro 8K</strong> — Damas y Varones (hasta 39
                  años)
                </div>
                <div>
                  <strong>Máster</strong> — Damas y Varones (40 – 64 años)
                </div>
                <div>
                  <strong>Leyenda – Tercera Edad</strong> — Damas y Varones (65
                  años en adelante)
                </div>
                <div>
                  <strong>Especiales / Capacidades Diferentes</strong> — Abierto
                </div>
              </div>
            </div>
          </ArticleCard>

          <ArticleCard id="art-6" title="Artículo 6. Inscripciones">
            <div className="space-y-3">
              <p>
                Las inscripciones se realizarán en línea a través del sitio
                oficial{" "}
                <a
                  href="https://8krutadelasmandarinas.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-extrabold underline underline-offset-4 hover:opacity-80"
                >
                  www.8krutadelasmandarinas.com
                </a>{" "}
                o vía WhatsApp habilitado por la organización:{" "}
                <WhatsAppLink
                  phoneE164={WHATSAPP_SOPORTE}
                  label="+593 99 510 2378"
                  message="Hola, quiero inscribirme en la 8K Ruta de las Mandarinas 2026. ¿Me ayudan con el proceso?"
                />
              </p>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="font-semibold mb-2">Costos de inscripción</p>
                <ul className="space-y-1 text-black/85">
                  <li>
                    <strong>${PRECIO_PREVENTA}</strong> — Élite Pro 8K (
                  hasta 39 años)
                  </li>
                  <li>
                    <strong>${PRECIO_PREVENTA}</strong> — Máster (40 – 64 años)
                  </li>
                  <li>
                    <strong>${PRECIO_DESCUENTO}</strong> — Leyenda (65 años en
                    adelante)
                  </li>
                  <li>
                    <strong>${PRECIO_DESCUENTO}</strong> — Especiales /
                    Capacidades Diferentes
                  </li>
                </ul>
              </div>

              <p>
                Incluye <strong>kit del corredor</strong>: camiseta oficial,
                dorsal, chip de cronometraje, medalla y obsequios de
                auspiciantes.
              </p>

              <p>
                <strong>IMPORTANTE:</strong> es requisito presentar cédula a
                color al momento de retirar el kit.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-7" title="Artículo 7. Entrega de Kits y Chips">
            <div className="space-y-3">
              {/* Fecha, lugar y horario aún sin confirmar por la organización.
                  Se anuncia como pendiente en vez de arrastrar los datos de la
                  edición anterior: un corredor que viaja a retirar el kit a un
                  sitio equivocado es un problema real, no una errata. */}
              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="font-semibold mb-1">Por definir</p>
                <p className="text-black/80">
                  La fecha, el lugar y el horario de entrega del kit oficial del
                  corredor se anunciarán próximamente en esta página y en los
                  canales oficiales del evento.
                </p>
              </div>

              <p>Requisitos para el retiro:</p>
              <ul className="list-disc pl-6 space-y-1 text-black/85">
                <li>Comprobante de inscripción</li>
                <li>Cédula de identidad a color</li>
              </ul>

              <p className="text-black/70">
                Una vez finalizado el horario de entrega que se anuncie, no se
                aceptarán reclamos ni reembolsos.
              </p>

              <p className="text-black/75">
                ¿Dudas sobre el retiro del kit? Escríbenos por WhatsApp:{" "}
                <WhatsAppLink
                  phoneE164={WHATSAPP_SOPORTE}
                  label="+593 99 510 2378"
                  message="Hola, quiero saber cuándo y dónde se entrega el kit de la 8K Ruta de las Mandarinas 2026."
                />
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-8" title="Artículo 8. Clasificación">
            <p>
              Los resultados generales y por categoría estarán disponibles en la
              web oficial de la carrera{" "}
              <strong>www.8krutadelasmandarinas.com</strong>, con sistema de
              cronometraje digital.
            </p>
          </ArticleCard>

          <ArticleCard id="art-9" title="Artículo 9. Puntos de Control">
            <p>
              La organización contará con puntos de control de ruta, hidratación
            . <strong>El no pasar por un punto de control
              será motivo de descalificación.</strong>
            </p>
          </ArticleCard>

          <ArticleCard id="art-10" title="Artículo 10. Vehículos Autorizados">
            <p>
              Solo los vehículos acreditados por la organización podrán circular
              durante la competencia. El tránsito será gestionado por la Policía
              Nacional y Agentes de Tránsito.
            </p>
          </ArticleCard>

          <ArticleCard
            id="art-11"
            title="Artículo 11. Seguridad"
          >
            <p>
              Habrá asistencia, seguridad y personal ubicados
              estratégicamente a lo largo del recorrido y en la meta,
              garantizando el bienestar de todos los participantes durante la
              competencia, además de contar con un{" "}
              <strong>seguro de accidentes</strong>.
            </p>
          </ArticleCard>

          <ArticleCard id="art-12" title="Artículo 12. Descalificación">
            <div className="space-y-4">
              <p>Serán descalificados los atletas que:</p>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <ul className="list-disc pl-6 space-y-1 text-black/85">
                  <li>No completen el recorrido oficial.</li>
                  <li>Excedan el tiempo límite (90 minutos).</li>
                  <li>No pasen por los puntos de control designados.</li>
                  <li>
                    Usen un número de otro corredor o no lo lleven visible.
                  </li>
                  <li>Reciban ayuda externa no autorizada.</li>
                </ul>
              </div>

              <p>
                <strong>Sanción adicional:</strong> los corredores descalificados
                quedarán inhabilitados para participar en competencias de la
                organización por <strong>5 años</strong>.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-13" title="Artículo 13. Premios y Sorteos">
            <PremiosTables />
          </ArticleCard>

          <ArticleCard
            id="art-14"
            title="Artículo 14. Declaración de Salud y Aceptación del Reglamento"
          >
            <div className="space-y-3">
              <p>
                Al inscribirse, cada atleta declara bajo su responsabilidad que
                se encuentra en condiciones físicas y de salud adecuadas para
                participar. Asimismo, exonera al Comité Organizador, auspiciantes
                y entidades colaboradoras de cualquier responsabilidad médica o
                legal derivada de su participación.
              </p>
              <p>
                La inscripción implica la aceptación total del presente
                reglamento y el compromiso de cumplir con todas sus
                disposiciones sin excepción.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-15" title="Artículo 15. Modificaciones">
            <p>
              El Comité Organizador se reserva el derecho de modificar el
              reglamento, el recorrido o las fechas de la competencia, así como
              de cancelar el evento en caso de fuerza mayor. En tal situación, no
              habrá obligación de reembolso; sin embargo, se establecerá una
              nueva fecha para la carrera.
            </p>
          </ArticleCard>

          <ArticleCard
            id="anexo"
            title="Anexo. Reglamento de aplicación a la ordenanza municipal"
          >
            <AnexoOrdenanza />
          </ArticleCard>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="
        rounded-[28px]
        border border-black/10
        bg-white
        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        overflow-hidden
        scroll-mt-28
      "
    >
      <div className="px-5 sm:px-7 py-4 sm:py-5 bg-black/[0.03] border-b border-black/10">
        <h3 className="font-extrabold text-black/90 text-[16px] sm:text-[18px]">
          {title}
        </h3>
      </div>
      <div className="px-5 sm:px-7 py-6">{children}</div>
    </article>
  );
}

/**
 * Premios económicos por categoría. Es la única tabla de premios del reglamento:
 * el anexo de la ordenanza remite aquí en vez de repetir los valores, que es
 * como se coló el desfase de precios que hubo entre landing, formulario y panel.
 */
function PremiosTables() {
  const tabla = [
    { categoria: "Élite Pro 8K", primero: "120", segundo: "100", tercero: "80" },
    { categoria: "Máster", primero: "80", segundo: "60", tercero: "40" },
    { categoria: "Leyenda", primero: "80", segundo: "60", tercero: "40" },
    { categoria: "Discapacidad", primero: "80", segundo: "60", tercero: "40" },
  ];

  return (
    <div className="space-y-5">
      <p className="font-semibold">Premios económicos</p>

      <div className="rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[560px] text-[15px] sm:text-[16px]">
            <thead>
              <tr className="text-left">
                {["CATEGORÍA", "1° LUGAR", "2° LUGAR", "3° LUGAR"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10 bg-black/[0.03]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabla.map((f) => (
                <tr
                  key={f.categoria}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-4 py-3 font-bold text-black/80">
                    {f.categoria}
                  </td>
                  <td className="px-4 py-3">${f.primero}</td>
                  <td className="px-4 py-3">${f.segundo}</td>
                  <td className="px-4 py-3">${f.tercero}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p>
        Los ganadores deberán contar con una cuenta activa en la{" "}
        <strong>Cooperativa de Ahorro y Crédito OSCUS</strong> para recibir los
        premios económicos.
      </p>

      <p>
        En sorteos, los atletas deberán estar presentes en el momento de la
        entrega y haber cumplido con los requisitos de la carrera.
      </p>

      <p>
        Los reclamos deberán presentarse dentro de los{" "}
        <strong>10 minutos</strong> posteriores al anuncio oficial de
        resultados. Transcurrido este plazo, el cuadro oficial no sufrirá
        modificaciones y los premios serán entregados de manera definitiva.
      </p>

      <p>
        Para cada categoría deberá haber un mínimo de{" "}
        <strong>10 participantes</strong>.
      </p>

      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
        <p className="font-semibold mb-1">Reclamos y consultas sobre premios</p>
        <p className="text-black/75">
          Escríbenos por WhatsApp:{" "}
          <WhatsAppLink
            phoneE164={WHATSAPP_RECLAMOS}
            label="099 724 1804"
            message="Hola, tengo una consulta sobre premios y categorías de la 8K Ruta de las Mandarinas 2026."
          />
        </p>
      </div>
    </div>
  );
}

function AnexoOrdenanza() {
  return (
    <div className="space-y-6">
      <p>
        Reglamento de aplicación al artículo 6 de la ORDENANZA MUNICIPAL que
        establece los incentivos para la Carrera Atlética 8K Ruta de las
        Mandarinas de Patate.
      </p>

      <div>
        <p className="font-extrabold">Artículo 1.- Objeto.–</p>
        <p className="mt-2">
          La ordenanza que establece los incentivos para la Carrera Atlética 8K
          Ruta de las Mandarinas asigna recursos que se utilizarán para premiar
          a los ganadores, conforme lo determinado en el presente reglamento.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 2.- Categorías.–</p>
        <p className="mt-2">
          Se constituyen las siguientes categorías, en base a las cuales se
          realizará la distribución de los recursos fijados en la ordenanza que
          establece los incentivos para la Carrera Atlética 8K Ruta de las
          Mandarinas de Patate:
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-black/85">
          <div>ÉLITE PRO 8K — Damas y Varones (Menores de 40 años)</div>
          <div>MÁSTER — Damas y Varones (40 – 64 años)</div>
          <div>LEYENDA – TERCERA EDAD — Damas y Varones (65 años en adelante)</div>
          <div>ESPECIALES / CAPACIDADES DIFERENTES — Abierto</div>
        </div>
        <p className="mt-3 text-black/70">
          Los límites de edad para cada categoría se toman en cuenta a la fecha
          de realización de la competencia atlética 8K Ruta de las Mandarinas.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 3.- Distribución.–</p>
        <p className="mt-2">
          La entrega de los recursos fijados en la ordenanza que establece los
          incentivos para la Carrera Atlética 8K Ruta de las Mandarinas se
          realizará según el detalle descrito en el{" "}
          <strong>Artículo 13. Premios y Sorteos</strong> del presente
          reglamento.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 4.- Requisitos para el pago.–</p>
        <p className="mt-2">
          Los requisitos para proceder con los pagos serán los siguientes:
        </p>
        <ol className="mt-3 list-decimal pl-6 space-y-1 text-black/85">
          <li>
            Resolución de Concejo Municipal donde se da por conocido el informe
            técnico y económico.
          </li>
          <li>
            Oficio de solicitud de pago formulado por el Director de Cultura,
            Turismo, Deportes y Recreación, en el que se incluye el listado de
            beneficiarios.
          </li>
          <li>Copia de cédula de ciudadanía.</li>
          <li>Copia del certificado bancario o de la cuenta bancaria.</li>
          <li>
            En caso de que el ganador sea menor de edad, se deberá adjuntar copia
            de cédula del representante legal.
          </li>
        </ol>
      </div>

      <div>
        <p className="font-extrabold">Artículo 5.-</p>
        <p className="mt-2">
          Una vez efectuados los pagos, de existir valores no cobrados se
          procederá a liquidar la certificación presupuestaria con el propósito
          de liberar esos fondos para que sean utilizados por el GAD
          Municipalidad de Patate.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 6.-</p>
        <p className="mt-2">
          Encárguese de la administración de estos recursos a la Dirección de
          Cultura, Turismo, Deportes y Recreación.
        </p>
      </div>
    </div>
  );
}

/**
 * Link reutilizable a WhatsApp con mensaje prellenado (wa.me)
 * - phoneE164: SOLO números sin "+"
 * - label: texto visible
 */
function WhatsAppLink({
  phoneE164,
  label,
  message,
}: {
  phoneE164: string;
  label: string;
  message: string;
}) {
  const href = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-extrabold underline underline-offset-4 hover:opacity-80"
      aria-label={`Abrir WhatsApp al ${label}`}
    >
      {label}
    </a>
  );
}
