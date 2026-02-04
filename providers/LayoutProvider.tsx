import React, { createContext, useContext, useMemo, useState } from "react";

// LayoutProvider: holds layout-level UI state (e.g., current screen title).
type LayoutContextValue = {
  title: string;
  setTitle: (value: string) => void;
};

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("Home");

  const value = useMemo(
    () => ({
      title,
      setTitle,
    }),
    [title],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}
