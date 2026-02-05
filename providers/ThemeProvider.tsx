import React, { createContext, useContext, useMemo } from "react";

// ThemeProvider: central place for colors and spacing tokens.
const ThemeContext = createContext({
  colors: {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#FFFFFF",
    mutedText: "#9AA3B2",
    primary: "#2d2c2d",
    border: "#2A2F3A",
    danger: "#F35B5B",
    black: "#000000",
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      colors: {
        background: "#ffffff",
        surface: "#ffffff",
        text: "#FFFFFF",
        mutedText: "#9AA3B2",
        primary: "#f6e71b",
        border: "#2A2F3A",
        danger: "#F35B5B",
        black: "#000000",
      },
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
