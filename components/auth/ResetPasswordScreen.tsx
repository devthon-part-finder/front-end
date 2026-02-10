import { router, useLocalSearchParams, type Href } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { useMessage } from "../../providers/MessageProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { FormInput } from "../FormInput";
import { PrimaryButton } from "../PrimaryButton";

// Reset password screen: set a new password using verified code.
export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuth();
  const { showMessage } = useMessage();

  const params = useLocalSearchParams<{ email?: string; code?: string }>();
  const email = useMemo(
    () => (params.email ? String(params.email) : ""),
    [params.email],
  );
  const code = useMemo(
    () => (params.code ? String(params.code) : ""),
    [params.code],
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showMessage({
        type: "error",
        message: "Passwords do not match. Please confirm your new password.",
      });
      return;
    }

    try {
      await resetPassword(email, code, newPassword);
      showMessage({
        type: "success",
        message: "Password updated. You can now sign in.",
      });
      router.replace("/(auth)/login" as Href);
    } catch (error) {
      showMessage({
        type: "error",
        message: String((error as Error).message || error),
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/auth/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={[styles.title, { color: colors.primary }]}>
                Part Finder
              </Text>
              <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                Create a new password for your account.
              </Text>

              <View style={styles.form}>
                <FormInput
                  label="Email"
                  value={email}
                  onChangeText={() => undefined}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  editable={false}
                />
                <FormInput
                  label="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter your new password"
                  secureTextEntry
                />
                <FormInput
                  label="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your new password"
                  secureTextEntry
                />

                <PrimaryButton
                  title={isLoading ? "Updating..." : "Update password"}
                  onPress={handleReset}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  card: {
    gap: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    paddingBottom: 24,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
});
