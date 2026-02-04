import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { FormInput } from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";

// Forgot password screen: email -> receive 6-digit code -> set new password.
export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { sendResetCode, resetPassword, isLoading } = useAuth();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mockCode, setMockCode] = useState<string | null>(null);

  const handleSendCode = async () => {
    try {
      const generatedCode = await sendResetCode(email);
      setMockCode(generatedCode);
      setStep("reset");
      Alert.alert("Reset code sent", "Check your email for a 6-digit code.");
    } catch (error) {
      Alert.alert("Error", String((error as Error).message || error));
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please confirm your new password.",
      );
      return;
    }

    try {
      await resetPassword(email, code, newPassword);
      Alert.alert(
        "Password updated",
        "You can now sign in with your new password.",
      );
      setStep("email");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Reset failed", String((error as Error).message || error));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>
          Forgot password
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>
          {step === "email"
            ? "Enter your email to get a reset code."
            : "Enter the 6-digit code and your new password."}
        </Text>

        <View style={styles.form}>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />

          {step === "reset" && (
            <>
              <FormInput
                label="Reset code"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="numeric"
              />
              <FormInput
                label="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••••"
                secureTextEntry
              />
              <FormInput
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
              />
            </>
          )}

          {step === "email" ? (
            <PrimaryButton
              title={isLoading ? "Sending..." : "Send code"}
              onPress={handleSendCode}
              disabled={isLoading}
            />
          ) : (
            <PrimaryButton
              title={isLoading ? "Updating..." : "Update password"}
              onPress={handleResetPassword}
              disabled={isLoading}
            />
          )}

          {mockCode && step === "reset" && (
            <Text style={[styles.mockText, { color: colors.mutedText }]}>
              Mock code (dev only): {mockCode}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  mockText: {
    fontSize: 12,
  },
});
