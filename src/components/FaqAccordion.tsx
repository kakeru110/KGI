import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function FaqAccordion({ dict }: { dict: Dictionary }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{dict.faq.heading}</h2>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {dict.faq.items.map((item) => (
          <details key={item.q} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {item.q}
              <span className="ml-4 shrink-0 text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
