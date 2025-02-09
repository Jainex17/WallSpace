import { Dimensions, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImageCard from "./ImageCard";
import { useMemo } from "react";
import { WallpaperTypes } from "@/hooks/useWallPapers";
import { useWallpaper } from "@/context/WallpaperContext";

export default function WallpapersGrid({
  wallpapers,
  loadingWallpapers = false,
}: {
  wallpapers: WallpaperTypes[];
  loadingWallpapers?: boolean;
}) {

  const { setSelectedWallpaper, setIsLikeBtnVisible } = useWallpaper();

  const renderItem = ({ item }: { item: WallpaperTypes }) => (
    <View style={styles.imageWrapper}>
      <ImageCard
        imageUrl={item.imageuri}
        title={item.title}
        color={item.color}
        onPress={() => {
          setIsLikeBtnVisible(true);
          setSelectedWallpaper(item);
        }}
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
    paddingVertical: 3,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: width / 2 - 15,
  },
});
