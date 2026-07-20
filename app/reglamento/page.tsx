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
    // Sin tarjeta: el blanco va a sangre (de borde a borde) como en el home, y
    // solo el contenido queda centrado en max-w-7xl.
    <section
      id="reglamento"
      className="w-full bg-white px-4 py-12 sm:px-6 md:py-16 lg:px-8"
    >
      {/* Aquí vivía un <style> que redefinía .font-bebas solo para esta página.
          Dos definiciones de la misma clase, una global y otra local, es cómo se
          acaba con un reglamento que no se parece al resto del sitio. La buena
          está en app/globals.css. */}

      <div className="mx-auto w-full max-w-7xl text-black">
        {/* HEADER */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-black/60 uppercase sm:text-sm">
            Información oficial — lectura clara y accesible
          </p>

          <h2 className="font-bebas mt-4 text-[40px] leading-[1.02] tracking-[0.08em] uppercase sm:text-[54px] lg:text-[66px]">
            Reglamento Oficial
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-relaxed text-black/70 sm:text-[16px]">
            8K Ruta de las Mandarinas 2026 — Patate, Tungurahua · Ecuador
          </p>
        </div>

        {/* BODY */}
        {/* 15/16px y no 17/18: el texto va un escalón más grueso que antes en
            todo el sitio, y a 18px un reglamento entero se lee como un muro. */}
        <div className="mt-12 space-y-6 text-[15px] leading-[1.8] text-black/85 sm:text-[16px]">
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
                La carrera tendrá una distancia de <strong>8 kilómetros</strong>
                , con un recorrido escénico que conecta las principales calles y
                zonas rurales de Patate, rodeadas de cultivos de mandarinas.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                  <p className="mb-1 text-[13px] tracking-[0.18em] text-black/60 uppercase">
                    Salida
                  </p>
                  <p className="font-extrabold">Patate Gardens</p>
                  <p className="text-[14px] text-black/70">08h00</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                  <p className="mb-1 text-[13px] tracking-[0.18em] text-black/60 uppercase">
                    Llegada
                  </p>
                  <p className="font-extrabold">Estadio Municipal de Patate</p>
                  <p className="text-[14px] text-black/70">
                    Tarima, sonido y premiación
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 font-semibold">Recorrido oficial</p>
                <p>
                  Salida desde <strong>Patate Gardens</strong>. Se gira a la
                  izquierda a la calle Hilario Torres, luego a la izquierda por
                  la calle E. Dávila, siguen por la calle bajo la Escalinata de
                  la Fe, continúan por la calle García Moreno, giran a la
                  izquierda a la calle Vicente Rocafuerte, a la derecha a la
                  calle Naciones Unidas, giran a la izquierda y suben a la vía a
                  San Jorge hasta el sector de Quinta, circunvalan el sector de
                  Chalpi pasando por los viveros del sector, bajan a la calle
                  Eloy Alfaro tras el colegio Benjamín Araujo, bajan la calle
                  Manuel Zapater frente al colegio Benjamín Araujo, giran a la
                  calle Juan León Mera hasta la calle Vicente Rocafuerte, giran
                  a la izquierda hasta la calle Naciones Unidas y continúan por
                  la <strong>Av. Ambato</strong> para la recta final hasta el
                  ingreso al <strong>Estadio Municipal de Patate</strong>.
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="font-semibold">Cierre de vías y operativo</p>
                <ul className="list-disc space-y-1 pl-6 text-black/85">
                  <li>
                    Cierre de vías desde las{" "}
                    <strong>07h00 hasta las 10h00</strong>. La apertura será
                    progresiva conforme avance la competencia.
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
              <div className="grid gap-2 text-black/85 sm:grid-cols-2">
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
                <p className="mb-2 font-semibold">Costos de inscripción</p>
                <ul className="space-y-1 text-black/85">
                  <li>
                    <strong>${PRECIO_PREVENTA}</strong> — Élite Pro 8K ( hasta
                    39 años)
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
                <p className="mb-1 font-semibold">Por definir</p>
                <p className="text-black/80">
                  La fecha, el lugar y el horario de entrega del kit oficial del
                  corredor se anunciarán próximamente en esta página y en los
                  canales oficiales del evento.
                </p>
              </div>

              <p>Requisitos para el retiro:</p>
              <ul className="list-disc space-y-1 pl-6 text-black/85">
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
              .{" "}
              <strong>
                El no pasar por un punto de control será motivo de
                descalificación.
              </strong>
            </p>
          </ArticleCard>

          <ArticleCard id="art-10" title="Artículo 10. Vehículos Autorizados">
            <p>
              Solo los vehículos acreditados por la organización podrán circular
              durante la competencia. El tránsito será gestionado por la Policía
              Nacional y Agentes de Tránsito.
            </p>
          </ArticleCard>

          <ArticleCard id="art-11" title="Artículo 11. Seguridad">
            <p>
              Habrá asistencia, seguridad y personal ubicados estratégicamente a
              lo largo del recorrido y en la meta, garantizando el bienestar de
              todos los participantes durante la competencia, además de contar
              con un <strong>seguro de accidentes</strong>.
            </p>
          </ArticleCard>

          <ArticleCard id="art-12" title="Artículo 12. Descalificación">
            <div className="space-y-4">
              <p>Serán descalificados los atletas que:</p>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <ul className="list-disc space-y-1 pl-6 text-black/85">
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
                <strong>Sanción adicional:</strong> los corredores
                descalificados quedarán inhabilitados para participar en
                competencias de la organización por <strong>5 años</strong>.
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
                participar. Asimismo, exonera al Comité Organizador,
                auspiciantes y entidades colaboradoras de cualquier
                responsabilidad médica o legal derivada de su participación.
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
              de cancelar el evento en caso de fuerza mayor. En tal situación,
              no habrá obligación de reembolso; sin embargo, se establecerá una
              nueva fecha para la carrera.
            </p>
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
      className="scroll-mt-28 overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      <div className="border-b border-black/10 bg-black/[0.03] px-5 py-4 sm:px-7 sm:py-5">
        <h3 className="text-[16px] font-extrabold text-black/90 sm:text-[18px]">
          {title}
        </h3>
      </div>
      <div className="px-5 py-6 sm:px-7">{children}</div>
    </article>
  );
}

/**
 * Premios económicos por categoría. Es la única tabla de premios del reglamento:
 * los valores se escriben una vez y aquí. Duplicarlos ya salió caro — el precio
 * de inscripción llegó a decir tres cosas distintas en tres páginas.
 */
function PremiosTables() {
  const tabla = [
    {
      categoria: "Élite Pro 8K",
      primero: "120",
      segundo: "100",
      tercero: "80",
    },
    { categoria: "Máster", primero: "80", segundo: "60", tercero: "40" },
    { categoria: "Leyenda", primero: "80", segundo: "60", tercero: "40" },
    { categoria: "Discapacidad", primero: "80", segundo: "60", tercero: "40" },
  ];

  return (
    <div className="space-y-5">
      <p className="font-semibold">Premios económicos</p>

      <div className="overflow-hidden rounded-2xl border border-black/10">
        <div className="overflow-auto">
          <table className="w-full min-w-[560px] text-[15px] sm:text-[16px]">
            <thead>
              <tr className="text-left">
                {["CATEGORÍA", "1° LUGAR", "2° LUGAR", "3° LUGAR"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-black/10 bg-black/[0.03] px-4 py-3 font-extrabold text-black/70"
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
        <p className="mb-1 font-semibold">Reclamos y consultas sobre premios</p>
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
