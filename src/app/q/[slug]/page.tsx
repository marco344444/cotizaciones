import { notFound } from "next/navigation";
import { obtenerPorSlug } from "@/controllers/cotizacionesController";
import { CotizacionView } from "@/components/cotizacion/CotizacionView";
import { CotizacionActions } from "@/components/cotizacion/CotizacionActions";
import { formatearFechaCorta } from "@/models/format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CotizacionPage({ params }: Props) {
  const { slug } = await params;
  const cotizacion = await obtenerPorSlug(slug);

  if (!cotizacion) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6">
      {/* Info de la URL única */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-ui-muted">
            Cotización {cotizacion.numero} · {cotizacion.proyecto} ·{" "}
            {formatearFechaCorta(cotizacion.fecha)}
          </p>
          <p className="mt-1 truncate text-sm text-ui-muted-2">
            URL única: <span className="font-semibold text-brand-400">/c/{cotizacion.slug}</span>
          </p>
        </div>
        {cotizacion.sugerenciasPendientes && (
          <span className="shrink-0 rounded-full bg-ui-greenwash px-3 py-1 text-xs font-bold text-brand-green-300">
            🔔 Hay sugerencias pendientes de revisar
          </span>
        )}
      </div>

      {/* Acciones */}
      <div className="print:hidden">
        <CotizacionActions
          slug={cotizacion.slug}
          numero={cotizacion.numero}
          sugerenciasPendientes={cotizacion.sugerenciasPendientes}
          totalSugerencias={cotizacion.sugerencias.length}
        />
      </div>

      {/* Documento */}
      <div className="print:my-0 print:shadow-none">
        <CotizacionView cotizacion={cotizacion} />
      </div>

      {/* Sugerencias recibidas */}
      {cotizacion.sugerencias.length > 0 && (
        <section className="print:hidden mt-8">
          <h2 className="mb-3 text-lg font-black text-ui-text">
            Sugerencias recibidas ({cotizacion.sugerencias.length})
          </h2>
          <div className="space-y-3">
            {cotizacion.sugerencias.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-ui-text">
                    {s.nombre}
                    <span className="ml-2 font-medium text-ui-muted">{s.email}</span>
                  </p>
                  <span className="text-xs text-ui-muted-2">
                    {formatearFechaCorta(s.fecha)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ui-muted">{s.mensaje}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ui-muted-2">
            Nota: estas sugerencias se notifican al creador (
            {cotizacion.creadorEmail || "sin email registrado"}) cuando se incorpora el
            envío de correos.
          </p>
        </section>
      )}
    </div>
  );
}
