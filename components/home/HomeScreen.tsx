import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

// Home screen: landing page after authentication.
export function HomeScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Home</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        You are logged in. Use the bottom tabs to explore.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
});
