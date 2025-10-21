"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./language-provider";
import { robotoMono } from "@/styles/fonts";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/settings", key: "settings" }
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-[#242b37] bg-[#161b22]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-4 text-zinc-200 md:px-6">
        <Link
          href="/"
          className={`${robotoMono.className} text-xl font-semibold uppercase tracking-[0.5em] text-white`}
        >
          notia
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`${robotoMono.className} border-b-2 px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.26em] transition ${
                  isActive
                    ? "border-[#3b82f6] text-white"
                    : "border-transparent text-zinc-500 hover:text-white"
                }`}
              >
                {t(`navbar.${link.key}`)}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {session ? (
            <button
              onClick={() => signOut()}
              className={`${robotoMono.className} rounded-full border border-[#2d3441] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-300 transition hover:border-[#3b82f6] hover:text-white`}
            >
              {session.user?.name ?? session.user?.email}
            </button>
          ) : (
            <Link
              href="/login"
              className={`${robotoMono.className} rounded-full border border-[#3b82f6]/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#3b82f6] transition hover:border-[#3b82f6] hover:text-white`}
            >
              {t("navbar.login")}
            </Link>
          )}
        </div>
      </div>
      <nav className="flex gap-1 border-t border-[#242b37] bg-[#161b22] p-2 md:hidden">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.key}
              href={link.href}
              className={`${robotoMono.className} flex-1 rounded-lg px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.26em] transition ${
                isActive
                  ? "bg-[#1f2630] text-white"
                  : "text-zinc-500 hover:text-white"
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
