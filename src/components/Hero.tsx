import { Tag } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      {/* The tagline lives inside the h1 (as a small line above the big
          brand name) so the heading still carries what people search for -
          area + "whole-house stay" - not just a name they don't know yet. */}
      <h1>
        <span className="block text-sm font-medium tracking-wide text-accent text-balance [word-break:auto-phrase] sm:text-base">
          {dict.hero.tagline}
        </span>
        <span className="mt-2 block text-3xl font-semibold tracking-tight sm:text-5xl">{dict.hero.title}</span>
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{dict.hero.subtitle}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent sm:text-sm">
        <Tag className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        {dict.hero.noFeesBadge}
      </p>
    </div>
  );
}
