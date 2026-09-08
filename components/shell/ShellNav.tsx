"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const ITEMS: { href: string; en: string; hi: string }[] = [
  { href: "/explore", en: "Explore", hi: "खोजें" },
  { href: "/games", en: "Games", hi: "खेल" },
  { href: "/map", en: "Map", hi: "मानचित्र" },
  { href: "/passport", en: "Passport", hi: "पासपोर्ट" },
];

export function ShellNav() {
  const path = usePathname();
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const rating = useGame((s) => s.rating);
  const xp = useGame((s) => s.xp);
  const hydrated = useHydrated();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-deep/25 bg-sandstone/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-4 py-2.5">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-ink hover:text-hingula"
        >
          BHARATVERSE
        </Link>
        <nav className="ml-3 hidden gap-1 sm:flex">
          {ITEMS.map((it) => {
            const active = path === it.href || path.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={clsx(
                  "px-2.5 py-1 font-display text-[13px] tracking-wide transition-colors",
                  active
                    ? "text-hingula"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {lang === "hi" ? it.hi : it.en}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {hydrated && (
            <span className="hidden border border-stone-deep/30 px-2 py-1 font-body text-[11px] text-stone-deep sm:inline">
              {rating} · {xp} XP
            </span>
          )}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="border border-stone-deep/30 px-2 py-1 font-display text-xs text-ink-soft hover:text-ink"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
        </div>
      </div>
      {/* mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-stone-deep/20 px-3 py-1.5 sm:hidden">
        {ITEMS.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "shrink-0 px-2.5 py-1 font-display text-[13px]",
                active ? "text-hingula" : "text-ink-soft",
              )}
            >
              {lang === "hi" ? it.hi : it.en}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
