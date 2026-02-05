import { useLayout } from "@/providers/LayoutProvider";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CameraScreen } from "../CameraScreen";
import { SearchModal } from "../SearchModal";

interface RecentSearch {
  id: string;
  title: string;
  matchesCount: number;
  timeAgo: string;
  imageUri: string;
}

// Home screen: landing page after authentication.
export function HomeScreen() {
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
      imageUri: "https://placeholder.co/60x60/666/FFF?text=Gear",
    },
    {
      id: "2",
      title: "Pressure Valve",
      matchesCount: 8,
      timeAgo: "3 hours ago",
      imageUri: "https://placeholder.co/60x60/666/FFF?text=Valve",
    },
    {
      id: "3",
      title: "Industrial Gear Set",
      matchesCount: 12,
      timeAgo: "5 hours ago",
      imageUri: "https://placeholder.co/60x60/666/FFF?text=Gear",
    },
    {
      id: "4",
      title: "Industrial Gear Set",
      matchesCount: 12,
      timeAgo: "1 hours ago",
      imageUri: "https://placeholder.co/60x60/666/FFF?text=Gear",
    },
    {
      id: "5",
      title: "Industrial Gear Set",
      matchesCount: 12,
      timeAgo: "7 hours ago",
      imageUri: "https://placeholder.co/60x60/666/FFF?text=Gear",
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
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Welcome Banner */}
      <View style={[styles.banner, { backgroundColor: colors.secondary + "20" }]}>
        <Text style={[styles.bannerTitle, { color: colors.text }]}>
          Welcome to the <Text style={[styles.bannerHighlight, { color: colors.primary }]}>Part Finder</Text>
        </Text>
        <Text style={[styles.bannerSubtitle, { color: colors.mutedText }]}>
          The Visual Search Engine for{"\n"}Industrial Hardware
        </Text>
      </View>

      {/* Recent Searches Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>

        {recentSearches.map((search) => (
          <Pressable
            key={search.id}
            style={[styles.searchCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => console.log("Search pressed:", search.title)}
          >
            <Image
              source={{ uri: search.imageUri }}
              style={[styles.searchImage, { backgroundColor: colors.surface }]}
            />
            <View style={styles.searchContent}>
              <Text style={[styles.searchTitle, { color: colors.text }]}>{search.title}</Text>
              <Text style={styles.searchMatches}>
                {search.matchesCount} matches found
              </Text>
              <Text style={[styles.searchTime, { color: colors.mutedText }]}>{search.timeAgo}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.black }]}
        onPress={() => setShowSearchModal(true)}
      >
        <Text style={[styles.fabIcon, { color: colors.text }]}>+</Text>
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
    bottom: 90,
    right: 20,
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
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 32,
  },
});
