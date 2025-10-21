"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryMenu } from "@/components/CategoryMenu";
import { NewsCard, NewsState } from "@/components/NewsCard";
import { useLanguage } from "@/components/language-provider";
import { getFeedSources, type FeedCategory } from "@/data/sources";
import type { NewsArticle } from "@/types/news";
import { FeedSidebar } from "@/components/FeedSidebar";
import { InsightPanel } from "@/components/InsightPanel";

type CategoryFilter = "all" | FeedCategory;

const NEWS_STATE_KEY = "notia:news-state";
const SOURCE_PREF_KEY = (locale: string) => `notia:sources:${locale}`;

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [newsState, setNewsState] = useState<Record<string, NewsState>>({});
  const [activeSources, setActiveSources] = useState<string[]>([]);

  const availableSources = useMemo(() => getFeedSources(locale), [locale]);

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

  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = SOURCE_PREF_KEY(locale);
    const storedSources = window.localStorage.getItem(key);
    if (storedSources) {
      try {
        const parsed = JSON.parse(storedSources) as string[];
        setActiveSources(parsed);
        setCategory("all");
        return;
      } catch {
        // fall through to defaults
      }
    }
    const defaults = availableSources.map((source) => source.label);
    setActiveSources(defaults);
    setCategory("all");
    window.localStorage.setItem(key, JSON.stringify(defaults));
  }, [locale, availableSources]);

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
        if (activeSources.length === 0) return true;
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
                    className="h-[88px] animate-pulse rounded-lg border border-[#1f2532] bg-[#161b22]"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
                {error}
              </div>
            )}

        {!loading && !error && filteredNews.length === 0 && (
              <div className="rounded-lg border border-[#1f2532] bg-[#161b22] p-6 text-sm text-zinc-400">
                {t("feed.noResults")}
              </div>
            )}

            {!loading && !error && filteredNews.length > 0 && (
              <div className="space-y-3">
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
