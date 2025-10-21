"use client";

import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(event) => setLocale(event.target.value as "en" | "es")}
      aria-label={t("language.label")}
      className="rounded-full border border-zinc-700 bg-transparent px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300 transition focus:border-brand focus:outline-none"
    >
      <option value="es" className="bg-[#0e1117] text-zinc-100">
        ES
      </option>
      <option value="en" className="bg-[#0e1117] text-zinc-100">
        EN
      </option>
    </select>
  );
}
