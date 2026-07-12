import Button from "@/components/ui/Button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onLogout?: () => void;
}

export default function Topbar({ title, subtitle, onLogout }: TopbarProps) {
  return (
    <header className="card-base shrink-0">
      <div className="topbar-accent-line" />
      <div className="flex items-start justify-between gap-4 px-6 py-5 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
        </div>
        {onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
