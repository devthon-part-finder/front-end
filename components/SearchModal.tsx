import React, { useState } from "react";
import {
    Modal,
    Pressable,
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Camera Input */}
          <View style={styles.section}>
            <Pressable style={styles.cameraInput} onPress={onCameraPress}>
              <Text style={styles.cameraPlaceholder}>Capture your item</Text>
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </Pressable>
          </View>

          {/* Select Coin */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Coin</Text>
            <Pressable
              style={styles.picker}
              onPress={() => setShowCoinPicker(!showCoinPicker)}
            >
              <Text style={[styles.pickerText, !selectedCoin && styles.placeholder]}>
                {selectedCoin || "Choose a coin..."}
              </Text>
              <Text style={styles.arrow}>▼</Text>
            </Pressable>

            {showCoinPicker && (
              <View style={styles.pickerDropdown}>
                {coins.map((coin) => (
                  <Pressable
                    key={coin}
                    style={styles.pickerOption}
                    onPress={() => {
                      setSelectedCoin(coin);
                      setShowCoinPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{coin}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (Optional)</Text>
            <Pressable style={styles.picker} onPress={() => {}}>
              <TextInput
                style={styles.pickerText}
                placeholder="Add any additional details..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </Pressable>
          </View>

          {/* Search Button */}
          <Pressable
            style={[styles.searchButton, !selectedCoin && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!selectedCoin}
          >
            <Text style={styles.searchButtonText}>Search Your Item</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: 400,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
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
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  cameraPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
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
    color: "#000000",
    marginBottom: 8,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  arrow: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  pickerDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    maxHeight: 200,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#000000",
  },
  searchButton: {
    backgroundColor: "#FCD34D",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  searchButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
