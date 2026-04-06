"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, Lang } from "@/lib/translations";
import type { UserFilters, Terrain, Style, Level, Gender } from "@/lib/types";

const TERRAINS: Terrain[] = ["groomed", "powder", "park", "all-mountain"];
const STYLES: Style[] = ["all-mountain", "carving", "groundtrick", "park"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced", "expert"];

const defaultFilters: UserFilters = {
  height_cm: 170,
  weight_kg: 68,
  budget_usd: 600,
  terrain: "all-mountain" as Terrain,
  style: "all-mountain",
  level: "intermediate",
  gender: "any",
};

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const tx = t[lang];

  function selectTerrain(terrain: Terrain) {
    setFilters((prev) => ({ ...prev, terrain }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      height: filters.height_cm.toString(),
      weight: filters.weight_kg.toString(),
      budget: filters.budget_usd.toString(),
      terrain: filters.terrain,
      style: filters.style,
      level: filters.level,
      gender: filters.gender,
      lang,
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            🏔️ {tx.site_name}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">{tx.site_tagline}</p>
        </div>
        <button
          onClick={() => setLang(lang === "en" ? "zh" : "en")}
          className="text-slate-500 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
        >
          {tx.switch_lang}
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 space-y-6 shadow-lg shadow-slate-200/50"
      >
        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-6">
          <SliderField
            label={`${tx.height} (${tx.cm})`}
            value={filters.height_cm}
            min={140}
            max={210}
            step={1}
            unit={tx.cm}
            onChange={(v) => setFilters((p) => ({ ...p, height_cm: v }))}
          />
          <SliderField
            label={`${tx.weight} (${tx.kg})`}
            value={filters.weight_kg}
            min={35}
            max={130}
            step={1}
            unit={tx.kg}
            onChange={(v) => setFilters((p) => ({ ...p, weight_kg: v }))}
          />
        </div>

        {/* Budget */}
        <SliderField
          label={`${tx.budget} (USD)`}
          value={filters.budget_usd}
          min={200}
          max={1000}
          step={25}
          unit="$"
          unitBefore
          onChange={(v) => setFilters((p) => ({ ...p, budget_usd: v }))}
        />

        {/* Terrain (multi-select) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {tx.terrain}
          </label>
          <div className="flex flex-wrap gap-2">
            {TERRAINS.map((terrain) => (
              <button
                key={terrain}
                type="button"
                onClick={() => selectTerrain(terrain)}
                className={`chip px-3 py-1.5 rounded-full text-sm font-medium border ${
                  filters.terrain === terrain
                    ? "chip-active"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {tx.terrains[terrain]}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <SelectField
          label={tx.style}
          value={filters.style}
          options={STYLES.map((s) => ({ value: s, label: tx.styles[s] }))}
          onChange={(v) => setFilters((p) => ({ ...p, style: v as Style }))}
        />

        {/* Level */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {tx.level}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, level }))}
                className={`chip py-2 rounded-lg text-sm font-medium border ${
                  filters.level === level
                    ? "chip-active"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {tx.levels[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {tx.gender}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["any", "unisex", "women"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, gender: g as Gender | "any" }))}
                className={`chip py-2 rounded-lg text-sm font-medium border ${
                  filters.gender === g
                    ? "chip-active"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {tx.genders[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
          >
            {tx.find_board}
          </button>
          <button
            type="button"
            onClick={() => setFilters(defaultFilters)}
            className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 rounded-xl transition text-sm"
          >
            {tx.reset}
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="text-slate-400 text-xs mt-8">
        Built with ❄️ for snowboard lovers
      </p>
    </main>
  );
}

// ─── Reusable Sub-components ──────────────────────────────────────────────────

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  unitBefore = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  unitBefore?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-0.5 rounded-md">
          {unitBefore ? `${unit}${value}` : `${value} ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{unitBefore ? `${unit}${min}` : `${min}`}</span>
        <span>{unitBefore ? `${unit}${max}` : `${max}`}</span>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
