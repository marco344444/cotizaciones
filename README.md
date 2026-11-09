# Sistema de Cotizaciones · VIA ELEVADORES

Aplicación web para crear, compartir y descargar cotizaciones profesionales mediante
enlaces únicos, con generación de PDF y recepción de sugerencias de cambios.
Desarrollada con **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS 4**.

El diseño replica la identidad de las cotizaciones de VIA ELEVADORES
(rojo `#C00000`, verde `#70AD47`) sobre un **tema oscuro** en la interfaz.

## Estructura (arquitectura MVC)

```
src/
├── models/                             # CAPA MODELO (datos y persistencia)
│   ├── types.ts                        # Tipos: Cotizacion, items, pagos, sugerencias
│   ├── cotizacionesStore.ts            # Repositorio en JSON (./data/cotizaciones.json)
│   ├── slug.ts                         # Generador de slugs únicos
│   ├── format.ts                       # Formato de moneda/fecha y cálculo de totales
│   └── catalogo.ts                     # Catálogo de productos (tipos de ítem + precios)
├── controllers/                        # CAPA CONTROLADOR (lógica de negocio)
│   └── cotizacionesController.ts       # Crear, validar, listar, sugerencias
├── components/                         # CAPA VISTA (React)
│   ├── ui/                             # Button, Input, Textarea, Field, Section, Header...
│   └── cotizacion/
│       ├── CotizacionForm.tsx          # Formulario de creación (cliente)
│       ├── CotizacionView.tsx          # Documento en HTML (estilo papel)
│       ├── CotizacionPdf.tsx           # Documento PDF descargable
│       └── CotizacionActions.tsx       # Descargar / Imprimir / Sugerir cambios
├── lib/                                # Utilidades transversales
│   ├── config/empresa.ts               # Datos de la empresa (edítalos aquí)
│   └── pdf/assetImages.ts              # Imágenes del PDF (data-URI)
└── app/                                # CAPA DE ENTRADA — Rutas (App Router)
    ├── page.tsx                        # Inicio + cotizaciones recientes
    ├── new/page.tsx                    # Formulario de nueva cotización
    ├── q/[slug]/page.tsx               # Vista pública de una cotización
    └── api/quotations/
        ├── route.ts                    # POST  /api/quotations             → crear
        └── [slug]/
            ├── pdf/route.tsx           # GET   /api/quotations/[slug]/pdf  → PDF
            └── suggestions/route.ts    # POST  /api/quotations/[slug]/suggestions
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/quotations` | Crea una cotización → `{ slug }` |
| `GET`  | `/api/quotations/[slug]/pdf` | Descarga el PDF |
| `POST` | `/api/quotations/[slug]/suggestions` | Envía una sugerencia de cambio |

Las URLs antiguas en español (`/nueva`, `/c/[slug]`, `/api/cotizaciones`,
`/api/c/[slug]/pdf`, `/api/c/[slug]/sugerencias`) redirigen automáticamente a
las nuevas (configurado en `next.config.ts`).

## Cómo usar

```bash
npm install
npm run dev
```

Abre http://localhost:3000

1. **Crear**: en `/new`, completa el formulario (usa "Cargar ejemplo" para
   ver un caso real basado en la cotización VN 2642-B).
2. **URL única**: al guardar se genera un enlace `/q/<slug>` elegido al azar.
3. **Ver / Descargar**: en la vista puedes imprimir o descargar el **PDF**.
4. **Sugerencias**: cualquiera con el enlace puede proponer cambios; quedan
   registradas y se marcan como pendientes para el creador.

## Persistencia

Las cotizaciones se guardan en `./data/cotizaciones.json` (carpeta ignorada por
git). Se lee de disco en cada petición para mantener consistencia. Si quieres
realizar el **envío real de correos** cuando llega una sugerencia, ese es el
siguiente paso natural (hoy solo se marcan como pendientes).

## Comandos

| Comando          | Descripción                            |
|------------------|----------------------------------------|
| `npm run dev`    | Servidor de desarrollo (Turbopack)     |
| `npm run build`  | Compilación de producción              |
| `npm start`      | Servir la build generada               |
| `npm run lint`   | Revisar código con ESLint              |