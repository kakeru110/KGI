import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function AmenitiesList({ dict }: { dict: Dictionary }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{dict.amenities.heading}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {dict.amenities.items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border p-4">
            <p className="font-medium">{item.label}</p>
            {item.sub && <p className="text-sm text-muted">{item.sub}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
