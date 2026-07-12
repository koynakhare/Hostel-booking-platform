import Badge from "@/components/ui/Badge";

interface RoomFeatureBadgesProps {
  hasWindow: boolean;
  hasBalcony: boolean;
  showMissing?: boolean;
}

export default function RoomFeatureBadges({
  hasWindow,
  hasBalcony,
  showMissing = true,
}: RoomFeatureBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {hasWindow ? (
        <Badge label="Window" variant="info" />
      ) : showMissing ? (
        <Badge label="No window" variant="neutral" />
      ) : null}
      {hasBalcony ? (
        <Badge label="Balcony" variant="info" />
      ) : showMissing ? (
        <Badge label="No balcony" variant="neutral" />
      ) : null}
    </div>
  );
}
