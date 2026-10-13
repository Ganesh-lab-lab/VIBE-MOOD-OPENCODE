const ranges: [string, string, string][] = [
  ["\u0C00", "\u0C7F", "te"],
  ["\u0B80", "\u0BFF", "ta"],
  ["\u0D00", "\u0D7F", "ml"],
  ["\u0C80", "\u0CFF", "kn"],
  ["\u0900", "\u097F", "hi"],
];

export function detectScript(text: string): string | null {
  for (const ch of text) {
    for (const [lo, hi, code] of ranges) {
      if (ch >= lo && ch <= hi) return code;
    }
  }
  // latin?
  if (/[A-Za-z]/.test(text)) return "en";
  return null;
}

export function detectLanguage(opts: { explicit?: string; channelLanguage?: string; title: string }): string | null {
  if (opts.explicit) return opts.explicit;
  if (opts.channelLanguage) return opts.channelLanguage;
  return detectScript(opts.title);
}