import type { PartSearchResponse } from "./web-agent-service";

type CachedSearch = {
  partName: string;
  location: string;
  response: PartSearchResponse;
  cachedAt: number;
};

let cachedSearch: CachedSearch | null = null;

export function setCachedPartSearch(params: {
  partName: string;
  location: string;
  response: PartSearchResponse;
}) {
  cachedSearch = {
    partName: params.partName,
    location: params.location,
    response: params.response,
    cachedAt: Date.now(),
  };
}

export function getCachedPartSearch(): CachedSearch | null {
  return cachedSearch;
}
