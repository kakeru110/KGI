import type { Photo } from "@/lib/photos";

const ICONS: Record<Photo["category"], string> = {
  living: "🛋️",
  bedroom: "🛏️",
  loft: "🪜",
  kitchen: "🍳",
  bathroom: "🛁",
  exterior: "🏠",
};

export default function PhotoTile({
  photo,
  label,
  className = "",
}: {
  photo: Photo;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-gradient-to-br ${photo.gradient} ${className}`}
    >
      <span className="absolute right-3 top-3 text-2xl opacity-80">{ICONS[photo.category]}</span>
      {label && (
        <span className="m-3 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
