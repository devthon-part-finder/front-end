import { useTheme } from "@/providers/ThemeProvider";
import { router, usePathname, type Href } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// BottomNavbar: minimal two-tab navbar for Home and Example.
export function BottomNavbar() {
  const { colors } = useTheme();
  const pathname = usePathname();

  const isHome = pathname.includes("/home");
  const isExample = pathname.includes("/example");

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <Pressable
        onPress={() => router.replace("/(app)/home" as Href)}
        style={styles.tab}
      >
        <Text
          style={[
            styles.label,
            { color: isHome ? colors.primary : colors.mutedText },
          ]}
        >
          Home
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace("/(app)/example" as Href)}
        style={styles.tab}
      >
        <Text
          style={[
            styles.label,
            { color: isExample ? colors.primary : colors.mutedText },
          ]}
        >
          Example
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
