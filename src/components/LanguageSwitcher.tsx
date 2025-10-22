"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, type Locale } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

const OPTIONS = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" }
] as const;

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("language.label")}
        className={`${robotoMono.className} flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-[11px] uppercase tracking-[0.28em] text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-[#2a2a2a] dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-white dark:focus-visible:ring-zinc-200`}
      >
        <span className="mr-2">{locale.toUpperCase()}</span>
        <span aria-hidden>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <ul className="space-y-1">
            {OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    setLocale(option.value as Locale);
                    setOpen(false);
                  }}
                  className={`${robotoMono.className} flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-200 dark:hover:bg-[#242424]`}
                >
                  <span>{option.label}</span>
                  {locale === option.value && <span aria-hidden>✓</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
