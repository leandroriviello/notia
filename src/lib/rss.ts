import Parser from "rss-parser";
import { getFeedSources, type Locale } from "@/data/sources";
import type { NewsArticle } from "@/types/news";

const parser = new Parser({
  customFields: {
    item: ["contentSnippet", "summary"]
  }
});

function sanitize(text: string | undefined | null): string {
  if (!text) return "No summary available.";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchNews(locale: Locale = "en"): Promise<NewsArticle[]> {
  const sources = getFeedSources(locale);
  const results = await Promise.all(
    sources.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return parsed.items.map((item) => ({
          title: item.title ?? "Untitled",
          link: item.link ?? "",
          summary: sanitize(
            item.contentSnippet ?? item.summary ?? (item.content as string)
          ),
          source: feed.label,
          date: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
          category: feed.category
        }));
      } catch (error) {
        console.error(`Failed to parse feed ${feed.url}`, error);
        return [];
      }
    })
  );

  return results
    .flat()
    .filter((item) => Boolean(item.link))
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 60);
}
