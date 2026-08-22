import type { Dictionary } from "@/lib/i18n/dictionary-type";
import PhotoTile from "./PhotoTile";
import { photos } from "@/lib/photos";

export default function FacilityIntro({ dict }: { dict: Dictionary }) {
  const photo = photos.find((p) => p.category === "living") ?? photos[0];

  return (
    <section className="grid gap-8 sm:grid-cols-2 sm:items-center">
      <PhotoTile
        photo={photo}
        label={dict.gallery.categories[photo.category]}
        className="sm:aspect-square"
        sizes="(min-width: 640px) 576px, 100vw"
      />
      <div>
        <h2 className="text-2xl font-semibold sm:text-3xl">{dict.facility.heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{dict.facility.intro}</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {dict.facility.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
