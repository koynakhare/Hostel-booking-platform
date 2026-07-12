interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="card-base shrink-0">
      <div className="topbar-accent-line" />
      <div className="px-6 py-5 lg:px-8">
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
      </div>
    </header>
  );
}
