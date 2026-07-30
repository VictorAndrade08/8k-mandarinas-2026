// Las montañas angulares del flyer (los Andes/Tungurahua estilizados), la firma
// visual de la marca, como componente reutilizable. Dos capas de chevrons:
// violeta detrás, navy delante, con los tokens --violeta y --navy. Sirve como
// pie de una banda de marca o como separador entre secciones.
// (docs/LINEA-GRAFICA-100.md, 33: el perfil angular como motivo reutilizable.)

export default function MontanasDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none block w-full ${className}`}
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
  );
}
