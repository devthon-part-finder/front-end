import { router, type Href } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, ImageBackground } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { FormInput } from "../FormInput";
import { PrimaryButton } from "../PrimaryButton";

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
    <ImageBackground
      source={require("../../assets/images/auth/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={[styles.container]}>
        <View style={styles.card}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Part Finder
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            The Visual Search Engine for Industrial Hardware
          </Text>

          <View style={styles.form}>
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
            <View style={styles.forgotPasswordContainer}>
              <Text
                style={[styles.linkText, { color: colors.mutedText }]}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                Forgot password?
              </Text>
            </View>
            <PrimaryButton
              title={isLoading ? "Signing in..." : "Login"}
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>

          <View style={styles.createAccountContainer}>
            <Text
              style={[styles.linkText, { color: colors.mutedText }]}
              onPress={() => router.push("/(auth)/signup")}
            >
              Don’t have an account?
            </Text>
            <Text
              style={[styles.linkText, { color: colors.black, fontWeight: "700" }]}
              onPress={() => router.push("/(auth)/signup")}
            >
              Create account
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 48,
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
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",

  },
  linkText: {
    fontWeight: "500",
    fontSize: 16,
  },
});
