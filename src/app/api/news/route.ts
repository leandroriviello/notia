import { fetchNews } from "@/lib/rss";

export async function GET() {
  const news = await fetchNews();
  return Response.json(news);
}
