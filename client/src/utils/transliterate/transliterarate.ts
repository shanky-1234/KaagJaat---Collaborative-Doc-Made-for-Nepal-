import { IndicTransliterator } from "@cloudrumbles/indic-transliterate";

const transliterator = new IndicTransliterator();

export async function getNepaliSuggestions(word: string) {
  if (!word.trim()) {
    return [];
  }

  try {
    const suggestions = await transliterator.transliterate(
      word,
      "ne",
      5
    );

    return suggestions;
  } catch (error) {
    console.error("Nepali transliteration failed:", error);
    return [];
  }
}