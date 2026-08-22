import Link from "next/link";

export default function StickyMobileCTA({
  primary,
  secondary,
  href,
  label,
  external = false,
}: {
  primary: string;
  secondary?: string;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="leading-tight">
          {secondary && <p className="text-xs text-muted">{secondary}</p>}
          <p className="text-lg font-semibold">{primary}</p>
        </div>
        {external ? (
          <a href={href} className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground">
            {label}
          </a>
        ) : (
          <Link href={href} className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground">
            {label}
          </Link>
        )}
      </div>
    </div>
  );
}
