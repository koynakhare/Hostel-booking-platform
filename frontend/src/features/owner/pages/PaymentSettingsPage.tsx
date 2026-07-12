import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createResolver } from "@/utils/form";
import { z } from "zod";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import Card from "@/components/ui/Card";
import { showToast } from "@/features/toast/toastSlice";
import { useAppDispatch } from "@/app/hooks";
import { PAYMENT_SETTINGS_KEY, PAYMENT_METHODS } from "@/utils/constants";

const schema = z.object({
  method: z.enum(["RAZORPAY", "STRIPE", "CASH_ON_ARRIVAL"]),
  razorpayKeyId: z.string().optional(),
  razorpayKeySecret: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PaymentSettingsPage() {
  const dispatch = useAppDispatch();
  const [saved, setSaved] = useState<FormData | null>(null);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: { method: "RAZORPAY" },
  });

  const method = watch("method");

  useEffect(() => {
    const raw = localStorage.getItem(PAYMENT_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FormData;
      reset(parsed);
      setSaved(parsed);
    }
  }, [reset]);

  const onSubmit = (data: FormData) => {
    localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(data));
    setSaved(data);
    dispatch(showToast({ message: "Payment settings saved!", type: "success" }));
  };

  return (
    <Card className="max-w-lg">
      <h2 className="mb-2 text-lg font-bold text-text-primary">Payment Gateway</h2>
      <p className="mb-6 text-sm text-text-muted">
        Choose how students pay for bookings. Settings are saved locally until backend payment config is available.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Payment Method</p>
          {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
            <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle p-3 hover:bg-bg-page">
              <input
                type="radio"
                value={value}
                checked={method === value}
                onChange={() => setValue("method", value as FormData["method"])}
                className="text-accent"
              />
              <span className="text-sm text-text-primary">{key.replace("_", " ")}</span>
            </label>
          ))}
        </div>

        {method === PAYMENT_METHODS.RAZORPAY && (
          <>
            <TextField name="razorpayKeyId" control={control} label="Razorpay Key ID" />
            <TextField name="razorpayKeySecret" control={control} label="Razorpay Key Secret" type="password" />
          </>
        )}

        {method === PAYMENT_METHODS.STRIPE && (
          <>
            <TextField name="stripePublishableKey" control={control} label="Stripe Publishable Key" />
            <TextField name="stripeSecretKey" control={control} label="Stripe Secret Key" type="password" />
          </>
        )}

        {method === PAYMENT_METHODS.CASH_ON_ARRIVAL && (
          <p className="text-sm text-text-muted">Students will pay cash when they arrive at the hostel.</p>
        )}

        <Button type="submit">Save Settings</Button>
      </form>

      {saved && (
        <p className="mt-4 text-xs text-text-muted">
          Current: {saved.method.replace("_", " ")}
        </p>
      )}
    </Card>
  );
}
