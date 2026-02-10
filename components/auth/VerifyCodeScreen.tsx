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

// Verify code screen: enter 6-digit code sent to email.
export default function VerifyCodeScreen() {
  const { colors } = useTheme();
  const { verifyResetCode, isLoading } = useAuth();
  const { showMessage } = useMessage();

  const params = useLocalSearchParams<{ email?: string }>();
  const email = useMemo(
    () => (params.email ? String(params.email) : ""),
    [params.email],
  );

  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      await verifyResetCode(email, code);
      showMessage({ type: "success", message: "Code verified successfully." });
      router.push({
        pathname: "/(auth)/forgot-password/reset-password",
        params: { email, code },
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
                Enter the 6-digit code sent to your email.
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
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="numeric"
                />

                <PrimaryButton
                  title={isLoading ? "Verifying..." : "Verify code"}
                  onPress={handleVerify}
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
