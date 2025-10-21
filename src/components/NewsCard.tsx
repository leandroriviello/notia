"use client";

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
  onOpen: () => void;
  locale: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  Research: "#e5e7eb",
  Products: "#e5e7eb",
  Business: "#e5e7eb",
  Regulation: "#e5e7eb",
  Tools: "#e5e7eb",
  Papers: "#e5e7eb",
  Social: "#e5e7eb"
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

  const accent = CATEGORY_COLORS[item.category] ?? "#e5e7eb";
  const categoryKey = CATEGORY_TRANSLATIONS[item.category] ?? "all";
  const categoryLabel = t(`categories.${categoryKey}`).toUpperCase();
  const summaryPreview = useMemo(() => {
    return item.summary.replace(/\s+/g, " ").trim();
  }, [item.summary]);

  return (
    <article
      className={`group relative overflow-hidden rounded-lg border border-[#1f1f1f] bg-[#161616] p-5 transition hover:border-zinc-400 ${
        state.read ? "opacity-70" : ""
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      <meta itemProp="datePublished" content={item.date} />
      <meta itemProp="inLanguage" content={locale} />
      <meta itemProp="url" content={item.link} />
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
          <button
            type="button"
            onClick={onOpen}
            className="line-clamp-2 cursor-pointer text-left text-[17px] font-semibold leading-tight text-white transition hover:text-zinc-100 focus:outline-none"
            itemProp="headline"
          >
            {item.title}
          </button>
          <span
            className={`${robotoMono.className} w-fit rounded-full bg-[#1a1a1a] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-300`}
            style={{
              color: accent,
              backgroundColor: `${accent}20`
            }}
          >
            {categoryLabel}
          </span>
        </div>
      </header>
      {summaryPreview && summaryPreview !== "No summary available." && (
        <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-zinc-400" itemProp="description">
          {summaryPreview.length > 220
            ? `${summaryPreview.slice(0, 220)}…`
            : summaryPreview}
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
          className={`flex items-center gap-2 rounded-full border border-[#1f1f1f] px-4 py-1.5 transition hover:border-zinc-300 hover:text-zinc-100 ${
            state.vote === "up" ? "border-zinc-300 text-zinc-100" : ""
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
          className={`flex items-center gap-2 rounded-full border border-[#1f1f1f] px-4 py-1.5 transition hover:border-zinc-300 hover:text-zinc-100 ${
            state.vote === "down" ? "border-zinc-300 text-zinc-100" : ""
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
          className={`flex items-center gap-2 rounded-full border border-[#1f1f1f] px-4 py-1.5 transition hover:border-zinc-300 hover:text-zinc-100 ${
            state.saved ? "border-zinc-300 text-zinc-100" : ""
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
          className={`ml-auto flex items-center gap-2 rounded-full border border-[#1f1f1f] px-4 py-1.5 transition hover:border-zinc-300 hover:text-zinc-100 ${
            state.read ? "border-zinc-400 text-zinc-300" : ""
          }`}
        >
          👁️ {t("actions.read")}
        </button>
      </footer>
    </article>
  );
}
