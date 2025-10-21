import { fetchNews } from "@/lib/rss";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const news = await fetchNews(locale);
  return Response.json(news);
}
