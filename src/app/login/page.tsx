"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin" ? t("login.error") : result.error
      );
      return;
    }

    router.push("/");
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12 text-zinc-900 dark:text-zinc-100 md:px-6">
      <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-xl dark:border-zinc-900 dark:bg-zinc-900/60">
        <h1 className="text-3xl font-semibold">
          {t("login.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-zinc-600 dark:text-zinc-300">
            {t("login.email")}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-brand focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </label>
          <label className="block text-sm text-zinc-600 dark:text-zinc-300">
            {t("login.password")}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-brand focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-brand px-4 py-2 text-sm text-brand transition hover:border-brand-accent hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "…" : t("login.submit")}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <p className="mt-6 text-xs text-zinc-500">
          {t("login.mockNotice")}
        </p>
      </div>
    </section>
  );
}
