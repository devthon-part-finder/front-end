import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PredictionCard } from "../../../components/PredictionCard";

// Predictions screen: landing page after authentication.
export default function PredictionsIndex() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();

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
          "Top-left valve near the motor"
        </Text>
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
