"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsCard, NewsState } from "@/components/NewsCard";
import { useLanguage } from "@/components/language-provider";
import type { NewsArticle } from "@/types/news";
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
    setSelectedArticle(null);
    setVisibleCount(10);
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
      const next = { ...prev, [link]: state };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NEWS_STATE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const visibleNews = useMemo(() => {
    return news.slice(0, visibleCount);
  }, [news, visibleCount]);

  const structuredData = useMemo(() => {
    const localizedName =
      locale === "es"
        ? "Notia — Noticias de Inteligencia Artificial"
        : "Notia — AI News Dashboard";
    const items = news.slice(0, 20).map((item) => ({
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
  }, [news, locale, t]);

  return (
    <div className="pb-16 text-zinc-100">
      <section className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[88px] animate-pulse rounded-lg border border-[#1f1f1f] bg-[#131313]"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && news.length === 0 && (
              <div className="rounded-lg border border-[#1f1f1f] bg-[#131313] p-6 text-sm text-zinc-400">
                {t("feed.noResults")}
              </div>
            )}

            {!loading && !error && visibleNews.length > 0 && (
              <div className="space-y-3">
                {visibleNews.map((item) => (
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
                    onOpen={() => setSelectedArticle(item)}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            {!loading && !error && news.length > visibleCount && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className={`${robotoMono.className} rounded-full border border-zinc-400 px-5 py-2 text-xs uppercase tracking-[0.24em] text-zinc-200 transition hover:border-zinc-300 hover:text-white`}
                >
                  {t("feed.showMore")}
                </button>
              </div>
            )}
          </div>
          <InsightPanel articles={news} />
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
