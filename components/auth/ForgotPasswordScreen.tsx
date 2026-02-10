import { router, type Href } from "expo-router";
import React, { useState } from "react";
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

// Forgot password screen: request a 6-digit verification code by email.
export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { sendResetCode, isLoading } = useAuth();
  const { showMessage } = useMessage();

  const [email, setEmail] = useState("");

  const handleSendCode = async () => {
    try {
      const message = await sendResetCode(email);
      showMessage({
        type: "success",
        message: message || "Reset code sent. Check your email.",
      });

      router.push({
        pathname: "/(auth)/forgot-password/verify-code",
        params: { email },
      } as unknown as Href);
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
                Enter your email to get a reset code.
              </Text>

              <View style={styles.form}>
                <FormInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />

                <PrimaryButton
                  title={isLoading ? "Sending..." : "Send code"}
                  onPress={handleSendCode}
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
