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
