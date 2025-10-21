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
        className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300"
        aria-label={t("theme.toggle")}
      >
        —
      </button>
    );
  }

  const isDark = theme === "dark";
  const label = isDark ? t("theme.dark") : t("theme.light");

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300 transition hover:border-brand hover:text-brand"
      aria-label={t("theme.toggle")}
    >
      <span aria-hidden className="text-lg">
        {isDark ? "🌙" : "☀️"}
      </span>
      <span>{label.toUpperCase()}</span>
    </button>
  );
}
