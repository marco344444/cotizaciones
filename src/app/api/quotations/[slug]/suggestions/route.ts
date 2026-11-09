import { NextResponse } from "next/server";

/**
 * POST /api/quotations/[slug]/suggestions
 * Guarda una sugerencia de cambio y marca la cotización como
 * "pendiente de revisión" para que el creador sea notificado.
 */
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { agregarSugerencia } = await import(
      "@/controllers/cotizacionesController"
    );
    const datos = (await request.json()) as {
      nombre?: string;
      email?: string;
      mensaje?: string;
    };

    await agregarSugerencia(slug, {
      nombre: datos.nombre ?? "",
      email: datos.email ?? "",
      mensaje: datos.mensaje ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al guardar la sugerencia";
    const status = mensaje.includes("no encontrada") ? 404 : 400;
    return NextResponse.json({ error: mensaje }, { status });
  }
}