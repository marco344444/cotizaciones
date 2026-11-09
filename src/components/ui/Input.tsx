import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-lg border border-ui-border bg-ui-card-2 px-3 text-sm text-ui-text placeholder:text-ui-muted-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${className}`}
        {...props}
      />
    );
  },
);
