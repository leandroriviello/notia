"use client";

import { useLanguage } from "./language-provider";

const CATEGORIES = [
  { key: "all", value: "all" },
  { key: "research", value: "Research" },
  { key: "products", value: "Products" },
  { key: "business", value: "Business" },
  { key: "regulation", value: "Regulation" },
  { key: "tools", value: "Tools" },
  { key: "papers", value: "Papers" },
  { key: "social", value: "Social" }
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

type Category = CategoryValue | "all";

type CategoryMenuProps = {
  active: Category;
  onSelect: (category: Category) => void;
};

export function CategoryMenu({ active, onSelect }: CategoryMenuProps) {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-16 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        {CATEGORIES.map((category) => {
          const isActive = active === category.value;
          return (
            <button
              key={category.key}
              onClick={() => onSelect(category.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-brand text-white shadow"
                  : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {t(`categories.${category.key}`)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
