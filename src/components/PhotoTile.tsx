import Image from "next/image";
import type { Photo } from "@/lib/photos";

export default function PhotoTile({
  photo,
  label,
  className = "",
  sizes = "100vw",
  quality = 90,
  priority = false,
}: {
  photo: Photo;
  label?: string;
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
}) {
  return (
    <div className={`relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-muted ${className}`}>
      <Image
        src={photo.src}
        alt={label ?? photo.id}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className="object-cover"
      />
      {label && (
        <span className="relative m-3 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
