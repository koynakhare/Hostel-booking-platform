import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  accentTop?: boolean;
  dark?: boolean;
  padding?: boolean;
}

export default function Card({
  children,
  className = "",
  accentTop = false,
  dark = false,
  padding = true,
}: CardProps) {
  return (
    <div
      className={`${
        dark ? "rounded-card bg-sidebar-bg shadow-card" : "card-base"
      } ${accentTop ? "card-accent-top" : ""} ${padding ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
