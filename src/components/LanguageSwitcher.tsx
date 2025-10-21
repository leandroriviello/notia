"use client";

import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(event) => setLocale(event.target.value as "en" | "es")}
      aria-label={t("language.label")}
      className={`${robotoMono.className} rounded-full border border-[#2a2a2a] bg-transparent px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300 transition focus:border-zinc-400 focus:outline-none`}
    >
      <option value="es" className="bg-[#111111] text-zinc-100">
        ES
      </option>
      <option value="en" className="bg-[#111111] text-zinc-100">
        EN
      </option>
    </select>
  );
}
