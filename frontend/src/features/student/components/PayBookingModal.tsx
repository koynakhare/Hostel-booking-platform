import { useEffect, useMemo, useState } from "react";
import { useGetPaymentConfigQuery } from "@/api/paymentApi";
import { useUpdatePaymentMethodMutation } from "@/api/bookingApi";
import { useOnlinePayment } from "@/features/student/hooks/useOnlinePayment";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatters";
import { PAYMENT_METHODS } from "@/utils/constants";
import { PAYMENT_LABELS } from "@/utils/paymentLabels";
import type { Booking, PaymentMethod } from "@/types/booking";

interface Props {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

export default function PayBookingModal({ booking, open, onClose }: Props) {
  const { data: paymentConfig } = useGetPaymentConfigQuery(undefined, { skip: !open });
  const [updatePaymentMethod, { isLoading: updatingMethod }] = useUpdatePaymentMethodMutation();
  const { payForBooking, isPaying } = useOnlinePayment();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHODS.CASH_ON_ARRIVAL);

  const availableMethods = useMemo(
    () =>
      (Object.values(PAYMENT_METHODS) as PaymentMethod[]).filter((method) => {
        if (method === PAYMENT_METHODS.RAZORPAY) return paymentConfig?.razorpayEnabled;
        if (method === PAYMENT_METHODS.STRIPE) return paymentConfig?.stripeEnabled;
        return true;
      }),
    [paymentConfig],
  );

  useEffect(() => {
    if (!booking || !open) return;
    if (availableMethods.includes(booking.paymentMethod)) {
      setSelectedMethod(booking.paymentMethod);
    } else if (availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0]);
    }
  }, [booking, open, availableMethods]);

  if (!booking) return null;

  const handleConfirm = async () => {
    try {
      const methodChanged = selectedMethod !== booking.paymentMethod;
      if (methodChanged) {
        await updatePaymentMethod({ id: booking.id, paymentMethod: selectedMethod }).unwrap();
      }

      if (selectedMethod === PAYMENT_METHODS.CASH_ON_ARRIVAL) {
        onClose();
        return;
      }

      await payForBooking(booking.id, selectedMethod, booking.hostelName);
      onClose();
    } catch { /* handled */ }
  };

  const isOnline = selectedMethod !== PAYMENT_METHODS.CASH_ON_ARRIVAL;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complete Payment"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={updatingMethod || isPaying}
            disabled={availableMethods.length === 0}
            onClick={handleConfirm}
          >
            {isOnline ? "Pay Now" : "Confirm Cash on Arrival"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-lg bg-bg-page p-4">
          <p className="font-semibold text-text-primary">{booking.hostelName}</p>
          <p className="mt-1 text-sm text-text-muted">
            Room {booking.roomNumber} · {formatCurrency(booking.totalAmount)}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Choose payment method</p>
          {availableMethods.length === 0 ? (
            <p className="text-sm text-text-muted">No payment methods available.</p>
          ) : (
            availableMethods.map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  selectedMethod === method
                    ? "border-accent bg-accent/5"
                    : "border-border-subtle hover:bg-bg-page"
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => setSelectedMethod(method)}
                  className="text-accent"
                />
                <span className="text-sm">{PAYMENT_LABELS[method]}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
