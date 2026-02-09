import { router, type Href } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { FormInput } from "../FormInput";
import { PrimaryButton } from "../PrimaryButton";

// Signup screen: username, email, password, confirm password.
export default function SignupScreen() {
  const { colors } = useTheme();
  const { signup, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please confirm your password.");
      return;
    }

    try {
      await signup({ username, email, password });
      router.replace("/(app)/home" as Href);
    } catch (error) {
      Alert.alert("Signup failed", String((error as Error).message || error));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>
          Create account
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>
          Join PartFinder today
        </Text>

        <View style={styles.form}>
          <FormInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Your name"
          />
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <FormInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <PrimaryButton
            title={isLoading ? "Creating..." : "Sign up"}
            onPress={handleSignup}
            disabled={isLoading}
          />
        </View>

        <Text
          style={[styles.linkText, { color: colors.primary }]}
          onPress={() => router.push("/(auth)/login")}
        >
          Already have an account? Login
        </Text>
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
  linkText: {
    marginTop: 8,
    fontWeight: "600",
  },
});
