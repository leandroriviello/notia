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
    <header className="sticky top-0 z-40 border-b border-brand/20 bg-[#0e1117]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 text-zinc-100 md:px-6">
        <Link href="/" className="text-2xl font-semibold lowercase tracking-[0.3em] text-white">
          notia
        </Link>
        <nav className="ml-6 hidden gap-1 rounded-xl bg-zinc-900/60 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] transition ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-zinc-400 hover:text-white"
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
              className="rounded-full border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300 transition hover:border-brand hover:text-brand"
            >
              {session.user?.name ?? session.user?.email}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-brand px-4 py-2 text-xs uppercase tracking-[0.24em] text-brand transition hover:border-brand-accent hover:text-brand-accent"
            >
              {t("navbar.login")}
            </Link>
          )}
        </div>
      </div>
      <nav className="flex gap-1 border-t border-zinc-900 bg-[#0e1117] p-2 md:hidden">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.key}
              href={link.href}
              className={`flex-1 rounded-lg px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.24em] transition ${
                isActive
                  ? "bg-brand text-white"
                  : "text-zinc-400 hover:text-white"
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
