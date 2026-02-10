import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";
import type { PredictionWithResults } from "@/services/catalog-service";

interface Props {
  prediction: PredictionWithResults;
  onFindVendors?: (predictionId: string) => void;
}

export function PredictionCard({ prediction, onFindVendors }: Props) {
  const { colors } = useTheme();

  const confidence = prediction.confidence_score;
  const matchPct = Math.round(confidence * 100);

  const badgeBg =
    confidence >= 0.9
      ? colors.lightgreen
      : confidence >= 0.7
        ? colors.lightblue
        : "#FDDEDE";
  const badgeText =
    confidence >= 0.9 ? colors.green : confidence >= 0.7 ? colors.blue : colors.danger;
  const barFill =
    confidence >= 0.9
      ? colors.lightgreen
      : confidence >= 0.7
        ? colors.lightblue
        : colors.danger;

  const placeholderImage =
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop";

  return (
    <View
      style={[styles.card, { borderColor: colors.primary, backgroundColor: colors.surface }]}
    >
      {/* Image + match badge */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: prediction.image_url || placeholderImage }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={[styles.matchBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.matchText, { color: badgeText }]}>{matchPct}% match</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{prediction.part_name}</Text>

        {prediction.part_number ? (
          <Text style={[styles.partNumber, { color: colors.mutedText }]}>
            Part #{prediction.part_number}
          </Text>
        ) : null}

        {prediction.manufacturer ? (
          <Text style={[styles.partNumber, { color: colors.mutedText }]}>
            {prediction.manufacturer}
          </Text>
        ) : null}

        {prediction.description ? (
          <Text style={[styles.description, { color: colors.mutedText }]} numberOfLines={3}>
            {prediction.description}
          </Text>
        ) : null}

        {/* Confidence bar */}
        <View>
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidenceLabel, { color: colors.mutedText }]}>Confidence</Text>
            <Text style={[styles.confidenceValue, { color: colors.text }]}>{matchPct}%</Text>
          </View>
          <View style={styles.confidenceBarContainer}>
            <View style={[styles.confidenceBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.confidenceBarFill,
                  { width: `${matchPct}%`, backgroundColor: barFill },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Find Vendors button */}
        {onFindVendors && (
          <Pressable
            onPress={() => onFindVendors(prediction.id)}
            style={({ pressed }) => [
              styles.vendorButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.vendorButtonText, { color: colors.text }]}>
              {prediction.search_results.length > 0 ? "View Vendors" : "Find Vendors"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  imageContainer: { position: "relative", width: "100%", height: 160 },
  productImage: { width: "100%", height: "100%" },
  matchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  matchText: { fontSize: 12, fontWeight: "600" },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  partNumber: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  confidenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confidenceLabel: { fontSize: 14, fontWeight: "500" },
  confidenceValue: { fontSize: 16, fontWeight: "700" },
  confidenceBarContainer: { marginTop: 8 },
  confidenceBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  confidenceBarFill: { height: "100%", borderRadius: 3 },
  vendorButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  vendorButtonText: { fontSize: 15, fontWeight: "600" },
});
