import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function UserMenu({ visible, onClose }: UserMenuProps) {
  const { logout,isAuthenticated } = useAuth();
  const { colors } = useTheme();

  const handleLogout = async () => {
    onClose();
    await logout();
    console.log("Logged out successfully", isAuthenticated);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Menu Container */}
      <View
        style={[
          styles.menuContainer,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        {/* Logout Option */}
        <Pressable style={[styles.menuItem]} onPress={handleLogout}>
          <Text style={[styles.menuText, { color: colors.black }]}>Logout</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 110,
    right: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
