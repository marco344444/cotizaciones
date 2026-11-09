import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { CotizacionPdf } from "@/components/cotizacion/CotizacionPdf";
import { obtenerPorSlug } from "@/controllers/cotizacionesController";

export const runtime = "nodejs";

/**
 * GET /api/quotations/[slug]/pdf
 * Genera el PDF de la cotización en el servidor y lo devuelve
 * como descarga (attachment).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cotizacion = await obtenerPorSlug(slug);

  if (!cotizacion) {
    return NextResponse.json(
      { error: "Cotización no encontrada" },
      { status: 404 },
    );
  }

  try {
    const buffer = await renderToBuffer(
      <CotizacionPdf cotizacion={cotizacion} />,
    );
    const nombreArchivo = `Cotizacion-${cotizacion.numero.replace(/\s+/g, "-")}-${slug}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      },
    });
  } catch (error) {
    console.error("Error generando PDF:", error);
    return NextResponse.json(
      { error: "Error generando el PDF" },
      { status: 500 },
    );
  }
}