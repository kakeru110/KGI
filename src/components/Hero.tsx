import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{dict.hero.title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{dict.hero.subtitle}</p>
    </div>
  );
}
