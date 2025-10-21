"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./language-provider";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/settings", key: "settings" }
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 text-zinc-900 dark:text-zinc-100 md:px-6">
        <Link href="/" className="text-2xl font-semibold lowercase text-zinc-900 dark:text-white">
          notia
        </Link>
        <nav className="ml-6 hidden gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                {t(`navbar.${link.key}`)}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {session ? (
            <button
              onClick={() => signOut()}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-300"
            >
              {session.user?.name ?? session.user?.email}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-brand px-3 py-1 text-sm text-brand transition hover:border-brand-accent hover:text-brand-accent"
            >
              {t("navbar.login")}
            </Link>
          )}
        </div>
      </div>
      <nav className="flex gap-1 border-t border-zinc-200 bg-white/70 p-2 dark:border-zinc-900 dark:bg-zinc-950/60 md:hidden">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.key}
              href={link.href}
              className={`flex-1 rounded-full px-4 py-2 text-center text-sm transition ${
                isActive
                  ? "bg-brand text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              {t(`navbar.${link.key}`)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
