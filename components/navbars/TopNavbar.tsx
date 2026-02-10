import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { UserMenu } from "../UserMenu";

// TopNavbar: shows the current screen title and a logout action.
export function TopNavbar() {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

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
      <View
        style={[styles.titleContainer, { backgroundColor: colors.secondary }]}
      >
        <Text style={[styles.title, { color: "white" }]}>P</Text>
      </View>

      <Pressable
        style={[styles.userContainer, { backgroundColor: colors.secondary }]}
        onPress={() => setMenuVisible(true)}
      >
        <Image
          source={require("@/assets/images/user.png")}
          style={styles.userIcon}
        />
      </Pressable>

      <UserMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    // borderRadius: 24,
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
  titleContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
  userContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
