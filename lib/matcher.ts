import type { Board, UserFilters, MatchResult } from "./types";

// ─── Scoring Weights (total = 100) ───────────────────────────────────────────
const WEIGHTS = {
  weight_range: 25,
  level: 20,
  terrain: 15,
  style: 20,
  budget: 10,
  gender: 5,
  in_stock: 5,
};

function closestLength(available: number[], target: number): number {
  return available.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

// ─── Recommend Board Length ──────────────────────────────────────────────────
export function recommendLength(board: Board, filters: UserFilters): number {
  let base = filters.height_cm - 14;

  if (filters.style === "groundtrick" || filters.style === "park") base -= 2;
  else if (filters.style === "carving") base += 2;

  if (filters.weight_kg >= 95) base += 4;
  else if (filters.weight_kg >= 80) base += 2;
  else if (filters.weight_kg >= 50) base += 0;
  else base -= 3;

  if (filters.level === "beginner") base -= 1;
  if (filters.level === "expert") base += 1;

  return closestLength(board.lengths, filters.preferred_length ?? base);
}

// ─── Score a Single Board ────────────────────────────────────────────────────
export function scoreBoard(board: Board, filters: UserFilters): MatchResult {
  let score = 0;
  const reasons_en: string[] = [];
  const reasons_zh: string[] = [];
  const warnings_en: string[] = [];
  const warnings_zh: string[] = [];

  // 1. Weight range (25 pts)
  const { min: wMin, max: wMax } = board.weight_range_kg;
  if (filters.weight_kg >= wMin && filters.weight_kg <= wMax) {
    score += WEIGHTS.weight_range;
    reasons_en.push("Your weight is within the ideal range");
    reasons_zh.push("体重在理想范围内");
  } else if (filters.weight_kg < wMin) {
    score += WEIGHTS.weight_range * 0.3;
    warnings_en.push(`You may be light for this board (ideal: ${wMin}–${wMax} kg)`);
    warnings_zh.push(`体重偏轻（推荐 ${wMin}–${wMax} kg）`);
  } else {
    score += WEIGHTS.weight_range * 0.2;
    warnings_en.push(`You may be heavy for this board (ideal: ${wMin}–${wMax} kg)`);
    warnings_zh.push(`体重偏重（推荐 ${wMin}–${wMax} kg）`);
  }

  // 2. Skill level (20 pts)
  if (board.level.includes(filters.level)) {
    score += WEIGHTS.level;
    reasons_en.push(`Designed for ${filters.level} riders`);
    reasons_zh.push(`适合${LEVEL_ZH[filters.level]}骑手`);
  } else {
    const order = ["beginner", "intermediate", "advanced", "expert"];
    const ui = order.indexOf(filters.level);
    const bMin = Math.min(...board.level.map((l) => order.indexOf(l)));
    const bMax = Math.max(...board.level.map((l) => order.indexOf(l)));
    const gap = Math.min(Math.abs(ui - bMin), Math.abs(ui - bMax));
    if (gap === 1) {
      score += WEIGHTS.level * 0.4;
      if (ui < bMin) { warnings_en.push("May be too advanced for you"); warnings_zh.push("可能超出你目前水平"); }
      else { warnings_en.push("You may outgrow this board soon"); warnings_zh.push("你可能很快会超越这块板"); }
    }
  }

  // 3. Terrain (15 pts)
  if (filters.terrain === "all-mountain") {
    if (board.terrain.includes("all-mountain")) { score += WEIGHTS.terrain; reasons_en.push("Versatile all-mountain board"); reasons_zh.push("全能型全山板"); }
    else { score += WEIGHTS.terrain * 0.5; }
  } else {
    if (board.terrain.includes(filters.terrain)) { score += WEIGHTS.terrain; reasons_en.push("Good terrain match"); reasons_zh.push("地形匹配"); }
    else if (board.terrain.includes("all-mountain")) { score += WEIGHTS.terrain * 0.5; }
    else { score += WEIGHTS.terrain * 0.1; }
  }

  // 4. Style (20 pts) — direct tag match
  if (board.style.includes(filters.style)) {
    score += WEIGHTS.style;
    reasons_en.push(`Tagged for ${STYLE_EN[filters.style]}`);
    reasons_zh.push(`适合${STYLE_ZH[filters.style]}`);
  } else if (filters.style === "all-mountain" && board.style.length >= 2) {
    score += WEIGHTS.style * 0.6;
    reasons_en.push("Multi-style board — decent versatility");
    reasons_zh.push("多风格板，有一定全能性");
  } else if (board.style.includes("all-mountain")) {
    score += WEIGHTS.style * 0.4;
  } else {
    score += WEIGHTS.style * 0.1;
  }

  // 5. Budget (10 pts)
  if (board.price_usd <= filters.budget_usd) {
    score += WEIGHTS.budget;
    reasons_en.push("Within your budget");
    reasons_zh.push("在预算内");
  } else if (board.price_usd <= filters.budget_usd * 1.15) {
    score += WEIGHTS.budget * 0.5;
    warnings_en.push(`Over budget by $${board.price_usd - filters.budget_usd}`);
    warnings_zh.push(`超预算 $${board.price_usd - filters.budget_usd}`);
  }

  // 6. Gender (5 pts)
  if (board.gender === "unisex" || board.gender === filters.gender || filters.gender === "any") {
    score += WEIGHTS.gender;
  } else {
    score *= 0.7;
    warnings_en.push("Gender mismatch");
    warnings_zh.push("性别款式不符");
  }

  // 7. In-stock (5 pts)
  if (board.retailers.evo?.in_stock) {
    score += WEIGHTS.in_stock;
  } else {
    warnings_en.push("May be out of stock");
    warnings_zh.push("可能缺货");
  }

  return {
    board,
    score: Math.round(Math.min(score, 100)),
    recommended_length: recommendLength(board, filters),
    reasons_en,
    reasons_zh,
    warnings_en,
    warnings_zh,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function getRecommendations(
  boards: Board[],
  filters: UserFilters,
  topN = 5
): { results: MatchResult[]; total_considered: number } {
  const scored = boards
    .map((board) => scoreBoard(board, filters))
    .sort((a, b) => b.score - a.score);
  return { results: scored.slice(0, topN), total_considered: boards.length };
}

// ─── Labels ──────────────────────────────────────────────────────────────────
const LEVEL_ZH: Record<string, string> = { beginner: "初学者", intermediate: "中级", advanced: "高级", expert: "专家" };
const STYLE_EN: Record<string, string> = { "all-mountain": "all-mountain", carving: "carving", groundtrick: "ground tricks", park: "park/jib" };
const STYLE_ZH: Record<string, string> = { "all-mountain": "全山滑行", carving: "刻滑", groundtrick: "平花", park: "公园/道具" };
