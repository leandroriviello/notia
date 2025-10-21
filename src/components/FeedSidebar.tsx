"use client";

import { CategoryValue } from "./CategoryMenu";
import { useLanguage } from "./language-provider";

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
    <aside className="hidden h-fit rounded-2xl border border-zinc-800/60 bg-zinc-950/70 p-4 shadow-md shadow-black/10 backdrop-blur md:block">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {t("feed.filters")}
      </p>
      <ul className="mt-4 space-y-1">
        {(Object.keys(ICONS) as Array<CategoryValue | "all">).map((key) => {
          const isActive = active === key;
          return (
            <li key={key}>
              <button
                onClick={() => onSelect(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand/15 text-white"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-white"
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
