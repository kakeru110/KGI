export type PhotoCategory =
  | "living"
  | "bedroom"
  | "loft"
  | "kitchen"
  | "bathroom"
  | "exterior";

export type Photo = {
  id: string;
  category: PhotoCategory;
  /** Real photography not yet available - swap `gradient` for a `src` field once it is. */
  gradient: string;
};

/**
 * Placeholder photo set. Replace with real photography (public/photos/*)
 * before launch - keep the same `category` values so gallery filtering
 * keeps working unchanged.
 */
export const photos: Photo[] = [
  { id: "exterior-1", category: "exterior", gradient: "from-emerald-800 to-emerald-950" },
  { id: "living-1", category: "living", gradient: "from-stone-300 to-stone-500" },
  { id: "living-2", category: "living", gradient: "from-amber-200 to-stone-400" },
  { id: "bedroom-1", category: "bedroom", gradient: "from-slate-300 to-slate-500" },
  { id: "loft-1", category: "loft", gradient: "from-orange-200 to-amber-400" },
  { id: "kitchen-1", category: "kitchen", gradient: "from-zinc-200 to-zinc-400" },
  { id: "bathroom-1", category: "bathroom", gradient: "from-sky-200 to-sky-400" },
  { id: "exterior-2", category: "exterior", gradient: "from-emerald-700 to-emerald-900" },
];

export function getTopPhotos(count = 5): Photo[] {
  return photos.slice(0, count);
}
