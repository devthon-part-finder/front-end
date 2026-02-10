import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PredictionCard } from "../../../components/PredictionCard";

// Predictions screen: landing page after authentication.
export default function PredictionsIndex() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const params = useLocalSearchParams<{
    inferred_type?: string;
    width_mm?: string;
    height_mm?: string;
    description?: string;
  }>();

  useEffect(() => {
    setTitle("Predictions");
  }, [setTitle]);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
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
          4 results found • Ordered by confidence
        </Text>
      </View>
      <PredictionCard />
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
