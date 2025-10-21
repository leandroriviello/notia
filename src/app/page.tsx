"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryMenu } from "@/components/CategoryMenu";
import { NewsCard, NewsState } from "@/components/NewsCard";
import { useLanguage } from "@/components/language-provider";
import { feedSources, type FeedCategory } from "@/data/sources";
import type { NewsArticle } from "@/types/news";
import { FeedSidebar } from "@/components/FeedSidebar";
import { InsightPanel } from "@/components/InsightPanel";

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
    <div className="pb-16 text-zinc-100">
      <CategoryMenu
        active={category}
        onSelect={(categoryValue) =>
          setCategory(categoryValue as CategoryFilter)
        }
      />
      <section className="mx-auto mt-6 max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          <FeedSidebar
            active={category}
            onSelect={(categoryValue) =>
              setCategory(categoryValue as CategoryFilter)
            }
          />
          <div className="space-y-6">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-xl border border-zinc-900 bg-zinc-950/60"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && filteredNews.length === 0 && (
              <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-6 text-sm text-zinc-400">
                {t("feed.noResults")}
              </div>
            )}

            {!loading && !error && filteredNews.length > 0 && (
              <div className="space-y-4">
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
          </div>
          <InsightPanel articles={filteredNews} />
        </div>
      </section>
    </div>
  );
}
