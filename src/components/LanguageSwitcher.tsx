"use client";

import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(event) => setLocale(event.target.value as "en" | "es")}
      aria-label={t("language.label")}
      className="rounded-full border border-zinc-300 bg-transparent px-3 py-1 text-sm text-zinc-600 transition focus:border-brand focus:outline-none dark:border-zinc-700 dark:text-zinc-300"
    >
      <option value="es" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        ES
      </option>
      <option value="en" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        EN
      </option>
    </select>
  );
}
