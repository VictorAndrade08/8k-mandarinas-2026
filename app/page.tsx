// TODO importado de forma NORMAL, no con next/dynamic. El home se sirve sin
// JavaScript (scripts/sin-js-home.mjs): con dynamic(), las secciones quedaban
// congeladas en sus placeholders para siempre porque el intercambio
// loader→contenido lo hacía el runtime del cliente, y la portada móvil se veía
// vacía de la franja de datos para abajo. Con imports directos, el HTML
// completo de cada sección sale del build. El "cargar después" que hacía
// dynamic() lo cubre la clase .seccion-diferida (content-visibility, CSS puro).
import HeroCountdown from "./components/HeroCountdown";
import FranjaDatos from "./components/FranjaDatos";
import MapaRuta from "./components/MapaRuta";
import Hero from "./components/Hero";
import FloatingCTA from "./components/FloatingCTA";
import TopGallery from "./components/TopGallery";
import SponsorsStrip from "./components/SponsorsStrip";
import Publicidad from "./components/Publicidad";
import AyudaWhatsApp from "./components/AyudaWhatsApp";
import ComoInscribirse from "./components/ComoInscribirse";
import InfoBeforeRace from "./components/InfoBeforeRace";
import FeaturedStories from "./components/FeaturedStories";
import ReglamentoSection from "./components/ReglamentoSection";
import FaqHome from "./components/FaqHome";
import CategoriasHome from "./components/CategoriasHome";
import PopupFlyer from "./components/PopupFlyer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-clip">
      {/* La ilustración del hero es el LCP en MÓVIL (ocupa toda la pantalla).
          El preload va SOLO en el home (no en el layout, que castigaría a las
          páginas interiores con 160 KB inútiles) y con media limitado a móvil
          (en escritorio va el vídeo). React 19 sube este <link> al <head>. */}
      <link
        rel="preload"
        as="image"
        href="/hero-movil-real.webp"
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      {/* La cuenta atrás va primero: es lo que trae a la gente y lo que la hace
          inscribirse. */}
      <HeroCountdown />

      {/* Franja de datos LUGAR/FECHA/SALIDA con la línea gráfica del flyer
          (degradado cálido + chips violeta/navy + montañas angulares). Es lo
          primero que se ve al bajar del hero: dónde, cuándo y de dónde se sale,
          en el lenguaje del arte oficial. */}
      <div className="seccion-diferida">
        <FranjaDatos />
      </div>

      {/* El flyer oficial. Se quitó en la pasada de simplicidad por repetir la
          fecha y el precio, y se repuso a petición: es el arte de la campaña y
          se quiere ver en el sitio. El texto de la imagen no lo lee Google —
          los datos que importan siguen también en HTML por todo el home. */}
      {/* Todo lo que sigue va en .seccion-diferida (content-visibility): bajo
          el pliegue no se maqueta ni se pinta hasta que el scroll se acerca —
          el primer cuadro del móvil solo paga el hero (docs/100-MOVIL.md). */}
      <div className="seccion-diferida">
        <Publicidad />
      </div>

      {/* EL ORDEN CUENTA UNA HISTORIA. El flyer de arriba anuncia
          "inscripciones abiertas": lo siguiente tiene que ser CÓMO, no el
          vídeo ni la galería. Antes los pasos estaban en la posición 7 de 11 —
          quien bajaba buscando inscribirse cruzaba media página de ambiente
          antes de encontrar el camino. Ahora: anuncio → cómo → la ruta → y ya
          después las pruebas (vídeo, fotos, edición anterior). */}
      {/* Los cuatro pasos ANTES de las dos opciones de inscripción: quien duda
          de inscribirse por internet duda porque no sabe qué le van a pedir.
          Contestar eso primero es lo que hace que llegue al formulario. */}
      <div className="seccion-diferida">
        <ComoInscribirse />
      </div>

      {/* Categorías con precio EN el home, justo después de los pasos: la
          pregunta "¿cuánto pago yo?" se contesta sin abrir el reglamento
          (notas de conversión). Misma fuente de datos que /informacion. */}
      <div className="seccion-diferida">
        <CategoriasHome />
      </div>

      {/* Antes aquí había otra sección entera de dos tarjetas: "Inscríbete
          online" (los mismos pasos y el mismo botón que la sección de arriba,
          otra vez) y "Hazlo por WhatsApp". Solo el WhatsApp aportaba algo
          propio, y cabe en una franja. */}
      <div className="seccion-diferida">
        <AyudaWhatsApp />
      </div>
      {/* El mapa arriba del todo: es lo que más se pregunta y hasta ahora no
          estaba en ningún sitio. */}
      <div className="seccion-diferida">
        <MapaRuta />
      </div>
      <div className="seccion-diferida">
        <Hero />
      </div>

      <div className="seccion-diferida">
        <TopGallery />
      </div>
      <div className="seccion-diferida">
        <SponsorsStrip />
      </div>

      <section id="info" className="seccion-diferida">
        <InfoBeforeRace />
      </section>

      {/* Los premios NO se enseñan aquí: viven en el artículo 13 del reglamento
          y ahí se quedan. Se probó ponerlos en el inicio y se quitó a petición.
          Los valores siguen en app/lib/carrera.ts, que es de donde los lee el
          reglamento. */}

      {/* Aquí iba <ExperienceSection />: repetía las mismas tres cosas que
          InfoBeforeRace —la ruta, las categorías y el kit— y sus cuatro botones
          solo hacían alert("¡Próximamente disponible!"). Dos rejillas de
          cuatro tarjetas iguales seguidas, y la segunda sin llevar a ningún
          sitio. Está en el historial de git si hace falta recuperarla. */}
      <div className="seccion-diferida">
        <FeaturedStories />
      </div>

      <section id="reglamento" className="seccion-diferida">
        <ReglamentoSection />
      </section>

      {/* Las 5 preguntas que más llegan por WhatsApp + la CTA de cierre: la
          página termina invitando a inscribirse, no en un footer vacío. */}
      <section id="preguntas" className="seccion-diferida">
        <FaqHome />
      </section>

      <FloatingCTA />
      <PopupFlyer />
    </main>
  );
}
