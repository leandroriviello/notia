export type FeedCategory =
  | "Research"
  | "Products"
  | "Business"
  | "Regulation"
  | "Tools"
  | "Papers"
  | "Social";

export type Locale = "en" | "es";

export type FeedSource = {
  id: string;
  url: string;
  label: string;
  category: FeedCategory;
};

const feedSourcesByLocale: Record<Locale, FeedSource[]> = {
  en: [
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
      id: "theverge-ai",
      url: "https://www.theverge.com/rss/ai-artificial-intelligence",
      category: "Products",
      label: "The Verge AI"
    },
    {
      id: "mit-tech-review",
      url: "https://www.technologyreview.com/feed/",
      category: "Research",
      label: "MIT Tech Review"
    },
    {
      id: "ai-trends",
      url: "https://www.aitrends.com/feed/",
      category: "Business",
      label: "AI Trends"
    },
    {
      id: "wired-ai",
      url: "https://www.wired.com/feed/category/science/artificial-intelligence/latest/rss",
      category: "Products",
      label: "WIRED AI"
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
      id: "builtin-ai",
      url: "https://builtin.com/topic/artificial-intelligence/feed",
      category: "Business",
      label: "Built In AI"
    },
    {
      id: "ai-blog",
      url: "https://www.artificial-intelligence.blog/feed/",
      category: "Research",
      label: "AI Blog"
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
      id: "nvidia-blog",
      url: "https://blogs.nvidia.com/feed/",
      category: "Products",
      label: "NVIDIA Blog"
    }
  ],
  es: [
    {
      id: "xataka-ia",
      url: "https://www.xataka.com/tag/inteligencia-artificial/rss",
      category: "Social",
      label: "Xataka IA"
    },
    {
      id: "hipertextual",
      url: "https://hipertextual.com/feed",
      category: "Products",
      label: "Hipertextual"
    },
    {
      id: "genbeta-ia",
      url: "https://www.genbeta.com/tag/inteligencia-artificial/rss2.xml",
      category: "Tools",
      label: "Genbeta IA"
    },
    {
      id: "europapress-ia",
      url: "https://www.europapress.es/rss/rss.aspx?canal=tecnologia-inteligencia-artificial",
      category: "Business",
      label: "Europa Press IA"
    },
    {
      id: "muycomputerpro-ia",
      url: "https://www.muycomputerpro.com/tag/inteligencia-artificial/feed/",
      category: "Business",
      label: "MuyComputer Pro IA"
    },
    {
      id: "emprendedores-ia",
      url: "https://emprendedores.es/tag/inteligencia-artificial/feed/",
      category: "Products",
      label: "Emprendedores IA"
    },
    {
      id: "elpais-retina-ia",
      url: "https://retina.elpais.com/rss/tag/inteligencia_artificial/a/",
      category: "Regulation",
      label: "El País Retina IA"
    }
  ]
};

export function getFeedSources(locale: Locale = "en"): FeedSource[] {
  return feedSourcesByLocale[locale] ?? feedSourcesByLocale.en;
}

export function getAllFeedSources(): FeedSource[] {
  return [...feedSourcesByLocale.en, ...feedSourcesByLocale.es];
}
