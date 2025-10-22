import Parser from "rss-parser";
import { getFeedSources, type Locale } from "@/data/sources";
import type { NewsArticle } from "@/types/news";

const parser = new Parser({
  customFields: {
    item: [
      "contentSnippet",
      "summary",
      "content",
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      "image"
    ]
  },
  requestOptions: {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NotiaBot/1.0; +https://notia.info)"
    },
    timeout: 10000
  }
});

function isValidUrl(url?: string | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function extractImage(item: any): string | undefined {
  if (!item) return undefined;

  const enclosureUrl = item.enclosure?.url ?? item.enclosure?.url ?? item.enclosure?.href;
  if (isValidUrl(enclosureUrl)) return enclosureUrl;

  const mediaContent = item["media:content"] ?? item["media:thumbnail"];
  if (mediaContent) {
    const mediaArray = Array.isArray(mediaContent)
      ? mediaContent
      : [mediaContent];
    for (const media of mediaArray) {
      const candidate = media?.url ?? media?.$?.url ?? media?.["@_url"];
      if (isValidUrl(candidate)) return candidate;
    }
  }

  const imageField = item.image?.url ?? item.image;
  if (isValidUrl(imageField)) return imageField;

  const contentHtml = item["content:encoded"] || item.content;
  if (typeof contentHtml === "string") {
    const match = contentHtml.match(/<img[^>]+src="([^"]+)"/i);
    if (match && isValidUrl(match[1])) {
      return match[1];
    }
  }

  return undefined;
}

function sanitize(text: string | undefined | null): string {
  if (!text) return "No summary available.";
  const withLineBreaks = text
    .replace(/<(\/?)(h\d|div|section|article|blockquote)[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>(\s)*/gi, "\n")
    .replace(/<\/(p|li)>/gi, "\n")
    .replace(/<li>/gi, "- ");

  const withoutTags = withLineBreaks.replace(/<[^>]+>/g, "");

  return withoutTags
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
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
          image: extractImage(item),
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
