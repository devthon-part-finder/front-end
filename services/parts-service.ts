import { Platform } from "react-native";

export type AnalyzePartResponse = {
  status: "success" | "error";
  part_detected?: boolean;
  inferred_type?: string;
  dimensions?: {
    width_mm: number;
    height_mm: number;
  };
  embedding_sample?: number[];
  message?: string;
};

const getApiBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set.");
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

function inferFilenameFromUri(uri: string): string {
  const cleaned = uri.split("?")[0];
  const last = cleaned.split("/").pop();
  if (last && last.includes(".")) return last;
  return `part_${Date.now()}.jpg`;
}

function inferMimeTypeFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function analyzePart(
  imageUri: string,
): Promise<AnalyzePartResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/v1/parts/analyze`;

  const filename = inferFilenameFromUri(imageUri);
  const contentType = inferMimeTypeFromFilename(filename);

  const formData = new FormData();

  if (Platform.OS === "web") {
    const blob = await (await fetch(imageUri)).blob();
    formData.append("file", blob, filename);
  } else {
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: contentType,
    } as unknown as Blob);
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error((await readErrorMessage(response)) || "Analyze failed.");
  }

  return (await response.json()) as AnalyzePartResponse;
}
