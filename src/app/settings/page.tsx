"use client";

import { useEffect, useMemo, useState } from "react";
import { feedSources } from "@/data/sources";
import { useLanguage } from "@/components/language-provider";

const SOURCE_PREF_KEY = "notia:sources";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SOURCE_PREF_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedSources(parsed);
      } catch {
        setSelectedSources(feedSources.map((source) => source.label));
      }
    } else {
      setSelectedSources(feedSources.map((source) => source.label));
    }
  }, []);

  const groupedSources = useMemo(() => {
    return feedSources.reduce<Record<string, string[]>>((acc, source) => {
      if (!acc[source.category]) {
        acc[source.category] = [];
      }
      acc[source.category].push(source.label);
      return acc;
    }, {});
  }, []);

  const toggleSource = (label: string) => {
    setSelectedSources((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SOURCE_PREF_KEY,
        JSON.stringify(selectedSources)
      );
      setSavedMessage(t("settings.stored"));
      setTimeout(() => setSavedMessage(""), 2500);
    }
  };

  const handleReset = () => {
    const all = feedSources.map((source) => source.label);
    setSelectedSources(all);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SOURCE_PREF_KEY, JSON.stringify(all));
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 text-zinc-200 md:px-6">
      <h1 className="text-3xl font-semibold tracking-[0.1em] uppercase text-white">
        {t("settings.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-500">
        {t("settings.description")}
      </p>

      <div className="mt-8 space-y-6 rounded-3xl border border-zinc-900 bg-[#10151f]/80 p-6 shadow-xl shadow-black/30 backdrop-blur">
        {Object.entries(groupedSources).map(([category, sources]) => {
          const translationKey = category.toLowerCase();
          return (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                {t(`categories.${translationKey}`)}
              </h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {sources.map((label) => {
                  const active = selectedSources.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleSource(label)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                        active
                          ? "border-brand text-brand"
                          : "border-zinc-700 text-zinc-400 hover:border-brand hover:text-brand"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            onClick={handleSave}
            className="rounded-full border border-brand px-6 py-2 text-xs uppercase tracking-[0.24em] text-brand transition hover:border-brand-accent hover:text-brand-accent"
          >
            {t("settings.save")}
          </button>
          <button
            onClick={handleReset}
            className="rounded-full border border-zinc-700 px-6 py-2 text-xs uppercase tracking-[0.24em] text-zinc-400 transition hover:border-brand hover:text-brand"
          >
            {t("settings.reset")}
          </button>
          {savedMessage && (
            <span className="text-xs uppercase tracking-[0.2em] text-brand-accent">
              {savedMessage}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
