import type { ReactNode } from "react";

interface SectionProps {
  step?: number;
  title: string;
  description?: string;
  children: ReactNode;
  /** Identificador de ancla para la navegación lateral. */
  id?: string;
}

export function Section({
  step,
  title,
  description,
  children,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:p-7"
    >
      <header className="mb-5 flex items-start gap-3 border-b border-ui-border pb-4">
        {step !== undefined && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold text-ui-text">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-ui-muted-2">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
