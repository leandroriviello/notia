import { fetchNews } from "@/lib/rss";
import { prisma } from "@/lib/prisma";
import type { NewsArticle } from "@/types/news";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const canUseDatabase = Boolean(process.env.DATABASE_URL);
  let persistenceAvailable = canUseDatabase;
  try {
    const news = await fetchNews(locale);

    if (persistenceAvailable) {
      const operations = news
        .filter((item) => item.link)
        .map((item) =>
          prisma.article.upsert({
            where: {
              link_locale: {
                link: item.link,
                locale
              }
            },
            update: {
              title: item.title,
              summary: item.summary,
              source: item.source,
              date: new Date(item.date),
              category: item.category
            },
            create: {
              title: item.title,
              summary: item.summary,
              source: item.source,
              date: new Date(item.date),
              category: item.category,
              link: item.link,
              locale
            }
          })
        );

      if (operations.length > 0) {
        try {
          await prisma.$transaction(operations);
        } catch (error: any) {
          if (error?.code === "P2021") {
            console.warn(
              "[notia] Prisma table Article does not exist. Skipping persistence."
            );
            persistenceAvailable = false;
          } else {
            throw error;
          }
        }
      }
    }

    return Response.json(news);
  } catch (error) {
    console.error("Failed to refresh RSS feeds", error);
  }

  if (!persistenceAvailable) {
    return Response.json([] satisfies NewsArticle[]);
  }

  try {
    const stored = await prisma.article.findMany({
      where: { locale },
      orderBy: { date: "desc" },
      take: 60
    });

    const fallback: NewsArticle[] = stored.map((item) => ({
      title: item.title,
      link: item.link,
      summary: item.summary ?? "No summary available.",
      source: item.source,
      date: item.date.toISOString(),
      category: item.category
    }));

    return Response.json(fallback);
  } catch (error) {
    console.error("Failed to load stored articles", error);
    return Response.json([] satisfies NewsArticle[]);
  }
}
