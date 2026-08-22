"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { photos as allPhotos, type PhotoCategory } from "@/lib/photos";
import PhotoTile from "./PhotoTile";

export default function PhotoGallery({ dict }: { dict: Dictionary }) {
  const categories = Object.keys(dict.gallery.categories) as PhotoCategory[];
  const [active, setActive] = useState<PhotoCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = active === "all" ? allPhotos : allPhotos.filter((p) => p.category === active);

  return (
    <section>
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.gallery.heading}</h1>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
            active === "all" ? "border-accent bg-accent text-accent-foreground" : "border-border"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
              active === category ? "border-accent bg-accent text-accent-foreground" : "border-border"
            }`}
          >
            {dict.gallery.categories[category]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((photo, i) => (
          <button key={photo.id} onClick={() => setOpenIndex(i)} className="text-left">
            <PhotoTile
              photo={photo}
              label={dict.gallery.categories[photo.category]}
              sizes="(min-width: 640px) 370px, 50vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            className="absolute right-4 top-4 text-2xl text-white"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
          >
            ×
          </button>
          <button
            className="absolute left-2 text-3xl text-white sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <PhotoTile
              photo={filtered[openIndex]}
              label={dict.gallery.categories[filtered[openIndex].category]}
              className="aspect-[4/3]"
              sizes="(min-width: 640px) 512px, 100vw"
              quality={95}
            />
          </div>
          <button
            className="absolute right-2 text-3xl text-white sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i + 1) % filtered.length));
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
