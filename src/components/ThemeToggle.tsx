"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-lg text-zinc-600 dark:border-[#2a2a2a] dark:text-zinc-200"
        aria-label={t("theme.toggle")}
      >
        •
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-lg transition hover:border-zinc-400 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-[#2a2a2a] dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-white dark:focus-visible:ring-zinc-200"
      aria-label={t("theme.toggle")}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
