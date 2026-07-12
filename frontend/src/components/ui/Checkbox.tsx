import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export default function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
}: CheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            ref={field.ref}
            className="h-4 w-4 rounded border-border-subtle text-accent focus:ring-accent"
          />
          {label}
        </label>
      )}
    />
  );
}
