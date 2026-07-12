import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";

export function createResolver<T extends FieldValues>(
  schema: z.ZodType<T, FieldValues>,
): Resolver<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return zodResolver(schema as any) as Resolver<T>;
}

export const zNum = (min = 0, message?: string) =>
  z
    .union([z.number(), z.string()])
    .transform((v) => (v === "" ? NaN : Number(v)))
    .pipe(z.number().min(min, message ?? `Must be at least ${min}`));
