import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Cotizacion, Especificacion } from "@/models/types";
import { EMPRESA } from "@/lib/config/empresa";
import {
  calcularValorTotalItem,
  formatearFecha,
  formatearMoneda,
} from "@/models/format";
import { IMAGEN } from "@/lib/pdf/assetImages";

/**
 * Documento PDF de la cotizacion (@react-pdf).
 * Replica el formato original de VIA ELEVADORES en varias hojas:
 * portada, carta de presentacion con imagenes, especificaciones,
 * caracteristicas, condiciones/entrega/requerimientos, y precio
 * con forma de pago y firmas.
 */

const ROJO = "#C00000";
const ROJO_TEXTO = "#8A0000";
const VERDE = "#70AD47";
const VERDE_CLARO = "#E2EFDA";
const GRIS = "#E7E6E6";
const TINTA = "#1F1F1F";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 30,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TINTA,
  },
  pageSinMargen: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TINTA,
  },

  /* ---------- Encabezado comun ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: ROJO,
    paddingBottom: 10,
    marginBottom: 14,
  },
  headerLogo: { width: 46, height: 46 },
  headerMarca: { flexDirection: "row", alignItems: "center", gap: 8 },
  marca: { fontSize: 16, fontFamily: "Helvetica-Bold", color: ROJO },
  marcaVerde: { color: VERDE },
  slogan: { fontSize: 6.5, letterSpacing: 1, color: ROJO_TEXTO, marginTop: 1 },
  contacto: { fontSize: 6.5, lineHeight: 1.5, color: ROJO_TEXTO, textAlign: "right" },
  contactoFuerte: { fontFamily: "Helvetica-Bold" },

  /* ---------- Pie comun ---------- */
  pie: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    borderTopWidth: 3,
    borderTopColor: ROJO,
    backgroundColor: GRIS,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pieTexto: { fontSize: 6, lineHeight: 1.5, color: "#5A0000" },

  /* ---------- Portada ---------- */
  portada: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  portadaLogo: { width: 110, height: 110, marginBottom: 6 },
  portadaMarca: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: ROJO,
    marginBottom: 2,
  },
  portadaSlogan: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: ROJO_TEXTO,
    textAlign: "center",
    textTransform: "uppercase",
  },
  portadaBand: {
    marginTop: 30,
    backgroundColor: ROJO,
    alignSelf: "stretch",
    paddingVertical: 14,
    alignItems: "center",
  },
  portadaNumero: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    color: "white",
  },
  portadaTitulo: {
    marginTop: 24,
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: ROJO_TEXTO,
    textAlign: "center",
    textTransform: "uppercase",
  },
  portadaDescripcion: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#A00000",
    textAlign: "center",
  },
  portadaFecha: {
    marginTop: 14,
    fontSize: 10,
    color: ROJO_TEXTO,
    textAlign: "center",
    textTransform: "uppercase",
  },
  portadaDatos: {
    marginTop: 22,
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },
  portadaDatoFila: {
    flexDirection: "row",
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDDDDD",
    paddingBottom: 5,
  },
  portadaDatoLabel: { width: "30%", fontFamily: "Helvetica-Bold", color: ROJO_TEXTO },
  portadaDatoValor: { flex: 1, color: TINTA },
  portadaImagen: {
    marginTop: 26,
    width: 260,
    height: 330,
    alignSelf: "center",
  },

  /* ---------- Titulos de seccion ---------- */
  seccionTitulo: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: ROJO_TEXTO,
    textTransform: "uppercase",
    borderLeftWidth: 4,
    borderLeftColor: ROJO,
    paddingLeft: 7,
    marginBottom: 8,
    marginTop: 6,
  },
  parrafo: { fontSize: 8.5, lineHeight: 1.6, marginBottom: 5, textAlign: "justify" },
  cita: {
    marginTop: 10,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: VERDE,
    textAlign: "center",
  },

  /* ---------- Fila de imagenes ---------- */
  filaImagenes: { flexDirection: "row", gap: 8, marginTop: 10, marginBottom: 4 },
  imgAncha: { flex: 1, height: 130 },
  imgMedia: { width: "49%", height: 170 },
  imgVertical: { width: "48%", height: 190 },

  /* ---------- Listas ---------- */
  filaItem: { flexDirection: "row", marginBottom: 3, paddingLeft: 2 },
  bullet: { width: 10, fontFamily: "Helvetica-Bold", color: VERDE },
  itemTexto: { fontSize: 8.5, flex: 1, lineHeight: 1.4 },

  /* ---------- Tabla general ---------- */
  tabla: { marginTop: 4 },
  filaEncabezado: { flexDirection: "row", backgroundColor: ROJO },
  celdaEnc: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    color: "white",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  fila: { flexDirection: "row" },
  celda: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 8,
    borderColor: "#CCCCCC",
    borderWidth: 0.5,
    lineHeight: 1.3,
  },
  celdaResaltada: { backgroundColor: GRIS },
  totalFila: { flexDirection: "row", backgroundColor: VERDE_CLARO },
  totalCelda: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#4E7A36",
    borderColor: "#CCCCCC",
    borderWidth: 0.5,
  },

  /* ---------- Firma ---------- */
  firma: {
    marginTop: 34,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  firmaColumna: { width: "44%", alignItems: "center" },
  firmaEtiqueta: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    color: "#999999",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  firmaLinea: {
    borderTopWidth: 1.5,
    borderTopColor: ROJO,
    paddingTop: 6,
    width: "100%",
    alignItems: "center",
  },
  firmaNombre: { fontSize: 9, fontFamily: "Helvetica-Bold", color: ROJO_TEXTO },
  firmaCargo: { fontSize: 7.5, color: ROJO, marginTop: 2 },
  firmaEmpresa: { fontSize: 7.5, color: "#333", marginTop: 2 },
});


