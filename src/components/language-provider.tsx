"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../../public/locales/en/common.json";
import es from "../../public/locales/es/common.json";

export type Locale = "en" | "es";

type Messages = typeof en;

const translations: Record<Locale, Messages> = {
  en,
  es
};

type LanguageContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "notia:locale";

function getMessage(messages: Messages, path: string): string {
  return path.split(".").reduce((acc: any, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return path;
  }, messages) as string;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
      return;
    }

    const browserLanguage = window.navigator.language?.toLowerCase() ?? "es";
    const detected: Locale = browserLanguage.startsWith("es") ? "es" : "en";
    setLocaleState(detected);
    window.localStorage.setItem(STORAGE_KEY, detected);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const messages = translations[locale];

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale,
      t: (path: string) => getMessage(messages, path)
    }),
    [locale, messages]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
