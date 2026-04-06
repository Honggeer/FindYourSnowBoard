// ─── Core Board Types ────────────────────────────────────────────────────────

export type Terrain = "groomed" | "park" | "jib" | "powder" | "backcountry" | "all-mountain";
export type Style = "all-mountain" | "carving" | "groundtrick" | "park";
export type BoardStyle = Style;
export type Level = "beginner" | "intermediate" | "advanced" | "expert";
export type Profile = "camber" | "rocker" | "flat" | "flat-top" | "hybrid-camber" | "hybrid-rocker" | "c2" | "c3-rocker" | "flying-v";
export type Shape = "directional" | "true-twin" | "directional-twin" | "setback-twin" | "twin";
export type Gender = "unisex" | "women";

export interface WaistWidthMap {
  [length: string]: number;
}

export interface Retailer {
  url: string;
  in_stock: boolean;
}

export interface Board {
  id: string;
  name: string;
  brand: string;
  year: number;
  gender: Gender;
  price_usd: number;
  image: string;
  lengths: number[];
  flex: number; // 1–10
  profile: Profile;
  shape: Shape;
  waist_width_mm: WaistWidthMap;
  effective_edge_mm?: Record<string, number>; // per-length effective edge, e.g. {"155": 1180}
  pop?: number; // 1-10 snap/rebound rating (butter/ollie responsiveness)
  terrain: Terrain[];
  style: Style[];
  level: Level[];
  weight_range_kg: { min: number; max: number };
  height_range_cm: { min: number; max: number };
  description_en: string;
  description_zh: string;
  pros_en: string[];
  pros_zh: string[];
  cons_en: string[];
  cons_zh: string[];
  retailers: {
    evo?: Retailer;
    tactics?: Retailer;
    [key: string]: Retailer | undefined;
  };
  seo_tags: string[];
}

// ─── User Filter Input ────────────────────────────────────────────────────────

export interface UserFilters {
  height_cm: number;
  weight_kg: number;
  budget_usd: number;
  terrain: Terrain;
  style: Style;
  level: Level;
  gender: Gender | "any";
  boot_size_us?: number; // for waist width check
  preferred_length?: number; // optional override
}

// ─── Match Result ─────────────────────────────────────────────────────────────

export interface MatchResult {
  board: Board;
  score: number; // 0–100
  recommended_length: number;
  reasons_en: string[];
  reasons_zh: string[];
  warnings_en: string[];
  warnings_zh: string[];
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface RecommendResponse {
  results: MatchResult[];
  total_considered: number;
}
