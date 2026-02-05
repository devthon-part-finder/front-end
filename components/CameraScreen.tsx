import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface CameraScreenProps {
  onCapture: (imageUri: string) => void;
  onClose: () => void;
}

export function CameraScreen({ onCapture, onClose }: CameraScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    // Simulate camera capture
    const mockImageUri = "https://placeholder.co/400x300/666/FFF?text=Captured";
    setCapturedImage(mockImageUri);
    Alert.alert("Camera", "Image captured successfully!");
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Viewfinder */}
      <View style={styles.viewfinder}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        ) : (
          <>
            {/* Detection Box */}
            <View style={styles.detectionBox} />
            
            {/* Flash Button */}
            <Pressable style={styles.flashButton}>
              <Text style={styles.flashIcon}>⚡</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>

        {/* Capture/Confirm Button */}
        <Pressable
          style={styles.captureButton}
          onPress={capturedImage ? handleConfirm : handleCapture}
        >
          <View style={styles.captureButtonInner} />
        </Pressable>

        {/* Gallery Button */}
        <Pressable style={styles.galleryButton}>
          <View style={styles.galleryIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  viewfinder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
  },
  detectionBox: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#10B981",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  flashButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashIcon: {
    fontSize: 24,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: "#000000",
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
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});
