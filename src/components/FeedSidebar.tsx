"use client";

import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";
import {
  CATEGORY_CONFIG,
  CATEGORY_ICONS,
  type CategoryValue
} from "@/constants/categories";

type FeedSidebarProps = {
  active: CategoryValue | "all";
  onSelect: (category: CategoryValue | "all") => void;
  available: CategoryValue[];
};

export function FeedSidebar({ active, onSelect, available }: FeedSidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="hidden h-fit rounded-xl border border-[#232323] bg-[#131313] p-4 shadow-inner shadow-black/20 md:block">
      <p className={`${robotoMono.className} px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500`}>
        {t("feed.filters")}
      </p>
      <ul className="mt-4 space-y-1">
        <li>
          <button
            onClick={() => onSelect("all")}
            className={`${robotoMono.className} flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] uppercase tracking-[0.22em] transition ${
              active === "all"
                ? "bg-[#1a1a1a] text-white"
                : "text-zinc-400 hover:bg-[#1a1a1a]/70 hover:text-white"
            }`}
          >
            <span className="text-lg">📰</span>
            <span className="truncate">{t("categories.all")}</span>
          </button>
        </li>
        {CATEGORY_CONFIG.filter((category) =>
          available.includes(category.value)
        ).map((category) => {
          const isActive = active === category.value;
          return (
            <li key={category.key}>
              <button
                onClick={() => onSelect(category.value)}
                className={`${robotoMono.className} flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] uppercase tracking-[0.22em] transition ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-zinc-400 hover:bg-[#1a1a1a]/70 hover:text-white"
                }`}
              >
                <span className="text-lg">{CATEGORY_ICONS[category.value]}</span>
                <span className="truncate">
                  {t(`categories.${category.key}`)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
