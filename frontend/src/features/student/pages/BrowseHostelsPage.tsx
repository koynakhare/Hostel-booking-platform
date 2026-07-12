import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHostelsQuery } from "@/api/hostelApi";
import HostelListingCard from "@/features/student/components/HostelListingCard";
import { SkeletonGrid } from "@/components/ui/Loader";
import Input from "@/components/ui/Input";

export default function BrowseHostelsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const { data, isLoading } = useGetHostelsQuery({ search: search || undefined, city: city || undefined });

  const hostels = data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search hostels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Input
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : hostels.length === 0 ? (
        <p className="text-center text-sm text-text-muted">No hostels found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <HostelListingCard
              key={hostel.id}
              hostel={hostel}
              onClick={() => navigate(`/student/hostels/${hostel.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
