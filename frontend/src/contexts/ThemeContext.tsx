import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { getAuthToken } from "@/services/api";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loadTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from API on mount
  const loadTheme = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const settings = await userService.getSettings();
      const savedTheme = settings.darkMode ? "dark" : "light";
      setThemeState(savedTheme);
    } catch (error) {
      console.error("No settings found, using default");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, isLoading]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    const token = getAuthToken();
    if (!token) return;

    try {
      const isDark = newTheme === "dark" || 
        (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      await userService.updateSettings({ darkMode: isDark });
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }; 

  const value = {
    theme,
    setTheme,
    loadTheme
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
