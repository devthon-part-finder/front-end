import { useAuth } from "@/providers/AuthProvider";
import { useCatalogSearch } from "@/providers/CatalogSearchProvider";
import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { uploadAndSearch } from "@/services/catalog-service";
import * as DocumentPicker from "expo-document-picker";
import { router, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RCSearchScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { getAuthHeader } = useAuth();
  const { setSearchResponse, setSearchDescription } = useCatalogSearch();

  const [file, setFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle("Reverse Catalog Search");
  }, [setTitle]);

  // -------------------------------------------------------------------------
  // Pick document
  // -------------------------------------------------------------------------
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/pdf",
        });
      }
    } catch {
      Alert.alert("Error", "Could not pick a document. Please try again.");
    }
  };

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleAnalyze = async () => {
    if (!file) {
      Alert.alert("Missing file", "Please upload a PDF document first.");
      return;
    }
    if (!description.trim()) {
      Alert.alert(
        "Missing description",
        "Please describe the part you are looking for."
      );
      return;
    }

    setLoading(true);
    try {
      const authHeader = await getAuthHeader();
      const response = await uploadAndSearch(
        authHeader,
        file,
        description.trim()
      );
      setSearchResponse(response);
      setSearchDescription(description.trim());
      router.push("/(app)/predictions" as Href);
    } catch (err) {
      Alert.alert(
        "Analysis failed",
        String((err as Error).message || "Something went wrong.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Upload Document header */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Upload Document
      </Text>

      {/* Upload area */}
      <Pressable
        onPress={handlePickDocument}
        style={[
          styles.uploadArea,
          { borderColor: colors.primary, backgroundColor: colors.surface },
        ]}
      >
        {/* Upload icon (circle with arrow) */}
        <View
          style={[styles.uploadIconCircle, { backgroundColor: colors.secondary }]}
        >
          <Text style={[styles.uploadArrow, { color: colors.primary }]}>
            {"\u2191"}
          </Text>
        </View>

        {file ? (
          <>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>
              {file.name}
            </Text>
            <Pressable onPress={() => setFile(null)}>
              <Text style={[styles.changeFile, { color: colors.danger }]}>
                Remove
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>
              Upload PDF or Image
            </Text>
            <Text style={[styles.uploadSubtitle, { color: colors.mutedText }]}>
              Drag and drop or click to browse
            </Text>
            <Text style={[styles.uploadSupported, { color: colors.mutedText }]}>
              Supported: PDF
            </Text>
          </>
        )}
      </Pressable>

      {/* Description input */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
        Describe the part you need
      </Text>
      <TextInput
        style={[
          styles.descriptionInput,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.surface,
          },
        ]}
        placeholder='e.g. "I need the drive belt from the motor assembly on page 15"'
        placeholderTextColor={colors.mutedText}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Analyze button */}
      <Pressable
        onPress={handleAnalyze}
        disabled={loading}
        style={({ pressed }) => [
          styles.analyzeButton,
          {
            backgroundColor: colors.primary,
            opacity: loading ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.text} />
            <Text style={[styles.analyzeButtonText, { color: colors.text, marginLeft: 8 }]}>
              Analyzing...
            </Text>
          </View>
        ) : (
          <Text style={[styles.analyzeButtonText, { color: colors.text }]}>
            Analyze Document
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  uploadArea: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadArrow: { fontSize: 22, fontWeight: "700" },
  uploadTitle: { fontSize: 16, fontWeight: "600" },
  uploadSubtitle: { fontSize: 13 },
  uploadSupported: { fontSize: 12, marginTop: 2 },
  changeFile: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    lineHeight: 22,
  },
  analyzeButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  analyzeButtonText: { fontSize: 17, fontWeight: "700" },
  loadingRow: { flexDirection: "row", alignItems: "center" },
});
