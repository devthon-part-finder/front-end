import { useAuth } from "@/providers/AuthProvider";
import { useCatalogSearch } from "@/providers/CatalogSearchProvider";
import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import type { SearchResultRead } from "@/services/catalog-service";
import { useLocalSearchParams, router, type Href } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProductDetailsScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { searchResponse } = useCatalogSearch();
  const { predictionId, vendorId } = useLocalSearchParams<{
    predictionId: string;
    vendorId: string;
  }>();

  useEffect(() => {
    setTitle("Search");
  }, [setTitle]);

  // Find the prediction and vendor from context
  const prediction = searchResponse?.predictions.find(
    (p) => p.id === predictionId
  );
  const vendor = prediction?.search_results.find(
    (sr) => sr.id === vendorId
  );

  if (!vendor || !prediction) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.mutedText }]}>
          Product details not found.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const isInStock = vendor.availability.toLowerCase().includes("in stock");
  const isOutOfStock = vendor.availability
    .toLowerCase()
    .includes("out of stock");
  const availabilityColor = isInStock
    ? colors.green
    : isOutOfStock
      ? colors.danger
      : colors.blue;

  const formattedPrice =
    vendor.price != null
      ? `${vendor.currency} ${vendor.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Price not available";

  // Extract domain from URL for button text
  const getDomain = (url: string): string => {
    try {
      const u = new URL(url);
      return u.hostname.replace("www.", "");
    } catch {
      return "vendor site";
    }
  };

  const placeholderImage =
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop";

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Product hero image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vendor.image_url || placeholderImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Product info card */}
      <View style={styles.infoContainer}>
        {/* Vendor domain link */}
        <Text style={[styles.vendorDomain, { color: colors.blue }]}>
          {getDomain(vendor.product_url)}
        </Text>

        {/* Product title */}
        <Text style={[styles.productTitle, { color: colors.text }]}>
          {vendor.product_title}
        </Text>

        {/* Part name from prediction */}
        <Text style={[styles.partName, { color: colors.text }]}>
          {prediction.part_name}
        </Text>

        {/* Availability badge */}
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor: isInStock
                ? colors.lightgreen
                : isOutOfStock
                  ? "#FDDEDE"
                  : colors.lightblue,
            },
          ]}
        >
          <Text style={[styles.availabilityText, { color: availabilityColor }]}>
            {vendor.availability}
          </Text>
        </View>

        {/* Price */}
        <Text style={[styles.price, { color: colors.text }]}>
          {formattedPrice}
        </Text>

        {/* Key Specifications section */}
        {(prediction.part_number || prediction.manufacturer) && (
          <View style={styles.specsSection}>
            <View style={styles.specsSectionHeader}>
              <Text style={[styles.specsIcon, { color: colors.text }]}>
                {"\u2699"}
              </Text>
              <Text style={[styles.specsTitle, { color: colors.text }]}>
                Key Specifications
              </Text>
            </View>
            <View
              style={[
                styles.specsCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {prediction.part_number && (
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.mutedText }]}>
                    Part Number
                  </Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>
                    {prediction.part_number}
                  </Text>
                </View>
              )}
              {prediction.manufacturer && (
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.mutedText }]}>
                    Manufacturer
                  </Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>
                    {prediction.manufacturer}
                  </Text>
                </View>
              )}
              {vendor.location && (
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.mutedText }]}>
                    Location
                  </Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>
                    {vendor.location}
                  </Text>
                </View>
              )}
              <View style={styles.specRow}>
                <Text style={[styles.specLabel, { color: colors.mutedText }]}>
                  Confidence
                </Text>
                <Text style={[styles.specValue, { color: colors.text }]}>
                  {Math.round(vendor.confidence_score * 100)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Product Description section */}
        {(vendor.description || prediction.description) && (
          <View style={styles.descriptionSection}>
            <View style={styles.specsSectionHeader}>
              <Text style={[styles.specsIcon, { color: colors.text }]}>
                {"\u24D8"}
              </Text>
              <Text style={[styles.specsTitle, { color: colors.text }]}>
                Product Description
              </Text>
            </View>
            <View
              style={[
                styles.descriptionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.descriptionText, { color: colors.text }]}>
                {vendor.description || prediction.description}
              </Text>
            </View>
          </View>
        )}

        {/* Go to vendor site button */}
        <Pressable
          onPress={() => Linking.openURL(vendor.product_url)}
          style={({ pressed }) => [
            styles.goToButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.goToButtonText, { color: colors.text }]}>
            Go to: {getDomain(vendor.product_url)}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: { fontSize: 15, textAlign: "center", marginBottom: 16 },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  backButtonText: { fontSize: 15, fontWeight: "600" },
  imageContainer: {
    width: "100%",
    height: 280,
    backgroundColor: "#f5f5f5",
  },
  heroImage: { width: "100%", height: "100%" },
  infoContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  vendorDomain: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 4,
  },
  partName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  availabilityBadge: {
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  availabilityText: { fontSize: 13, fontWeight: "600" },
  price: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  specsSection: { marginBottom: 20 },
  specsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  specsIcon: { fontSize: 16 },
  specsTitle: { fontSize: 16, fontWeight: "700" },
  specsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specLabel: { fontSize: 14, fontWeight: "500" },
  specValue: { fontSize: 14, fontWeight: "600" },
  descriptionSection: { marginBottom: 24 },
  descriptionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
  },
  goToButton: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  goToButtonText: { fontSize: 16, fontWeight: "700" },
});
