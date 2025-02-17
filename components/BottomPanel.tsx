import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { STORAGE_KEY, WallpaperTypes } from "@/hooks/useWallPapers";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWallpaper } from "@/context/WallpaperContext";

const ERROR_MESSAGES = {
  PERMISSION: "Please grant permission to save wallpapers",
  DOWNLOAD_FAILED: "Failed to download wallpaper",
  SAVE_FAILED: "Failed to save wallpaper",
  SHARE_FAILED: "Could not share the wallpaper",
  LIKE_FAILED: "Failed to update favorites",
};

interface BottomPanelProps {
  selectedWallpaper: WallpaperTypes;
  onClose: () => void;
  style?: object;
  isLikeBtnVisible?: boolean;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  selectedWallpaper,
  onClose,
  style,
  isLikeBtnVisible = true,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshLiked } = useWallpaper();

  // Memoized handlers
  const handleSheetClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  const showAlert = useCallback(
    (title: string, message: string) => {
      Alert.alert(title, message, undefined, {
        userInterfaceStyle: currentTheme,
      });
    },
    [currentTheme]
  );

  const handleDownloadBtn = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const fileUri = `${FileSystem.documentDirectory}wallpaper.jpg`;
      const downloadResult = await FileSystem.downloadAsync(
        selectedWallpaper.imageuri,
        fileUri
      );

      if (downloadResult.status !== 200) {
        throw new Error(ERROR_MESSAGES.DOWNLOAD_FAILED);
      }

      const saveimage = await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      if(saveimage !== undefined){
        showAlert("Success", "Wallpaper saved to your photos!");
      }else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission needed", ERROR_MESSAGES.PERMISSION);
        return;
      }

      await MediaLibrary.saveToLibraryAsync(fileUri);
      }
    } catch (error) {
      console.error("Download error:", error);
      showAlert("Error", ERROR_MESSAGES.SAVE_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWallpaper.imageuri, showAlert, isLoading]);

  const handleShareBtn = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const fileUri = `${FileSystem.documentDirectory}wallpaper.jpg`;
      await FileSystem.downloadAsync(selectedWallpaper.imageuri, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        showAlert("Info", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Share error:", error);
      showAlert("Error", ERROR_MESSAGES.SHARE_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWallpaper.imageuri, showAlert, isLoading]);

  const updateLikedWallpapers = useCallback(
    async (wallpaperId: string, shouldAdd: boolean) => {
      try {
        const storedData = await AsyncStorage.getItem(
          STORAGE_KEY.LIKED_WALLPAPERS
        );
        const likedWallpapers = storedData ? JSON.parse(storedData) : [];

        const updatedWallpapers = shouldAdd
          ? [...new Set([...likedWallpapers, wallpaperId])]
          : likedWallpapers.filter((id: string) => id !== wallpaperId);

        await AsyncStorage.setItem(
          STORAGE_KEY.LIKED_WALLPAPERS,
          JSON.stringify(updatedWallpapers)
        );

        return true;
      } catch (error) {
        console.error("Storage error:", error);
        return false;
      }
    },
    []
  );

  const handleLikeBtn = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const success = await updateLikedWallpapers(
        selectedWallpaper.id,
        !isLiked
      );
      if (success) {
        setIsLiked(!isLiked);
        refreshLiked(); // This now comes from useWallpaper
      } else {
        showAlert("Error", ERROR_MESSAGES.LIKE_FAILED);
      }
    } catch (error) {
      console.error("Like error:", error);
      showAlert("Error", ERROR_MESSAGES.LIKE_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLiked,
    selectedWallpaper.id,
    updateLikedWallpapers,
    showAlert,
    isLoading,
    refreshLiked,
  ]);

  const handleSaveBtn = () => {
    Alert.alert(
      'Set Wallpaper',
      'Where would you like to set this wallpaper?',
      [
        {
          text: 'Home Screen',
          onPress: () => setWallpaperLocation('home'),
        },
        {
          text: 'Lock Screen',
          onPress: () => setWallpaperLocation('lock'),
        },
        {
          text: 'Both',
          onPress: () => setWallpaperLocation('both'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true, userInterfaceStyle: currentTheme }
    );
  };

  const setWallpaperLocation = async (location: 'home' | 'lock' | 'both') => {
    if (isLoading) return;

    try {
      // TODO
    } catch (error) {
      console.error('Wallpaper setting error:', error);
      showAlert('Error', 'Failed to set wallpaper');
    }
  };

  // Check if wallpaper is liked on mount
  useEffect(() => {
    const checkLiked = async () => {
      try {
        const storedData = await AsyncStorage.getItem(
          STORAGE_KEY.LIKED_WALLPAPERS
        );
        if (storedData) {
          const likedWallpapers = JSON.parse(storedData);
          setIsLiked(likedWallpapers.includes(selectedWallpaper.id));
        }
      } catch (error) {
        console.error("Error checking liked status:", error);
      }
    };
    checkLiked();
  }, [selectedWallpaper.id]);

  // Back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleSheetClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [handleSheetClose]);

  return (
    <View style={[styles.container, style]}>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={handleSheetClose}
        enablePanDownToClose
        snapPoints={["100%"]}
        index={0}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{ display: "none" }}
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        backgroundComponent={({ style }) => (
          <View
            style={[style, { backgroundColor: Colors[currentTheme].background }]}
          />
        )}

      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: Colors[currentTheme].background },
          ]}
        >
          <Pressable
            style={styles.closeButton}
            onPress={handleSheetClose}
            hitSlop={{ top: 5, bottom: 0, left: 5, right: 5 }}
          >
            <Ionicons name="close" size={25} color="white" />
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
            {isLikeBtnVisible && (
            <Pressable style={styles.rightbtns} onPress={handleLikeBtn}>
              {isLiked ? (
                <AntDesign name="heart" size={20} color="red" />
              ) : (
                <AntDesign name="hearto" size={20} color="white" />
              )}
            </Pressable>
            )}
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

            <View style={{ flexDirection: "row", gap: 20 }}>
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
              color={Colors[currentTheme].background} />
            <Text
              style={[
                styles.downloadtxt,
                { color: Colors[currentTheme].background },
              ]}
            >
              Save
            </Text>
          </Pressable>
          </View>
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
    left: 14,
    top: 15,
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#2c2c2c",
    borderRadius: 50,
    padding: 5,
    // width: 40,
    // height: 40,
    // alignItems: "center",
    // justifyContent: "center",
  },
  rightbtns: {
    top: 15,
    right: 10,
    alignSelf: "center",
    zIndex: 1,
    backgroundColor: "#2c2c2c",
    color: "black",
    borderRadius: 50,
    // padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 25,
    fontWeight: "800",
  },
  downloadtxt: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  setWallpaper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderRadius: 7,
    width: "80%",
    marginTop: 15,
  },
});

export default BottomPanel;
