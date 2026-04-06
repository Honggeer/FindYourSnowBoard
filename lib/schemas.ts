import { z } from "zod";

// ─── Enum Schemas ─────────────────────────────────────────────────────────────

export const TerrainSchema = z.enum(["groomed", "park", "jib", "powder", "backcountry", "all-mountain"]);
export const StyleSchema = z.enum(["all-mountain", "carving", "groundtrick", "park"]);
export const LevelSchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);
export const ProfileSchema = z.enum(["camber", "rocker", "flat", "flat-top", "hybrid-camber", "hybrid-rocker", "c2", "c3-rocker", "flying-v"]);
export const ShapeSchema = z.enum(["directional", "true-twin", "directional-twin", "setback-twin", "twin"]);
export const GenderSchema = z.enum(["unisex", "women"]);

// ─── Board Schema ─────────────────────────────────────────────────────────────

export const RetailerSchema = z.object({
  url: z.string().url(),
  in_stock: z.boolean(),
});

export const BoardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  year: z.number().int(),
  gender: GenderSchema,
  price_usd: z.number().positive(),
  image: z.string(),
  lengths: z.array(z.number().positive()).min(1),
  flex: z.number().min(1).max(10),
  profile: ProfileSchema,
  shape: ShapeSchema,
  waist_width_mm: z.record(z.string(), z.number().positive()),
  terrain: z.array(TerrainSchema).min(1),
  style: z.array(StyleSchema).min(1),
  level: z.array(LevelSchema).min(1),
  weight_range_kg: z.object({ min: z.number().positive(), max: z.number().positive() }),
  height_range_cm: z.object({ min: z.number().positive(), max: z.number().positive() }),
  description_en: z.string().min(1),
  description_zh: z.string().min(1),
  pros_en: z.array(z.string()).min(1),
  pros_zh: z.array(z.string()).min(1),
  cons_en: z.array(z.string()).min(1),
  cons_zh: z.array(z.string()).min(1),
  retailers: z.object({
    evo: RetailerSchema.optional(),
    tactics: RetailerSchema.optional(),
  }).and(z.record(z.string(), RetailerSchema.optional())),
  seo_tags: z.array(z.string()),
});

export const BoardsDataSchema = z.object({
  version: z.string(),
  last_updated: z.string(),
  boards: z.array(BoardSchema).min(1),
});

// ─── Inferred Types (replaces manual interfaces in types.ts) ──────────────────

export type Board = z.infer<typeof BoardSchema>;
export type Terrain = z.infer<typeof TerrainSchema>;
export type Style = z.infer<typeof StyleSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type Retailer = z.infer<typeof RetailerSchema>;
