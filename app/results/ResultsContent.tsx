"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BoardCard from "@/components/BoardCard";
import type { MatchResult } from "@/lib/types";
import type { Lang } from "@/lib/translations";
import { t } from "@/lib/translations";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get("lang") ?? "en") as Lang;
  const tx = t[lang];

  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalConsidered, setTotalConsidered] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/recommend?${searchParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setResults(data.results);
        setTotalConsidered(data.total_considered);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-blue-500 text-lg animate-pulse font-medium">
          🏔️ Matching boards...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">🏔️ {tx.results_title}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {tx.results_subtitle} · {totalConsidered} boards analyzed
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-700 text-sm border border-slate-200 bg-white rounded-lg px-3 py-1.5 transition hover:border-slate-300 shadow-sm"
          >
            ← {tx.back}
          </button>
        </div>

        {/* User Summary */}
        <UserSummary searchParams={searchParams} lang={lang} />

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center text-slate-400 py-16">{tx.no_results}</div>
        ) : (
          <div className="space-y-4 mt-6">
            {results.map((result, i) => (
              <BoardCard key={result.board.id} result={result} rank={i + 1} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function UserSummary({
  searchParams,
  lang,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
  lang: Lang;
}) {
  const tx = t[lang];
  const height = searchParams.get("height");
  const weight = searchParams.get("weight");
  const budget = searchParams.get("budget");
  const level = searchParams.get("level") ?? "";
  const style = searchParams.get("style") ?? "";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap gap-3 text-sm shadow-sm">
      {height && <Tag label={tx.height} value={`${height} ${tx.cm}`} />}
      {weight && <Tag label={tx.weight} value={`${weight} ${tx.kg}`} />}
      {budget && <Tag label={tx.budget} value={`$${budget}`} />}
      {level && (
        <Tag label={tx.level} value={tx.levels[level as keyof typeof tx.levels] ?? level} />
      )}
      {style && (
        <Tag label={tx.style} value={tx.styles[style as keyof typeof tx.styles] ?? style} />
      )}
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-400">{label}:</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  );
}
