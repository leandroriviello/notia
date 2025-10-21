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

export function NewsCard({ item, state, onUpdate }: NewsCardProps) {
  const { t } = useLanguage();

  const formattedDate = useMemo(() => {
    const parsed = new Date(item.date);
    return parsed.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }, [item.date]);

  return (
    <article
      className={`flex flex-col rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm transition hover:border-brand/60 dark:border-zinc-900 dark:bg-zinc-900/80 ${
        state.read ? "opacity-70" : ""
      }`}
    >
      <header className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500">
          <span>{item.source}</span>
          <time dateTime={item.date}>{formattedDate}</time>
        </div>
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-semibold text-zinc-900 transition hover:text-brand dark:text-zinc-100"
        >
          {item.title}
        </Link>
      </header>
      {item.summary && (
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {item.summary.length > 260
            ? `${item.summary.slice(0, 260)}…`
            : item.summary}
        </p>
      )}
      <footer className="mt-auto flex flex-wrap items-center gap-3 text-sm">
        <button
          onClick={() =>
            onUpdate({
              ...state,
              vote: state.vote === "up" ? undefined : "up"
            })
          }
          className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
            state.vote === "up"
              ? "border-brand bg-brand/20 text-brand"
              : "border-zinc-300 text-zinc-600 hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
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
          className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
            state.vote === "down"
              ? "border-zinc-400 bg-zinc-200 text-zinc-600 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
              : "border-zinc-300 text-zinc-600 hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
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
          className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
            state.saved
              ? "border-brand-accent bg-brand-accent/20 text-brand-accent"
              : "border-zinc-300 text-zinc-600 hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
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
          className={`ml-auto flex items-center gap-2 rounded-full border px-3 py-1 transition ${
            state.read
              ? "border-zinc-400 bg-zinc-200 text-zinc-600 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
              : "border-zinc-300 text-zinc-600 hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          👁️ {t("actions.read")}
        </button>
      </footer>
    </article>
  );
}
