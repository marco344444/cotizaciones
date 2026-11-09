import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ui-border bg-ui-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
            V
          </span>
          <span className="text-sm font-bold leading-tight text-ui-text">
            Via Elevadores
            <span className="block text-[11px] font-medium text-ui-muted">
              Cotizaciones
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-ui-muted transition-colors hover:bg-ui-card-2 hover:text-ui-text"
          >
            Inicio
          </Link>
          <Link
            href="/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            + Nueva cotización
          </Link>
        </nav>
      </div>
    </header>
  );
}
