"use client";

import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";
import {
  CATEGORY_CONFIG,
  type CategoryValue
} from "@/constants/categories";

type Category = CategoryValue | "all";

type CategoryMenuProps = {
  active: Category;
  onSelect: (category: Category) => void;
  available: CategoryValue[];
};

export function CategoryMenu({ active, onSelect, available }: CategoryMenuProps) {
  const { t } = useLanguage();

  const categories = available.length
    ? CATEGORY_CONFIG.filter((category) => available.includes(category.value))
    : CATEGORY_CONFIG;

  return (
    <nav className="sticky top-[64px] z-30 border-b border-[#232323] bg-[#131313]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 md:px-6">
        <button
          onClick={() => onSelect("all")}
          className={`${robotoMono.className} whitespace-nowrap border-b-2 px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.26em] transition ${
            active === "all"
              ? "border-brand text-white"
              : "border-transparent text-zinc-500 hover:text-white"
          }`}
        >
          {t("categories.all")}
        </button>
        {categories.map((category) => {
          const isActive = active === category.value;
          return (
            <button
              key={category.key}
              onClick={() => onSelect(category.value)}
              className={`${robotoMono.className} whitespace-nowrap border-b-2 px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.26em] transition ${
                isActive
                  ? "border-brand text-white"
                  : "border-transparent text-zinc-500 hover:text-white"
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
