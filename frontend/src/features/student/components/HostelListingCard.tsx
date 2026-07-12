import type { Hostel } from "@/types/hostel";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import HostelImage from "@/components/ui/HostelImage";
import Button from "@/components/ui/Button";

interface Props {
  hostel: Hostel;
  onClick: () => void;
}

function amenityList(amenities?: string) {
  if (!amenities) return [];
  return amenities.split(",").map((a) => a.trim()).filter(Boolean).slice(0, 3);
}

export default function HostelListingCard({ hostel, onClick }: Props) {
  const amenities = amenityList(hostel.amenities);

  return (
    <Card
      padding={false}
      className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-bg-page"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        <HostelImage
          src={hostel.images?.[0]}
          alt={hostel.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hostel.active && (
          <div className="absolute left-3 top-3">
            <Badge label="Available" variant="success" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div
          className="cursor-pointer"
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClick()}
        >
          <h3 className="line-clamp-1 font-bold text-text-primary group-hover:text-accent">
            {hostel.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {hostel.city}, {hostel.state}
          </p>
        </div>

        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.map((item) => (
              <span
                key={item}
                className="rounded-full bg-bg-page px-2 py-0.5 text-xs text-text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-sm font-semibold text-accent">
            {hostel.totalRooms} rooms
          </p>
          <Button size="sm" variant="secondary" onClick={onClick}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
