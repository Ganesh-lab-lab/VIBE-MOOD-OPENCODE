## 17. LANGUAGES AND INDIAN MUSIC FOCUS

PRIORITY LANGUAGES (in this order)
Telugu, Hindi, Tamil, Malayalam, Kannada, and English (international: global pop, hip-hop, rock and so on). Design the code so adding Punjabi, Bengali, Marathi or others later takes only a config change.
Language object: { code: "te" | "hi" | "ta" | "ml" | "kn" | "en", name, nativeName, industryLabel, color }.
- Telugu / తెలుగు (Tollywood), Hindi / हिन्दी (Bollywood), Tamil / தமிழ் (Kollywood), Malayalam / മലയാളം (Mollywood), Kannada / ಕನ್ನಡ (Sandalwood), English (International).
- Each language gets a small accent tint taken from the theme variables (use --secondary, --highlight and --primary mixes), never new hard-coded hex values.

DATA MODEL
- songs get: language (code), isFilm (boolean), filmName (optional), musicDirector (optional), singers (array). artists get: languages (array).
- Detect language in this order: the source's explicit language field, the channel's language from channels.json, then the Unicode script of the title (Telugu U+0C00 to 0C7F, Tamil U+0B80 to 0BFF, Malayalam U+0D00 to 0D7F, Kannada U+0C80 to 0CFF, Devanagari U+0900 to 097F). Default to "en" only if the title is Latin script and no other signal exists. Never guess silently: if unsure, store language as null and show the song under "All".

ONBOARDING AND PERSONALIZATION
- The "Pick your vibe" step becomes "Pick your languages": big glass language bubbles showing the native name in its own script (and the English name small below). Choose 1 or more. Order of selection = priority. Stored in the profile and editable in Settings.
- Home is ordered by the chosen languages: a "Release pulse" row per top-2 languages, "Trending in Telugu / Hindi..." rows, "New from {industryLabel}" rows. Language filter chips at the top of Home, New and Search (All, plus the user's languages first, then the rest).
- A language chip filters every list and every API call (pass ?lang=).
- Greeting stays "Hello, {name}"; below it show a small line in the user's top language when a translation exists: Telugu "నమస్కారం", Hindi "नमस्ते", Tamil "வணக்கம்", Malayalam "നമസ്കാരം", Kannada "ನಮಸ್ಕಾರ" (English users see none).

SCRIPTS AND FONTS
- Load Noto Sans Telugu, Noto Sans Tamil, Noto Sans Malayalam, Noto Sans Kannada and Noto Sans Devanagari (Google Fonts, display=swap) and set the font stack so native-script titles, artist names and lyrics render correctly, with the Latin display font first for English text. Line-height at least 1.5 for Indic scripts so ascenders are not clipped. Never truncate Indic text mid-character: use CSS text-overflow ellipsis only.
- Search works with native script (Telugu, Hindi and so on) and with romanized spelling ("naatu naatu", "kesariya"). If a query is Latin and returns few results, also try the query with the language name appended ("{query} telugu song"). Highlight the matched language chip in results.

CATALOG SOURCES (India-first)
- iTunes Search API with country=IN (also try other storefronts for English international), and Deezer search. Verify each endpoint against its current documentation first, and skip any source that fails instead of crashing.
- DO NOT use JioSaavn, Gaana, Wynk, Spotify scrapers or any unofficial/reverse-engineered API. DO NOT download or proxy audio.
- Full-song playback only through the official YouTube IFrame Player (already in Stage 8). Previews only from the metadata API's preview URL.

AUTO NEW RELEASES BY LANGUAGE
- Extend server/channels.json to entries { name, channelId, language, type: "label" | "artist" | "music-director" }. Do NOT invent channel IDs. Resolve each name below to its real channelId using the YouTube Data API (channels.list or search.list type=channel), VERIFY that the channel title and subscriber count look official (verified, large), and write only verified IDs. Print a table of name, resolved ID and subscribers for me to review, and leave unresolved ones out.
  Candidate channels to resolve:
  Telugu: Aditya Music, Lahari Music, Mango Music, Saregama Telugu, Sony Music South, T-Series Telugu, Anand Audio.
  Hindi: T-Series, Zee Music Company, Sony Music India, Saregama Music, Tips Official, Speed Records.
  Tamil: Sony Music South, Think Music India, Saregama Tamil, Muzik247, Lahari Music, Divo Music.
  Malayalam: Muzik247, Manorama Music, Satyam Audios, Saregama Malayalam, Millennium Audios, Sony Music South.
  Kannada: Anand Audio, Lahari Music, Aditya Music, Saregama Kannada, A2 Music, PRK Audio.
  English/International: official VEVO channels or label channels of globally charting artists, as configured by me.
- The 30-minute cron job fetches each channel's RSS feed, tags songs with the channel's language, filters out non-music uploads (trailers, teasers, reels, behind-the-scenes, interviews, "jukebox" compilations over 20 minutes) using title keywords and duration, and inserts only unseen items. Mark isNew for 48 hours.
- GET /api/new?lang=te returns new releases for that language. Release Pulse and the New page use it. The SSE toast reads "N new Telugu songs dropped" using the language name.
- Add a Charts page ("Trending") per language, built from the most recently added and most played songs in the app's own database (do not claim to be an official chart).

FILM-MUSIC UI DETAILS
- Song rows and Now Playing show film name and music director when known (small muted text under the artist).
- Add "Films" as a browse tab: grid of film covers per language with the film's songs inside.
- Artist pages: languages shown as small chips; tabs Popular, Albums, Singles, About; "Fans also like" filtered to the same language first.
- Playlists can hold songs from any language. Add auto vibe playlists such as "Telugu Melodies", "Tamil Kuthu", "Hindi Romance", "Malayalam Chill", "Kannada Hits", "English Pop", built from vibeTags + language.
- Vibe ring still works: the 7 moods filter within the chosen languages.

ACCEPTANCE
- [ ] Onboarding asks for languages, native names render correctly in all 5 scripts, and no characters are clipped.
- [ ] Switching the language chip filters Home, New and Search.
- [ ] Searching a Telugu title in Telugu script and in English spelling both return results.
- [ ] channels.json contains only verified channel IDs, and the review table is shown to me.
- [ ] New releases carry the right language tag, and non-music uploads are filtered out.
- [ ] No unofficial API and no audio download exists anywhere in the code.
