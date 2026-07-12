import Card from "@/components/ui/Card";
import { useGetPaymentConfigQuery } from "@/api/paymentApi";
import Loader from "@/components/ui/Loader";

export default function PaymentSettingsPage() {
  const { data: config, isLoading } = useGetPaymentConfigQuery();

  if (isLoading) return <Loader label="Loading payment config..." />;

  return (
    <Card className="max-w-lg">
      <h2 className="mb-2 text-lg font-bold text-text-primary">Payment Gateway</h2>
      <p className="mb-6 text-sm text-text-muted">
        Payment gateways are configured on the server via environment variables.
        Students will only see enabled methods at checkout.
      </p>

      <div className="space-y-4 text-sm">
        <div className="rounded-lg border border-border-subtle p-4">
          <p className="font-medium text-text-primary">Razorpay</p>
          <p className="mt-1 text-text-muted">
            Status: {config?.razorpayEnabled ? "Enabled" : "Not configured"}
          </p>
          {config?.razorpayEnabled && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              Key ID: {config.razorpayKeyId}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border-subtle p-4">
          <p className="font-medium text-text-primary">Stripe</p>
          <p className="mt-1 text-text-muted">
            Status: {config?.stripeEnabled ? "Enabled" : "Not configured"}
          </p>
          {config?.stripeEnabled && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              Publishable key: {config.stripePublishableKey.slice(0, 12)}...
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border-subtle p-4">
          <p className="font-medium text-text-primary">Cash on Arrival</p>
          <p className="mt-1 text-text-muted">Always available for students.</p>
        </div>

        <div className="rounded-lg bg-bg-page p-4 text-xs text-text-muted">
          <p className="font-medium text-text-primary">Server setup</p>
          <p className="mt-2">Set these environment variables on the backend:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-mono">
            <li>RAZORPAY_KEY_ID</li>
            <li>RAZORPAY_KEY_SECRET</li>
            <li>STRIPE_PUBLISHABLE_KEY</li>
            <li>STRIPE_SECRET_KEY</li>
            <li>FRONTEND_URL (e.g. http://localhost:5173)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
