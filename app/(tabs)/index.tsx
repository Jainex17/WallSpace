import { useState, useMemo } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import BottomPanel from "@/components/BottomPanel";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ImageCard from "@/components/ImageCard";
import Wallpapers from "@/hooks/useWallPapers";
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get('window');

interface Wallpaper {
  title: string;
  imageuri: string;
}

export default function Explore() {
  
  const wallapapers = Wallpapers();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  const renderItem = ({ item }: {item : Wallpaper}) => (
    <View style={styles.imageWrapper}>
      <ImageCard imageUrl={item.imageuri} title={item.title} onPress={()=> setSelectedWallpaper(item)} />
    </View>
  );

  // Memoize the renderItem function to prevent unnecessary re-renders
  const memoizedRenderItem = useMemo(() => renderItem, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "black", light: "white" }}
      headerImage={
        <Image
          style={{ flex: 1 }}
          source={{
            uri: "https://ideogram.ai/assets/image/lossless/response/rnfyKYz1SKKx0xnr_eU6RQ",
          }}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={wallapapers}
            renderItem={memoizedRenderItem}
            keyExtractor={(item) => item.title}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        </View>
      </View>
    </ParallaxScrollView>
    {selectedWallpaper && <BottomPanel selectedWallpaper={selectedWallpaper} onClose={()=> setSelectedWallpaper(null)} />}
  </SafeAreaView>
  );
}

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
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: width / 2 - 15,
    marginBottom: 3,
  },
});
