import { PredictionCard } from "@/components/PredictionCard";
import { useCatalogSearch } from "@/providers/CatalogSearchProvider";
import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { router, type Href } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PredictionsScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { searchResponse, searchDescription } = useCatalogSearch();

  useEffect(() => {
    setTitle("Compatible Parts Found");
  }, [setTitle]);

  const predictions = searchResponse?.predictions ?? [];

  const handleFindVendors = (predictionId: string) => {
    router.push(`/(app)/predictions/vendors?predictionId=${predictionId}` as Href);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Search summary header */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.headerLabel, { color: colors.mutedText }]}>
          Your Search:
        </Text>
        <Text style={[styles.headerDescription, { color: colors.text }]}>
          &quot;{searchDescription || "—"}&quot;
        </Text>
        <Text style={[styles.headerMeta, { color: colors.mutedText }]}>
          {predictions.length} result{predictions.length !== 1 ? "s" : ""} found
          {" \u2022 "}Ordered by confidence
        </Text>
      </View>

      {/* Prediction cards */}
      {predictions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            No predictions were generated. Try uploading a different document or
            refining your description.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {predictions.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onFindVendors={handleFindVendors}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  headerCard: {
    padding: 20,
    gap: 4,
    borderWidth: 1,
    borderRadius: 12,
    margin: 16,
  },
  headerLabel: { fontSize: 14, fontWeight: "500" },
  headerDescription: { fontSize: 16, fontWeight: "700" },
  headerMeta: { fontSize: 13, marginTop: 2 },
  listContainer: { paddingBottom: 24 },
  emptyContainer: { padding: 32, alignItems: "center" },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
