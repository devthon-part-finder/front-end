import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

// Example screen: placeholder for future content.
export function ExampleScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Example");
  }, [setTitle]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Example</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        This is a placeholder page. Add more screens here.
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
