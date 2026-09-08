"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import {
  SITES,
  REGION_LABEL,
  CATEGORY_LABEL,
  type Region,
  type SiteCategory,
} from "@/content/heritage";
import { ShellNav } from "@/components/shell/ShellNav";

export function ExplorePage() {
  const lang = useGame((s) => s.lang);
  const [region, setRegion] = useState<Region | "all">("all");
  const [cat, setCat] = useState<SiteCategory | "all">("all");

  const list = SITES.filter(
    (s) =>
      (region === "all" || s.region === region) &&
      (cat === "all" || s.categories.includes(cat)),
  );

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[1180px] px-6 py-10">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
          {lang === "hi" ? "भारत की खोज" : "Discover India"}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          {lang === "hi" ? "विरासत स्थल" : "Heritage sites"}
        </h1>

        <div className="mt-6 space-y-3">
          <FilterRow
            label={lang === "hi" ? "क्षेत्र" : "Region"}
            value={region}
            onChange={(v) => setRegion(v as Region | "all")}
            options={[
              ["all", lang === "hi" ? "सभी" : "All"],
              ...(Object.keys(REGION_LABEL) as Region[]).map(
                (r) => [r, REGION_LABEL[r][lang]] as [string, string],
              ),
            ]}
          />
          <FilterRow
            label={lang === "hi" ? "श्रेणी" : "Category"}
            value={cat}
            onChange={(v) => setCat(v as SiteCategory | "all")}
            options={[
              ["all", lang === "hi" ? "सभी" : "All"],
              ...(Object.keys(CATEGORY_LABEL) as SiteCategory[]).map(
                (c) => [c, CATEGORY_LABEL[c][lang]] as [string, string],
              ),
            ]}
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((site) => (
            <Link
              key={site.id}
              href={`/site/${site.id}`}
              className="group block border border-stone-deep/25 bg-sandstone/40 p-5 transition-colors hover:border-hingula/50"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-10" style={{ background: site.accent }} />
                <span
                  className={clsx(
                    "font-body text-[10px] uppercase tracking-wide",
                    site.verification === "verified"
                      ? "text-terreverte"
                      : site.verification === "curated"
                        ? "text-stone-deep"
                        : "text-hingula",
                  )}
                >
                  {site.verification}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl text-ink">{site.name[lang]}</h3>
              <p className="font-body text-xs italic text-stone-deep">
                {site.state} · {site.period}
              </p>
              <p className="mt-2 line-clamp-4 font-body text-[13px] leading-snug text-ink-soft">
                {site.summary[lang]}
              </p>
              <p className="mt-3 font-body text-[11px] uppercase tracking-wide text-hingula">
                {site.games.length} {lang === "hi" ? "खेल" : "games"} →
              </p>
            </Link>
          ))}
          {list.length === 0 && (
            <p className="font-body text-sm text-stone-deep">
              {lang === "hi" ? "इस चयन में कोई स्थल नहीं।" : "No sites in this selection yet."}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 font-body text-[11px] uppercase tracking-widest text-stone-deep">
        {label}
      </span>
      {options.map(([v, l]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={clsx(
            "border px-2.5 py-1 font-display text-[12px] transition-colors",
            value === v
              ? "border-hingula bg-hingula/10 text-ink"
              : "border-stone-deep/30 text-ink-soft hover:text-ink",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
