import type { NewsArticle } from "@/types/news";
import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

type InsightPanelProps = {
  articles: NewsArticle[];
  topVotes: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  selectedDate: string;
  onSelectDate: (value: string) => void;
  availableDates: string[];
  onClearDate: () => void;
};

export function InsightPanel({
  articles,
  topVotes,
  onSelectArticle,
  selectedDate,
  onSelectDate,
  availableDates,
  onClearDate
}: InsightPanelProps) {
  const { t, locale } = useLanguage();

  const topSources = Object.entries(
    articles.reduce<Record<string, number>>((acc, article) => {
      acc[article.source] = (acc[article.source] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const hasCalendar = availableDates.length > 0;

  return (
    <aside className="hidden h-fit rounded-xl border border-zinc-200 bg-white p-4 shadow-inner shadow-black/5 dark:border-[#232323] dark:bg-[#131313] xl:block">
      <section>
        <h3 className={`${robotoMono.className} px-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500`}>
          {t("feed.topSources")}
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {topSources.map(([source, count]) => (
            <li
              key={source}
              className={`${robotoMono.className} flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-600 dark:bg-[#1a1a1a] dark:text-zinc-300`}
            >
              <span className="truncate">{source}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{count}</span>
            </li>
          ))}
          {topSources.length === 0 && (
            <li className={`${robotoMono.className} rounded-lg bg-zinc-100 px-3 py-4 text-xs text-zinc-500 dark:bg-[#1a1a1a] dark:text-zinc-500`}>
              {t("feed.noResults")}
            </li>
          )}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className={`${robotoMono.className} px-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500`}>
          {t("feed.topVotes")}
        </h3>
        <ul className="mt-3 space-y-2">
          {topVotes.map((article, index) => (
            <li
              key={article.link}
              className={`${robotoMono.className} flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-[11px] uppercase tracking-[0.2em] text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-zinc-300 dark:hover:border-zinc-400 dark:hover:text-white`}
            >
              <button
                onClick={() => onSelectArticle(article)}
                className="text-left normal-case text-sm font-semibold text-zinc-900 focus:outline-none dark:text-zinc-100"
              >
                <span className="mr-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {index + 1}.
                </span>
                {article.title}
              </button>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                {new Date(article.date).toLocaleDateString(locale, {
                  dateStyle: "medium"
                })}
              </span>
            </li>
          ))}
          {topVotes.length === 0 && (
            <li className={`${robotoMono.className} rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-3 py-4 text-xs uppercase tracking-[0.2em] text-zinc-400 dark:border-[#2b2b2b] dark:bg-[#1a1a1a] dark:text-zinc-500`}>
              {t("feed.noVotes")}
            </li>
          )}
        </ul>
      </section>

      {hasCalendar && (
        <section className="mt-6">
          <h3 className={`${robotoMono.className} px-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500`}>
            {t("feed.calendarTitle")}
          </h3>
          <div className="mt-3 space-y-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => onSelectDate(event.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition focus:border-zinc-400 focus:outline-none dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-zinc-200"
              aria-label={t("feed.calendarTitle")}
              min={availableDates[availableDates.length - 1]}
              max={availableDates[0]}
            />
            {selectedDate && (
              <button
                onClick={onClearDate}
                className={`${robotoMono.className} w-full rounded-full border border-zinc-300 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-[#2a2a2a] dark:text-zinc-300 dark:hover:border-zinc-400 dark:hover:text-white`}
              >
                {t("feed.clearDate")}
              </button>
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
