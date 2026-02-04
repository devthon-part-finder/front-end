import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useLayout } from "../providers/LayoutProvider";
import { useTheme } from "../providers/ThemeProvider";

// TopNavbar: shows the current screen title and a logout action.
export function TopNavbar() {
  const { colors } = useTheme();
  const { title } = useLayout();
  const { logout } = useAuth();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Pressable onPress={logout}>
        <Text style={[styles.action, { color: colors.primary }]}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
});
