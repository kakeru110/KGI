export default function BookingSteps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
      {labels.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        return (
          <li key={label} className={`flex items-center gap-2 ${active ? "font-semibold text-foreground" : ""}`}>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] ${
                active ? "bg-accent text-accent-foreground" : "bg-surface"
              }`}
            >
              {step}
            </span>
            {label}
            {step < labels.length && <span className="ml-2 text-border">›</span>}
          </li>
        );
      })}
    </ol>
  );
}
