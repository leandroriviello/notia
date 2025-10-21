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
    <nav className="sticky top-[64px] z-30 border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        {CATEGORIES.map((category) => {
          const isActive = active === category.value;
          return (
            <button
              key={category.key}
              onClick={() => onSelect(category.value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                isActive
                  ? "bg-brand/30 text-white shadow-sm shadow-brand/40"
                  : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-900 hover:text-white"
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
