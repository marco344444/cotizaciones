/**
 * =========================================================
 * PDF — Cargador de imágenes de la cotización
 * ---------------------------------------------------------
 * Lee las imágenes desde `public/cotizacion/` y las devuelve
 * como data-URI base64 para que @react-pdf pueda insertarlas
 * al renderizar en el servidor.
 * =========================================================
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CACHE = new Map<string, string>();

/** Base absoluta de `public/` usando el directorio de trabajo (raíz del proyecto). */
function publicDir(): string {
  return join(process.cwd(), "public", "cotizacion");
}

/** Devuelve una imagen como data-URI base64 (cacheada). */
export function imagenDataUri(nombre: string): string {
  const enc = CACHE.get(nombre);
  if (enc) return enc;

  const ruta = join(publicDir(), nombre);
  const buffer = readFileSync(ruta);
  const type = nombre.endsWith(".png") ? "image/png" : "image/jpeg";
  const uri = `data:${type};base64,${buffer.toString("base64")}`;
  CACHE.set(nombre, uri);
  return uri;
}

/** Imágenes disponibles (extraídas del PDF original de referencia). */
export const IMAGEN = {
  logo: () => imagenDataUri("page01_img1.png"), // logo VIA (cuadrado)
  portada: () => imagenDataUri("page01_img2.png"), // imagen hero de portada
  presentacion: () => imagenDataUri("page02_img3.png"), // foto ancha
  cabina: () => imagenDataUri("page04_img4.png"), // cabina (vertical)
  logo2: () => imagenDataUri("page04_img5.png"), // logo pequeño
  fosoSlim: () => imagenDataUri("page05_img6.png"), // vertical esbelta
  equipoSlim: () => imagenDataUri("page05_img7.png"), // vertical esbelta
  panorama: () => imagenDataUri("page06_img8.png"), // foto ancha grande
  equipo: () => imagenDataUri("page07_img9.png"), // equipo vertical
  banner: () => imagenDataUri("page09_img10.png"), // banner ancho
} as const;
