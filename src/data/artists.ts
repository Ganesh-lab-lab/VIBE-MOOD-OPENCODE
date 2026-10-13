export interface Artist {
  id: string;
  name: string;
  verified: boolean;
  monthlyListeners: number;
  colors: [string, string];
  bio: string;
}

export const artists: Artist[] = [
  { id: "a1", name: "Nova Lune", verified: true, monthlyListeners: 12400000, colors: ["#FF6B4A", "#5AA9FF"], bio: "A velvet-voiced dreamer weaving synth-washed lullabies for late nights. Born in Lisbon, raised on vinyl." },
  { id: "a2", name: "Kairo Beats", verified: true, monthlyListeners: 8900000, colors: ["#F5B83D", "#FF9F1C"], bio: "Sun-soaked percussionist blending tropical rhythms with crisp electronic textures." },
  { id: "a3", name: "Lina Voss", verified: false, monthlyListeners: 4200000, colors: ["#2FAE5F", "#C9F0A8"], bio: "Acoustic storyteller with a voice like warm tea and a pen full of honest lines." },
  { id: "a4", name: "Echo Harbor", verified: true, monthlyListeners: 15600000, colors: ["#4FC3F7", "#FF6B4A"], bio: "Cinematic indie collective building walls of shimmering guitars." },
  { id: "a5", name: "Solstice", verified: false, monthlyListeners: 3100000, colors: ["#F26A0C", "#FFD6A8"], bio: "Lo-fi bedroom producer crafting hazy afternoons into sound." },
  { id: "a6", name: "Mira Ash", verified: true, monthlyListeners: 6700000, colors: ["#E8567A", "#FF8FA3"], bio: "Alt-pop darling turning heartbreak into neon anthems." },
  { id: "a7", name: "Dune Walker", verified: false, monthlyListeners: 2300000, colors: ["#5AA9FF", "#0A2A2B"], bio: "Desert blues guitarist with a cosmic edge." },
  { id: "a8", name: "Pulse Theory", verified: true, monthlyListeners: 11000000, colors: ["#7CF5C8", "#FF6B4A"], bio: "Electronic duo known for bass that you feel in your bones." },
];
