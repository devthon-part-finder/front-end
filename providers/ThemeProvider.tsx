import React, { createContext, useContext, useMemo } from "react";

// ThemeProvider: central place for colors and spacing tokens.
const ThemeContext = createContext({
  colors: {
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#000000",
    mutedText: "#666666",
    primary: "#FFC800",
    secondary: "#FFD633",
    border: "#e0e0e0",
    danger: "#F35B5B",
    black: "#000000",
    green: "#288936",
    lightgreen: "#D0F5D3",
    blue: "#285B89",
    lightblue: "#D0EDF5",
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      colors: {
        background: "#ffffff",
        surface: "#f5f5f5",
        text: "#000000",
        mutedText: "#666666",
        primary: "#FFC800",
        secondary: "#FFD633",
        border: "#e0e0e0",
        danger: "#F35B5B",
        black: "#000000",
        green: "#288936",
        lightgreen: "#D0F5D3",
        blue: "#285B89",
        lightblue: "#D0EDF5",
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
