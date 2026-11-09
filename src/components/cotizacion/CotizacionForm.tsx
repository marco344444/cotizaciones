"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { Section } from "@/components/ui/Section";
import {
  calcularValorTotalItem,
  formatearMoneda,
} from "@/models/format";
import { IVA_DEFAULT } from "@/models/types";
import {
  TIPOS_DE_ITEM,
  productosPorTipo,
  type ProductoCatalogo,
} from "@/models/catalogo";

/**
 * =========================================================
 * VISTA — Formulario de creación de cotizaciones (cliente)
 * ---------------------------------------------------------
 * Envía los datos a POST /api/quotations (Controlador) y
 * redirige a la URL única generada para la nueva cotización.
 * =========================================================
 */

interface FilaEspecificacion {
  etiqueta: string;
  valor: string;
}
interface FilaCaracteristica {
  titulo: string;
  items: string;
}
interface FilaItem {
  /** Tipo de ítem del catálogo. "__otro__" = descripción libre. Solo UI, no se envía al API. */
  tipo: string;
  descripcion: string;
  cantidad: string;
  valorNeto: string;
  iva: string;
}
interface FilaPago {
  concepto: string;
  porcentaje: string;
}

interface FormState {
  numero: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  proyecto: string;
  cliente: string;
  municipio: string;
  validezOferta: string;
  introduccion: string;
  especificaciones: FilaEspecificacion[];
  caracteristicas: FilaCaracteristica[];
  condiciones: string;
  plazoEntrega: string;
  requerimientos: string;
  items: FilaItem[];
  formaPago: FilaPago[];
  firmaNombre: string;
  firmaCargo: string;
  firmaCelular: string;
  creadorNombre: string;
  creadorEmail: string;
}

/** Etiquetas fijas de la sección "Especificaciones de los equipos". */
const ETIQUETAS_ESPECIFICACIONES = [
  "MARCA",
  "MODELO",
  "PARADAS, PISOS, PUERTAS",
  "CAPACIDAD",
  "VELOCIDAD",
  "DIMENSIONES DEL DUCTO",
  "CONTROL",
  "CABINA",
  "PUERTAS",
] as const;

/** Valor del selector "Otro" = descripción libre, sin catálogo. */
const TIPO_LIBRE = "__otro__";

const estadoInicial: FormState = {
  numero: "",
  fecha: new Date().toISOString().slice(0, 10),
  titulo: "",
  descripcion: "",
  proyecto: "",
  cliente: "",
  municipio: "",
  validezOferta: "",
  introduccion: "",
  especificaciones: ETIQUETAS_ESPECIFICACIONES.map((etiqueta) => ({
    etiqueta,
    valor: "",
  })),
  caracteristicas: [{ titulo: "", items: "" }],
  condiciones: "",
  plazoEntrega: "",
  requerimientos: "",
  items: [
    { tipo: "", descripcion: "", cantidad: "1", valorNeto: "", iva: String(IVA_DEFAULT) },
  ],
  formaPago: [{ concepto: "", porcentaje: "100" }],
  firmaNombre: "",
  firmaCargo: "DIRECTORA COMERCIAL",
  firmaCelular: "",
  creadorNombre: "",
  creadorEmail: "",
};



