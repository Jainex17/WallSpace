import { Dimensions, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImageCard from "./ImageCard";
import { useMemo, useState } from "react";
import BottomPanel from "./BottomPanel";
import { WallpaperTypes } from "@/hooks/useWallPapers";

export default function WallpapersGrid({
  wallpapers,
  setSelectedWallpaper
}: {
  wallpapers: WallpaperTypes[],
  setSelectedWallpaper: (wallpaper: WallpaperTypes) => void;
}) {
  

  const renderItem = ({ item }: { item: WallpaperTypes }) => (
    <View style={styles.imageWrapper}>
      <ImageCard
        imageUrl={item.imageuri}
        title={item.title}
        onPress={() => setSelectedWallpaper(item)}
      />
    </View>
  );

  // Memoize the renderItem function to prevent unnecessary re-renders
  const memoizedRenderItem = useMemo(() => renderItem, []);

  return (
    <>
      <View style={styles.container}>
        <FlatList
            data={wallpapers}
            renderItem={memoizedRenderItem}
            keyExtractor={(item, idx) => `${item.title}-${idx}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            scrollEnabled={false}
          />
      </View>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  gridContainer: {
    paddingTop: 5,
  },
  row: {
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: width / 2 - 15,
    marginBottom: 3,
  },
});
