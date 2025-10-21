"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "./language-provider";
import type { NewsArticle } from "@/types/news";
import { robotoMono } from "@/styles/fonts";

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
      className={`group relative overflow-hidden rounded-lg border border-[#1f2532] bg-[#141923] p-5 transition hover:border-[#3b82f6]/60 ${
        state.read ? "opacity-70" : ""
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <header className="mb-4 flex flex-col gap-3">
        <div
          className={`${robotoMono.className} flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-zinc-500`}
        >
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
            className="line-clamp-2 text-[17px] font-semibold leading-tight text-white transition group-hover:text-[#3b82f6]"
          >
            {item.title}
          </Link>
          <span
            className={`${robotoMono.className} w-fit rounded-full bg-[#1f2532] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-300`}
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
        <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-zinc-400">
          {item.summary.length > 220
            ? `${item.summary.slice(0, 220)}…`
            : item.summary}
        </p>
      )}
      <footer
        className={`${robotoMono.className} mt-auto flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-zinc-500`}
      >
        <button
          onClick={() =>
            onUpdate({
              ...state,
              vote: state.vote === "up" ? undefined : "up"
            })
          }
          className={`flex items-center gap-2 rounded-full border border-[#1f2532] px-4 py-1.5 transition hover:border-[#3b82f6] hover:text-[#3b82f6] ${
            state.vote === "up" ? "border-[#3b82f6] text-[#3b82f6]" : ""
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
          className={`flex items-center gap-2 rounded-full border border-[#1f2532] px-4 py-1.5 transition hover:border-[#3b82f6] hover:text-[#3b82f6] ${
            state.vote === "down" ? "border-[#3b82f6]/70 text-[#3b82f6]" : ""
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
          className={`flex items-center gap-2 rounded-full border border-[#1f2532] px-4 py-1.5 transition hover:border-[#3b82f6] hover:text-[#3b82f6] ${
            state.saved ? "border-[#22c55e] text-[#22c55e]" : ""
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
          className={`ml-auto flex items-center gap-2 rounded-full border border-[#1f2532] px-4 py-1.5 transition hover:border-[#3b82f6] hover:text-[#3b82f6] ${
            state.read ? "border-[#2f3645] text-zinc-300" : ""
          }`}
        >
          👁️ {t("actions.read")}
        </button>
      </footer>
    </article>
  );
}
