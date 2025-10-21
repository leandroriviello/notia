import type { NewsArticle } from "@/types/news";
import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

type InsightPanelProps = {
  articles: NewsArticle[];
};

export function InsightPanel({ articles }: InsightPanelProps) {
  const { t } = useLanguage();

  const topSources = Object.entries(
    articles.reduce<Record<string, number>>((acc, article) => {
      acc[article.source] = (acc[article.source] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <aside className="hidden h-fit rounded-xl border border-[#242b37] bg-[#161b22] p-4 shadow-inner shadow-black/20 xl:block">
      <section>
        <h3 className={`${robotoMono.className} px-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500`}>
          {t("feed.topSources")}
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {topSources.map(([source, count]) => (
            <li
              key={source}
              className={`${robotoMono.className} flex items-center justify-between rounded-lg bg-[#1b2130] px-3 py-2 text-[11px] uppercase tracking-[0.2em]`}
            >
              <span className="truncate">{source}</span>
              <span className="text-xs text-zinc-500">{count}</span>
            </li>
          ))}
          {topSources.length === 0 && (
            <li className={`${robotoMono.className} rounded-lg bg-[#1b2130] px-3 py-4 text-xs text-zinc-500`}>
              {t("feed.noResults")}
            </li>
          )}
        </ul>
      </section>
      <section className="mt-6">
        <h3 className={`${robotoMono.className} px-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500`}>
          {t("actions.save")}
        </h3>
        <p className={`${robotoMono.className} mt-3 rounded-lg border border-dashed border-[#2a303d] px-3 py-4 text-xs uppercase tracking-[0.2em] text-zinc-500`}>
          {t("feed.insightPlaceholder")}
        </p>
      </section>
    </aside>
  );
}
