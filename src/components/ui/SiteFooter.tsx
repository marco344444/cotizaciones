import { EMPRESA } from "@/lib/config/empresa";

export function SiteFooter() {
  return (
    <footer className="border-t border-ui-border bg-ui-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-ui-muted-2 md:flex-row md:px-6 md:text-left">
        <p>
          {EMPRESA.nombre} · {EMPRESA.direccion} · {EMPRESA.telefono}
        </p>
        <p>© {new Date().getFullYear()} · Sistema de cotizaciones</p>
      </div>
    </footer>
  );
}
