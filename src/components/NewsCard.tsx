"use client";

import { useMemo } from "react";
import { useLanguage } from "./language-provider";
import type { NewsArticle, NewsState } from "@/types/news";
import { robotoMono } from "@/styles/fonts";

type NewsCardProps = {
  item: NewsArticle;
  state: NewsState | undefined;
  onUpdate: (state: NewsState) => void;
  onOpen: () => void;
  locale: string;
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Research: "research",
  Products: "products",
  Business: "business",
  Regulation: "regulation",
  Tools: "tools",
  Papers: "papers",
  Social: "social"
};

export function NewsCard({ item, state, onUpdate, onOpen, locale }: NewsCardProps) {
  const { t } = useLanguage();

  const formattedDate = useMemo(() => {
    const parsed = new Date(item.date);
    return parsed.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }, [item.date]);

  const categoryKey = CATEGORY_TRANSLATIONS[item.category] ?? "all";
  const categoryLabel = t(`categories.${categoryKey}`).toUpperCase();
  const summaryPreview = useMemo(() => item.summary.replace(/\s+/g, " ").trim(), [item.summary]);
  const vote = state?.vote;

  return (
    <article
      className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-[#1f1f1f] dark:bg-[#161616] dark:hover:border-zinc-400"
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      <meta itemProp="datePublished" content={item.date} />
      <meta itemProp="inLanguage" content={locale} />
      <meta itemProp="url" content={item.link} />
      <header className="mb-4 flex flex-col gap-3">
        <div
          className={`${robotoMono.className} flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-500`}
        >
          <span className="truncate">{item.source}</span>
          <time dateTime={item.date} className="whitespace-nowrap">
            {formattedDate}
          </time>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="line-clamp-2 cursor-pointer text-left text-[17px] font-semibold leading-tight text-zinc-900 transition hover:text-zinc-700 focus:outline-none dark:text-white dark:hover:text-zinc-100"
            itemProp="headline"
          >
            {item.title}
          </button>
          <span
            className={`${robotoMono.className} w-fit rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600 dark:bg-[#1a1a1a] dark:text-zinc-300`}
          >
            {categoryLabel}
          </span>
        </div>
      </header>
      {summaryPreview && summaryPreview !== "No summary available." && (
        <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400" itemProp="description">
          {summaryPreview.length > 220 ? `${summaryPreview.slice(0, 220)}…` : summaryPreview}
        </p>
      )}
      <footer
        className={`${robotoMono.className} mt-auto flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-zinc-500`}
      >
        <button
          onClick={() => onUpdate({ vote: vote === "up" ? undefined : "up" })}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-200 ${
            vote === "up"
              ? "border-zinc-500 text-zinc-900 dark:border-zinc-300 dark:text-zinc-100"
              : "border-zinc-300 text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 dark:border-[#1f1f1f] dark:hover:border-zinc-300 dark:hover:text-zinc-100"
          }`}
        >
          👍 {t("actions.interesting")}
        </button>
        <button
          onClick={() => onUpdate({ vote: vote === "down" ? undefined : "down" })}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-200 ${
            vote === "down"
              ? "border-zinc-500 text-zinc-900 dark:border-zinc-300 dark:text-zinc-100"
              : "border-zinc-300 text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 dark:border-[#1f1f1f] dark:hover:border-zinc-300 dark:hover:text-zinc-100"
          }`}
        >
          👎 {t("actions.irrelevant")}
        </button>
      </footer>
    </article>
  );
}
