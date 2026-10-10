import { Tag } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      {/* The brand name sits above as an eyebrow so the h1 can carry what
          people actually search for (area + "whole-house stay"), not just
          a name they don't know yet. */}
      <p className="text-sm font-medium tracking-wide text-accent sm:text-base">{dict.meta.siteName}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance [word-break:auto-phrase] sm:text-5xl">{dict.hero.title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{dict.hero.subtitle}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent sm:text-sm">
        <Tag className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        {dict.hero.noFeesBadge}
      </p>
    </div>
  );
}
