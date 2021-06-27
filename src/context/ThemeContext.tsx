import { createContext, ReactNode, useEffect, useState } from "react";

interface ThemeContextData {
  isDark: boolean;
  toggleDarkMode: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const ThemeContextProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  function toggleDarkMode(): void {
    const newMode = !isDark;
    document.documentElement.className = newMode ? `dark` : ``;
    setIsDark(!isDark);
    localStorage.setItem(`theme`, newMode ? `dark` : `light`);
  }

  useEffect(() => {
    if (window) {
      const storageMode = window.localStorage.getItem(`theme`) === `dark`;
      if (storageMode) {
        setIsDark(window.localStorage.getItem(`theme`) === `dark`);
        document.documentElement.className = storageMode ? `dark` : ``;
      }
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
