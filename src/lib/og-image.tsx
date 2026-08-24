import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultLocale, isLocale, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/get-dictionary";
import { SITE_URL } from "./site";

/**
 * The branded 1200x630 card shown when a link to the site is shared - on
 * X, LINE, Slack, Facebook, iMessage. Both `opengraph-image.tsx` and
 * `twitter-image.tsx` are thin wrappers around this, and Next.js
 * statically generates one per locale at build time.
 *
 * Sharing a raw interior photo works, but the card is often the only thing
 * a reader sees before deciding whether to tap: the name, what the place
 * is, and that this is the official site all have to survive on their own.
 */

/** X's summary_large_image and Open Graph both want 1.91:1. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Kamakura Gate Inn";

/**
 * Satori has no `inset` shorthand - an absolutely positioned box without
 * explicit offsets collapses to its content, so a full-bleed overlay has
 * to name all four sides.
 */
const FILL = { top: 0, right: 0, bottom: 0, left: 0 };

const BRAND = {
  /** Matches --accent in globals.css. */
  accent: "#1f4d3d",
  /** Deep neutral the photo is darkened toward, so text keeps its contrast. */
  scrim: "20, 26, 23",
};

const fontSubsets = new Map<string, Promise<ArrayBuffer>>();

/**
 * A Google Fonts subset covering exactly `text`. Satori (what next/og
 * renders with) has no system fonts, so Japanese needs real font data, and
 * the full Shippori Mincho face is several MB - a per-string subset is a
 * few KB, which is what makes this practical.
 *
 * This runs at build time, and the app already depends on
 * fonts.googleapis.com at build time through next/font in the root layout,
 * so it adds no failure mode that wasn't already there.
 */
function loadGoogleFontSubset(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  // opengraph-image and twitter-image render the same card, so each
  // subset is asked for twice per locale - fetch it once.
  const key = `${family}|${weight}|${text}`;
  const cached = fontSubsets.get(key);
  if (cached) return cached;
  const pending = fetchGoogleFontSubset(family, weight, text);
  fontSubsets.set(key, pending);
  return pending;
}

/**
 * The plain User-Agent is load-bearing: the CSS API serves woff2 to modern
 * browsers, which Satori can't parse, and TrueType to everything else.
 */
async function fetchGoogleFontSubset(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).then((res) => res.text());
  const fontUrl = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`No TrueType subset for ${family} ${weight} in the Google Fonts response`);
  }
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

/**
 * Pre-cropped to exactly 1200x630 and committed to public/og/, rather than
 * cropping the 4.6MB original at build time - Satori would have to decode
 * that full-resolution JPEG once per generated image.
 */
async function loadBackground(): Promise<string> {
  const jpeg = await readFile(join(process.cwd(), "public/og/background.jpg"));
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

export async function renderOgImage(rawLocale: string): Promise<ImageResponse> {
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const domain = new URL(SITE_URL).host;

  // The heading serif from globals.css, so the card reads as the same
  // brand as the page it links to. One subset request per weight, covering
  // every string this image draws.
  const text = dict.meta.siteName + dict.meta.ogBadge + dict.meta.ogTagline + domain;
  const [background, mincho500, mincho700] = await Promise.all([
    loadBackground(),
    loadGoogleFontSubset("Shippori Mincho", 500, text),
    loadGoogleFontSubset("Shippori Mincho", 700, text),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori rasterizes a plain <img>; next/image has no meaning inside an ImageResponse. */}
        <img src={background} alt="" width={OG_SIZE.width} height={OG_SIZE.height} />

        {/* Darkened at the left, clear at the right, so the copy stays
            readable over a bright interior without hiding the room. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            ...FILL,
            // Satori reads gradients from backgroundImage, not the
            // `background` shorthand - as `background` it silently draws
            // nothing and the copy sits on a bare photo.
            backgroundImage:
              `linear-gradient(100deg, rgba(${BRAND.scrim}, 0.92) 0%, rgba(${BRAND.scrim}, 0.8) 34%,` +
              ` rgba(${BRAND.scrim}, 0.4) 64%, rgba(${BRAND.scrim}, 0.04) 100%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            ...FILL,
            justifyContent: "center",
            padding: "0 96px 0 76px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 22px",
              borderRadius: 999,
              backgroundColor: BRAND.accent,
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            {dict.meta.ogBadge}
          </div>

          <div style={{ display: "flex", marginTop: 28, color: "#ffffff", fontSize: 82, fontWeight: 700 }}>
            {dict.meta.siteName}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              // Keeps the line inside the darkened left side of the photo,
              // wrapping rather than running out over the bright wall.
              maxWidth: 760,
              color: "rgba(255, 255, 255, 0.88)",
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.35,
            }}
          >
            {dict.meta.ogTagline}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 44,
              color: "rgba(255, 255, 255, 0.62)",
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            {domain}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Shippori Mincho", data: mincho500, style: "normal", weight: 500 },
        { name: "Shippori Mincho", data: mincho700, style: "normal", weight: 700 },
      ],
    }
  );
}
