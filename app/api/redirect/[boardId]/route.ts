import { NextRequest, NextResponse } from "next/server";
import boardsData from "@/data/boards.json";
import { BoardsDataSchema } from "@/lib/schemas";

// Your Impact affiliate ID — set in .env
const AFFILIATE_ID = process.env.EVO_AFFILIATE_ID ?? "";

// Build the affiliate URL for EVO (Impact platform format)
function buildAffiliateUrl(baseUrl: string): string {
  if (!AFFILIATE_ID) {
    // No affiliate ID yet — link directly to EVO
    return baseUrl;
  }
  // Impact.com affiliate link format for EVO
  // Update this format once you get your actual affiliate ID from Impact
  const url = new URL(baseUrl);
  url.searchParams.set("irclickid", AFFILIATE_ID);
  url.searchParams.set("utm_source", "findyourownsnowboard");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", "board-recommendation");
  return url.toString();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const { boardId } = params;
  const parsed = BoardsDataSchema.safeParse(boardsData);
  if (!parsed.success) {
    console.error("boards.json validation failed:", parsed.error.flatten());
    return NextResponse.json({ error: "Board data is invalid" }, { status: 500 });
  }
  const board = parsed.data.boards.find((b) => b.id === boardId);

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const evoRetailer = board.retailers.evo;

  if (!evoRetailer?.url) {
    return NextResponse.json({ error: "No retailer URL available" }, { status: 404 });
  }

  // Log click for your own analytics (extend this to your DB later)
  console.log(
    JSON.stringify({
      event: "affiliate_click",
      boardId,
      boardName: `${board.brand} ${board.name}`,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get("referer") ?? "direct",
    })
  );

  const affiliateUrl = buildAffiliateUrl(evoRetailer.url);

  // 302 Temporary Redirect — keeps your URL canonical
  return NextResponse.redirect(affiliateUrl, { status: 302 });
}
