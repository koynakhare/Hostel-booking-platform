import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHostelsQuery } from "@/api/hostelApi";
import HostelListingCard from "@/features/student/components/HostelListingCard";
import { SkeletonGrid } from "@/components/ui/Loader";
import Input from "@/components/ui/Input";

export default function BrowseHostelsPage() {
  const navigate = useNavigate();
  const [draftSearch, setDraftSearch] = useState("");
  const [draftCity, setDraftCity] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCity, setAppliedCity] = useState("");

  const { data, isLoading } = useGetHostelsQuery({
    search: appliedSearch || undefined,
    city: appliedCity || undefined,
  });

  const hostels = data?.content ?? [];

  const applyFilters = () => {
    setAppliedSearch(draftSearch.trim());
    setAppliedCity(draftCity.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div>
      <section className="storefront-hero">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Student accommodation
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">
              Find your perfect hostel
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Browse verified hostels near campus, compare amenities, and book your room in minutes.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-card bg-card-bg p-3 shadow-card sm:flex-row sm:items-center sm:p-4">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by hostel name..."
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <div className="relative sm:max-w-xs sm:flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Input
                placeholder="Filter by city..."
                value={draftCity}
                onChange={(e) => setDraftCity(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {appliedSearch || appliedCity ? "Search results" : "All hostels"}
            </h2>
            {!isLoading && (
              <p className="mt-1 text-sm text-text-muted">
                {hostels.length} {hostels.length === 1 ? "hostel" : "hostels"} available
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : hostels.length === 0 ? (
          <div className="rounded-card bg-card-bg py-16 text-center shadow-card">
            <svg
              className="mx-auto h-12 w-12 text-text-muted/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="mt-4 text-base font-medium text-text-primary">No hostels found</p>
            <p className="mt-1 text-sm text-text-muted">Try adjusting your search or city filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hostels.map((hostel) => (
              <HostelListingCard
                key={hostel.id}
                hostel={hostel}
                onClick={() => navigate(`/student/hostels/${hostel.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
