/**
 * Datos por defecto de la empresa emisora de cotizaciones.
 * Edita estos valores para cambiar el encabezado/pie de las cotizaciones.
 */
export interface EmpresaConfig {
  nombre: string;
  slogan: string;
  direccion: string;
  telefono: string;
  celular: string;
  email: string;
  ciudades: string;
  ciudadOrigen: string;
}

export const EMPRESA: EmpresaConfig = {
  nombre: "VIA ELEVADORES S.A.S.",
  slogan: "Suministro e instalación de ascensores",
  direccion: "Calle 9 No 5-27",
  telefono: "607-5735466",
  celular: "300 6305114",
  email: "via_elevadores@hotmail.com",
  ciudades: "Barranquilla - Bucaramanga - Bogotá - Ibagué - Medellín",
  ciudadOrigen: "Villa del Rosario - Barrio Lomitas",
};

export const EMPRESA_SEDES = "Villa del Rosario - Barrio Lomitas • Otras ciudades";
