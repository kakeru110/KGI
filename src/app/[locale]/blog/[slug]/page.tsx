import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { formatDateLabel } from "@/lib/i18n/format";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog/posts";
import { buildBlogPostingJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return locales.flatMap((locale) => BLOG_POSTS.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${locale === "ja" ? post.titleJa : post.titleEn} | Kamakura Gate Inn`,
    description: locale === "ja" ? post.excerptJa : post.excerptEn,
    alternates: buildAlternates(locale, `/blog/${slug}`),
    openGraph: { images: [`${SITE_URL}${post.heroImage}`] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = buildBlogPostingJsonLd(locale, dict, post);
  const sourceLabel = locale === "ja" ? post.sourceLabelJa : post.sourceLabelEn;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={jsonLd} />
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.blog.backToList}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl">
        {locale === "ja" ? post.titleJa : post.titleEn}
      </h1>
      <p className="mt-2 text-sm text-muted">{formatDateLabel(post.publishedDate, locale)}</p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={post.heroImage}
          alt={locale === "ja" ? post.titleJa : post.titleEn}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 space-y-8">
        {post.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold sm:text-xl">
              {locale === "ja" ? section.headingJa : section.headingEn}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {locale === "ja" ? section.bodyJa : section.bodyEn}
            </p>
          </section>
        ))}
      </div>

      {post.sourceUrl && sourceLabel && (
        <p className="mt-10 text-xs text-muted">
          {locale === "ja" ? "出典" : "Source"}:{" "}
          <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {sourceLabel}
          </a>
        </p>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="font-medium">{dict.hero.noFeesBadge}</p>
        <Link
          href={`/${locale}/booking`}
          className="mt-3 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {dict.nav.checkAvailability}
        </Link>
      </div>
    </article>
  );
}
