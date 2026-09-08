import "server-only";
import type { Locale } from "./i18n/config";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Free-tier DeepL keys are suffixed ":fx" and use a different API host
// than paid keys.
const DEEPL_API_URL = DEEPL_API_KEY?.endsWith(":fx")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

function localeToDeepLTarget(locale: Locale): string {
  return locale === "ja" ? "JA" : "EN-US";
}

type DeepLResponse = { translations: { text: string }[] };

/**
 * Translates one string via DeepL, cached indefinitely (not on a timer).
 * Next.js's fetch cache keys on the exact request body, so this being a
 * per-text call (rather than one batched call for every review) means a
 * given review's translation is cached forever once made - a new review
 * arriving only ever triggers a DeepL call for that one new text, and
 * every review translated before keeps being served from cache rather
 * than being re-translated (and re-billed against the DeepL quota) just
 * because it happened to ride along in the same batch.
 */
async function translateOne(text: string, locale: Locale): Promise<string> {
  try {
    const res = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: [text], target_lang: localeToDeepLTarget(locale) }),
      // This Next.js version defaults fetch to "no persistent cache" for
      // POST requests unless `cache: "force-cache"` is set explicitly.
      // `revalidate: false` caches indefinitely rather than on a timer,
      // per the above.
      cache: "force-cache",
      next: { revalidate: false },
    });
    if (!res.ok) return text;
    const data = (await res.json()) as DeepLResponse;
    return data.translations[0]?.text ?? text;
  } catch {
    return text;
  }
}

/**
 * Translates a batch of strings to the given locale via DeepL. Source
 * language is auto-detected (guest reviews arrive in whatever language
 * the guest wrote them). Falls back to returning the original text
 * unchanged if DEEPL_API_KEY isn't set, so a missing/invalid key degrades
 * gracefully instead of breaking the page.
 */
export async function translateTexts(texts: string[], locale: Locale): Promise<string[]> {
  if (!DEEPL_API_KEY || texts.length === 0) return texts;
  return Promise.all(texts.map((text) => translateOne(text, locale)));
}
