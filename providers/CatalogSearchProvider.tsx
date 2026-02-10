import React, { createContext, useContext, useMemo, useState } from "react";
import type { CatalogSearchResponse } from "@/services/catalog-service";

type CatalogSearchContextValue = {
  /** The latest search response (chat + predictions + results). */
  searchResponse: CatalogSearchResponse | null;
  setSearchResponse: (r: CatalogSearchResponse | null) => void;

  /** The user's description text for display on the predictions screen. */
  searchDescription: string;
  setSearchDescription: (d: string) => void;
};

const CatalogSearchContext = createContext<CatalogSearchContextValue | undefined>(undefined);

export function CatalogSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchResponse, setSearchResponse] = useState<CatalogSearchResponse | null>(null);
  const [searchDescription, setSearchDescription] = useState("");

  const value = useMemo<CatalogSearchContextValue>(
    () => ({
      searchResponse,
      setSearchResponse,
      searchDescription,
      setSearchDescription,
    }),
    [searchResponse, searchDescription]
  );

  return (
    <CatalogSearchContext.Provider value={value}>
      {children}
    </CatalogSearchContext.Provider>
  );
}

export function useCatalogSearch() {
  const ctx = useContext(CatalogSearchContext);
  if (!ctx) throw new Error("useCatalogSearch must be used within CatalogSearchProvider");
  return ctx;
}
