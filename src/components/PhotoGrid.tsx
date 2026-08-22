import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { getTopPhotos } from "@/lib/photos";
import PhotoTile from "./PhotoTile";

export default function PhotoGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const topPhotos = getTopPhotos(5);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">{dict.gallery.heading}</h2>
        <Link href={`/${locale}/gallery`} className="text-sm font-medium text-accent hover:underline">
          {dict.gallery.viewAll}
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {topPhotos.map((photo, i) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            label={dict.gallery.categories[photo.category]}
            sizes="(min-width: 640px) 220px, 50vw"
            priority={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
