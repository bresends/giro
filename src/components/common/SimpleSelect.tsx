import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            className="block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {label}
            {props.required && <span className="text-[#dc2626] ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#dc2626]",
            className
          )}
          style={{
            border: "1.5px solid #e5e5e5",
            fontFamily: "'Barlow', sans-serif",
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-[11px] text-[#dc2626]">{error}</p>
        )}
      </div>
    );
  }
);

SimpleSelect.displayName = "SimpleSelect";
