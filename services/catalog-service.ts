// =============================================================================
// Catalog Search Service — API layer for Reverse Catalog Search
// =============================================================================
// Connects to:
//   POST /api/v1/catalog-search/upload-and-search
//   GET  /api/v1/catalog-search/{chatId}/results
//   POST /api/v1/catalog-search/predictions/{predictionId}/search
//   GET  /api/v1/catalog-search/history
// =============================================================================

// ---------------------------------------------------------------------------
// Types (mirror backend schemas)
// ---------------------------------------------------------------------------

export type ChatRead = {
  id: string;
  user_id: string;
  chat_type: string;
  status: string;
  description: string | null;
  media_url: string | null;
  media_type: string | null;
  original_filename: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type SearchResultRead = {
  id: string;
  prediction_id: string;
  vendor_name: string;
  product_title: string;
  description: string | null;
  price: number | null;
  currency: string;
  availability: string;
  product_url: string;
  image_url: string | null;
  location: string | null;
  source_type: string;
  confidence_score: number;
  created_at: string;
};

export type PredictionRead = {
  id: string;
  chat_id: string;
  prediction_type: string;
  part_name: string;
  part_number: string | null;
  manufacturer: string | null;
  description: string | null;
  confidence_score: number;
  image_url: string | null;
  matched_chunk_text: string | null;
  rank: number;
  web_search_completed: boolean;
  created_at: string;
};

export type PredictionWithResults = PredictionRead & {
  search_results: SearchResultRead[];
};

export type CatalogSearchResponse = {
  chat: ChatRead;
  predictions: PredictionWithResults[];
  processing_time_ms: number | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getBaseUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error("EXPO_PUBLIC_API_URL is not set.");
  return url.replace(/\/$/, "");
};

type AuthHeader = { Authorization?: string };

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Upload a PDF and trigger the full RAG pipeline.
 * POST /api/v1/catalog-search/upload-and-search  (multipart/form-data)
 */
export async function uploadAndSearch(
  authHeader: AuthHeader,
  file: { uri: string; name: string; type: string },
  description: string,
  options?: {
    runWebSearch?: boolean;
    maxWebResults?: number;
    location?: string;
  }
): Promise<CatalogSearchResponse> {
  const base = getBaseUrl();

  const formData = new FormData();

  // Append the file — React Native accepts { uri, name, type } as a blob
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  formData.append("description", description);
  formData.append("run_web_search", String(options?.runWebSearch ?? true));
  formData.append("max_web_results", String(options?.maxWebResults ?? 5));
  formData.append("location", options?.location ?? "Sri Lanka");

  const response = await fetch(
    `${base}/api/v1/catalog-search/upload-and-search`,
    {
      method: "POST",
      headers: {
        ...authHeader,
        // Do NOT set Content-Type — fetch will set it with the boundary
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Upload & search failed.");
  }

  return response.json();
}

/**
 * Get the full results of a completed catalog search.
 * GET /api/v1/catalog-search/{chatId}/results
 */
export async function getChatResults(
  authHeader: AuthHeader,
  chatId: string
): Promise<CatalogSearchResponse> {
  const base = getBaseUrl();

  const response = await fetch(
    `${base}/api/v1/catalog-search/${chatId}/results`,
    {
      method: "GET",
      headers: { ...authHeader, "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch results.");
  }

  return response.json();
}

/**
 * Trigger web search for a specific prediction.
 * POST /api/v1/catalog-search/predictions/{predictionId}/search
 */
export async function searchPredictionVendors(
  authHeader: AuthHeader,
  predictionId: string,
  location: string = "Sri Lanka",
  maxResults: number = 5
): Promise<PredictionWithResults> {
  const base = getBaseUrl();

  const params = new URLSearchParams({
    location,
    max_results: String(maxResults),
  });

  const response = await fetch(
    `${base}/api/v1/catalog-search/predictions/${predictionId}/search?${params}`,
    {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Vendor search failed.");
  }

  return response.json();
}

/**
 * Get user's search history.
 * GET /api/v1/catalog-search/history
 */
export async function getSearchHistory(
  authHeader: AuthHeader,
  chatType?: string,
  skip: number = 0,
  limit: number = 20
): Promise<ChatRead[]> {
  const base = getBaseUrl();

  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  if (chatType) params.append("chat_type", chatType);

  const response = await fetch(
    `${base}/api/v1/catalog-search/history?${params}`,
    {
      method: "GET",
      headers: { ...authHeader, "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch history.");
  }

  return response.json();
}
