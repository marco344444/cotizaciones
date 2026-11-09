import { NextResponse } from "next/server";
import {
  ErrorValidacion,
  crearCotizacion,
  type DatosCreacionCotizacion,
} from "@/controllers/cotizacionesController";

export const runtime = "nodejs";

/**
 * POST /api/quotations
 * Crea una cotización nueva y devuelve su URL única (slug).
 */
export async function POST(request: Request) {
  try {
    const datos = (await request.json()) as DatosCreacionCotizacion;
    const cotizacion = await crearCotizacion(datos);
    return NextResponse.json({ slug: cotizacion.slug }, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorValidacion) {
      return NextResponse.json(
        { error: "Revisa los campos marcados", campos: error.campos },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo guardar la cotización" },
      { status: 500 },
    );
  }
}
