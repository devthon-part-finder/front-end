import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

interface CameraScreenProps {
  onCapture: (imageUri: string) => void;
  onClose: () => void;
}

export function CameraScreen({ onCapture, onClose }: CameraScreenProps) {
  const { colors } = useTheme();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Don't auto-open camera - let user trigger it manually

  const openCamera = async () => {
    try {
      console.log("Opening camera...");
      setIsLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log("Camera timeout - taking too long");
        setIsLoading(false);
        Alert.alert(
          "Camera Timeout",
          "Camera is taking too long to open. Please use the gallery instead.",
          [{ text: "OK" }]
        );
      }, 5000); // 5 second timeout

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      
      if (status !== "granted") {
        clearTimeout(timeoutId);
        console.log("Camera permission denied");
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera permission to capture images, or use gallery instead.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }

      console.log("Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      clearTimeout(timeoutId);
      console.log("Camera result:", result);
      setIsLoading(false);

      if (!result.canceled && result.assets[0]) {
        console.log("Image captured:", result.assets[0].uri);
        setCapturedImage(result.assets[0].uri);
      } else {
        console.log("Camera canceled");
        // User canceled camera, stay on screen to allow gallery option
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setIsLoading(false);
      Alert.alert(
        "Camera Error",
        `Failed to open camera: ${error}. Please try using the gallery instead.`,
        [{ text: "OK" }]
      );
    }
  };

  const openGallery = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      setIsLoading(false);

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Gallery error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Don't auto-open, let user choose again
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.black }]}>
      {/* Camera Viewfinder */}
      <View style={styles.viewfinder}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        ) : (
          <View style={styles.loadingContainer}>
            {isLoading ? (
              <>
                <Ionicons name="camera-outline" size={64} color="#FFFFFF" style={styles.centerIcon} />
                <Text style={styles.loadingText}>Opening Camera...</Text>
              </>
            ) : (
              <>
                <Ionicons name="scan-outline" size={80} color="rgba(255, 255, 255, 0.3)" style={styles.centerIcon} />
                <Text style={styles.instructionTitle}>Capture Your Part</Text>
                <Text style={styles.instructionSubtitle}>
                  Take a photo or choose from gallery{"\n"}to search for your industrial part
                </Text>
              </>
            )}
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={[styles.controls, { backgroundColor: colors.black }]}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>

        {/* Action Buttons */}
        {capturedImage ? (
          <>
            <Pressable style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.buttonText}>Retake</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.cameraButton} onPress={openCamera} disabled={isLoading}>
              <View style={styles.buttonContent}>
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Camera</Text>
              </View>
            </Pressable>
            <Pressable style={styles.galleryButton} onPress={openGallery} disabled={isLoading}>
              <View style={styles.buttonContent}>
                <Ionicons name="images" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Gallery</Text>
              </View>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewfinder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  centerIcon: {
    marginBottom: 20,
  },
  instructionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  instructionSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  retakeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  confirmButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#10B981",
  },
  cameraButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
  },
  galleryButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
