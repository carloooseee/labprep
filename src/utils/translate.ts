const cache = new Map<string, string>();

export async function translateText(text: string, targetLang: string = 'tl'): Promise<string> {
  if (!text || typeof text !== 'string') return text;
  
  const cacheKey = `${text}_${targetLang}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    const translated = data[0].map((item: any) => item[0]).join('');
    cache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback to original
  }
}
