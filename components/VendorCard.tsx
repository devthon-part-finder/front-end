import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";
import type { SearchResultRead } from "@/services/catalog-service";

interface Props {
  vendor: SearchResultRead;
}

export function VendorCard({ vendor }: Props) {
  const { colors } = useTheme();

  const isInStock = vendor.availability.toLowerCase().includes("in stock");
  const isOutOfStock = vendor.availability.toLowerCase().includes("out of stock");
  const availabilityColor = isInStock
    ? colors.green
    : isOutOfStock
      ? colors.danger
      : colors.mutedText;
  const availabilityBg = isInStock
    ? colors.lightgreen
    : isOutOfStock
      ? "#FDDEDE"
      : colors.border;

  const formattedPrice =
    vendor.price != null
      ? `${vendor.currency} ${vendor.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Price not available";

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {/* Vendor name + availability */}
      <View style={styles.headerRow}>
        <Text style={[styles.vendorName, { color: colors.text }]} numberOfLines={1}>
          {vendor.vendor_name}
        </Text>
        <View style={[styles.availabilityBadge, { backgroundColor: availabilityBg }]}>
          <Text style={[styles.availabilityText, { color: availabilityColor }]}>
            {vendor.availability}
          </Text>
        </View>
      </View>

      {/* Product title */}
      <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
        {vendor.product_title}
      </Text>

      {/* Description */}
      {vendor.description ? (
        <Text style={[styles.description, { color: colors.mutedText }]} numberOfLines={2}>
          {vendor.description}
        </Text>
      ) : null}

      {/* Price + location row */}
      <View style={styles.detailsRow}>
        <Text style={[styles.price, { color: colors.text }]}>{formattedPrice}</Text>
        {vendor.location ? (
          <Text style={[styles.location, { color: colors.mutedText }]}>{vendor.location}</Text>
        ) : null}
      </View>

      {/* Source type badge */}
      <View style={styles.metaRow}>
        <View style={[styles.sourceBadge, { backgroundColor: colors.lightblue }]}>
          <Text style={[styles.sourceText, { color: colors.blue }]}>
            {vendor.source_type === "serper_snippet" ? "Fast Result" : "AI Scraped"}
          </Text>
        </View>
        <Text style={[styles.confidence, { color: colors.mutedText }]}>
          {Math.round(vendor.confidence_score * 100)}% match
        </Text>
      </View>

      {/* Buy Now button */}
      <Pressable
        onPress={() => Linking.openURL(vendor.product_url)}
        style={({ pressed }) => [
          styles.buyButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buyButtonText, { color: colors.text }]}>View Product</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vendorName: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 8 },
  availabilityBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  availabilityText: { fontSize: 11, fontWeight: "600" },
  productTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  description: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: { fontSize: 18, fontWeight: "700" },
  location: { fontSize: 13 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sourceBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  sourceText: { fontSize: 11, fontWeight: "600" },
  confidence: { fontSize: 12 },
  buyButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: { fontSize: 15, fontWeight: "600" },
});
