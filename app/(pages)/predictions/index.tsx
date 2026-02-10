import { PredictionCard } from "@/components/PredictionCard";
import { useLayout } from "@/providers/LayoutProvider";
import { useMessage } from "@/providers/MessageProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { setCachedPartSearch } from "@/services/predictions-cache";
import {
    searchParts,
    type PartSearchResponse,
} from "@/services/web-agent-service";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Predictions screen: results list.
export default function PredictionsIndex() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { showMessage } = useMessage();
  const params = useLocalSearchParams<{
    part_name?: string;
    location?: string;
    inferred_type?: string;
    width_mm?: string;
    height_mm?: string;
    description?: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PartSearchResponse | null>(null);

  const partName = useMemo(() => {
    const explicit = params.part_name?.trim();
    if (explicit) return explicit;

    const pieces = [params.inferred_type, params.description]
      .map((v) => (v || "").trim())
      .filter(Boolean);
    return pieces.join(" ") || "Unknown part";
  }, [params.description, params.inferred_type, params.part_name]);

  const location = useMemo(
    () => (params.location || "Sri Lanka").trim() || "Sri Lanka",
    [params.location],
  );

  useEffect(() => {
    setTitle("Predictions");
  }, [setTitle]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        const res = await searchParts({
          part_name: partName,
          location,
          max_results: 10,
          include_scraping: true,
        });

        if (isMounted) {
          setResponse(res);
          setCachedPartSearch({ partName, location, response: res });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        showMessage({ type: "error", message });
        if (isMounted) setResponse(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    // console.log("Searching for part:", { partName, location });
    run();
    return () => {
      isMounted = false;
    };
  }, [location, partName, showMessage]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <Text style={[styles.title, { color: colors.mutedText }]}>
          Your Search:
        </Text>
        <Text style={[styles.title, { color: colors.text, fontSize: 16 }]}>
          {params.description ? `"${params.description}"` : "(image search)"}
        </Text>
        {!!params.inferred_type && (
          <Text style={[styles.title, { color: colors.text, fontSize: 14 }]}>
            Detected: {params.inferred_type}
            {params.width_mm && params.height_mm
              ? ` • ${params.width_mm}mm × ${params.height_mm}mm`
              : ""}
          </Text>
        )}
        <Text style={[styles.title, { color: colors.mutedText, fontSize: 14 }]}>
          {isLoading
            ? "Searching…"
            : `${response?.total_results ?? 0} results found • Ordered by confidence`}
        </Text>
        {!!response?.search_query && (
          <Text
            style={[styles.title, { color: colors.mutedText, fontSize: 12 }]}
          >
            Query: {response.search_query}
          </Text>
        )}
      </View>
      <PredictionCard
        results={response?.results ?? []}
        partName={partName}
        location={location}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 4,
    borderWidth: 1,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
});
