import { cn } from "@/lib/utils";
import React from "react";
import type { UseFormRegister, FieldError } from "react-hook-form";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  placeholder = "",
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <textarea
        {...register(name)}
        className={cn(
          "w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground text-sm transition-colors resize-none",
          "placeholder:text-muted-foreground/60",
          "focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring",
          error?.message && "border-destructive ring-destructive/20",
        )}
        placeholder={placeholder}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
