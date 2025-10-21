export const CATEGORY_CONFIG = [
  { key: "research", value: "Research", icon: "🔬" },
  { key: "products", value: "Products", icon: "🛠️" },
  { key: "business", value: "Business", icon: "💼" },
  { key: "regulation", value: "Regulation", icon: "⚖️" },
  { key: "tools", value: "Tools", icon: "🧰" },
  { key: "papers", value: "Papers", icon: "📄" },
  { key: "social", value: "Social", icon: "💬" }
] as const;

export type CategoryValue = (typeof CATEGORY_CONFIG)[number]["value"];

export const CATEGORY_ICONS: Record<CategoryValue, string> = CATEGORY_CONFIG.reduce(
  (acc, category) => {
    acc[category.value] = category.icon;
    return acc;
  },
  {} as Record<CategoryValue, string>
);
