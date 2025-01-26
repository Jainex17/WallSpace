import React, { useRef } from "react";
import { StyleSheet, Image, View, Text, Pressable, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { WallpaperTypes } from "@/hooks/useWallPapers";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

interface BottomPanelProps {
  selectedWallpaper: WallpaperTypes;
  onClose: () => void;
  style?: object;
}

const BottomPanel = ({
  selectedWallpaper,
  onClose,
  style,
}: BottomPanelProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useTheme();

  const handleDownloadBtn = async () => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save wallpapers",
          undefined,
          { userInterfaceStyle: currentTheme }
        );
        return;
      }

      // Download the file
      const fileUri = `${FileSystem.documentDirectory}wallpaper.jpg`;
      const downloadResult = await FileSystem.downloadAsync(
        selectedWallpaper.imageuri,
        fileUri
      );

      if (downloadResult.status !== 200) {
        Alert.alert("Error", "Failed to download wallpaper", undefined, {
          userInterfaceStyle: currentTheme,
        });
        return;
      }

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      Alert.alert("Success", "Wallpaper saved to your photos!", undefined, {
        userInterfaceStyle: currentTheme,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save wallpaper", undefined, {
        userInterfaceStyle: currentTheme,
      });
      console.error(error);
    }
  };

  const handleShareBtn = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "wallpaper.jpg";
      await FileSystem.downloadAsync(selectedWallpaper.imageuri, fileUri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Saved", "Wallpaper saved to your device.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not save the wallpaper.");
    }
  };

  const handleLikeBtn = () => {
    // Handle like button
  }

  return (
    <View style={[styles.container, style]}>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={onClose}
        enablePanDownToClose
        snapPoints={["100%"]}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{ display: "none" }}
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: Colors[currentTheme].background },
          ]}
        >
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={25} color={"white"} />
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              position: "absolute",
              width: "100%",
              gap: 11,
              zIndex: 1,
            }}
          >
            <Pressable style={styles.rightbtns} onPress={handleLikeBtn}>
              <AntDesign name="hearto" size={20} color="white" />
            </Pressable>
            <Pressable style={styles.rightbtns} onPress={handleShareBtn}>
              <AntDesign name="sharealt" size={20} color="white" />
            </Pressable>
          </View>
          <Image
            source={{ uri: selectedWallpaper.imageuri }}
            style={styles.image}
            resizeMode="cover"
          ></Image>

          <Text style={[styles.title, { color: Colors[currentTheme].text }]}>
            {selectedWallpaper.title}
          </Text>

          <Pressable
            onPress={handleDownloadBtn}
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
              style={[
                styles.downloadtxt,
                { color: Colors[currentTheme].background },
              ]}
            >
              Download Wallpaper
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 14,
    zIndex: 1,
    backgroundColor: "#2c2c2c",
    color: "black",
    padding: 5,
    borderRadius: 50,
  },
  rightbtns: {
    top: 15,
    right: 10,
    alignSelf: "center",
    zIndex: 1,
    backgroundColor: "#2c2c2c",
    color: "black",
    padding: 10,
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: "75%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 25,
  },
  downloadbtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderRadius: 7,
    width: "80%",
    marginVertical: 25,
  },
  downloadtxt: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default BottomPanel;
