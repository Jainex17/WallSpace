import React, { useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  useColorScheme,
  Button,
  Text,
  Pressable,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { WallpaperTypes } from "@/hooks/useWallPapers";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

interface BottomPanelProps {
  selectedWallpaper: WallpaperTypes;
  onClose: () => void;
}

const BottomPanel = ({ selectedWallpaper, onClose }: BottomPanelProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { theme, currentTheme } = useTheme();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onClose={onClose}
      enablePanDownToClose
      snapPoints={["95%"]}
      handleIndicatorStyle={{ display: "none" }}
      handleStyle={{ display: "none" }}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { backgroundColor: Colors[currentTheme].background },
        ]}
      >
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={25} />
        </Pressable>
        <Image
          source={{ uri: selectedWallpaper.imageuri }}
          style={styles.image}
          resizeMode="cover"
        ></Image>

        <Text style={[styles.title, { color: Colors[currentTheme].text }]}>
          {selectedWallpaper.title}
        </Text>

        <Pressable
          onPress={() => {}}
          style={[
            styles.downloadbtn,
            { backgroundColor: Colors[currentTheme].tint },
          ]}
        >
          <Feather
            name="download"
            size={20}
            style={{ marginRight: 10 }}
            color={Colors[currentTheme].background}
          />
          <Text
            style={[styles.downloadtxt, { color: Colors[currentTheme].background }]}
          >
            Download Wallpaper
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 14,
    zIndex: 1,
    backgroundColor: "white",
    color: "black",
    padding: 3,
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },
  downloadbtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderRadius: 10,
    width: "80%",
    marginVertical: 10,
  },
  downloadtxt: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default BottomPanel;
