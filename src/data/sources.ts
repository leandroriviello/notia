export type FeedCategory =
  | "Research"
  | "Products"
  | "Business"
  | "Regulation"
  | "Tools"
  | "Papers"
  | "Social";

export type FeedSource = {
  id: string;
  url: string;
  label: string;
  category: FeedCategory;
};

export const feedSources: FeedSource[] = [
  {
    id: "techcrunch-ai",
    url: "https://techcrunch.com/tag/artificial-intelligence/feed/",
    category: "Products",
    label: "TechCrunch AI"
  },
  {
    id: "venturebeat-ai",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "Business",
    label: "VentureBeat AI"
  },
  {
    id: "synced-review",
    url: "https://syncedreview.com/feed",
    category: "Tools",
    label: "Synced Review"
  },
  {
    id: "the-decoder",
    url: "https://the-decoder.com/feed/",
    category: "Research",
    label: "The Decoder"
  },
  {
    id: "ai-act-news",
    url: "https://artificialintelligenceact.eu/feed/",
    category: "Regulation",
    label: "AI Act News"
  },
  {
    id: "arxiv-cs-ai",
    url: "https://arxiv.org/rss/cs.AI",
    category: "Papers",
    label: "arXiv cs.AI"
  },
  {
    id: "xataka-ia",
    url: "https://www.xataka.com/tag/inteligencia-artificial/rss",
    category: "Social",
    label: "Xataka IA"
  }
];
