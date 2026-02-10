import { useLayout } from "@/providers/LayoutProvider";
import { useMessage } from "@/providers/MessageProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { getCachedPartSearch } from "@/services/predictions-cache";
import type { VendorResult } from "@/services/web-agent-service";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Prediction detail screen
export default function PredictionDetail() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { showMessage } = useMessage();
  const params = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [vendor, setVendor] = useState<VendorResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const getParam = (key: string): string | undefined => {
    const raw = params[key];
    if (Array.isArray(raw)) return raw[0];
    return typeof raw === "string" ? raw : undefined;
  };

  const idParam = getParam("id");
  const partName = (getParam("part_name") || "").trim();
  const loc = (getParam("location") || "Sri Lanka").trim() || "Sri Lanka";
  const index = (() => {
    const n = Number.parseInt(idParam || "-1", 10);
    return Number.isFinite(n) ? n : -1;
  })();

  useEffect(() => {
    setTitle("Product Details");
  }, [setTitle]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!partName) {
        setVendor(null);
        setLoadError(null);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const cached = getCachedPartSearch();
        const cachedMatches =
          !!cached &&
          cached.partName.trim() === partName &&
          cached.location.trim() === loc;

        if (!cachedMatches) {
          throw new Error(
            "No cached results found for this item. Please go back to Predictions and open the product again.",
          );
        }

        const selected = cached.response.results?.[index] ?? null;
        if (isMounted) {
          setVendor(selected);
          setTitle(selected?.product_title || "Product Details");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        showMessage({ type: "error", message });
        if (isMounted) {
          setVendor(null);
          setLoadError(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [index, loc, partName, setTitle, showMessage]);

  const priceText =
    typeof vendor?.price === "number" && !Number.isNaN(vendor.price)
      ? `${(vendor.currency || "").trim()} ${vendor.price}`.trim()
      : null;

  const confidence =
    typeof vendor?.confidence_score === "number"
      ? vendor.confidence_score
      : null;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.statusTitle, { color: colors.text }]}>
          Loading…
        </Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.statusTitle, { color: colors.text }]}>
          {loadError ? "Unable to load product" : "Product not found"}
        </Text>
        {!!loadError && (
          <Text style={[styles.statusSubtitle, { color: colors.mutedText }]}>
            {loadError}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.border },
            ]}
          >
            <MaterialIcons
              name="image-not-supported"
              size={36}
              color={colors.mutedText}
            />
            <Text
              style={[styles.imagePlaceholderText, { color: colors.mutedText }]}
            >
              No image found
            </Text>
          </View>

          <Text style={[styles.productTitle, { color: colors.text }]}>
            {vendor.product_title}
          </Text>

          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                Vendor
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {vendor.vendor_name}
              </Text>
            </View>

            {!!priceText && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                  Price
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {priceText}
                </Text>
              </View>
            )}

            {!!vendor.availability && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                  Availability
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {vendor.availability}
                </Text>
              </View>
            )}

            {!!vendor.source_type && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                  Source
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {vendor.source_type}
                </Text>
              </View>
            )}

            {typeof confidence === "number" && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                  Confidence
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {Math.round(confidence * 100)}%
                </Text>
              </View>
            )}

            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.mutedText }]}>
                Location
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {loc}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.buttonContainer, { backgroundColor: colors.background }]}
      >
        <Pressable
          style={[styles.detailsButton, { backgroundColor: colors.primary }]}
          onPress={async () => {
            try {
              await Linking.openURL(vendor.product_url);
            } catch {
              showMessage({
                type: "error",
                message: "Unable to open the product link.",
              });
            }
          }}
        >
          <Text style={[styles.detailsButtonText, { color: colors.black }]}>
            Open Product Link
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  statusSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontWeight: "500",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  metaCard: {
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 0,
  },
  metaValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  detailsButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
