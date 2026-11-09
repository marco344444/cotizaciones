import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-ui-muted">
        {label}
        {required && <span className="ml-0.5 text-brand-500">*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="text-xs text-ui-muted-2">{hint}</span>
      )}
      {error && <span className="text-xs font-medium text-brand-400">{error}</span>}
    </label>
  );
}
