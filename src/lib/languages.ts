export interface Language {
  code: string;
  name: string;
  nativeName: string;
  industryLabel: string;
  colorVar: string; // css var name to use
}

export const LANGUAGES: Language[] = [
  { code: "te", name: "Telugu", nativeName: "తెలుగు", industryLabel: "Tollywood", colorVar: "--secondary" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", industryLabel: "Bollywood", colorVar: "--highlight" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", industryLabel: "Kollywood", colorVar: "--primary" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", industryLabel: "Mollywood", colorVar: "--secondary" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", industryLabel: "Sandalwood", colorVar: "--highlight" },
  { code: "en", name: "English", nativeName: "English", industryLabel: "International", colorVar: "--primary" },
];

export const greetings: Record<string,string> = {
  te: "నమస్కారం", hi: "नमस्ते", ta: "வணக்கம்", ml: "നമസ്കാരം", kn: "ನಮಸ್ಕಾರ",
};

export function langByCode(code: string) { return LANGUAGES.find(l=>l.code===code); }