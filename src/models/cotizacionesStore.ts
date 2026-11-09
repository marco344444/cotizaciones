import { promises as fs } from "fs";
import path from "path";
import type { Cotizacion } from "./types";

/**
 * =========================================================
 * MODELO — Repositorio de cotizaciones (persistencia)
 * ---------------------------------------------------------
 * Almacena las cotizaciones en un archivo JSON dentro de
 * ./data. Se lee desde disco en cada operación para
 * garantizar consistencia entre procesos/bundles (Next.js
 * instancia el módulo por separado en páginas y rutas API,
 * por lo que una caché en memoria quedaría desactualizada).
 * Las escrituras se serializan para evitar corrupciones.
 * =========================================================
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cotizaciones.json");

let escrituraEnCurso: Promise<void> = Promise.resolve();

async function leerDesdeDisco(): Promise<Map<string, Cotizacion>> {
  const mapa = new Map<string, Cotizacion>();
  try {
    const contenido = await fs.readFile(DATA_FILE, "utf-8");
    const registros = JSON.parse(contenido) as Cotizacion[];
    for (const r of registros) mapa.set(r.slug, r);
  } catch {
    // No existe el archivo aún o está vacío: se empieza de cero.
  }
  return mapa;
}

async function escribir(mapa: Map<string, Cotizacion>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(
    tmp,
    JSON.stringify([...mapa.values()], null, 2),
    "utf-8",
  );
  await fs.rename(tmp, DATA_FILE);
}

/** Ejecuta la operación de escritura en cola para evitar concurrencia. */
async function encolarEscritura(operacion: () => Promise<void>): Promise<void> {
  escrituraEnCurso = escrituraEnCurso.then(operacion);
  await escrituraEnCurso;
}

export async function listarCotizaciones(): Promise<Cotizacion[]> {
  const mapa = await leerDesdeDisco();
  return [...mapa.values()].sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || ""),
  );
}

export async function obtenerCotizacion(
  slug: string,
): Promise<Cotizacion | null> {
  const mapa = await leerDesdeDisco();
  return mapa.get(slug) ?? null;
}

export async function guardarCotizacion(
  cotizacion: Cotizacion,
): Promise<void> {
  await encolarEscritura(async () => {
    const mapa = await leerDesdeDisco();
    mapa.set(cotizacion.slug, cotizacion);
    await escribir(mapa);
  });
}

export async function eliminarCotizacion(slug: string): Promise<boolean> {
  let eliminada = false;
  await encolarEscritura(async () => {
    const mapa = await leerDesdeDisco();
    eliminada = mapa.delete(slug);
    if (eliminada) await escribir(mapa);
  });
  return eliminada;
}


