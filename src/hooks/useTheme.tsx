"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme = "system" | "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  // Resolve system preference
  const resolveTheme = useCallback((t: Theme): "dark" | "light" => {
    if (t === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "dark";
    }
    return t;
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("ds-theme") as Theme | null;
    if (saved && ["system", "dark", "light"].includes(saved)) {
      setThemeState(saved);
      setResolvedTheme(resolveTheme(saved));
    } else {
      setResolvedTheme(resolveTheme("system"));
    }
  }, [resolveTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        setResolvedTheme(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Apply theme class to html
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-light");
    html.classList.add(`theme-${resolvedTheme}`);
  }, [resolvedTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setResolvedTheme(resolveTheme(t));
    localStorage.setItem("ds-theme", t);
  }, [resolveTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
