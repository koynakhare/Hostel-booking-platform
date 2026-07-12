interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

export default function Loader({ size = "md", label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`animate-spin rounded-full border-2 border-accent border-t-transparent ${sizeMap[size]}`}
      />
      {label && <p className="text-sm text-text-muted">{label}</p>}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-base p-4">
          <div className="skeleton-block mb-3 h-40 w-full rounded-lg" />
          <div className="skeleton-block mb-2 h-5 w-3/4" />
          <div className="skeleton-block h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
