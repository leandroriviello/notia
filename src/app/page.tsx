"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryMenu } from "@/components/CategoryMenu";
import { NewsCard, NewsState } from "@/components/NewsCard";
import { useLanguage } from "@/components/language-provider";
import { feedSources, type FeedCategory } from "@/data/sources";
import type { NewsArticle } from "@/types/news";

type CategoryFilter = "all" | FeedCategory;

const NEWS_STATE_KEY = "notia:news-state";
const SOURCE_PREF_KEY = "notia:sources";

export default function HomePage() {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [newsState, setNewsState] = useState<Record<string, NewsState>>({});
  const [activeSources, setActiveSources] = useState<string[] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedState = window.localStorage.getItem(NEWS_STATE_KEY);
    if (storedState) {
      try {
        setNewsState(JSON.parse(storedState));
      } catch {
        setNewsState({});
      }
    }

    const storedSources = window.localStorage.getItem(SOURCE_PREF_KEY);
    if (storedSources) {
      try {
        setActiveSources(JSON.parse(storedSources));
      } catch {
        setActiveSources(null);
      }
    } else {
      setActiveSources(feedSources.map((source) => source.label));
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news", { cache: "no-store" });
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
  }, [t]);

  const handleUpdate = (link: string) => (state: NewsState) => {
    setNewsState((prev) => {
      const next = { ...prev, [link]: state };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NEWS_STATE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const filteredNews = useMemo(() => {
    return news
      .filter((item) => {
        if (!activeSources || activeSources.length === 0) return true;
        return activeSources.includes(item.source);
      })
      .filter((item) => {
        if (category === "all") return true;
        return item.category === category;
      });
  }, [news, activeSources, category]);

  return (
    <div className="pb-16 text-zinc-900 dark:text-zinc-100">
      <CategoryMenu
        active={category}
        onSelect={(categoryValue) =>
          setCategory(categoryValue as CategoryFilter)
        }
      />
      <section className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-900 dark:bg-zinc-900/60"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/60 bg-red-500/10 p-6 text-sm text-red-600 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            {t("feed.noResults")}
          </div>
        )}

        {!loading && !error && filteredNews.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.link}
                item={item}
                state={
                  newsState[item.link] ?? {
                    read: false,
                    saved: false
                  }
                }
                onUpdate={handleUpdate(item.link)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
