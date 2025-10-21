"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../../public/locales/en/common.json";
import es from "../../public/locales/es/common.json";

type Locale = "en" | "es";

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
    const stored = typeof window !== "undefined"
      ? (window.localStorage.getItem(STORAGE_KEY) as Locale | null)
      : null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
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
