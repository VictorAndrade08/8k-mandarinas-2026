"use client";

import React from "react";

export default function PoliticaPrivacidad8K() {
  return (
    <section
      id="politica-privacidad"
      className="w-full px-4 py-10 md:py-14 flex justify-center"
    >
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
            Información legal — protección de datos personales
          </p>

          <h1
            className="
              mt-4
              text-[40px] sm:text-[54px] lg:text-[66px]
              leading-[1.02]
              uppercase tracking-[0.08em]
              ${bebas.className}"
          >
            Política de Privacidad
          </h1>

          <p className="mt-3 text-black/70 max-w-3xl mx-auto text-[15px] sm:text-[16px] leading-relaxed">
            8K Ruta de las Mandarinas · Patate – Ecuador
          </p>
        </div>

        {/* BODY */}
        <div className="mt-12 space-y-6 text-[17px] sm:text-[18px] leading-[1.9] text-black/85">
          <ArticleCard title="Responsable del tratamiento de datos">
            <p>
              La carrera atlética <strong>8K Ruta de las Mandarinas</strong>,
              organizada por <strong>Vigop Eventos</strong>, con domicilio en
              Patate – Ecuador,
              actúa como <strong>RESPONSABLE del tratamiento de los datos
              personales</strong> del titular, obtenidos mediante consentimiento
              verbal, escrito o digital, conforme a la{" "}
              <strong>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong>.
            </p>
          </ArticleCard>

          <ArticleCard title="1. Finalidad del tratamiento de los datos personales">
            <div className="space-y-3">
              <p>
                Los datos personales serán tratados exclusivamente para fines
                relacionados con la organización, ejecución y difusión del
                evento deportivo.
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Registro e inscripción de atletas.</li>
                <li>Verificación de identidad y categorías.</li>
                <li>Gestión de pagos y comprobantes.</li>
                <li>Confirmaciones vía WhatsApp, correo o redes sociales.</li>
                <li>Entrega de kits, chips y dorsales.</li>
                <li>Publicación de resultados y clasificaciones.</li>
                <li>Atención médica, seguros y control logístico.</li>
                <li>Sorteos, premiaciones y actividades promocionales.</li>
                <li>Difusión de fotografías y material audiovisual del evento.</li>
              </ul>
            </div>
          </ArticleCard>

          <ArticleCard title="2. Tratamiento de categorías especiales de datos">
            <div className="space-y-3">
              <p>
                La organización no trata datos sensibles de manera general,
                salvo en los casos permitidos por la LOPDP:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Datos de salud, únicamente para atención médica del evento.</li>
                <li>Datos de discapacidad para validación de categorías especiales.</li>
                <li>Datos de menores de edad en categorías colegiales, con autorización del representante legal.</li>
                <li>Imágenes y videos captados durante el evento.</li>
              </ul>
            </div>
          </ArticleCard>

          <ArticleCard title="3. Transferencia de datos personales">
            <p>
              Los datos personales podrán ser compartidos únicamente cuando sea
              necesario con:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Empresas de cronometraje deportivo.</li>
              <li>Aseguradoras y servicios médicos.</li>
              <li>Entidades públicas (GAD Patate u otras autoridades).</li>
              <li>Proveedores tecnológicos y plataformas digitales.</li>
            </ul>
            <p className="mt-3">
              Todos los terceros deberán cumplir estándares adecuados de
              confidencialidad y seguridad.
            </p>
          </ArticleCard>

          <ArticleCard title="4. Consentimiento del titular">
            <p>
              El titular otorga su consentimiento de forma libre, voluntaria e
              inequívoca al inscribirse mediante formularios web, WhatsApp,
              redes sociales, correos electrónicos o registros autorizados.
            </p>
            <p className="mt-3">
              El consentimiento podrá ser revocado en cualquier momento,
              salvo cuando exista una obligación legal que lo impida.
            </p>
          </ArticleCard>

          <ArticleCard title="5. Derechos del titular">
            <p>El titular podrá ejercer los siguientes derechos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Acceso</li>
              <li>Rectificación y actualización</li>
              <li>Eliminación</li>
              <li>Oposición</li>
              <li>Suspensión</li>
              <li>Portabilidad</li>
            </ul>
            <p className="mt-3">
              Las solicitudes serán atendidas en un plazo máximo de{" "}
              <strong>15 días</strong>, conforme a la LOPDP.
            </p>
          </ArticleCard>

          <ArticleCard title="6. Tiempo de conservación de los datos">
            <p>
              Los datos personales serán conservados únicamente durante el
              tiempo necesario para cumplir con las finalidades del evento y
              hasta un máximo de <strong>3 años</strong> para fines legales,
              administrativos y de trazabilidad.
            </p>
          </ArticleCard>

          <ArticleCard title="7. Contacto">
            <p>
              Para ejercer sus derechos o realizar consultas relacionadas con
              el tratamiento de datos personales, el titular puede comunicarse
              a:
            </p>
            <p className="mt-3">
              📧 <strong>Correo:</strong> inscripciones@8krutadelasmandarinas.com<br />
              📱 <strong>WhatsApp oficial:</strong> +593 99 510 2378<br />
              📍 <strong>Ciudad:</strong> Patate – Ecuador
            </p>
          </ArticleCard>

          <ArticleCard title="8. Cambios a la política de privacidad">
            <p>
              La presente Política de Privacidad podrá ser actualizada en
              cualquier momento. Las modificaciones serán publicadas en los
              canales oficiales del evento.
            </p>
            <p className="mt-3 text-black/70">
              Última actualización: <strong>17 de diciembre de 2026</strong>
            </p>
          </ArticleCard>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-5 sm:px-7 py-4 bg-black/[0.03] border-b border-black/10">
        <h3 className="font-extrabold text-black/90">{title}</h3>
      </div>
      <div className="px-5 sm:px-7 py-6">{children}</div>
    </article>
  );
}
