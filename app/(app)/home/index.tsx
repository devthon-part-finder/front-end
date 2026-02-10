import { CameraScreen } from "@/components/CameraScreen";
import { SearchModal } from "@/components/SearchModal";
import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    {
      id: "1",
      title: "Industrial Gear Set",
      matchesCount: 12,
      timeAgo: "2 hours ago",
      imageUri: "data:image/jpeg;base64,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",
    },
    {
      id: "2",
      title: "Pressure Valve",
      matchesCount: 8,
      timeAgo: "3 hours ago",
      imageUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbJcJ7oki111u8ndMsyDo9Eu740cIe5WLUGQ&s",
    },
    {
      id: "3",
      title: "CPU Fan",
      matchesCount: 12,
      timeAgo: "5 hours ago",
      imageUri: "https://img.drz.lazcdn.com/static/lk/p/98b27d7080267b722336c8b6562ba909.jpg_960x960q80.jpg_.webp",
    },
    {
      id: "4",
      title: "5/8\" X 1\" IRON BOLT & NUT",
      matchesCount: 12,
      timeAgo: "1 hours ago",
      imageUri: "https://rohanahardware.com/pub/media/catalog/product/0/1/01_557.jpg",
    },
    {
      id: "5",
      title: "කොටුවේ පොඩ්ඩා",
      matchesCount: 12,
      timeAgo: "7 hours ago",
      imageUri: "https://www.colomboxnews.com/wp-content/uploads/2021/07/kotuwe-640x334-1.jpg",
    },
  ]);

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  const handleSearch = (data: { coin: string; description: string }) => {
    console.log("Search data:", data);
    // TODO: Implement search logic
  };

  const handleCameraCapture = (imageUri: string) => {
    console.log("Captured image:", imageUri);
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
        onPress={() => setShowSearchModal(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
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
