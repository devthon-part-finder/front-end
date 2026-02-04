import React, { createContext, useContext, useMemo } from "react";

// ThemeProvider: central place for colors and spacing tokens.
const ThemeContext = createContext({
  colors: {
    background: "#0F1115",
    surface: "#171A21",
    text: "#FFFFFF",
    mutedText: "#9AA3B2",
    primary: "#4F7DF3",
    border: "#2A2F3A",
    danger: "#F35B5B",
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      colors: {
        background: "#0F1115",
        surface: "#171A21",
        text: "#FFFFFF",
        mutedText: "#9AA3B2",
        primary: "#4F7DF3",
        border: "#2A2F3A",
        danger: "#F35B5B",
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
