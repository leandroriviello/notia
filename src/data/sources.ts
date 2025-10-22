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
      id: "ai-trends",
      url: "https://www.aitrends.com/feed/",
      category: "Business",
      label: "AI Trends"
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
      id: "unite-ai",
      url: "https://www.unite.ai/feed/",
      category: "Research",
      label: "Unite.AI"
    }
  ],
  es: [
    {
      id: "genbeta-ia",
      url: "https://www.genbeta.com/tag/inteligencia-artificial/rss2.xml",
      category: "Tools",
      label: "Genbeta IA"
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
    },
    {
      id: "lavanguardia-ia",
      url: "https://www.lavanguardia.com/tecnologia/inteligencia-artificial/rss.xml",
      category: "Research",
      label: "La Vanguardia IA"
    },
    {
      id: "digitaltrends-ia",
      url: "https://es.digitaltrends.com/inteligencia-artificial/feed/",
      category: "Products",
      label: "Digital Trends IA"
    }
  ]
};

export function getFeedSources(locale: Locale = "en"): FeedSource[] {
  return feedSourcesByLocale[locale] ?? feedSourcesByLocale.en;
}

export function getAllFeedSources(): FeedSource[] {
  return [...feedSourcesByLocale.en, ...feedSourcesByLocale.es];
}
