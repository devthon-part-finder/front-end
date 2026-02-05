import { router, type Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useLayout } from "../providers/LayoutProvider";
import { useTheme } from "../providers/ThemeProvider";

// TopNavbar: shows the current screen title and a logout action.
export function TopNavbar() {
  const { colors } = useTheme();
  const { title } = useLayout();
  const { logout } = useAuth();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <View style={[styles.titleContainer]}>
        <Text style={[styles.title, { color: colors.text }]}>PF</Text>
      </View>

      <Pressable
        style={styles.userContainer}
        onPress={() => router.replace("/(app)/home" as Href)}
      >
        <Image
          source={require("@/assets/images/user.png")}
          style={styles.userIcon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderTopWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#FFD700",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    borderRadius: 4,
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
  userContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#FFD700",
  },
  userIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
