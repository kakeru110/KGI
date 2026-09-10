import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { formatDateLabel } from "@/lib/i18n/format";
import { BLOG_POSTS } from "@/lib/blog/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.blog, alternates: buildAlternates(locale, "/blog") };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.blog.heading}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{dict.blog.intro}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-border"
          >
            {post.heroImage ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={post.heroImage}
                  alt={locale === "ja" ? post.titleJa : post.titleEn}
                  fill
                  sizes="(min-width: 640px) 480px, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-surface">
                <Image src="/logo.png" alt="" width={56} height={56} className="h-14 w-14 opacity-40" />
              </div>
            )}
            <div className="p-5">
              <p className="text-xs text-muted">{formatDateLabel(post.publishedDate, locale)}</p>
              <p className="mt-1 font-medium leading-snug">{locale === "ja" ? post.titleJa : post.titleEn}</p>
              <p className="mt-2 text-sm text-muted">{locale === "ja" ? post.excerptJa : post.excerptEn}</p>
              <p className="mt-3 text-sm font-medium text-accent">{dict.blog.readMore} →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
