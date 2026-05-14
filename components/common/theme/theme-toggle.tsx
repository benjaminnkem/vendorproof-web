"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "vp-theme";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme =
      stored === "light" || stored === "dark" ? stored : getSystemTheme();

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-stone-border bg-cloud-white px-3 py-1.5 text-xs font-medium text-ash-gray transition hover:border-hover-stone hover:text-slate-text dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
      aria-label="Toggle theme"
    >
      <span className="vp-muted">Theme:</span>
      {mounted && theme === "dark" ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
      <span className="rounded-full border border-stone-border px-2 py-0.5 text-[10px] font-semibold text-slate-text dark:border-slate-700 dark:text-slate-200">
        {mounted ? theme : "light"}
      </span>
    </button>
  );
}
