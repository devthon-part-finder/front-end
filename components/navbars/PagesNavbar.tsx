import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLayout } from "../../providers/LayoutProvider";
import { useTheme } from "../../providers/ThemeProvider";

// PagesNavbar: back button + current page title (used for /(pages) routes).
export function PagesNavbar() {
  const { colors } = useTheme();
  const { title } = useLayout();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
          shadowColor: colors.black,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </Pressable>

        <Text style={[styles.title, { color: colors.black }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderTopWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "700",
    flexShrink: 1,
  },
  rightSpacer: {
    width: 44,
    height: 44,
  },
});
