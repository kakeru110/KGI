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
  src: string;
};

export const photos: Photo[] = [
  { id: "living-1", category: "living", src: "/photos/living-1.jpg" },
  { id: "bedroom-1", category: "bedroom", src: "/photos/bedroom-1.jpg" },
  { id: "loft-1", category: "loft", src: "/photos/loft-1.jpg" },
  { id: "kitchen-1", category: "kitchen", src: "/photos/kitchen-1.jpg" },
  { id: "bathroom-1", category: "bathroom", src: "/photos/bathroom-1.jpg" },
  { id: "exterior-1", category: "exterior", src: "/photos/exterior-1.jpg" },
  { id: "living-2", category: "living", src: "/photos/living-2.jpg" },
  { id: "loft-2", category: "loft", src: "/photos/loft-2.jpg" },
  { id: "kitchen-2", category: "kitchen", src: "/photos/kitchen-2.jpg" },
  { id: "bathroom-2", category: "bathroom", src: "/photos/bathroom-2.jpg" },
  { id: "bathroom-3", category: "bathroom", src: "/photos/bathroom-3.jpg" },
  { id: "exterior-2", category: "exterior", src: "/photos/exterior-2.jpg" },
  { id: "living-3", category: "living", src: "/photos/living-3.jpg" },
  { id: "kitchen-3", category: "kitchen", src: "/photos/kitchen-3.jpg" },
];

export function getTopPhotos(count = 5): Photo[] {
  return photos.slice(0, count);
}
