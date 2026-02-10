import { CameraScreen } from "@/components/CameraScreen";
import { SearchModal } from "@/components/SearchModal";
import { useLayout } from "@/providers/LayoutProvider";
import { useMessage } from "@/providers/MessageProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { analyzePart } from "@/services/parts-service";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

interface RecentSearch {
  id: string;
  title: string;
  matchesCount: number;
  timeAgo: string;
  imageUri: string;
}

// Home screen: landing page after authentication.
export default function HomeScreen() {
  const { colors } = useTheme();
  const { setTitle } = useLayout();
  const { showMessage } = useMessage();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches] = useState<RecentSearch[]>([
    {
      id: "1",
      title: "Industrial Gear Set",
      matchesCount: 12,
      timeAgo: "2 hours ago",
      imageUri:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Pressure Valve",
      matchesCount: 8,
      timeAgo: "3 hours ago",
      imageUri:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbJcJ7oki111u8ndMsyDo9Eu740cIe5WLUGQ&s",
    },
    {
      id: "3",
      title: "CPU Fan",
      matchesCount: 12,
      timeAgo: "5 hours ago",
      imageUri:
        "https://img.drz.lazcdn.com/static/lk/p/98b27d7080267b722336c8b6562ba909.jpg_960x960q80.jpg_.webp",
    },
    {
      id: "4",
      title: '5/8" X 1" IRON BOLT & NUT',
      matchesCount: 12,
      timeAgo: "1 hours ago",
      imageUri:
        "https://rohanahardware.com/pub/media/catalog/product/0/1/01_557.jpg",
    },
    {
      id: "5",
      title: "කොටුවේ පොඩ්ඩා",
      matchesCount: 12,
      timeAgo: "7 hours ago",
      imageUri:
        "https://www.colomboxnews.com/wp-content/uploads/2021/07/kotuwe-640x334-1.jpg",
    },
  ]);

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  const handleSearch = async (data: { coin: string; description: string }) => {
    if (!selectedImageUri) {
      showMessage({
        type: "error",
        message: "Please capture or select an image first.",
      });
      return;
    }

    try {
      setIsSearching(true);
      const result = await analyzePart(selectedImageUri);

      if (result.status !== "success") {
        showMessage({
          type: "error",
          message: result.message || "Unable to analyze image.",
        });
        return;
      }

      router.push({
        pathname: "/(pages)/predictions" as any,
        params: {
          part_name: `${result.inferred_type ?? ""} ${data.description ?? ""}`
            .trim()
            .replace(/\s+/g, " "),
          location: "Sri Lanka",
          inferred_type: result.inferred_type ?? "Unknown",
          width_mm: String(result.dimensions?.width_mm ?? ""),
          height_mm: String(result.dimensions?.height_mm ?? ""),
          description: data.description,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      showMessage({ type: "error", message });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCameraCapture = (imageUri: string) => {
    console.log("Captured image:", imageUri);
    setSelectedImageUri(imageUri);
    setShowCamera(false);
    setShowSearchModal(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Welcome Banner */}
        <View
          style={[styles.banner, { backgroundColor: colors.secondary + "20" }]}
        >
          <Text style={[styles.bannerTitle, { color: colors.text }]}>
            Welcome to the{" "}
            <Text style={[styles.bannerHighlight, { color: colors.primary }]}>
              Part Finder
            </Text>
          </Text>
          <Text style={[styles.bannerSubtitle, { color: colors.mutedText }]}>
            The Visual Search Engine for{"\n"}Industrial Hardware
          </Text>
        </View>

        {/* Recent Searches Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Searches
          </Text>

          {recentSearches.map((search) => (
            <Pressable
              key={search.id}
              style={[
                styles.searchCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => console.log("Search pressed:", search.title)}
            >
              <Image
                source={{ uri: search.imageUri }}
                style={[
                  styles.searchImage,
                  { backgroundColor: colors.surface },
                ]}
              />
              <View style={styles.searchContent}>
                <Text style={[styles.searchTitle, { color: colors.text }]}>
                  {search.title}
                </Text>
                <Text style={styles.searchMatches}>
                  {search.matchesCount} matches found
                </Text>
                <Text style={[styles.searchTime, { color: colors.mutedText }]}>
                  {search.timeAgo}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={[
          styles.fab,
          { backgroundColor: colors.primary, shadowColor: colors.black },
        ]}
        onPress={() => {
          if (!isSearching) setShowSearchModal(true);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        imageUri={selectedImageUri}
        onCameraPress={() => {
          setShowSearchModal(false);
          setShowCamera(true);
        }}
      />

      {/* Camera Screen Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraScreen
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  bannerHighlight: {
    fontWeight: "700",
  },
  bannerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  searchCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  searchImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  searchContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  searchMatches: {
    fontSize: 14,
    color: "#10B981",
    marginBottom: 4,
  },
  searchTime: {
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 60,
    fontWeight: "900",
  },
});
