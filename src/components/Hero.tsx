import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 sm:min-h-[70vh]">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 text-white sm:px-6 sm:py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{dict.hero.title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          {dict.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
