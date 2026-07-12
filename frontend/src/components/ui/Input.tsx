import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-button border bg-card-bg px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 ${
        error ? "border-red-400" : "border-border-subtle"
      } ${className}`}
      {...props}
    />
  );
}