/** Datos de ejemplo basados en la cotización VN 2642-B de VIA ELEVADORES. */
function crearEjemplo(): FormState {
  return {
    numero: "VN 2700-A",
    fecha: new Date().toISOString().slice(0, 10),
    titulo: "SUMINISTRO E INSTALACION",
    descripcion: "CUATRO (4) ASCENSORES DE PASAJEROS",
    proyecto: "LAURELES",
    cliente: "CONSTRUCTORA LOS PATIOS S.A.S.",
    municipio: "Los Patios - Norte de Santander",
    validezOferta: "Según variación del TRM. Antes de la firma del contrato.",
    introduccion:
      "Presentamos la oferta para suministro, instalación y puesta en funcionamiento de 4 ascensores eléctricos de pasajeros, marca KOYO ELEVATOR para el PROYECTO: LAURELES.\n\nEl elevador ofertado es 100% importado; su fabricación está regida por los altos estándares de calidad y electrónica de última tecnología, bajo normativa EN 81.",
    especificaciones: [
      { etiqueta: "MARCA", valor: "KOYO ELEVATOR - Totalmente importado" },
      { etiqueta: "MODELO", valor: "TWJ1000MRL" },
      { etiqueta: "PARADAS, PISOS, PUERTAS", valor: "DUPLEX 18 pisos / 18 paradas / 18 puertas" },
      { etiqueta: "CAPACIDAD", valor: "1000 kg. 13 personas" },
      { etiqueta: "VELOCIDAD", valor: "2,0 m/s" },
      { etiqueta: "DIMENSIONES DEL DUCTO", valor: "2150 mm ANCHO x 2000 mm FONDO" },
      { etiqueta: "CONTROL", valor: "VVVF Voltaje de frecuencia variable" },
      { etiqueta: "CABINA", valor: "1400 mm ANCHO x 1600 mm FONDO x 2400 mm ALTO" },
      { etiqueta: "PUERTAS", valor: "900 mm X 2100 mm" },
    ],
    caracteristicas: [
      {
        titulo: "CABINA INCLUYE",
        items:
          "Acero inoxidable satinado 304 (ANTIHUELLA)\nFondo en acero espejo\nTecho en Acero Inoxidable\nPasamanos en Acero Inoxidable\nPiso en PVC",
      },
      {
        titulo: "BOTONERAS DE CABINA",
        items:
          "En acero inoxidable y vidrio\nBotón de piso digital blanco monocromático\nBotón de alarma\nPulsadores con Braille",
      },
    ],
    condiciones:
      "Después de la Instalación del equipo y el acta de liquidación del contrato, el elevador queda en garantía sobre defectos de fabricación y de funcionamiento, por treinta y seis (36) meses.\n\nNo cubre, ni por mal uso, mal trato, saboteo, incendio, inundación, descargas eléctricas o fluctuaciones y sobrecargas en el sistema de alimentación eléctrica.",
    plazoEntrega:
      "Entrega de los equipos y materiales en obra: 12 meses. Instalación y entrega en funcionamiento: 18 meses. Esto después de la firma del contrato y pago de la inicial.",
    requerimientos:
      "Proveer la estructura soporte para el ascensor\nRealizar apoyos en cada nivel de piso e intermedios, en los laterales\nRealizar acometida eléctrica trifásica ó 220v y 110v (independientes) al punto más alto\nProveer el foso bajo especificaciones del plano",
    items: [
      {
        tipo: "Ascensor",
        descripcion:
          "EQUIPO ASCENSOR PARA PERSONAS: 1000kg 18P/18P/18P PUERTAS 900mm CENTRALES",
        cantidad: "4",
        valorNeto: "126050420",
        iva: "19",
      },
    ],
    formaPago: [
      { concepto: "AL INICIO DEL CONTRATO", porcentaje: "30" },
      { concepto: "PARA EL 1 DE DICIEMBRE (5 MESES DESPUES DE LA FIRMA DEL CONTRATO)", porcentaje: "30" },
      { concepto: "15 DIAS ANTES DE LLEGADA A PUERTO COLOMBIANO", porcentaje: "15" },
      { concepto: "CON LA DESCARGA EN OBRA DE LOS (4) EQUIPOS", porcentaje: "10" },
      { concepto: "CON ACTA DE ENTREGA Y RECIBIDO POR EL CLIENTE DE LOS DOS ULTIMOS EQUIPOS", porcentaje: "7.5" },
      { concepto: "CON ACTA DE ENTREGA Y RECIBIDO POR EL CLIENTE DE LOS DOS ULTIMOS EQUIPOS", porcentaje: "7.5" },
    ],
    firmaNombre: "ING. KAREN SANTANDER",
    firmaCargo: "DIRECTORA COMERCIAL",
    firmaCelular: "300 6305114",
    creadorNombre: "Karen Santander",
    creadorEmail: "via_elevadores@hotmail.com",
  };
}

/** Mini-tarjeta de producto del catálogo con selector de cantidad. */
function ProductoMiniTarjeta({
  producto,
  onSeleccionar,
}: {
  producto: ProductoCatalogo;
  onSeleccionar: (producto: ProductoCatalogo, cantidad: number) => void;
}) {
  const [cantidad, setCantidad] = useState("1");
  return (
    <div className="flex flex-col rounded-lg border border-ui-border bg-ui-card p-2.5">
      <div className="mb-2 flex h-24 items-center justify-center overflow-hidden rounded-md border border-ui-border bg-ui-card-2">
        {producto.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.modelo}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex flex-col items-center gap-1 text-ui-muted-2">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 opacity-50"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.5" />
              <path d="M21 15l-5-5-9 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-semibold uppercase">Sin imagen</span>
          </span>
        )}
      </div>
      <p className="text-xs font-bold leading-snug text-ui-text">{producto.modelo}</p>
      {producto.especificaciones && (
        <p className="mt-0.5 text-[11px] leading-snug text-ui-muted-2">
          {producto.especificaciones}
        </p>
      )}
      <p className="mt-1 text-xs font-semibold text-brand-green-300">
        {formatearMoneda(producto.precioUnitario)}{" "}
        <span className="font-normal text-ui-muted">c/u sin IVA</span>
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="h-9 w-16 text-center text-xs"
          title="Cantidad"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => onSeleccionar(producto, Number(cantidad) || 1)}
        >
          Usar
        </Button>
      </div>
    </div>
  );
}

