import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyStripePaymentMutation } from "@/api/paymentApi";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import { STUDENT_ROUTES } from "@/utils/constants";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyStripe, { isLoading, isSuccess, isError }] = useVerifyStripePaymentMutation();
  const attempted = useRef(false);

  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    if (attempted.current || !sessionId || !bookingId) return;
    attempted.current = true;

    verifyStripe({
      bookingId: Number(bookingId),
      sessionId,
    });
  }, [sessionId, bookingId, verifyStripe]);

  if (!sessionId || !bookingId) {
    return (
      <Card>
        <p className="text-sm text-text-muted">Invalid payment return URL.</p>
        <Button className="mt-4" onClick={() => navigate(STUDENT_ROUTES.myBookings)}>
          Go to My Bookings
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return <Loader label="Confirming your payment..." />;
  }

  if (isSuccess) {
    return (
      <Card accentTop className="max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold text-text-primary">Payment Successful</h2>
        <p className="mt-2 text-sm text-text-muted">
          Your booking has been confirmed. You can view it in My Bookings.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate(STUDENT_ROUTES.myBookings)}>
          View My Bookings
        </Button>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold text-text-primary">Payment Verification Failed</h2>
        <p className="mt-2 text-sm text-text-muted">
          We could not confirm your payment. If money was deducted, contact support with your booking ID.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate(STUDENT_ROUTES.myBookings)}>
          Go to My Bookings
        </Button>
      </Card>
    );
  }

  return <Loader label="Processing..." />;
}
