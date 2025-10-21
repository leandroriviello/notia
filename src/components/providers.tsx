"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./language-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
