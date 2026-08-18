import { VIDEO_SRC, VIDEO_POSTER } from "../lib/carrera";

// Sección del video promocional. Componente de SERVIDOR: el home va sin
// JavaScript, así que el reproductor es el <video controls> nativo del
// navegador — el póster y el botón de play los pinta el propio elemento, y al
// tocar play suena, porque lo arranca el usuario. preload="none": los 8 MB
// solo bajan si alguien le da al play, no de entrada con datos móviles.
export default function Hero8K() {
  return (
    // Sin tarjeta: el fondo blanco va a sangre y el contenido (vídeo + texto)
    // queda centrado en max-w-7xl.
    <section
      className={`w-full bg-white px-4 py-12 font-sans sm:px-6 sm:py-16 lg:px-8`}
    >
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        {/* VIDEO */}
        <div className="relative z-10 order-1 flex items-center justify-center lg:order-none">
          <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-black shadow-lg sm:rounded-[28px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              controls
              loop
              playsInline
              preload="none"
              aria-label="Video promocional: el recorrido de la 8K por el valle de Patate"
            />
          </div>
        </div>

        {/* CONTENIDO / TEXTO */}
        <div className="relative z-10 order-2 flex flex-col justify-center text-center lg:order-none lg:text-left">
          {/* A 72px el titular partía en cuatro líneas y "Mandarinas" se comía el
              ancho de la columna. Con el peso nuevo del sitio, menos cuerpo se
              lee mejor y cabe en dos. */}
          <h2 className="mb-4 font-[family-name:var(--font-titular)] text-[30px] leading-[1] text-black sm:mb-5 sm:text-[38px] lg:text-[46px] xl:text-[54px]">
            <span className="block tracking-wide">
              8K Ruta de las Mandarinas
            </span>
            <span className="block text-[#f7771c]">de Patate</span>
          </h2>

          <p className="mx-auto mb-6 max-w-lg font-sans text-[13px] leading-relaxed font-medium text-gray-600 sm:text-sm md:text-base lg:mx-0">
            Corre celebrando el{" "}
            <span className="font-semibold text-black">
              Aniversario de la Ruta de las Mandarinas
            </span>
            . La carrera que une a la ciudad en sus calles más emblemáticas.
          </p>

          {/* Sin "Ver Reglamento": el reglamento aún no está aprobado por la
              organización y el enlace se retira hasta que lo esté. */}
          {/* Aquí había OTRO botón de "Inscribirse Ahora" — era la tercera
              llamada a inscribirse en tres pantallas. Esta sección existe para
              enseñar el vídeo de Patate; quien quiera inscribirse tiene el CTA
              del hero, el de "Cómo inscribirse" y el flotante. Un solo CTA
              primario por pantalla (docs/100-CONSEJOS.md, consejo 44). */}
        </div>
      </div>
    </section>
  );
}
