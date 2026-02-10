import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";
import type { VendorResult } from "../services/web-agent-service";

export function PredictionCard({
  results,
  partName,
  location,
}: {
  results: VendorResult[];
  partName: string;
  location: string;
}) {
  const { colors } = useTheme();

  const formatPrice = (price?: number | null, currency?: string | null) => {
    if (typeof price !== "number" || Number.isNaN(price)) return null;
    const cur = (currency || "").trim();
    return cur ? `${cur} ${price}` : String(price);
  };

  return (
    <View style={styles.container}>
      {results.map((item, index) => {
        const confidence =
          typeof item.confidence_score === "number" ? item.confidence_score : 0;
        const priceText = formatPrice(item.price, item.currency);

        return (
          <Pressable
            key={`${item.vendor_name}_${item.product_url}_${index}`}
            style={[
              styles.card,
              { borderColor: colors.primary, backgroundColor: colors.surface },
            ]}
            onPress={() => {
              router.push({
                pathname: "/(pages)/predictions/(part)/[id]",
                params: {
                  id: String(index),
                  part_name: partName,
                  location,
                },
              });
            }}
          >
            {/* Product image with badge overlay */}
            <View style={styles.imageContainer}>
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.border },
                ]}
              >
                <MaterialIcons
                  name="image-not-supported"
                  size={32}
                  color={colors.mutedText}
                />
                <Text
                  style={[
                    styles.imagePlaceholderText,
                    { color: colors.mutedText },
                  ]}
                >
                  No image found
                </Text>
              </View>
              {/* Match percentage badge */}
              <View
                style={[
                  styles.matchBadge,
                  confidence < 0.9
                    ? { backgroundColor: colors.lightblue }
                    : { backgroundColor: colors.lightgreen },
                ]}
              >
                <Text
                  style={[
                    styles.matchText,
                    confidence < 0.9
                      ? { color: colors.blue }
                      : { color: colors.green },
                  ]}
                >
                  {Math.round(confidence * 100)}% match
                </Text>
              </View>
            </View>

            {/* Content section */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]}>
                {item.product_title}
              </Text>
              <Text style={[styles.partNumber, { color: colors.mutedText }]}>
                {item.vendor_name}
              </Text>
              {!!priceText && (
                <Text style={[styles.description, { color: colors.mutedText }]}>
                  Price: {priceText}
                </Text>
              )}
              {!!item.availability && (
                <Text style={[styles.description, { color: colors.mutedText }]}>
                  Availability: {item.availability}
                </Text>
              )}

              {/* Confidence section */}
              <View>
                <View style={styles.confidenceContainer}>
                  <Text
                    style={[
                      styles.confidenceLabel,
                      { color: colors.mutedText },
                    ]}
                  >
                    Confidence
                  </Text>
                  <Text
                    style={[styles.confidenceValue, { color: colors.text }]}
                  >
                    {Math.round(confidence * 100)}%
                  </Text>
                </View>
                {/* Confidence bar */}
                <View style={styles.confidenceBarContainer}>
                  <View
                    style={[
                      styles.confidenceBar,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.confidenceBarFill,
                        {
                          width: `${Math.max(0, Math.min(1, confidence)) * 100}%`,
                          backgroundColor:
                            confidence >= 0.9
                              ? colors.lightgreen
                              : confidence >= 0.7
                                ? colors.lightblue
                                : colors.danger,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  matchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  partNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  confidenceBarContainer: {
    marginTop: 8,
  },
  confidenceBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
