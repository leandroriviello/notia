import type { NewsArticle } from "@/types/news";
import { useLanguage } from "./language-provider";

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
    <aside className="hidden h-fit rounded-2xl border border-zinc-800/60 bg-zinc-950/70 p-4 shadow-md shadow-black/10 backdrop-blur xl:block">
      <section>
        <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          {t("feed.topSources")}
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {topSources.map(([source, count]) => (
            <li
              key={source}
              className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-3 py-2"
            >
              <span className="truncate">{source}</span>
              <span className="text-xs text-zinc-500">{count}</span>
            </li>
          ))}
          {topSources.length === 0 && (
            <li className="rounded-xl bg-zinc-900/40 px-3 py-4 text-xs text-zinc-500">
              {t("feed.noResults")}
            </li>
          )}
        </ul>
      </section>
      <section className="mt-6">
        <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          {t("actions.save")}
        </h3>
        <p className="mt-3 rounded-xl border border-dashed border-zinc-800 px-3 py-4 text-xs text-zinc-500">
          {t("feed.insightPlaceholder")}
        </p>
      </section>
    </aside>
  );
}
