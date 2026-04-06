"use client";

import type { MatchResult } from "@/lib/types";
import type { Lang } from "@/lib/translations";
import { t } from "@/lib/translations";

const PROFILE_EMOJI: Record<string, string> = {
  camber: "⌒",
  rocker: "∪",
  flat: "—",
  "flat-top": "—",
  "hybrid-camber": "⌒∪",
  "hybrid-rocker": "∪⌒",
  c2: "⌒",
  "c3-rocker": "∪⌒",
  "flying-v": "∪⌒∪",
};

function FlexBar({ flex }: { flex: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-sm ${
              i < flex ? "bg-blue-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">{flex}/10</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-orange-500";
  const bg =
    score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : "bg-orange-50";
  return (
    <div className={`${bg} rounded-xl px-3 py-2 text-center`}>
      <div className={`text-2xl font-extrabold ${color}`}>
        {score}
        <span className="text-sm font-normal text-slate-400">%</span>
      </div>
      <div className="text-[10px] text-slate-400 font-medium">MATCH</div>
    </div>
  );
}

interface BoardCardProps {
  result: MatchResult;
  rank: number;
  lang: Lang;
}

export default function BoardCard({ result, rank, lang }: BoardCardProps) {
  const { board, score, recommended_length, reasons_en, reasons_zh, warnings_en, warnings_zh } =
    result;
  const tx = t[lang];
  const reasons = lang === "zh" ? reasons_zh : reasons_en;
  const warnings = lang === "zh" ? warnings_zh : warnings_en;
  const description = lang === "zh" ? board.description_zh : board.description_en;
  const pros = lang === "zh" ? board.pros_zh : board.pros_en;

  const evoUrl = board.retailers.evo?.url;

  const rankBadge =
    rank === 1
      ? "bg-amber-400 text-white"
      : rank === 2
      ? "bg-slate-400 text-white"
      : rank === 3
      ? "bg-amber-600 text-white"
      : "bg-slate-200 text-slate-500";

  return (
    <div className="board-card bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadge}`}>
            {rank}
          </span>
          <div>
            <h3 className="text-slate-800 font-bold text-lg leading-tight">
              {board.brand} {board.name}
            </h3>
            <p className="text-slate-400 text-sm">{board.year}</p>
          </div>
        </div>
        <ScoreRing score={score} />
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{description}</p>

      {/* Specs grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <SpecItem label={tx.flex}>
          <FlexBar flex={board.flex} />
        </SpecItem>
        <SpecItem label={tx.profile}>
          <span className="text-slate-700 font-medium">
            {PROFILE_EMOJI[board.profile] ?? ""} {board.profile}
          </span>
        </SpecItem>
        <SpecItem label={tx.recommended_length}>
          <span className="text-slate-700 font-semibold">{recommended_length} cm</span>
        </SpecItem>
        <SpecItem label={tx.price}>
          <span className="text-slate-700 font-semibold">${board.price_usd}</span>
        </SpecItem>
      </div>

      {/* Pros */}
      {pros.length > 0 && (
        <div className="mb-3">
          <ul className="space-y-1">
            {pros.map((pro, i) => (
              <li key={i} className="text-emerald-600 text-xs flex items-start gap-1.5">
                <span className="mt-0.5">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Why it matches */}
      {reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-blue-500 mb-1">{tx.why_match}</p>
          <ul className="space-y-0.5">
            {reasons.map((r, i) => (
              <li key={i} className="text-slate-600 text-xs flex items-start gap-1.5">
                <span className="text-blue-400 mt-0.5">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-500 mb-1">{tx.watch_out}</p>
          <ul className="space-y-0.5">
            {warnings.map((w, i) => (
              <li key={i} className="text-amber-600 text-xs flex items-start gap-1.5">
                <span className="mt-0.5">⚠</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      {evoUrl && (
        <a
          href={`/api/redirect/${board.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-md shadow-blue-500/20 hover:shadow-lg"
        >
          {tx.buy_on_evo} →
        </a>
      )}
    </div>
  );
}

function SpecItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {children}
    </div>
  );
}
