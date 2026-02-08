import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PredictionResult {
  id: number;
  title: string;
  partNumber: string;
  confidence: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
  thumbnails: string[];
  keySpecs: string;
}

// Prediction detail screen
export default function PredictionDetail() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { id } = useLocalSearchParams();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sample prediction data (in real app, this would come from API)
  const predictionResults: PredictionResult[] = [
    {
      id: 1,
      title: "FEETECH High-Torque Servo FS5115M",
      partNumber: "Part #PLV-300721",
      confidence: 0.96,
      imageUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      description:
        "The FS5115M is a standard-size analog servo from FEETECH that has an all metal gear train and delivers extra-high torque normally associated with much larger servos. Servo horns and associated hardware are included. This servo can work with both 5 V and 3.3 V servo signals.",
      inStock: true,
      keySpecs: "8 V, 0.2 sec/60°, 218 oz-in (15.5 kg-cm), 62 g",
      thumbnails: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=150&h=150&fit=crop",
      ],
    },
    {
      id: 2,
      title: "Hydraulic Pump Module",
      partNumber: "Part #HPM-450832",
      confidence: 0.89,
      imageUrl:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
      description:
        "High-performance hydraulic pump designed for industrial applications with enhanced durability and efficiency ratings...",
      inStock: true,
      keySpecs: "12 V, 3000 RPM, 45 PSI, 2.5 kg",
      thumbnails: [
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=150&h=150&fit=crop",
      ],
    },
    {
      id: 3,
      title: "Industrial Gear Assembly",
      partNumber: "Part #IGA-123456",
      confidence: 0.75,
      imageUrl:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop",
      description:
        "Heavy-duty gear assembly designed for high-torque industrial applications with enhanced wear resistance and precision engineering...",
      inStock: false,
      keySpecs: "24 V, 1:10 ratio, 150 Nm, 3.2 kg",
      thumbnails: [
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop",
      ],
    },
  ];

  useEffect(() => {
    // Find the prediction based on the ID parameter
    const foundPrediction = predictionResults.find(
      (p) => p.id === parseInt(id as string),
    );
    setPrediction(foundPrediction || null);
    setTitle(foundPrediction?.title || "Product Details");
  }, [id, setTitle]);

  if (!prediction) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.contentContainer}>
        {/* Main Product Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: prediction.imageUrl }}
            style={[styles.mainImage, { borderColor: colors.primary }]}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, { backgroundColor: colors.surface }]}>
          <Text style={[styles.productTitle, { color: colors.text }]}>
            {prediction.title}
          </Text>

          {/* Thumbnail Images */}
          <View style={styles.thumbnailContainer}>
            {prediction.thumbnails.map((thumbnail, index) => (
              <View
                key={index}
                style={[
                  styles.thumbnailWrapper,
                  { borderColor: colors.border },
                ]}
              >
                <Image
                  source={{ uri: thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* View Details Button - Fixed at bottom */}
      <View
        style={[styles.buttonContainer, { backgroundColor: colors.background }]}
      >
        <Pressable
          style={[styles.detailsButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={[styles.detailsButtonText, { color: colors.black }]}>
            View Details
          </Text>
        </Pressable>
      </View>

      {/* Bottom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setIsModalVisible(false)}
          />
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <View
              style={[styles.modalHandle, { backgroundColor: colors.border }]}
            />

            <ScrollView style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {prediction.title}
              </Text>

              <View style={styles.stockContainer}>
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor: prediction.inStock
                        ? colors.green
                        : colors.danger,
                    },
                  ]}
                >
                  <Text style={styles.stockText}>
                    {prediction.inStock ? "In Stock" : "Out of Stock"}
                  </Text>
                </View>
              </View>

              <View style={styles.specSection}>
                <View style={styles.specHeader}>
                  <Text style={[styles.specTitle, { color: colors.text }]}>
                    Key Specifications
                  </Text>
                </View>
                <Text style={[styles.specText, { color: colors.mutedText }]}>
                  {prediction.keySpecs}
                </Text>
              </View>

              <View style={styles.descSection}>
                <View style={styles.descHeader}>
                  <Text style={[styles.descTitle, { color: colors.text }]}>
                    Product Description
                  </Text>
                </View>
                <Text style={[styles.descText, { color: colors.mutedText }]}>
                  {prediction.description}
                </Text>
              </View>
            </ScrollView>

            <View
              style={[
                styles.modalButtonContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.modalButtonText, { color: colors.black }]}>
                  Go to: pololu.com
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "500",
  },
  mainImageContainer: {
    padding: 20,
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    borderWidth: 3,
  },
  productInfo: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    height: "100%",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: "left",
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  detailsButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "60%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  stockContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stockBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  specSection: {
    marginBottom: 20,
  },
  specHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  specTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  specText: {
    fontSize: 14,
    lineHeight: 20,
  },
  descSection: {
    marginBottom: 20,
  },
  descHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
