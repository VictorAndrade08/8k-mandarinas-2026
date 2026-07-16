import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind resolviendo los conflictos por el último que gana.
 *
 * Sin esto, `"px-4" + " px-8"` deja las dos en el atributo y quien manda es la
 * que Tailwind pusiera antes en la hoja, no la que escribiste después — de ahí
 * los "no me hace caso el padding" que no se explican mirando el JSX.
 *
 * Úsalo siempre que unas clases fijas con condicionales:
 *
 *   className={cn("rounded-full px-4", activo && "px-8 bg-[#FF6B1A]")}
 *
 * Lo que NO arregla: construir el nombre de la clase con una plantilla
 * (`h-${alto}`). Eso es invisible para el compilador, que lee el código como
 * texto y nunca llega a ejecutar tu interpolación. Escribe la clase entera en
 * cada rama.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
