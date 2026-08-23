import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { getTopPhotos, photos as allPhotos } from "@/lib/photos";

export default function PhotoMosaic({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const topPhotos = getTopPhotos(5);
  const remaining = Math.max(allPhotos.length - topPhotos.length, 0);

  return (
    <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl sm:h-[440px] sm:grid-cols-4 sm:grid-rows-2">
      {topPhotos.map((photo, i) => {
        const isLast = i === topPhotos.length - 1;
        return (
          <Link
            key={photo.id}
            href={`/${locale}/gallery`}
            className={`group relative block aspect-square overflow-hidden sm:aspect-auto sm:h-full ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <Image
              src={photo.src}
              alt={dict.gallery.categories[photo.category]}
              fill
              sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
              priority={i === 0}
              className="object-cover transition group-hover:brightness-95"
            />
            {isLast && remaining > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-center text-sm font-medium text-white transition group-hover:bg-black/60">
                {dict.gallery.viewAll}
                <span className="ml-1">(+{remaining})</span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
