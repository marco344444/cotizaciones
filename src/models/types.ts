/**
 * =========================================================
 * MODELO — Tipos de datos de la aplicación (capa Modelo MVC)
 * =========================================================
 */

export interface Especificacion {
  /** Etiqueta del dato, ej. "MARCA" */
  etiqueta: string;
  /** Valor del dato, ej. "KOYO ELEVATOR" */
  valor: string;
}

export interface Caracteristica {
  /** Título de la sección de características, ej. "CABINA" */
  titulo: string;
  /** Viñetas descriptivas */
  items: string[];
}

export interface ItemCotizacion {
  /** Descripción del bien/servicio */
  descripcion: string;
  /** Cantidad de unidades */
  cantidad: number;
  /** Valor neto por unidad (sin IVA) */
  valorNeto: number;
  /** Porcentaje de IVA aplicado (ej. 19) */
  iva: number;
}

export interface FormaPago {
  /** Descripción de la cuota, ej. "AL INICIO DEL CONTRATO" */
  concepto: string;
  /** Porcentaje del total que representa la cuota */
  porcentaje: number;
}

export interface Sugerencia {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

export interface Cotizacion {
  /** Identificador único usado en la URL pública */
  slug: string;
  /** Número de cotización, ej. "VN 2642-B" */
  numero: string;
  /** Fecha de emisión (ISO yyyy-mm-dd) */
  fecha: string;
  /** Título principal, ej. "SUMINISTRO E INSTALACION" */
  titulo: string;
  /** Subtítulo/descripción general, ej. "CUATRO (4) ASCENSORES DE PASAJEROS" */
  descripcion: string;
  /** Nombre del proyecto */
  proyecto: string;
  /** Cliente / destinatario */
  cliente: string;
  /** Municipio / ubicación del proyecto */
  municipio: string;
  /** Texto de validez de la oferta */
  validezOferta: string;
  /** Párrafos de la carta de presentación */
  introduccion: string[];
  /** Tabla de especificaciones técnicas */
  especificaciones: Especificacion[];
  /** Secciones de características con viñetas */
  caracteristicas: Caracteristica[];
  /** Párrafos de condiciones / garantía */
  condiciones: string[];
  /** Plazo de entrega */
  plazoEntrega: string;
  /** Lista de requerimientos del cliente */
  requerimientos: string[];
  /** Items económicos */
  items: ItemCotizacion[];
  /** Plan de pagos (concepto + porcentaje) */
  formaPago: FormaPago[];
  /** Total de la cotización (calculado) */
  total: number;
  /** Datos de la firma */
  firmaNombre: string;
  firmaCargo: string;
  firmaCelular: string;
  /** Quién creó la cotización (para notificaciones) */
  creadorNombre: string;
  creadorEmail: string;
  /** Fecha de creación (ISO timestamp) */
  createdAt: string;
  /** Sugerencias de cambios recibidas */
  sugerencias: Sugerencia[];
  /** true si hay sugerencias sin leer */
  sugerenciasPendientes: boolean;
}

export const IVA_DEFAULT = 19;
