import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { removeToast } from "@/features/toast/toastSlice";

const typeStyles = {
  success: "border-l-emerald-500 bg-emerald-50 text-emerald-800",
  error: "border-l-red-500 bg-red-50 text-red-800",
  info: "border-l-accent bg-accent/5 text-text-primary",
};

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.toast.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onClose,
}: {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`card-base min-w-[280px] max-w-sm border-l-4 px-4 py-3 text-sm shadow-card-hover ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
