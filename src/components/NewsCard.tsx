"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "./language-provider";
import type { NewsArticle } from "@/types/news";

export type NewsState = {
  read: boolean;
  saved: boolean;
  vote?: "up" | "down";
};

type NewsCardProps = {
  item: NewsArticle;
  state: NewsState;
  onUpdate: (state: NewsState) => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  Research: "#22d3ee",
  Products: "#34d399",
  Business: "#fcd34d",
  Regulation: "#f87171",
  Tools: "#a855f7",
  Papers: "#60a5fa",
  Social: "#f472b6"
};

export function NewsCard({ item, state, onUpdate }: NewsCardProps) {
  const { t } = useLanguage();

  const formattedDate = useMemo(() => {
    const parsed = new Date(item.date);
    return parsed.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }, [item.date]);

  const accent = CATEGORY_COLORS[item.category] ?? "#3B82F6";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-zinc-900 bg-[#10151f]/90 p-5 shadow-md shadow-black/20 transition hover:border-brand/60 ${
        state.read ? "opacity-70" : ""
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <header className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-zinc-500">
          <span className="truncate">{item.source}</span>
          <time dateTime={item.date} className="whitespace-nowrap">
            {formattedDate}
          </time>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 text-lg font-semibold text-white transition group-hover:text-brand"
          >
            {item.title}
          </Link>
          <span
            className="w-fit rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300"
            style={{
              color: accent,
              backgroundColor: `${accent}20`
            }}
          >
            {item.category}
          </span>
        </div>
      </header>
      {item.summary && (
        <p className="mb-6 text-sm text-zinc-400">
          {item.summary.length > 240
            ? `${item.summary.slice(0, 240)}…`
            : item.summary}
        </p>
      )}
      <footer className="mt-auto flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
        <button
          onClick={() =>
            onUpdate({
              ...state,
              vote: state.vote === "up" ? undefined : "up"
            })
          }
          className={`flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 transition hover:border-brand hover:text-brand ${
            state.vote === "up" ? "border-brand text-brand" : ""
          }`}
        >
          👍 {t("actions.interesting")}
        </button>
        <button
          onClick={() =>
            onUpdate({
              ...state,
              vote: state.vote === "down" ? undefined : "down"
            })
          }
          className={`flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 transition hover:border-brand hover:text-brand ${
            state.vote === "down" ? "border-brand/60 text-brand" : ""
          }`}
        >
          👎 {t("actions.irrelevant")}
        </button>
        <button
          onClick={() =>
            onUpdate({
              ...state,
              saved: !state.saved
            })
          }
          className={`flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 transition hover:border-brand hover:text-brand ${
            state.saved ? "border-brand-accent/80 text-brand-accent" : ""
          }`}
        >
          ⭐ {state.saved ? t("actions.saved") : t("actions.save")}
        </button>
        <button
          onClick={() =>
            onUpdate({
              ...state,
              read: !state.read
            })
          }
          className={`ml-auto flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 transition hover:border-brand hover:text-brand ${
            state.read ? "border-zinc-600 text-zinc-300" : ""
          }`}
        >
          👁️ {t("actions.read")}
        </button>
      </footer>
    </article>
  );
}
