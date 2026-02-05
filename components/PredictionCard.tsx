import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

interface PredictionResult {
  id: number;
  title: string;
  partNumber: string;
  confidence: number;
  imageUrl: string;
  description: string;
}

export function PredictionCard() {
  const { colors } = useTheme();

  const predictionResults: PredictionResult[] = [
    {
      id: 1,
      title: "Top-Left Valve Assembly",
      partNumber: "Part #PLV-300721",
      confidence: 0.96,
      imageUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      description:
        "The FS810MA is a standard-size sealing servo from FESTECH that allows plain bear trail and offers extra-high torque normally associated with much...",
    },
    {
      id: 2,
      title: "Hydraulic Pump Module",
      partNumber: "Part #HPM-450832",
      confidence: 0.89,
      imageUrl:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
      description:
        "High-performance hydraulic pump designed for industrial applications with enhanced durability and efficiency ratings...",
    },
    {
      id: 3,
      title: "Industrial Gear Assembly",
      partNumber: "Part #IGA-123456",
      confidence: 0.75,
      imageUrl:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop",
      description:
        "Heavy-duty gear assembly designed for high-torque industrial applications with enhanced wear resistance and precision engineering...",
    },
  ];

  return (
    <View style={styles.container}>
      {predictionResults.map((prediction) => (
        <View
          key={prediction.id}
          style={[
            styles.card,
            { borderColor: colors.primary, backgroundColor: colors.surface },
          ]}
        >
          {/* Product image with badge overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: prediction.imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {/* Match percentage badge */}
            <View
              style={[
                styles.matchBadge,
                prediction.confidence < 0.9
                  ? { backgroundColor: colors.lightblue }
                  : { backgroundColor: colors.lightgreen },
              ]}
            >
              <Text
                style={[
                  styles.matchText,
                  prediction.confidence < 0.9
                    ? { color: colors.blue }
                    : { color: colors.green },
                ]}
              >
                {Math.round(prediction.confidence * 100)}% match
              </Text>
            </View>
          </View>

          {/* Content section */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              {prediction.title}
            </Text>
            <Text style={[styles.partNumber, { color: colors.mutedText }]}>
              {prediction.partNumber}
            </Text>
            <Text
              style={[styles.description, { color: colors.mutedText }]}
              numberOfLines={3}
            >
              {prediction.description}
            </Text>

            {/* Confidence section */}
            <View>
              <View style={styles.confidenceContainer}>
                <Text
                  style={[styles.confidenceLabel, { color: colors.mutedText }]}
                >
                  Confidence
                </Text>
                <Text style={[styles.confidenceValue, { color: colors.text }]}>
                  {Math.round(prediction.confidence * 100)}%
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
                        width: `${prediction.confidence * 100}%`,
                        backgroundColor:
                          prediction.confidence >= 0.9
                            ? colors.lightgreen
                            : prediction.confidence >= 0.7
                              ? colors.lightblue
                              : colors.danger,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
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
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: 120,
    height: 80,
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
