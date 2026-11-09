/**
 * =========================================================
 * DATOS — Catálogo de productos para los ítems de cotización
 * ---------------------------------------------------------
 * Para agregar imágenes de productos:
 *   1. Guarda los archivos en `public/catalogo/`.
 *   2. Referencialos en el campo `imagen` (ej. "/catalogo/piso-roble.png").
 * Mientras `imagen` esté vacía la UI muestra un placeholder.
 * =========================================================
 */

export interface ProductoCatalogo {
  /** Identificador único del producto */
  id: string;
  /** Tipo de ítem, ej. "Ascensor" */
  tipo: string;
  /** Nombre comercial del producto (se usa como descripción del ítem) */
  modelo: string;
  /** Precio por unidad SIN IVA (COP) */
  precioUnitario: number;
  /** Ruta de la imagen en /public (opcional) */
  imagen?: string;
  /** Detalle corto opcional, ej. "1000 kg · 13 personas" */
  especificaciones?: string;
}

/** Tipos de ítem disponibles en el catálogo. */
export const TIPOS_DE_ITEM = ["Ascensor", "Piso", "Montacargas"] as const;

export const PRODUCTOS: ProductoCatalogo[] = [
  // ── Ascensores ──────────────────────────────────────────────
  {
    id: "asc-1000",
    tipo: "Ascensor",
    modelo: "EQUIPO ASCENSOR 1000kg 18P",
    precioUnitario: 126050420,
    especificaciones: "1000 kg · 13 personas · 2,0 m/s · puertas centrales 900mm",
  },
  {
    id: "asc-panoramico",
    tipo: "Ascensor",
    modelo: "ASCENSOR PANORÁMICO 6P",
    precioUnitario: 158900000,
    especificaciones: "450 kg · 6 personas · 1,0 m/s · cabina en vidrio",
  },
  {
    id: "asc-hospitalario",
    tipo: "Ascensor",
    modelo: "ASCENSOR HOSPITALARIO 1600kg",
    precioUnitario: 187300000,
    especificaciones: "1600 kg · para camillas · puertas 1100mm",
  },
  // ── Pisos ───────────────────────────────────────────────────
  {
    id: "piso-roble",
    tipo: "Piso",
    modelo: "PVC WOOD ROBLE",
    precioUnitario: 89900,
    especificaciones: "Por m² · sistema click · 4mm",
  },
  {
    id: "piso-nogal",
    tipo: "Piso",
    modelo: "PVC WOOD NOGAL",
    precioUnitario: 94900,
    especificaciones: "Por m² · sistema click · 5mm",
  },
  {
    id: "piso-spc-gris",
    tipo: "Piso",
    modelo: "VINILO SPC GRIS",
    precioUnitario: 79900,
    especificaciones: "Por m² · rigid core · resistente al agua",
  },
  {
    id: "piso-porcelanato",
    tipo: "Piso",
    modelo: "PORCELANATO MADERA 20x120",
    precioUnitario: 59900,
    especificaciones: "Por m² · acabado mate · rectificado",
  },
  // ── Montacargas ─────────────────────────────────────────────
  {
    id: "mc-500",
    tipo: "Montacargas",
    modelo: "MONTACARGAS RESIDENCIAL 500kg",
    precioUnitario: 45000000,
    especificaciones: "500 kg · 4 paradas · hidráulico",
  },
  {
    id: "mc-1000",
    tipo: "Montacargas",
    modelo: "MONTACARGAS INDUSTRIAL 1000kg",
    precioUnitario: 85000000,
    especificaciones: "1000 kg · 6 paradas · eléctrico",
  },
];

/** Productos disponibles de un tipo (comparación insensible a mayúsculas). */
export function productosPorTipo(tipo: string): ProductoCatalogo[] {
  const normalizado = tipo.trim().toLowerCase();
  return PRODUCTOS.filter((p) => p.tipo.toLowerCase() === normalizado);
}