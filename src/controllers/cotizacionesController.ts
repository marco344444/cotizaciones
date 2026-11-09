import type { Cotizacion, FormaPago } from "../models/types";
import { calcularValorTotalItem } from "../models/format";
import { generarId, generarSlug } from "../models/slug";
import {
  guardarCotizacion,
  listarCotizaciones,
  obtenerCotizacion,
} from "../models/cotizacionesStore";

/**
 * =========================================================
 * CONTROLADOR — Lógica de negocio de cotizaciones
 * ---------------------------------------------------------
 * Separa las reglas de negocio / validación de la infra de
 * datos (Modelo) y de la presentación (Vistas / rutas).
 * =========================================================
 */

export type DatosCreacionCotizacion = Omit<
  Cotizacion,
  "slug" | "total" | "createdAt" | "sugerencias" | "sugerenciasPendientes"
>;

export class ErrorValidacion extends Error {
  campos: Record<string, string>;
  constructor(campos: Record<string, string>) {
    super("Datos de cotización inválidos");
    this.campos = campos;
  }
}

function textoNoVacio(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

/** Calcula el total de una línea (por unidad) con IVA. */
export function calcularTotal(item: {
  cantidad: number;
  valorNeto: number;
  iva: number;
}): number {
  return calcularValorTotalItem(item);
}

export function calcularTotalCotizacion(
  items: { cantidad: number; valorNeto: number; iva: number }[],
): number {
  return items.reduce((suma, item) => suma + calcularTotal(item), 0);
}

/** Valida y normaliza los datos recibidos del formulario. */
export function validarDatos(datos: DatosCreacionCotizacion): Cotizacion {
  const errores: Record<string, string> = {};

  const numero = textoNoVacio(datos.numero);
  const titulo = textoNoVacio(datos.titulo);
  const proyecto = textoNoVacio(datos.proyecto);
  const cliente = textoNoVacio(datos.cliente);
  const firmaNombre = textoNoVacio(datos.firmaNombre);
  const creadorEmail = textoNoVacio(datos.creadorEmail);

  if (!numero) errores.numero = "El número de cotización es obligatorio";
  if (!titulo) errores.titulo = "El título es obligatorio";
  if (!proyecto) errores.proyecto = "El proyecto es obligatorio";
  if (!cliente) errores.cliente = "El cliente es obligatorio";
  if (!firmaNombre) errores.firmaNombre = "El nombre del firmante es obligatorio";

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creadorEmail);
  if (!creadorEmail) errores.creadorEmail = "Tu email es obligatorio (para recibir sugerencias)";
  else if (!emailValido) errores.creadorEmail = "Email inválido";

  const items = (datos.items || []).filter((i) => textoNoVacio(i.descripcion));
  if (items.length === 0) {
    errores.items = "Agrega al menos un ítem a la cotización";
  }

  const formaPagoNorm = (datos.formaPago || []).filter((f) =>
    textoNoVacio(f.concepto),
  );

  const total = calcularTotalCotizacion(items);

  if (Object.keys(errores).length > 0) {
    throw new ErrorValidacion(errores);
  }

  return {
    slug: generarSlug(),
    numero,
    fecha: textoNoVacio(datos.fecha) || new Date().toISOString().slice(0, 10),
    titulo,
    descripcion: textoNoVacio(datos.descripcion),
    proyecto,
    cliente,
    municipio: textoNoVacio(datos.municipio),
    validezOferta: textoNoVacio(datos.validezOferta),
    introduccion: normalizarParrafos(datos.introduccion),
    especificaciones: (datos.especificaciones || []).filter(
      (e) => textoNoVacio(e.etiqueta) && textoNoVacio(e.valor),
    ),
    caracteristicas: (datos.caracteristicas || [])
      .filter((c) => textoNoVacio(c.titulo))
      .map((c) => ({
        titulo: textoNoVacio(c.titulo),
        items: normalizarParrafos(c.items),
      })),
    condiciones: normalizarParrafos(datos.condiciones),
    plazoEntrega: textoNoVacio(datos.plazoEntrega),
    requerimientos: normalizarParrafos(datos.requerimientos),
    items: items.map((i) => ({
      descripcion: textoNoVacio(i.descripcion),
      cantidad: Number(i.cantidad) || 1,
      valorNeto: Number(i.valorNeto) || 0,
      iva: Number(i.iva) || 0,
    })),
    formaPago: formaPagoNorm.map((f: FormaPago) => ({
      concepto: textoNoVacio(f.concepto),
      porcentaje: Number(f.porcentaje) || 0,
    })),
    total,
    firmaNombre,
    firmaCargo: textoNoVacio(datos.firmaCargo) || "DIRECTORA COMERCIAL",
    firmaCelular: textoNoVacio(datos.firmaCelular),
    creadorNombre: textoNoVacio(datos.creadorNombre),
    creadorEmail,
    createdAt: new Date().toISOString(),
    sugerencias: [],
    sugerenciasPendientes: false,
  };
}

export async function crearCotizacion(
  datos: DatosCreacionCotizacion,
): Promise<Cotizacion> {
  const cotizacion = validarDatos(datos);
  for (let i = 0; i < 3; i++) {
    if (!(await obtenerCotizacion(cotizacion.slug))) {
      await guardarCotizacion(cotizacion);
      return cotizacion;
    }
    cotizacion.slug = generarSlug();
  }
  await guardarCotizacion(cotizacion);
  return cotizacion;
}

export async function obtenerPorSlug(
  slug: string,
): Promise<Cotizacion | null> {
  return obtenerCotizacion(slug);
}

export async function listar(): Promise<Cotizacion[]> {
  return listarCotizaciones();
}

export async function agregarSugerencia(
  slug: string,
  datos: { nombre: string; email: string; mensaje: string },
): Promise<Cotizacion> {
  const existente = await obtenerCotizacion(slug);
  if (!existente) throw new Error("Cotización no encontrada");

  const nombre = textoNoVacio(datos.nombre);
  const email = textoNoVacio(datos.email);
  const mensaje = textoNoVacio(datos.mensaje);

  if (!nombre || !email || !mensaje) {
    throw new Error("Completa nombre, email y mensaje");
  }

  const actualizada: Cotizacion = {
    ...existente,
    sugerenciasPendientes: true,
    sugerencias: [
      ...existente.sugerencias,
      {
        id: generarId(),
        nombre,
        email,
        mensaje,
        fecha: new Date().toISOString(),
        leida: false,
      },
    ],
  };
  await guardarCotizacion(actualizada);
  return actualizada;
}

export async function marcarSugerenciasLeidas(slug: string): Promise<Cotizacion> {
  const existente = await obtenerCotizacion(slug);
  if (!existente) throw new Error("Cotización no encontrada");

  const actualizada: Cotizacion = {
    ...existente,
    sugerenciasPendientes: false,
    sugerencias: existente.sugerencias.map((s) => ({ ...s, leida: true })),
  };
  await guardarCotizacion(actualizada);
  return actualizada;
}

function normalizarParrafos(lista: string[] | undefined): string[] {
  if (!Array.isArray(lista)) return [];
  return lista
    .map((li) => (typeof li === "string" ? li.trim() : ""))
    .filter((li) => li.length > 0);
}

