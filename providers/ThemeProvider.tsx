import React, { createContext, useContext, useMemo } from "react";

// ThemeProvider: central place for colors and spacing tokens.
const ThemeContext = createContext({
  colors: {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
    mutedText: "#666666",
    primary: "#FFC800",
    secondary: "#FFD633",
    border: "#e0e0e0",
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
        text: "#000000",
        mutedText: "#666666",
        primary: "#FFC800",
        secondary: "#FFD633",
        border: "#e0e0e0",
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
