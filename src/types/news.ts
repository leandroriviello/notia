export type NewsArticle = {
  title: string;
  link: string;
  summary: string;
  image?: string;
  source: string;
  date: string;
  category: string;
};

export type NewsState = {
  vote?: "up" | "down";
};
