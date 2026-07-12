import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import Input from "@/components/ui/Input";

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: string | number;
  integerOnly?: boolean;
}

export default function TextField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  required,
  helperText,
  disabled,
  min,
  max,
  step,
  integerOnly,
}: TextFieldProps<T>) {
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
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            error={!!fieldState.error}
            min={min}
            max={max}
            step={integerOnly ? 1 : step}
            value={field.value ?? ""}
            onKeyDown={
              integerOnly
                ? (e) => {
                    if ([".", "e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }
                : undefined
            }
            onChange={(e) => {
              const raw = e.target.value;
              if (type === "number" || integerOnly) {
                if (raw === "") {
                  field.onChange("");
                  return;
                }
                const num = Number(raw);
                if (Number.isNaN(num)) return;
                field.onChange(integerOnly ? Math.trunc(num) : num);
                return;
              }
              field.onChange(raw);
            }}
          />
          {fieldState.error ? (
            <p className="text-xs text-red-500">{fieldState.error.message}</p>
          ) : helperText ? (
            <p className="text-xs text-text-muted">{helperText}</p>
          ) : null}
        </div>
      )}
    />
  );
}
