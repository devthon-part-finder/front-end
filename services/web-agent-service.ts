export type VendorResult = {
  vendor_name: string;
  product_title: string;
  price?: number | null;
  currency?: string | null;
  availability?: string | null;
  product_url: string;
  source_type?: string | null;
  confidence_score?: number | null;
};

export type PartSearchRequest = {
  part_name: string;
  part_number?: string | null;
  manufacturer?: string | null;
  location?: string;
  max_results?: number;
  include_scraping?: boolean;
};

export type PartSearchResponse = {
  results: VendorResult[];
  search_query: string;
  total_results: number;
  fast_path_count: number;
  slow_path_count: number;
  search_time_ms?: number | null;
};

const getApiBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set.");
  }
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error(
      "EXPO_PUBLIC_API_URL must start with http:// or https:// (example: http://172.20.10.3:8000).",
    );
  }
  return baseUrl.replace(/\/$/, "");
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        message?: string;
        detail?: string;
      };
      return data.message || data.detail || JSON.stringify(data);
    }

    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function searchParts(
  request: PartSearchRequest,
): Promise<PartSearchResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/v1/web-agent/search`;

  if (!request.part_name?.trim()) {
    throw new Error("part_name is required.");
  }

  const payload: PartSearchRequest = {
    location: "Sri Lanka",
    max_results: 10,
    include_scraping: true,
    ...request,
    part_name: request.part_name.trim(),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // In Expo/React Native, `response.body` is often not implemented (undefined).
  // Use `clone()` so we can log the payload without consuming the original body.
  
    const debugJson = await response.clone().json();
   

  if (!response.ok) {
    throw new Error((await readErrorMessage(response)) || "Search failed.");
  }

  const data = (await response.json()) as PartSearchResponse;
//   console.log("Search response:", data);
  return debugJson;
}