/* Encabezado que se repite en todas las paginas interiores. */
function Encabezado() {
  return (
    <View style={styles.header} fixed>
      <View style={styles.headerMarca}>
        <Image style={styles.headerLogo} src={IMAGEN.logo()} />
        <View>
          <Text style={styles.marca}>
            VIA <Text style={styles.marcaVerde}>ELEVADORES</Text> S.A.S.
          </Text>
          <Text style={styles.slogan}>{EMPRESA.slogan.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.contacto}>
        <Text>{EMPRESA.ciudades}</Text>
        <Text>
          {EMPRESA.direccion} - Telf.: {EMPRESA.telefono}
        </Text>
        <Text>
          Cel: {EMPRESA.celular} - {EMPRESA.email}
        </Text>
        <Text style={styles.contactoFuerte}>{EMPRESA.ciudadOrigen}</Text>
      </View>
    </View>
  );
}

function Pie() {
  return (
    <View style={styles.pie} fixed>
      <View>
        <Text style={[styles.pieTexto, { fontFamily: "Helvetica-Bold" }]}>
          {EMPRESA.nombre}
        </Text>
        <Text style={styles.pieTexto}>
          {EMPRESA.direccion} - Telf.: {EMPRESA.telefono} · Cel: {EMPRESA.celular}
        </Text>
        <Text style={styles.pieTexto}>{EMPRESA.email}</Text>
      </View>
      <View>
        <Text style={[styles.pieTexto, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>
          {EMPRESA_SEDES}
        </Text>
        <Text style={[styles.pieTexto, { textAlign: "right" }]}>{EMPRESA.ciudades}</Text>
      </View>
    </View>
  );
}

function Seccion({ titulo }: { titulo: string }) {
  return <Text style={styles.seccionTitulo}>{titulo}</Text>;
}

export function CotizacionPdf({ cotizacion }: { cotizacion: Cotizacion }) {
  const { items, formaPago } = cotizacion;

  return (
    <Document
      title={`Cotizacion ${cotizacion.numero} - ${cotizacion.proyecto}`}
      author={EMPRESA.nombre}
    >


      {/* ============ PAGINA 1 - PORTADA ============ */}
      <Page size="A4" style={styles.pageSinMargen}>
        <View style={styles.portada}>
          <Image style={styles.portadaLogo} src={IMAGEN.logo()} />
          <Text style={styles.portadaMarca}>
            VIA <Text style={{ color: VERDE }}>ELEVADORES</Text> S.A.S.
          </Text>
          <Text style={styles.portadaSlogan}>{EMPRESA.slogan.toUpperCase()}</Text>

          <View style={styles.portadaBand}>
            <Text style={styles.portadaNumero}>COTIZACION {cotizacion.numero}</Text>
          </View>

          <Text style={styles.portadaTitulo}>{cotizacion.titulo}</Text>
          {cotizacion.descripcion && (
            <Text style={styles.portadaDescripcion}>{cotizacion.descripcion}</Text>
          )}
          <Text style={styles.portadaFecha}>
            {formatearFecha(cotizacion.fecha).toUpperCase()}
          </Text>

          <View style={styles.portadaDatos}>
            {cotizacion.proyecto && (
              <View style={styles.portadaDatoFila}>
                <Text style={styles.portadaDatoLabel}>PROYECTO</Text>
                <Text style={styles.portadaDatoValor}>{cotizacion.proyecto}</Text>
              </View>
            )}
            {cotizacion.cliente && (
              <View style={styles.portadaDatoFila}>
                <Text style={styles.portadaDatoLabel}>CLIENTE</Text>
                <Text style={styles.portadaDatoValor}>{cotizacion.cliente}</Text>
              </View>
            )}
            {cotizacion.municipio && (
              <View style={styles.portadaDatoFila}>
                <Text style={styles.portadaDatoLabel}>MUNICIPIO</Text>
                <Text style={styles.portadaDatoValor}>{cotizacion.municipio}</Text>
              </View>
            )}
          </View>

          <Image style={styles.portadaImagen} src={IMAGEN.portada()} />
        </View>
        <Pie />
      </Page>

      {/* ============ PAGINA 2 - CARTA DE PRESENTACION ============ */}
      <Page size="A4" style={styles.page}>
        <Encabezado />
        <Seccion titulo="Carta de presentacion" />
        {cotizacion.introduccion.map((parrafo, i) => (
          <Text key={i} style={styles.parrafo}>
            {parrafo}
          </Text>
        ))}
        <Text style={styles.cita}>
          “Excelente desempeño y primordial importancia a la seguridad de los pasajeros”
        </Text>

        <View style={styles.filaImagenes}>
          <Image style={styles.imgAncha} src={IMAGEN.presentacion()} />
        </View>
        <View style={styles.filaImagenes}>
          <Image style={styles.imgMedia} src={IMAGEN.panorama()} />
          <Image style={styles.imgMedia} src={IMAGEN.equipo()} />
        </View>
        <Pie />
      </Page>



      {/* ============ PAGINA 3 - ESPECIFICACIONES ============ */}
      <Page size="A4" style={styles.page}>
        <Encabezado />
        <Seccion titulo="Especificaciones de los equipos" />
        {cotizacion.descripcion && (
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Helvetica-Bold",
              color: ROJO_TEXTO,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Ascensores pasajeros · {cotizacion.descripcion}
          </Text>
        )}

        <View style={styles.tabla}>
          {cotizacion.especificaciones.map((esp, i) => (
            <FilaEspecificacion key={i} esp={esp} par={i % 2 === 1} />
          ))}
        </View>

        <View style={{ marginTop: 14 }}>
          <Image style={{ width: "100%", height: 150 }} src={IMAGEN.panorama()} />
        </View>
        <Pie />
      </Page>

      {/* ============ PAGINA 4 - CARACTERISTICAS ============ */}
      <Page size="A4" style={styles.page}>
        <Encabezado />
        {cotizacion.caracteristicas.length > 0 && (
          <View>
            <Seccion titulo="Caracteristicas de los equipos" />
            {cotizacion.caracteristicas.map((car, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 9.5,
                    fontFamily: "Helvetica-Bold",
                    color: ROJO_TEXTO,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {car.titulo}
                </Text>
                {car.items.map((it, j) => (
                  <View key={j} style={styles.filaItem}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.itemTexto}>{it}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.filaImagenes}>
          <Image style={styles.imgVertical} src={IMAGEN.cabina()} />
          <Image style={styles.imgVertical} src={IMAGEN.equipo()} />
        </View>
        <Pie />
      </Page>



      {/* ============ PAGINA 5 - CONDICIONES / ENTREGA / REQUERIMIENTOS ============ */}
      <Page size="A4" style={styles.page}>
        <Encabezado />
        {cotizacion.condiciones.length > 0 && (
          <View>
            <Seccion titulo="Condiciones de garantia" />
            {cotizacion.condiciones.map((c, i) => (
              <Text key={i} style={styles.parrafo}>
                {c}
              </Text>
            ))}
          </View>
        )}

        {cotizacion.plazoEntrega && (
          <View style={{ marginTop: 10 }}>
            <Seccion titulo="Plazo de entrega" />
            <Text style={styles.parrafo}>{cotizacion.plazoEntrega}</Text>
          </View>
        )}

        {cotizacion.requerimientos.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Seccion titulo="Requerimientos por parte del cliente" />
            {cotizacion.requerimientos.map((req, i) => (
              <View key={i} style={styles.filaItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.itemTexto}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.filaImagenes}>
          <Image style={styles.imgAncha} src={IMAGEN.panorama()} />
        </View>
        <Pie />
      </Page>



      {/* ============ PAGINA 6 - PRECIO / FORMA DE PAGO / FIRMA ============ */}
      <Page size="A4" style={styles.page}>
        <Encabezado />

        <Seccion titulo="Precio" />
        <Text style={styles.parrafo}>
          Este precio incluye el suministro y la instalacion de los equipos anteriormente
          descritos.
        </Text>

        {/* Tabla de items */}
        {items.length > 0 && (
          <View style={styles.tabla}>
            <View style={styles.filaEncabezado}>
              <Text style={[styles.celdaEnc, { width: "42%" }]}>Descripcion</Text>
              <Text style={[styles.celdaEnc, { width: "10%", textAlign: "center" }]}>Cant.</Text>
              <Text style={[styles.celdaEnc, { width: "16%", textAlign: "right" }]}>Valor Neto</Text>
              <Text style={[styles.celdaEnc, { width: "15%", textAlign: "right" }]}>IVA</Text>
              <Text style={[styles.celdaEnc, { width: "17%", textAlign: "right" }]}>Total</Text>
            </View>
            {items.map((item, i) => {
              const neto = Number(item.valorNeto) || 0;
              const iva = Number(item.iva) || 0;
              const porUnidad = neto + (neto * iva) / 100;
              const bg = i % 2 ? GRIS : "white";
              return (
                <View key={i} style={styles.fila}>
                  <Text style={[styles.celda, { width: "42%", backgroundColor: bg }]}>
                    {item.descripcion}
                  </Text>
                  <Text style={[styles.celda, { width: "10%", textAlign: "center", backgroundColor: bg }]}>
                    {item.cantidad}
                  </Text>
                  <Text style={[styles.celda, { width: "16%", textAlign: "right", backgroundColor: bg }]}>
                    {formatearMoneda(neto)}
                  </Text>
                  <Text style={[styles.celda, { width: "15%", textAlign: "right", backgroundColor: bg }]}>
                    {formatearMoneda(porUnidad - neto)}
                  </Text>
                  <Text
                    style={[
                      styles.celda,
                      { width: "17%", textAlign: "right", fontFamily: "Helvetica-Bold", backgroundColor: bg },
                    ]}
                  >
                    {formatearMoneda(calcularValorTotalItem(item))}
                  </Text>
                </View>
              );
            })}
            <View style={styles.totalFila}>
              <Text style={[styles.totalCelda, { width: "83%" }]}>TOTAL</Text>
              <Text style={[styles.totalCelda, { width: "17%", textAlign: "right" }]}>
                {formatearMoneda(cotizacion.total)}
              </Text>
            </View>
          </View>
        )}



        {/* Forma de pago */}
        {formaPago.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Seccion titulo="Forma de pago" />
            <Text style={[styles.parrafo, { fontStyle: "italic", fontSize: 8 }]}>
              El pago del equipo se realizara en base a las siguientes cuotas y periodos
              planteados:
            </Text>
            <View style={styles.tabla}>
              <View style={styles.filaEncabezado}>
                <Text style={[styles.celdaEnc, { width: "58%" }]}>Concepto</Text>
                <Text style={[styles.celdaEnc, { width: "20%", textAlign: "right" }]}>%</Text>
                <Text style={[styles.celdaEnc, { width: "22%", textAlign: "right" }]}>Valor</Text>
              </View>
              {formaPago.map((pago, i) => (
                <View key={i} style={styles.fila}>
                  <Text style={[styles.celda, { width: "58%", backgroundColor: i % 2 ? GRIS : "white" }]}>
                    {pago.concepto}
                  </Text>
                  <Text
                    style={[
                      styles.celda,
                      { width: "20%", textAlign: "right", fontFamily: "Helvetica-Bold", color: ROJO_TEXTO, backgroundColor: i % 2 ? GRIS : "white" },
                    ]}
                  >
                    {pago.porcentaje}%
                  </Text>
                  <Text
                    style={[
                      styles.celda,
                      { width: "22%", textAlign: "right", fontFamily: "Helvetica-Bold", color: ROJO_TEXTO, backgroundColor: i % 2 ? GRIS : "white" },
                    ]}
                  >
                    {formatearMoneda((pago.porcentaje / 100) * cotizacion.total)}
                  </Text>
                </View>
              ))}
              <View style={styles.totalFila}>
                <Text style={[styles.totalCelda, { width: "58%" }]}>TOTAL</Text>
                <Text style={[styles.totalCelda, { width: "20%", textAlign: "right" }]}>100%</Text>
                <Text style={[styles.totalCelda, { width: "22%", textAlign: "right" }]}>
                  {formatearMoneda(cotizacion.total)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {cotizacion.validezOferta && (
          <Text
            style={{
              marginTop: 12,
              fontSize: 7.5,
              fontStyle: "italic",
              color: ROJO,
              textAlign: "center",
            }}
          >
            Validez de la oferta: {cotizacion.validezOferta}
          </Text>
        )}

        {/* FIRMA (quien elabora y cliente) */}
        <View style={styles.firma}>
          <View style={styles.firmaColumna}>
            <Text style={styles.firmaEtiqueta}>Elaboro</Text>
            <View style={styles.firmaLinea}>
              <Text style={styles.firmaNombre}>{cotizacion.firmaNombre}</Text>
              <Text style={styles.firmaCargo}>{cotizacion.firmaCargo}</Text>
              {cotizacion.firmaCelular && (
                <Text style={styles.firmaCargo}>Cel. {cotizacion.firmaCelular}</Text>
              )}
              <Text style={styles.firmaEmpresa}>{EMPRESA.nombre}</Text>
            </View>
          </View>

          <View style={styles.firmaColumna}>
            <Text style={styles.firmaEtiqueta}>Cliente</Text>
            <View style={styles.firmaLinea}>
              <Text style={styles.firmaNombre}>{cotizacion.cliente}</Text>
              {cotizacion.municipio && (
                <Text style={styles.firmaCargo}>{cotizacion.municipio}</Text>
              )}
              <Text style={styles.firmaEmpresa}>
                {cotizacion.proyecto ? `Proyecto: ${cotizacion.proyecto}` : ""}
              </Text>
            </View>
          </View>
        </View>

        <Pie />
      </Page>
    </Document>
  );
}

/** Fila de la tabla de especificaciones (etiqueta roja a la izquierda, valor a la derecha). */
function FilaEspecificacion({ esp, par }: { esp: Especificacion; par: boolean }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={[
          styles.celda,
          {
            width: "34%",
            fontFamily: "Helvetica-Bold",
            color: "white",
            backgroundColor: ROJO,
          },
        ]}
      >
        {esp.etiqueta}
      </Text>
      <Text style={[styles.celda, { width: "66%", backgroundColor: par ? GRIS : "white" }]}>
        {esp.valor}
      </Text>
    </View>
  );
}

const EMPRESA_SEDES = "Villa del Rosario - Barrio Lomitas • Otras ciudades";