export function CotizacionForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(estadoInicial);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  /** Índices de tarjetas de ítems que están expandidas. */
  const [tarjetasAbiertas, setTarjetasAbiertas] = useState<Set<number>>(
    () => new Set([0]),
  );

  const total = useMemo(
    () =>
      form.items.reduce(
        (suma, item) =>
          suma +
          calcularValorTotalItem({
            cantidad: Number(item.cantidad) || 0,
            valorNeto: Number(item.valorNeto) || 0,
            iva: Number(item.iva) || 0,
          }),
        0,
      ),
    [form.items],
  );

  const sumaPorcentajes = useMemo(
    () =>
      form.formaPago.reduce(
        (suma, pago) => suma + (Number(pago.porcentaje) || 0),
        0,
      ),
    [form.formaPago],
  );

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  /** Expande/colapsa la tarjeta del ítem en la posición dada. */
  function toggleTarjeta(i: number) {
    setTarjetasAbiertas((prev) => {
      const nueva = new Set(prev);
      if (nueva.has(i)) {
        nueva.delete(i);
      } else {
        nueva.add(i);
      }
      return nueva;
    });
  }

  /** Quita el ítem en la posición dada y corrige los índices abiertos. */
  function quitarItem(i: number) {
    const lista = [...form.items];
    lista.splice(i, 1);
    set(
      "items",
      lista.length
        ? lista
        : [
            {
              tipo: "",
              descripcion: "",
              cantidad: "1",
              valorNeto: "",
              iva: String(IVA_DEFAULT),
            },
          ],
    );
    setTarjetasAbiertas((prev) => {
      const nueva = new Set<number>();
      prev.forEach((j) => {
        if (j < i) nueva.add(j);
        else if (j > i) nueva.add(j - 1);
      });
      return nueva;
    });
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErrores({});

    const payload = {
      numero: form.numero,
      fecha: form.fecha,
      titulo: form.titulo,
      descripcion: form.descripcion,
      proyecto: form.proyecto,
      cliente: form.cliente,
      municipio: form.municipio,
      validezOferta: form.validezOferta,
      introduccion: form.introduccion
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      especificaciones: form.especificaciones.filter(
        (esp) => esp.etiqueta.trim() || esp.valor.trim(),
      ),
      caracteristicas: form.caracteristicas
        .filter((car) => car.titulo.trim())
        .map((car) => ({
          titulo: car.titulo,
          items: car.items.split("\n"),
        })),
      condiciones: form.condiciones
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      plazoEntrega: form.plazoEntrega,
      requerimientos: form.requerimientos
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      items: form.items
        .filter((item) => item.descripcion.trim())
        .map((item) => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          valorNeto: item.valorNeto,
          iva: item.iva,
        })),
      formaPago: form.formaPago.filter((pago) => pago.concepto.trim()),
      firmaNombre: form.firmaNombre,
      firmaCargo: form.firmaCargo,
      firmaCelular: form.firmaCelular,
      creadorNombre: form.creadorNombre,
      creadorEmail: form.creadorEmail,
    };

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrores(data.campos ?? { general: data.error ?? "Error al crear" });
        return;
      }
      router.push(`/c/${data.slug}`);
    } catch {
      setErrores({ general: "Error de conexión. Inténtalo de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      {errores.general && (
        <div className="rounded-xl border border-brand-500/30 bg-ui-redwash px-4 py-3 text-sm font-semibold text-brand-400">
          {errores.general}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-ui-text">Nueva cotización</h1>
          <p className="text-sm text-ui-muted-2">
            Completa la información y al guardar generaremos una URL única.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setForm(crearEjemplo());
            setErrores({});
          }}
        >
          ⚡ Cargar ejemplo (LAURELES)
        </Button>
      </div>


      <Section step={1} id="sec-datos" title="Datos generales" description="Información básica que aparece en el encabezado de la cotización.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Número de cotización" required error={errores.numero}>
            <Input
              value={form.numero}
              onChange={(e) => set("numero", e.target.value)}
              placeholder="Ej: VN 2642-B"
            />
          </Field>
          <Field label="Fecha" required>
            <Input
              type="date"
              value={form.fecha}
              onChange={(e) => set("fecha", e.target.value)}
            />
          </Field>
          <Field label="Título" required error={errores.titulo}>
            <Input
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ej: SUMINISTRO E INSTALACION"
            />
          </Field>
          <Field label="Descripción general">
            <Input
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="Ej: CUATRO (4) ASCENSORES DE PASAJEROS"
            />
          </Field>
          <Field label="Proyecto" required error={errores.proyecto}>
            <Input
              value={form.proyecto}
              onChange={(e) => set("proyecto", e.target.value)}
              placeholder="Ej: LAURELES"
            />
          </Field>
          <Field label="Cliente" required error={errores.cliente}>
            <Input
              value={form.cliente}
              onChange={(e) => set("cliente", e.target.value)}
              placeholder="Nombre del cliente"
            />
          </Field>
          <Field label="Municipio / Ubicación">
            <Input
              value={form.municipio}
              onChange={(e) => set("municipio", e.target.value)}
              placeholder="Ej: Los Patios - Norte de Santander"
            />
          </Field>
          <Field label="Validez de la oferta">
            <Input
              value={form.validezOferta}
              onChange={(e) => set("validezOferta", e.target.value)}
              placeholder="Ej: Según variación del TRM"
            />
          </Field>
        </div>
      </Section>

      <Section step={2} id="sec-carta" title="Carta de presentación" description="Párrafos introductorios. Separa los párrafos con una línea en blanco.">
        <Textarea
          rows={5}
          value={form.introduccion}
          onChange={(e) => set("introduccion", e.target.value)}
          placeholder={"Presentamos la oferta para suministro, instalación...\n\nSegundo párrafo..."}
        />
      </Section>

      <Section step={3} id="sec-especificaciones" title="Especificaciones de los equipos" description="Campos fijos de datos técnicos; completa el valor de cada uno.">
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
          {form.especificaciones.map((esp, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-ui-muted">
                {esp.etiqueta}
              </span>
              <Input
                value={esp.valor}
                onChange={(e) => {
                  const lista = [...form.especificaciones];
                  lista[i].valor = e.target.value;
                  set("especificaciones", lista);
                }}
                placeholder={`Valor de ${esp.etiqueta.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </Section>


      <Section step={4} id="sec-caracteristicas" title="Características" description="Secciones de características con viñetas. Escribe una viñeta por línea.">
        <div className="space-y-4">
          {form.caracteristicas.map((car, i) => (
            <div key={i} className="rounded-xl border border-ui-border bg-ui-card-2/60 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={car.titulo}
                  onChange={(e) => {
                    const lista = [...form.caracteristicas];
                    lista[i].titulo = e.target.value;
                    set("caracteristicas", lista);
                  }}
                  placeholder="Título (ej: CABINA INCLUYE)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const lista = [...form.caracteristicas];
                    lista.splice(i, 1);
                    set("caracteristicas", lista.length ? lista : [{ titulo: "", items: "" }]);
                  }}
                >
                  ✕ Eliminar
                </Button>
              </div>
              <Textarea
                rows={3}
                className="mt-2"
                value={car.items}
                onChange={(e) => {
                  const lista = [...form.caracteristicas];
                  lista[i].items = e.target.value;
                  set("caracteristicas", lista);
                }}
                placeholder={"Acero inoxidable satinado 304\nFondo en acero espejo\nPiso en PVC"}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => set("caracteristicas", [...form.caracteristicas, { titulo: "", items: "" }])}
        >
          + Agregar sección de características
        </Button>
      </Section>

      <Section step={5} id="sec-items" title="Items de la cotización" description="Bienes o servicios a cotizar. El total se calcula automáticamente con IVA del 19%.">
        <div className="space-y-3">
          {form.items.map((item, i) => {
            const abierta = tarjetasAbiertas.has(i);
            const subtotal = calcularValorTotalItem({
              cantidad: Number(item.cantidad) || 0,
              valorNeto: Number(item.valorNeto) || 0,
              iva: IVA_DEFAULT,
            });
            const mostrarCatalogo = item.tipo !== "" && item.tipo !== TIPO_LIBRE;
            return (
              <div key={i} className="rounded-xl border border-ui-border bg-ui-card-2/60">
                {/* Cabecera de la tarjeta (siempre visible) */}
                <div className="flex flex-wrap items-center gap-2 p-3">
                  <select
                    value={item.tipo}
                    onChange={(e) => {
                      const lista = [...form.items];
                      lista[i].tipo = e.target.value;
                      set("items", lista);
                    }}
                    className="h-10 rounded-lg border border-ui-border bg-ui-card px-3 text-sm font-semibold text-ui-text focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 md:w-52"
                    title="Tipo de ítem"
                  >
                    <option value="">Tipo de ítem…</option>
                    {TIPOS_DE_ITEM.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                    <option value={TIPO_LIBRE}>Otro (libre)</option>
                  </select>
                  <span className="min-w-0 flex-1 truncate text-sm text-ui-muted">
                    {item.descripcion
                      ? `${item.cantidad || 0} × ${formatearMoneda(Number(item.valorNeto) || 0)} · ${item.descripcion}`
                      : "Sin producto seleccionado"}
                  </span>
                  <span className="text-sm font-bold text-ui-text">
                    {formatearMoneda(subtotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => quitarItem(i)}
                    className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-brand-400 transition-colors hover:bg-ui-redwash"
                    title="Quitar ítem"
                  >
                    ✕ Quitar
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTarjeta(i)}
                    aria-expanded={abierta}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ui-border text-ui-muted transition-colors hover:bg-ui-card hover:text-ui-text"
                    title={abierta ? "Colapsar" : "Expandir"}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 transition-transform ${abierta ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Cuerpo expandido */}
                {abierta && (
                  <div className="space-y-3 border-t border-ui-border p-3">
                    {mostrarCatalogo && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ui-muted">
                          Productos disponibles — {item.tipo}
                        </p>
                        <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                          {productosPorTipo(item.tipo).map((p) => (
                            <ProductoMiniTarjeta
                              key={p.id}
                              producto={p}
                              onSeleccionar={(prod, cant) => {
                                const lista = [...form.items];
                                lista[i].descripcion = prod.modelo;
                                lista[i].valorNeto = String(prod.precioUnitario);
                                lista[i].cantidad = String(cant);
                                set("items", lista);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {item.tipo === "" && (
                      <p className="rounded-lg border border-dashed border-ui-border px-3 py-2 text-xs text-ui-muted-2">
                        Selecciona un tipo de ítem para ver el catálogo de productos, u
                        elige <span className="font-semibold">Otro (libre)</span> para
                        escribir la descripción manualmente.
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-[2fr_90px_150px_1fr]">
              <Input
                className="col-span-2 md:col-span-1"
                value={item.descripcion}
                onChange={(e) => {
                  const lista = [...form.items];
                  lista[i].descripcion = e.target.value;
                  set("items", lista);
                }}
                placeholder="Descripción"
              />
              <Input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => {
                  const lista = [...form.items];
                  lista[i].cantidad = e.target.value;
                  set("items", lista);
                }}
                placeholder="Cant."
                title="Cantidad"
              />
              <Input
                type="number"
                min="0"
                value={item.valorNeto}
                onChange={(e) => {
                  const lista = [...form.items];
                  lista[i].valorNeto = e.target.value;
                  set("items", lista);
                }}
                placeholder="Valor neto"
                title="Valor neto"
              />
                      <div className="flex items-center justify-between gap-2 rounded-lg bg-ui-greenwash/40 px-3 py-2">
                        <span className="text-xs font-bold text-brand-green-300">
                          IVA 19%
                        </span>
                        <span className="text-sm font-bold text-ui-text">
                          {formatearMoneda(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => {
            set("items", [
              ...form.items,
              {
                tipo: "",
                descripcion: "",
                cantidad: "1",
                valorNeto: "",
                iva: String(IVA_DEFAULT),
              },
            ]);
            setTarjetasAbiertas((prev) => new Set(prev).add(form.items.length));
          }}
        >
          + Agregar ítem
        </Button>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-ui-greenwash px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold uppercase text-brand-green-300">
            Total cotización
            <span className="rounded-full bg-brand-green-600/20 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal">
              IVA 19% incluido
            </span>
          </span>
          <span className="text-lg font-black text-brand-green-300">{formatearMoneda(total)}</span>
        </div>
        {errores.items && (
          <p className="mt-2 text-xs font-medium text-brand-400">{errores.items}</p>
        )}
      </Section>


      <Section step={6} id="sec-pago" title="Forma de pago" description="Plan de pagos por porcentajes del total (verifica que sumen 100%).">
        <div className="space-y-2">
          {form.formaPago.map((pago, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_auto]">
              <Input
                value={pago.concepto}
                onChange={(e) => {
                  const lista = [...form.formaPago];
                  lista[i].concepto = e.target.value;
                  set("formaPago", lista);
                }}
                placeholder="Concepto de la cuota"
              />
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={pago.porcentaje}
                  onChange={(e) => {
                    const lista = [...form.formaPago];
                    lista[i].porcentaje = e.target.value;
                    set("formaPago", lista);
                  }}
                  placeholder="%"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-muted">
                  %
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="hidden text-sm font-semibold text-ui-text sm:inline">
                  {formatearMoneda((Number(pago.porcentaje || 0) / 100) * total)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const lista = [...form.formaPago];
                    lista.splice(i, 1);
                    set("formaPago", lista.length ? lista : [{ concepto: "", porcentaje: "100" }]);
                  }}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => set("formaPago", [...form.formaPago, { concepto: "", porcentaje: "0" }])}
        >
          + Agregar cuota
        </Button>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <span className="text-ui-text">Suma:</span>
          <span
            className={
              sumaPorcentajes === 100
                ? "rounded-full bg-ui-greenwash px-2 py-0.5 text-brand-green-300"
                : "rounded-full bg-ui-redwash px-2 py-0.5 text-brand-400"
            }
          >
            {sumaPorcentajes}%
          </span>
          {sumaPorcentajes !== 100 && (
            <span className="text-xs text-ui-muted-2">
              Idealmente debe sumar 100%
            </span>
          )}
        </div>
      </Section>

      <Section step={7} id="sec-condiciones" title="Condiciones" description="Garantía, plazo de entrega y requerimientos del cliente.">
        <div className="space-y-4">
          <Field label="Condiciones y garantía" hint="Separa párrafos con una línea en blanco.">
            <Textarea
              rows={4}
              value={form.condiciones}
              onChange={(e) => set("condiciones", e.target.value)}
              placeholder="Condiciones de garantía del equipo..."
            />
          </Field>
          <Field label="Plazo de entrega">
            <Textarea
              rows={2}
              value={form.plazoEntrega}
              onChange={(e) => set("plazoEntrega", e.target.value)}
              placeholder="Ej: Entrega de equipos: Junio 2027. Instalación: Marzo 2028..."
            />
          </Field>
          <Field label="Requerimientos por parte del cliente" hint="Escribe un requerimiento por línea.">
            <Textarea
              rows={4}
              value={form.requerimientos}
              onChange={(e) => set("requerimientos", e.target.value)}
              placeholder={"Proveer la estructura soporte para el ascensor\nRealizar apoyos en cada nivel de piso"}
            />
          </Field>
        </div>
      </Section>


      <Section step={8} id="sec-firma" title="Firma y contacto del creador" description="Quién firma la cotización y a qué email llegará el aviso de sugerencias.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre del firmante" required error={errores.firmaNombre}>
            <Input
              value={form.firmaNombre}
              onChange={(e) => set("firmaNombre", e.target.value)}
              placeholder="Ej: ING. KAREN SANTANDER"
            />
          </Field>
          <Field label="Cargo del firmante">
            <Input
              value={form.firmaCargo}
              onChange={(e) => set("firmaCargo", e.target.value)}
              placeholder="Ej: DIRECTORA COMERCIAL"
            />
          </Field>
          <Field label="Celular del firmante">
            <Input
              value={form.firmaCelular}
              onChange={(e) => set("firmaCelular", e.target.value)}
              placeholder="300 6305114"
            />
          </Field>
          <Field label="Tu nombre (creador)">
            <Input
              value={form.creadorNombre}
              onChange={(e) => set("creadorNombre", e.target.value)}
              placeholder="Cómo te llamas"
            />
          </Field>
          <Field label="Tu email (para recibir sugerencias)" required error={errores.creadorEmail}>
            <Input
              type="email"
              value={form.creadorEmail}
              onChange={(e) => set("creadorEmail", e.target.value)}
              placeholder="tucorreo@empresa.com"
            />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-ui-border bg-ui-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ui-muted">
          Al guardar se generará una{" "}
          <span className="font-semibold text-brand-400">URL única</span> para
          ver, descargar o sugerir cambios.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/")}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={enviando}>
            Guardar y generar URL
          </Button>
        </div>
      </div>
    </form>
  );
}

