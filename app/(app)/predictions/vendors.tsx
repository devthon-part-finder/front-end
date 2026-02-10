import { useAuth } from "@/providers/AuthProvider";
import { useCatalogSearch } from "@/providers/CatalogSearchProvider";
import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import {
  searchPredictionVendors,
  type PredictionWithResults,
  type SearchResultRead,
} from "@/services/catalog-service";
import { useLocalSearchParams, router, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function VendorsScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { getAuthHeader } = useAuth();
  const { searchResponse, setSearchResponse } = useCatalogSearch();
  const { predictionId } = useLocalSearchParams<{ predictionId: string }>();

  const [loading, setLoading] = useState(false);
  const [localPrediction, setLocalPrediction] =
    useState<PredictionWithResults | null>(null);
  const [componentExpanded, setComponentExpanded] = useState(false);

  // Find prediction from context
  const prediction =
    localPrediction ??
    searchResponse?.predictions.find((p) => p.id === predictionId) ??
    null;

  useEffect(() => {
    setTitle("Search results");
  }, [setTitle]);

  // Auto-trigger vendor search if no results yet
  useEffect(() => {
    if (
      prediction &&
      prediction.search_results.length === 0 &&
      !prediction.web_search_completed &&
      !loading
    ) {
      triggerVendorSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction?.id]);

  const triggerVendorSearch = async () => {
    if (!predictionId) return;
    setLoading(true);
    try {
      const authHeader = await getAuthHeader();
      const updated = await searchPredictionVendors(authHeader, predictionId);
      setLocalPrediction(updated);

      // Also update context so going back shows fresh data
      if (searchResponse) {
        const updatedPredictions = searchResponse.predictions.map((p) =>
          p.id === predictionId ? updated : p
        );
        setSearchResponse({
          ...searchResponse,
          predictions: updatedPredictions,
        });
      }
    } catch (err) {
      Alert.alert(
        "Search failed",
        String((err as Error).message || "Could not search for vendors.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vendor: SearchResultRead) => {
    router.push(
      `/(app)/predictions/details?predictionId=${predictionId}&vendorId=${vendor.id}` as Href
    );
  };

  const vendors = prediction?.search_results ?? [];
  const placeholderImage =
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop";

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* ── Detected Components ─────────────────────────────────── */}
      {prediction && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Detected Components
          </Text>

          <Pressable
            onPress={() => setComponentExpanded(!componentExpanded)}
            style={[
              styles.componentCard,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.componentRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.componentName, { color: colors.text }]}>
                  {prediction.part_name}
                </Text>
                <Text
                  style={[styles.componentMeta, { color: colors.mutedText }]}
                >
                  {[
                    prediction.part_number
                      ? `ID: ${prediction.part_number}`
                      : null,
                    prediction.manufacturer,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Identified from catalog"}
                </Text>
              </View>
              {/* Chevron indicator + yellow dot */}
              <View style={styles.chevronContainer}>
                <Text style={[styles.chevron, { color: colors.mutedText }]}>
                  {componentExpanded ? "\u25B2" : "\u25BC"}
                </Text>
                <View
                  style={[styles.dot, { backgroundColor: colors.primary }]}
                />
              </View>
            </View>

            {componentExpanded && prediction.description && (
              <Text
                style={[
                  styles.componentDescription,
                  { color: colors.mutedText },
                ]}
              >
                {prediction.description}
              </Text>
            )}
          </Pressable>
        </>
      )}

      {/* ── Compatible Replacements ──────────────────────────────── */}
      <View style={styles.replacementsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Compatible Replacements
        </Text>
      </View>

      {/* Loading spinner */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedText }]}>
            Searching vendors across the web...
          </Text>
        </View>
      )}

      {/* Empty state */}
      {!loading && vendors.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            No vendor results yet.
          </Text>
          <Pressable
            onPress={triggerVendorSearch}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.retryButtonText, { color: colors.text }]}>
              Search Vendors
            </Text>
          </Pressable>
        </View>
      )}

      {/* Vendor cards – matching Figma "Compatible Replacements" */}
      {!loading &&
        vendors.map((vendor) => (
          <View
            key={vendor.id}
            style={[
              styles.vendorCard,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.vendorTopRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.vendorProductTitle, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {vendor.product_title}
                </Text>
                <Text
                  style={[
                    styles.vendorManufacturer,
                    { color: colors.mutedText },
                  ]}
                  numberOfLines={1}
                >
                  {vendor.vendor_name}
                </Text>
                <Text style={[styles.vendorPrice, { color: colors.text }]}>
                  {vendor.price != null
                    ? `${vendor.currency} ${vendor.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "Price not available"}
                </Text>
              </View>
              <Image
                source={{ uri: vendor.image_url || placeholderImage }}
                style={styles.vendorThumb}
                resizeMode="cover"
              />
            </View>

            {/* View Details button */}
            <Pressable
              onPress={() => handleViewDetails(vendor)}
              style={({ pressed }) => [
                styles.viewDetailsButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[styles.viewDetailsText, { color: colors.text }]}
              >
                View Details
              </Text>
            </Pressable>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  /* ── Section titles ──────────────────────────────────────── */
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  /* ── Detected Component card ─────────────────────────────── */
  componentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  componentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  componentName: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  componentMeta: { fontSize: 13 },
  chevronContainer: { alignItems: "center", gap: 6 },
  chevron: { fontSize: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  componentDescription: { fontSize: 13, lineHeight: 19, marginTop: 10 },

  /* ── Replacements header ─────────────────────────────────── */
  replacementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ── Vendor card (Figma style) ───────────────────────────── */
  vendorCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  vendorTopRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  vendorProductTitle: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  vendorManufacturer: { fontSize: 13, marginBottom: 4 },
  vendorPrice: { fontSize: 18, fontWeight: "700" },
  vendorThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  viewDetailsButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  viewDetailsText: { fontSize: 15, fontWeight: "600" },

  /* ── Loading / empty ─────────────────────────────────────── */
  loadingContainer: {
    padding: 48,
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, textAlign: "center" },
  emptyContainer: { padding: 32, alignItems: "center", gap: 16 },
  emptyText: { fontSize: 14, textAlign: "center" },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  retryButtonText: { fontSize: 15, fontWeight: "600" },
});
