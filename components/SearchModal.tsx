import { useTheme } from "@/providers/ThemeProvider";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (data: { coin: string; description: string }) => void;
  onCameraPress: () => void;
}

export function SearchModal({
  visible,
  onClose,
  onSearch,
  onCameraPress,
}: SearchModalProps) {
  const { colors } = useTheme();
  const [selectedCoin, setSelectedCoin] = useState("");
  const [description, setDescription] = useState("");
  const [showCoinPicker, setShowCoinPicker] = useState(false);

  const coins = [
    "USD - United States Dollar",
    "EUR - Euro",
    "GBP - British Pound",
    "JPY - Japanese Yen",
    "CAD - Canadian Dollar",
  ];

  const handleSearch = () => {
    if (selectedCoin) {
      onSearch({ coin: selectedCoin, description });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Camera Input */}
              <View style={styles.section}>
                <Pressable style={[styles.cameraInput, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={onCameraPress}>
                  <Text style={[styles.cameraPlaceholder, { color: colors.mutedText }]}>Capture your item</Text>
                  <View style={styles.cameraIconContainer}>
                    <Text style={styles.cameraIcon}>📷</Text>
                  </View>
                </Pressable>
              </View>

              {/* Select Coin */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Select Coin</Text>
                <Pressable
                  style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={() => setShowCoinPicker(!showCoinPicker)}
                >
                  <Text style={[styles.pickerText, { color: colors.text }, !selectedCoin && { color: colors.mutedText }]}>
                    {selectedCoin || "Choose a coin..."}
                  </Text>
                  <Text style={[styles.arrow, { color: colors.mutedText }]}>▼</Text>
                </Pressable>

                {showCoinPicker && (
                  <View style={[styles.pickerDropdown, { borderColor: colors.border, backgroundColor: colors.background }]}>
                    <ScrollView 
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      style={styles.pickerScrollView}
                    >
                      {coins.map((coin) => (
                        <Pressable
                          key={coin}
                          style={[styles.pickerOption, { borderBottomColor: colors.surface }]}
                          onPress={() => {
                            setSelectedCoin(coin);
                            setShowCoinPicker(false);
                          }}
                        >
                          <Text style={[styles.pickerOptionText, { color: colors.text }]}>{coin}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
                <View style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <TextInput
                    style={[styles.pickerText, { color: colors.text }]}
                    placeholder="Add any additional details..."
                    placeholderTextColor={colors.mutedText}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              {/* Search Button */}
              <Pressable
                style={[styles.searchButton, { backgroundColor: colors.primary }, !selectedCoin && { backgroundColor: colors.border }]}
                onPress={handleSearch}
                disabled={!selectedCoin}
              >
                <Text style={[styles.searchButtonText, { color: colors.text }]}>Search Your Item</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  cameraInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
  },
  cameraPlaceholder: {
    fontSize: 14,
  },
  cameraIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cameraIcon: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
  },
  arrow: {
    fontSize: 12,
  },
  pickerDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 200,
    overflow: "hidden",
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontSize: 14,
  },
  searchButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
