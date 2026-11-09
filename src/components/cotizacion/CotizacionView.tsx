import type { Cotizacion } from "@/models/types";
import { EMPRESA } from "@/lib/config/empresa";
import {
  calcularValorTotalItem,
  formatearFecha,
  formatearMoneda,
} from "@/models/format";

const EMPRESA_SEDES =
  process.env.NEXT_PUBLIC_SEDES ||
  "Villa del Rosario - Barrio Lomitas • Otras ciudades";

/**
 * =========================================================
 * VISTA — Documento de la cotización (HTML, estilo papel)
 * ---------------------------------------------------------
 * Replica el formato del PDF original de VIA ELEVADORES con
 * sus colores (rojo #C00000, verde #70AD47, gris #E7E6E6).
 * Es "print-friendly" para que al imprimir se vea como A4.
 * =========================================================
 */

export function CotizacionView({ cotizacion }: { cotizacion: Cotizacion }) {
  const { items, formaPago } = cotizacion;

  return (
    <div className="document-paper mx-auto w-full max-w-[210mm] bg-white text-brand-900 shadow-sm ring-1 ring-black/10">
      {/* ===== ENCABEZADO ===== */}
      <header className="border-b-4 border-brand-600 bg-white px-6 py-5 md:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-black tracking-tight text-brand-600">
              VIA{" "}
              <span className="text-brand-green-600">ELEVADORES</span> S.A.S.
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-brand-800">
              {EMPRESA.slogan}
            </p>
          </div>
          <div className="text-xs leading-5 text-brand-600">
            <p>{EMPRESA_SEDES}</p>
            <p>
              {EMPRESA.direccion} – Telf.: {EMPRESA.telefono}
            </p>
            <p>
              Cel: {EMPRESA.celular} – {EMPRESA.email}
            </p>
            <p className="font-semibold">{EMPRESA.ciudades}</p>
          </div>
        </div>
      </header>

      {/* ===== TÍTULO ===== */}
      <section className="border-b border-brand-100 px-6 py-6 text-center md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
          COTIZACIÓN {cotizacion.numero}
        </p>
        <h1 className="mt-2 text-2xl font-black uppercase leading-tight text-brand-800 md:text-3xl">
          {cotizacion.titulo}
        </h1>
        {cotizacion.descripcion && (
          <p className="mt-1 text-base font-bold text-brand-700">
            {cotizacion.descripcion}
          </p>
        )}
        <p className="mt-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold text-brand-600">
          Fecha: {formatearFecha(cotizacion.fecha)}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-brand-700">
          {cotizacion.proyecto && (
            <p>
              <span className="font-semibold">Proyecto:</span>{" "}
              {cotizacion.proyecto}
            </p>
          )}
          {cotizacion.cliente && (
            <p>
              <span className="font-semibold">Cliente:</span> {cotizacion.cliente}
            </p>
          )}
          {cotizacion.municipio && (
            <p>
              <span className="font-semibold">Municipio:</span>{" "}
              {cotizacion.municipio}
            </p>
          )}
        </div>
      </section>

      {/* ===== PRESENTACIÓN ===== */}
      {cotizacion.introduccion.length > 0 && (
        <section className="px-6 py-5 md:px-10">
          <SectionTitle>Carta de presentación</SectionTitle>
          <div className="space-y-3 text-sm leading-6 text-brand-800">
            {cotizacion.introduccion.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </section>
      )}

      {/* ===== ESPECIFICACIONES ===== */}
      {cotizacion.especificaciones.length > 0 && (
        <section className="px-6 py-5 md:px-10">
          <SectionTitle>Especificaciones de los equipos</SectionTitle>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {cotizacion.especificaciones.map((esp, i) => (
                <tr key={i} className={i % 2 ? "bg-brand-wash" : "bg-white"}>
                  <td className="w-2/5 border border-brand-200 px-3 py-2 font-bold text-brand-800">
                    {esp.etiqueta}
                  </td>
                  <td className="border border-brand-200 px-3 py-2 text-brand-900">
                    {esp.valor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ===== CARACTERÍSTICAS ===== */}
      {cotizacion.caracteristicas.length > 0 && (
        <section className="px-6 py-5 md:px-10">
          <SectionTitle>Características</SectionTitle>
          <div className="space-y-4">
            {cotizacion.caracteristicas.map((car, i) => (
              <div key={i}>
                {car.titulo && (
                  <p className="mb-1 text-sm font-bold uppercase text-brand-700">
                    {car.titulo}
                  </p>
                )}
                <ul className="list-none space-y-1 pl-1 text-sm text-brand-800">
                  {car.items.map((item, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CONDICIONES / GARANTÍA ===== */}
      {(cotizacion.condiciones.length > 0 || cotizacion.plazoEntrega) && (
        <section className="px-6 py-5 md:px-10">
          <SectionTitle>Condiciones y garantía</SectionTitle>
          {cotizacion.condiciones.length > 0 && (
            <div className="space-y-3 text-sm leading-6 text-brand-800">
              {cotizacion.condiciones.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
          )}
          {cotizacion.plazoEntrega && (
            <p className="mt-3 text-sm text-brand-800">
              <span className="font-bold text-brand-700">Plazo de entrega:</span>{" "}
              {cotizacion.plazoEntrega}
            </p>
          )}
        </section>
      )}

      {/* ===== REQUERIMIENTOS DEL CLIENTE ===== */}
      {cotizacion.requerimientos.length > 0 && (
        <section className="px-6 py-5 md:px-10">
          <SectionTitle>Requerimientos por parte del cliente</SectionTitle>
          <ul className="space-y-1 pl-1 text-sm text-brand-800">
            {cotizacion.requerimientos.map((req, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-brand-green-600">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== PRECIO / FORMA DE PAGO ===== */}
      <section className="px-6 py-5 md:px-10">
        <SectionTitle>Precio y forma de pago</SectionTitle>

        {formaPago.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-brand-600 text-white">
                <th className="border border-brand-600 px-3 py-2 text-left font-bold">
                  Concepto
                </th>
                <th className="border border-brand-600 px-3 py-2 text-right font-bold">
                  %
                </th>
                <th className="border border-brand-600 px-3 py-2 text-right font-bold">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {formaPago.map((pago, i) => (
                <tr key={i} className={i % 2 ? "bg-brand-wash" : "bg-white"}>
                  <td className="border border-brand-200 px-3 py-2 text-brand-900">
                    {pago.concepto}
                  </td>
                  <td className="border border-brand-200 px-3 py-2 text-right font-semibold text-brand-800">
                    {pago.porcentaje}%
                  </td>
                  <td className="border border-brand-200 px-3 py-2 text-right font-semibold text-brand-800">
                    {formatearMoneda((pago.porcentaje / 100) * cotizacion.total)}
                  </td>
                </tr>
              ))}
              <tr className="bg-brand-green-100">
                <td className="border border-brand-200 px-3 py-2 font-black uppercase text-brand-green-700">
                  Total
                </td>
                <td className="border border-brand-200 px-3 py-2 text-right font-black text-brand-green-700">
                  100%
                </td>
                <td className="border border-brand-200 px-3 py-2 text-right font-black text-brand-green-700">
                  {formatearMoneda(cotizacion.total)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Tabla resumen de ítems */}
        {items.length > 0 && (
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-brand-600 text-white">
                <th className="border border-brand-600 px-3 py-2 text-left font-bold">
                  Descripción
                </th>
                <th className="border border-brand-600 px-3 py-2 text-center font-bold">
                  Cant.
                </th>
                <th className="border border-brand-600 px-3 py-2 text-right font-bold">
                  Valor Neto
                </th>
                <th className="border border-brand-600 px-3 py-2 text-right font-bold">
                  IVA
                </th>
                <th className="border border-brand-600 px-3 py-2 text-right font-bold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const porUnidad =
                  Number(item.valorNeto) +
                  (Number(item.valorNeto) * Number(item.iva)) / 100;
                return (
                  <tr key={i} className={i % 2 ? "bg-brand-wash" : "bg-white"}>
                    <td className="border border-brand-200 px-3 py-2 text-brand-900">
                      {item.descripcion}
                    </td>
                    <td className="border border-brand-200 px-3 py-2 text-center text-brand-800">
                      {item.cantidad}
                    </td>
                    <td className="border border-brand-200 px-3 py-2 text-right text-brand-800">
                      {formatearMoneda(item.valorNeto)}
                    </td>
                    <td className="border border-brand-200 px-3 py-2 text-right text-brand-800">
                      {formatearMoneda(porUnidad - Number(item.valorNeto))}
                    </td>
                    <td className="border border-brand-200 px-3 py-2 text-right font-semibold text-brand-900">
                      {formatearMoneda(calcularValorTotalItem(item))}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-brand-green-100 font-black text-brand-green-700">
                <td className="border border-brand-200 px-3 py-2" colSpan={4}>
                  TOTAL COTIZACIÓN
                </td>
                <td className="border border-brand-200 px-3 py-2 text-right">
                  {formatearMoneda(cotizacion.total)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {cotizacion.validezOferta && (
          <p className="mt-3 text-xs italic text-brand-600">
            Validez de la oferta: {cotizacion.validezOferta}
          </p>
        )}
      </section>

      {/* ===== FIRMA (quien elabora y cliente) ===== */}
      <section className="px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400">
              Elaboró
            </p>
            <div className="mx-auto w-full max-w-[240px] border-t-2 border-brand-600 pt-3">
              <p className="text-sm font-black uppercase text-brand-800">
                {cotizacion.firmaNombre}
              </p>
              <p className="text-xs font-semibold uppercase text-brand-600">
                {cotizacion.firmaCargo}
              </p>
              {cotizacion.firmaCelular && (
                <p className="text-xs text-brand-600">
                  Cel. {cotizacion.firmaCelular}
                </p>
              )}
              <p className="text-xs font-semibold text-brand-800">
                {EMPRESA.nombre}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400">
              Cliente
            </p>
            <div className="mx-auto w-full max-w-[240px] border-t-2 border-brand-600 pt-3">
              <p className="text-sm font-black uppercase text-brand-800">
                {cotizacion.cliente}
              </p>
              {cotizacion.municipio && (
                <p className="text-xs font-semibold uppercase text-brand-600">
                  {cotizacion.municipio}
                </p>
              )}
              {cotizacion.proyecto && (
                <p className="text-xs font-semibold text-brand-800">
                  Proyecto: {cotizacion.proyecto}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PIE ===== */}
      <footer className="border-t-4 border-brand-600 bg-brand-wash px-6 py-4 text-xs leading-5 text-brand-700 md:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-brand-800">{EMPRESA.nombre}</p>
            <p>
              {EMPRESA.direccion} – Telf.: {EMPRESA.telefono} · Cel:{" "}
              {EMPRESA.celular}
            </p>
            <p>{EMPRESA.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-semibold">{EMPRESA_SEDES}</p>
            <p>{EMPRESA.ciudades}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-l-4 border-brand-600 pl-3 text-base font-black uppercase tracking-wide text-brand-800">
      {children}
    </h2>
  );
}

