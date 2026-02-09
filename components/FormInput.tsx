import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

// FormInput: labeled input with theme-aware styling.
export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.black }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.mutedText, color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={"none"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    // textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
});
