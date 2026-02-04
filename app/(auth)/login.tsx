import { router, type Href } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { FormInput } from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";

// Login screen: email + password authentication.
export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace("/(app)/home" as Href);
    } catch (error) {
      Alert.alert("Login failed", String((error as Error).message || error));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>
          Sign in to continue
        </Text>

        <View style={styles.form}>
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
          <PrimaryButton
            title={isLoading ? "Signing in..." : "Login"}
            onPress={handleLogin}
            disabled={isLoading}
          />
        </View>

        <View style={styles.links}>
          <Text
            style={[styles.linkText, { color: colors.primary }]}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            Forgot password?
          </Text>
          <Text
            style={[styles.linkText, { color: colors.primary }]}
            onPress={() => router.push("/(auth)/signup")}
          >
            Create account
          </Text>
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
  links: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    fontWeight: "600",
  },
});
