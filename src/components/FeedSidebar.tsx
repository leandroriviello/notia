"use client";

import { CategoryValue } from "./CategoryMenu";
import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

const ICONS: Record<CategoryValue | "all", string> = {
  all: "📰",
  Research: "🔬",
  Products: "🛠️",
  Business: "💼",
  Regulation: "⚖️",
  Tools: "🧰",
  Papers: "📄",
  Social: "💬"
};

type FeedSidebarProps = {
  active: CategoryValue | "all";
  onSelect: (category: CategoryValue | "all") => void;
};

export function FeedSidebar({ active, onSelect }: FeedSidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="hidden h-fit rounded-xl border border-[#232323] bg-[#131313] p-4 shadow-inner shadow-black/20 md:block">
      <p className={`${robotoMono.className} px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500`}>
        {t("feed.filters")}
      </p>
      <ul className="mt-4 space-y-1">
        {(Object.keys(ICONS) as Array<CategoryValue | "all">).map((key) => {
          const isActive = active === key;
          return (
            <li key={key}>
              <button
                onClick={() => onSelect(key)}
                className={`${robotoMono.className} flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] uppercase tracking-[0.22em] transition ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-zinc-400 hover:bg-[#1a1a1a]/70 hover:text-white"
                }`}
              >
                <span className="text-lg">{ICONS[key]}</span>
                <span className="truncate">
                  {t(
                    `categories.${
                      key === "all" ? "all" : key.toLowerCase()
                    }`
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
