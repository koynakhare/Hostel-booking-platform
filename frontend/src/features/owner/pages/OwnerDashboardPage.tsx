import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHostelsQuery } from "@/api/hostelApi";
import { useGetMyBookingsQuery } from "@/api/bookingApi";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatters";
import { OWNER_ROUTES } from "@/utils/constants";

export default function OwnerDashboardPage() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const { data: hostelsData, isLoading } = useGetHostelsQuery({});
  const { data: bookings } = useGetMyBookingsQuery(undefined, { skip: true });

  const myHostels = useMemo(
    () => hostelsData?.content.filter((h) => h.ownerId === user?.id) ?? [],
    [hostelsData, user?.id],
  );

  const activeBookings = bookings?.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").length ?? 0;
  const revenue = bookings?.reduce((sum, b) => sum + (b.status === "CONFIRMED" ? b.totalAmount : 0), 0) ?? 0;

  const stats = [
    { label: "Total Hostels", value: isLoading ? "—" : String(myHostels.length) },
    { label: "Active Bookings", value: String(activeBookings) },
    { label: "Revenue", value: formatCurrency(revenue) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card accentTop>
          <h2 className="text-base font-bold text-text-primary">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-text-primary">
            <li><span className="font-semibold text-accent">1.</span> Add your hostel with photos and amenities.</li>
            <li><span className="font-semibold text-accent">2.</span> Configure rooms — set rent, AC, window, balcony.</li>
            <li><span className="font-semibold text-accent">3.</span> Students browse, pick rooms, and pay online.</li>
          </ol>
        </Card>

        <Card dark>
          <h2 className="text-base font-bold text-text-on-dark">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => navigate(OWNER_ROUTES.hostelNew)}>+ New Hostel</Button>
            <Button variant="secondary" className="!text-text-on-dark !border-white/20" onClick={() => navigate(OWNER_ROUTES.hostels)}>
              Manage Hostels
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
