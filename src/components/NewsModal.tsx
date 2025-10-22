"use client";

import { useEffect } from "react";
import { useLanguage } from "./language-provider";
import type { NewsArticle } from "@/types/news";
import { robotoMono } from "@/styles/fonts";

type NewsModalProps = {
  article: NewsArticle | null;
  onClose: () => void;
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

export function NewsModal({ article, onClose }: NewsModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!article) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [article, onClose]);

  if (!article) return null;

  const formattedDate = new Date(article.date).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short"
  });
  const categoryKey = CATEGORY_TRANSLATIONS[article.category] ?? "all";
  const categoryLabel = t(`categories.${categoryKey}`).toUpperCase();
  const rawSummary = article.summary ?? "";
  const paragraphs = rawSummary
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph && paragraph !== "No summary available.");

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-16"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl shadow-black/40 dark:border-[#232323] dark:bg-[#131313]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-modal-title"
      >
        <button
          onClick={onClose}
          className={`${robotoMono.className} absolute right-5 top-5 rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-[#2a2a2a] dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-white dark:focus-visible:ring-zinc-200`}
          aria-label={t("modal.close")}
        >
          {t("modal.close")}
        </button>
        <div className="space-y-6 pr-0 md:pr-24">
          <div className="space-y-3">
            <p
              className={`${robotoMono.className} text-[11px] uppercase tracking-[0.22em] text-zinc-500`}
            >
              {article.source}
            </p>
            <h2
              id="news-modal-title"
              className="text-2xl font-semibold leading-tight text-zinc-900 dark:text-white"
            >
              {article.title}
            </h2>
            <div
              className={`${robotoMono.className} flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.22em] text-zinc-500`}
            >
              <span>
                {t("modal.published")}: {formattedDate}
              </span>
              <span>
                {t("modal.source")}: {article.source}
              </span>
              <span>
                {t("modal.category")}: {categoryLabel}
              </span>
            </div>
          </div>
          {paragraphs.length > 0 && (
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          <div className="flex items-center justify-end border-t border-zinc-200 pt-6 dark:border-[#1f1f1f]">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${robotoMono.className} inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2 text-xs uppercase tracking-[0.26em] text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-400 dark:text-zinc-100 dark:hover:border-zinc-300 dark:hover:text-white`}
            >
              {t("modal.open")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
