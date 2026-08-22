import type { Locale } from "./config";
import type { Dictionary } from "./dictionary-type";
import ja from "./dictionaries/ja";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
