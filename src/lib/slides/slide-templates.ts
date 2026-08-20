export interface SlideTheme {
  id: string;
  name: string;
  bg: string; // hex
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accent2: string;
  accent3: string;
  accent4: string;
  isDark: boolean;
}

export const SLIDE_THEMES: Record<string, SlideTheme> = {
  "nordic-slate": {
    id: "nordic-slate",
    name: "Nordic Slate (Minimalist Indigo)",
    bg: "0F172A", // Slate 900
    cardBg: "1E293B", // Slate 800
    textPrimary: "F8FAFC",
    textMuted: "94A3B8",
    accent: "6366F1", // Indigo
    accent2: "38BDF8", // Sky
    accent3: "34D399", // Emerald
    accent4: "F472B6", // Pink
    isDark: true
  },
  "emerald-corporate": {
    id: "emerald-corporate",
    name: "Emerald Executive (Modern Strategy)",
    bg: "064E3B", // Emerald 900
    cardBg: "065F46", // Emerald 800
    textPrimary: "ECFDF5",
    textMuted: "A7F3D0",
    accent: "34D399", // Emerald 400
    accent2: "FBBF24", // Amber
    accent3: "60A5FA", // Blue
    accent4: "F87171", // Rose
    isDark: true
  },
  "clean-paper": {
    id: "clean-paper",
    name: "Clean Editorial (Light Minimal)",
    bg: "F8FAFC", // Slate 50
    cardBg: "FFFFFF",
    textPrimary: "0F172A",
    textMuted: "64748B",
    accent: "4F46E5", // Indigo 600
    accent2: "0D9488", // Teal 600
    accent3: "EA580C", // Orange 600
    accent4: "7C3AED", // Violet 600
    isDark: false
  },
  "midnight-navy": {
    id: "midnight-navy",
    name: "Midnight Navy (Executive Briefing)",
    bg: "0A192F",
    cardBg: "112240",
    textPrimary: "E6F1FF",
    textMuted: "8892B0",
    accent: "64FFDA", // Cyan/Mint
    accent2: "F7D070", // Gold
    accent3: "FF6B6B", // Coral
    accent4: "9D72FF", // Lavender
    isDark: true
  }
};

export type SlideType = 
  | "title"
  | "swot"
  | "cards-3"
  | "cards-2"
  | "timeline"
  | "metrics"
  | "takeaway";

export interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string;
  badge?: string;
  notes?: string;
  cards?: { title: string; desc: string; tag?: string; highlight?: boolean }[];
  metrics?: { value: string; label: string; change?: string }[];
  timeline?: { step: string; title: string; desc: string }[];
}
