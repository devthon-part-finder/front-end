import { useTheme } from "@/providers/ThemeProvider";
import { router, usePathname, type Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// BottomNavbar: Mobile bottom navigation with Home, Search, and History tabs
export function BottomNavbar() {
  const { colors } = useTheme();
  const pathname = usePathname();

  const isHome = pathname.includes("/home");
  const isSearch = pathname.includes("/search");
  const isHistory = pathname.includes("/history");

  const NavigationTab = ({
    icon,
    label,
    isActive,
    onPress,
  }: {
    icon: any;
    label: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Pressable onPress={onPress} style={styles.tab}>
      <Image
        source={icon}
        style={[
          styles.icon,
          { tintColor: isActive ? colors.primary : colors.mutedText },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: isActive ? colors.primary : colors.mutedText },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.container,
        { borderTopColor: colors.border, backgroundColor: colors.background },
      ]}
    >
      <NavigationTab
        icon={require("@/assets/images/home.png")}
        label="Home"
        isActive={isHome}
        onPress={() => router.replace("/(app)/home" as Href)}
      />
      <NavigationTab
        icon={require("@/assets/images/search.png")}
        label="Search"
        isActive={isSearch}
        onPress={() => {
          // Navigate to search page when implemented
          console.log("Search pressed");
        }}
      />
      <NavigationTab
        icon={require("@/assets/images/history.png")}
        label="History"
        isActive={isHistory}
        onPress={() => {
          // Navigate to history page when implemented
          console.log("History pressed");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
