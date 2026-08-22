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
 * Translates a batch of strings to the given locale via DeepL. Source
 * language is auto-detected (guest reviews arrive in whatever language
 * the guest wrote them). Falls back to returning the original text
 * unchanged if DEEPL_API_KEY isn't set or the request fails, so a
 * missing/invalid key degrades gracefully instead of breaking the page.
 */
export async function translateTexts(texts: string[], locale: Locale): Promise<string[]> {
  if (!DEEPL_API_KEY || texts.length === 0) return texts;

  try {
    const res = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: texts, target_lang: localeToDeepLTarget(locale) }),
      // Matches the review fetch cache window - translations are stable
      // for a given text, so no need to re-translate every request.
      next: { revalidate: 1800 },
    });
    if (!res.ok) return texts;
    const data = (await res.json()) as DeepLResponse;
    if (data.translations.length !== texts.length) return texts;
    return data.translations.map((t) => t.text);
  } catch {
    return texts;
  }
}
