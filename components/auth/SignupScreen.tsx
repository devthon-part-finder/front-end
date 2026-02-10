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

// Signup screen: username, email, password, confirm password.
export default function SignupScreen() {
  const { colors } = useTheme();
  const { signup, isLoading } = useAuth();
  const { showMessage } = useMessage();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      showMessage({
        type: "error",
        message: "Passwords do not match. Please confirm your password.",
      });
      return;
    }

    try {
      await signup({ username, email, password });
      router.replace("/(app)/home" as Href);
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
                Create your account to get started
              </Text>

              <View style={styles.form}>
                <FormInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your name"
                />
                <FormInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
                <FormInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                />
                <FormInput
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                />

                <PrimaryButton
                  title={isLoading ? "Creating..." : "Create Account"}
                  onPress={handleSignup}
                  disabled={isLoading}
                />
              </View>

              <View style={styles.createAccountContainer}>
                <Text
                  style={[styles.linkText, { color: colors.mutedText }]}
                  onPress={() => router.push("/(auth)/login")}
                >
                  Already have an account?
                </Text>
                <Text
                  style={[
                    styles.linkText,
                    { color: colors.black, fontWeight: "700" },
                  ]}
                  onPress={() => router.push("/(auth)/login")}
                >
                  Login
                </Text>
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
  createAccountContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  linkText: {
    fontWeight: "500",
    fontSize: 16,
  },
});
