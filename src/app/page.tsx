"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { useLanguage } from "@/components/language-provider";
import type { NewsArticle, NewsState } from "@/types/news";
import { InsightPanel } from "@/components/InsightPanel";
import { NewsModal } from "@/components/NewsModal";
import { robotoMono } from "@/styles/fonts";

const NEWS_STATE_KEY = "notia:news-state";

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsState, setNewsState] = useState<Record<string, NewsState>>({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedState = window.localStorage.getItem(NEWS_STATE_KEY);
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState) as Record<string, any>;
        const cleaned: Record<string, NewsState> = {};
        Object.entries(parsed).forEach(([link, value]) => {
          if (value && typeof value === "object" && "vote" in value) {
            cleaned[link] = { vote: value.vote };
          }
        });
        setNewsState(cleaned);
        window.localStorage.setItem(NEWS_STATE_KEY, JSON.stringify(cleaned));
      } catch {
        setNewsState({});
      }
    }
  }, []);

  useEffect(() => {
    setSelectedArticle(null);
    setVisibleCount(10);
    setSelectedDate("");
  }, [locale]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news?locale=${locale}`, {
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = (await response.json()) as NewsArticle[];
        setNews(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(t("feed.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [locale, t]);

  const handleUpdate = (link: string) => (state: NewsState) => {
    setNewsState((prev) => {
      const next: Record<string, NewsState> = { ...prev };
      if (state.vote) {
        next[link] = { vote: state.vote };
      } else {
        delete next[link];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NEWS_STATE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const filteredNews = useMemo(() => {
    if (!selectedDate) return news;
    return news.filter((article) => {
      const iso = new Date(article.date).toISOString().slice(0, 10);
      return iso === selectedDate;
    });
  }, [news, selectedDate]);

  const visibleNews = useMemo(() => {
    return filteredNews.slice(0, visibleCount);
  }, [filteredNews, visibleCount]);

  const topUpvoted = useMemo(() => {
    const upvotedLinks = Object.entries(newsState)
      .filter(([, value]) => value.vote === "up")
      .map(([link]) => link);

    return filteredNews
      .filter((article) => upvotedLinks.includes(article.link))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3);
  }, [filteredNews, newsState]);

  const availableDates = useMemo(() => {
    return Array.from(
      new Set(
        news.map((article) =>
          new Date(article.date).toISOString().slice(0, 10)
        )
      )
    ).sort((a, b) => (a > b ? -1 : 1));
  }, [news]);

  const structuredData = useMemo(() => {
    const localizedName =
      locale === "es"
        ? "Notia — Noticias de Inteligencia Artificial"
        : "Notia — AI News Dashboard";
    const items = filteredNews.slice(0, 20).map((item) => ({
      "@type": "NewsArticle",
      headline: item.title,
      datePublished: item.date,
      articleSection: item.category,
      url: item.link,
      author: {
        "@type": "Organization",
        name: item.source
      }
    }));

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: localizedName,
      inLanguage: locale,
      description: t("feed.subheading"),
      about: "Artificial intelligence news aggregator",
      hasPart: items
    };
  }, [filteredNews, locale, t]);

  return (
    <div className="pb-16 text-zinc-900 dark:text-zinc-100">
      <section className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[88px] animate-pulse rounded-lg border border-zinc-200 bg-white dark:border-[#1f1f1f] dark:bg-[#131313]"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-red-200 bg-red-100/80 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && filteredNews.length === 0 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-[#1f1f1f] dark:bg-[#131313] dark:text-zinc-400">
                {t("feed.noResults")}
              </div>
            )}

            {!loading && !error && visibleNews.length > 0 && (
              <div className="space-y-3">
                {visibleNews.map((item) => (
                  <NewsCard
                    key={item.link}
                    item={item}
                    state={newsState[item.link]}
                    onUpdate={handleUpdate(item.link)}
                    onOpen={() => setSelectedArticle(item)}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            {!loading && !error && filteredNews.length > visibleCount && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className={`${robotoMono.className} rounded-full border border-zinc-300 px-5 py-2 text-xs uppercase tracking-[0.24em] text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-400 dark:text-zinc-200 dark:hover:border-zinc-300 dark:hover:text-white`}
                >
                  {t("feed.showMore")}
                </button>
              </div>
            )}
          </div>
          <InsightPanel
            articles={filteredNews}
            topVotes={topUpvoted}
            onSelectArticle={(article) => setSelectedArticle(article)}
            selectedDate={selectedDate}
            onSelectDate={(value) => {
              setSelectedDate(value);
              setVisibleCount(10);
            }}
            availableDates={availableDates}
            onClearDate={() => {
              setSelectedDate("");
              setVisibleCount(10);
            }}
          />
        </div>
      </section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
