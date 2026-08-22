import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-emerald-950 sm:min-h-[70vh]">
      <Image
        src="/photos/living-2.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-12 pb-16 text-white sm:px-6 sm:pt-16 sm:pb-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{dict.hero.title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          {dict.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
