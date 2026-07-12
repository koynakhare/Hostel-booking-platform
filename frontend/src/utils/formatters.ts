export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function resolveImageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

export function localToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidStayDateRange(checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return false;
  return checkIn >= localToday() && checkOut > checkIn;
}

export function daysBetween(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, days);
}

export function dailyRateFromMonthly(pricePerMonth: number): number {
  return pricePerMonth / 30;
}

export function calculateBookingTotal(
  pricePerMonth: number,
  checkIn: string,
  checkOut: string,
  seatCount: number,
): number {
  const days = daysBetween(checkIn, checkOut);
  const dailyRate = dailyRateFromMonthly(pricePerMonth);
  return Math.round(dailyRate * days * seatCount);
}

/** @deprecated Use daysBetween + calculateBookingTotal for day-wise pricing */
export function monthsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(1, months);
}
