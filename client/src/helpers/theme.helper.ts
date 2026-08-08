const THEME_KEY = "embed_bot_theme";

export type Theme = "dark" | "light";

export const getTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(THEME_KEY) as Theme | null;
};

export const setTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(THEME_KEY, theme);
};

export const removeTheme = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(THEME_KEY);
};

export const initializeTheme = (): Theme => {
  const savedTheme = getTheme();
  if (savedTheme) {
    applyThemeToDOM(savedTheme);
    return savedTheme;
  }

  // Default to dark mode for EmbedBot
  const defaultTheme = "dark";
  setTheme(defaultTheme);
  applyThemeToDOM(defaultTheme);
  return defaultTheme;
};

export const applyThemeToDOM = (theme: Theme) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};
