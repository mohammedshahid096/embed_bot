import { cn } from "@/lib/utils";
import React from "react";
import type { FieldError } from "react-hook-form";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  error?: FieldError;
  required?: boolean;
  options: { label: string; value: string }[];
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  error,
  required = false,
  options,
  className = "",
  value,
  onValueChange,
  ...props
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground text-sm transition-colors appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring",
          error?.message && "border-destructive ring-destructive/20",
          !value && "text-muted-foreground/60",
        )}
        {...props}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
