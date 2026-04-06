import { NextRequest, NextResponse } from "next/server";
import boardsData from "@/data/boards.json";
import { getRecommendations } from "@/lib/matcher";
import { BoardsDataSchema } from "@/lib/schemas";
import type { UserFilters, Terrain, Style, Level, Gender } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse and validate inputs
  const height_cm = Number(searchParams.get("height")) || 170;
  const weight_kg = Number(searchParams.get("weight")) || 68;
  const budget_usd = Number(searchParams.get("budget")) || 600;
  const terrain = (searchParams.get("terrain") ?? "all-mountain") as Terrain;
  const style = (searchParams.get("style") ?? "all-mountain") as Style;
  const level = (searchParams.get("level") ?? "intermediate") as Level;
  const gender = (searchParams.get("gender") ?? "any") as Gender | "any";

  const filters: UserFilters = {
    height_cm,
    weight_kg,
    budget_usd,
    terrain,
    style,
    level,
    gender,
  };

  try {
    const parsed = BoardsDataSchema.safeParse(boardsData);
    if (!parsed.success) {
      console.error("boards.json validation failed:", parsed.error.flatten());
      return NextResponse.json({ error: "Board data is invalid" }, { status: 500 });
    }
    const boards = parsed.data.boards;
    const { results, total_considered } = getRecommendations(boards, filters, 5);

    return NextResponse.json(
      { results, total_considered },
      {
        headers: {
          // Cache for 1 hour — data doesn't change often
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
