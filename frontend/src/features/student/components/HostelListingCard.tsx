import type { Hostel } from "@/types/hostel";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import HostelImage from "@/components/ui/HostelImage";

interface Props {
  hostel: Hostel;
  onClick: () => void;
}

export default function HostelListingCard({ hostel, onClick }: Props) {
  return (
    <div
      className="cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <Card padding={false} className="overflow-hidden transition-shadow hover:shadow-card-hover">
        <div className="relative h-44 bg-bg-page">
          <HostelImage
            src={hostel.images?.[0]}
            alt={hostel.name}
            className="h-full w-full object-cover"
          />
          {hostel.active && (
            <div className="absolute left-3 top-3">
              <Badge label="Available" variant="success" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-text-primary">{hostel.name}</h3>
          <p className="mt-1 text-sm text-text-muted">{hostel.city}, {hostel.state}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-accent">{hostel.totalRooms} rooms</p>
            <p className="text-xs text-text-muted">{hostel.amenities?.slice(0, 30)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
