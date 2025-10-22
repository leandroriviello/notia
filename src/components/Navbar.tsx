"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

export function Navbar() {
  const { t, locale } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-[#232323] dark:bg-[#131313]/95">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 text-zinc-800 dark:text-zinc-200 md:px-6">
        <Link
          href="/"
          className={`${robotoMono.className} text-xl font-semibold uppercase tracking-[0.5em] text-zinc-900 dark:text-white`}
        >
          notia
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {locale === "es" && (
            <a
              href="https://notia.beehiiv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${robotoMono.className} hidden h-10 items-center rounded-full border border-zinc-300 px-4 text-[11px] uppercase tracking-[0.28em] text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-400 dark:text-zinc-200 dark:hover:border-zinc-200 dark:hover:text-white dark:focus-visible:ring-zinc-200 md:inline-flex`}
            >
              {t("navbar.subscribe")}
            </a>
          )}
        </div>
      </div>
      {locale === "es" && (
        <div className="flex justify-center border-t border-zinc-200 bg-white/90 p-3 md:hidden dark:border-[#232323] dark:bg-[#131313]/95">
          <a
            href="https://notia.beehiiv.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${robotoMono.className} inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-[11px] uppercase tracking-[0.28em] text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-400 dark:text-zinc-200 dark:hover:border-zinc-200 dark:hover:text-white dark:focus-visible:ring-zinc-200`}
          >
            {t("navbar.subscribe")}
          </a>
        </div>
      )}
    </header>
  );
}
