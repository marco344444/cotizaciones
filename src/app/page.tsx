import Link from "next/link";
import { listar } from "@/controllers/cotizacionesController";
import { formatearFechaCorta, formatearMoneda } from "@/models/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cotizaciones = await listar();

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6">
      {/* Barra de trabajo */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ui-text">Cotizaciones</h1>
          <p className="text-sm text-ui-muted-2">
            Consulta las existentes o crea una nueva.
          </p>
        </div>
        <Link
          href="/new"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          + Nueva cotización
        </Link>
      </div>

      {/* Lista de cotizaciones */}
      {cotizaciones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ui-border px-6 py-14 text-center">
          <p className="text-base font-semibold text-ui-text">
            Aún no hay cotizaciones
          </p>
          <p className="mt-1 text-sm text-ui-muted-2">
            Crea la primera con el botón{" "}
            <span className="font-semibold">+ Nueva cotización</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cotizaciones.map((c) => (
            <div
                key={c.slug}
                className="flex flex-col gap-3 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-400">
                      Cotización {c.numero}
                    </p>
                    <h3 className="text-base font-black text-ui-text">{c.proyecto}</h3>
                  </div>
                  {c.sugerenciasPendientes && (
                    <span
                      title="Hay sugerencias sin revisar"
                      className="rounded-full bg-ui-greenwash px-2.5 py-1 text-xs font-bold text-brand-green-300"
                    >
                      🔔 Sugerencias
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ui-muted">
                  <span>Cliente: {c.cliente}</span>
                  <span>{formatearFechaCorta(c.fecha)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-ui-border pt-3">
                  <span className="text-lg font-black text-brand-400">
                    {formatearMoneda(c.total)}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/q/${c.slug}`}
                      className="text-sm font-bold text-brand-400 hover:text-brand-300"
                    >
                      Ver →
                    </Link>
                    <a
                      href={`/api/quotations/${c.slug}/pdf`}
                      className="text-sm font-bold text-brand-400 hover:text-brand-300"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

