import type { RazorpaySuccessResponse } from "@/types/payment";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(options: {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  hostelName: string;
  userName: string;
  userEmail: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Failed to load Razorpay checkout");
  }

  const rzp = new window.Razorpay({
    key: options.keyId,
    amount: Math.round(options.amount * 100),
    currency: options.currency,
    name: "Hostel Booking Platform",
    description: options.hostelName,
    order_id: options.orderId,
    prefill: {
      name: options.userName,
      email: options.userEmail,
    },
    theme: { color: "#2563eb" },
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  rzp.open();
}
