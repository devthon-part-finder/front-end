import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function UserMenu({ visible, onClose }: UserMenuProps) {
  const { logout, isAuthenticated } = useAuth();
  const { colors } = useTheme();

  const handleLogout = async () => {
    onClose();
    await logout();
    console.log("Logged out successfully", isAuthenticated);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Menu Container */}
        <View
          style={[
            styles.menuContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          {/* Arrow indicator */}
          <View
            style={[
              styles.arrow,
              { borderBottomColor: colors.background },
            ]}
          />

          {/* Logout Option */}
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: colors.border, opacity: 0.8 },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#e74c3c"
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: "#e74c3c" }]}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 100,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 160,
    paddingVertical: 4,
  },
  arrow: {
    position: "absolute",
    top: -8,
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
