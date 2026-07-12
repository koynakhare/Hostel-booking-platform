import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function Select<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
  placeholder = "Select...",
  disabled,
}: SelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
          <select
            {...field}
            disabled={disabled}
            className={`w-full rounded-button border bg-card-bg px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
              fieldState.error ? "border-red-400" : "border-border-subtle"
            }`}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldState.error && (
            <p className="text-xs text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
