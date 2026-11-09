const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatoNumero = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 2,
});

export function formatearMoneda(valor: number): string {
  return formatoCOP.format(Number.isFinite(valor) ? valor : 0);
}

export function formatearNumero(valor: number): string {
  return formatoNumero.format(Number.isFinite(valor) ? valor : 0);
}

export function formatearFecha(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatearFechaCorta(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Calcula el valor con IVA de una línea (por unidad). */
export function calcularValorTotalItem(item: {
  cantidad: number;
  valorNeto: number;
  iva: number;
}): number {
  const neto = Number(item.valorNeto) || 0;
  const iva = Number(item.iva) || 0;
  const cantidad = Number(item.cantidad) || 0;
  return Math.round((neto + (neto * iva) / 100) * cantidad);
}
