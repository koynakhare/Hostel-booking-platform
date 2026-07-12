type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function statusToBadgeVariant(
  status: string,
): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    AVAILABLE: "success",
    CONFIRMED: "success",
    PENDING: "warning",
    LOCKED: "warning",
    BOOKED: "danger",
    CANCELLED: "neutral",
    EXPIRED: "neutral",
    UNAVAILABLE: "neutral",
  };
  return map[status] ?? "neutral";
}

export default function Badge({ label, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
