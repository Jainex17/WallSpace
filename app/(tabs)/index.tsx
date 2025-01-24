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
import Wallpapers, { WallpaperTypes } from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";

const { width } = Dimensions.get("window");

export default function Explore() {
  const wallpapers = Wallpapers();
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperTypes | null>(
    null
  );

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
        <WallpapersGrid wallpapers={wallpapers} setSelectedWallpaper={setSelectedWallpaper} />
      </ParallaxScrollView>
      {selectedWallpaper && (
        <BottomPanel
          selectedWallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
        />
      )}
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
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: width / 2 - 15,
    marginBottom: 3,
  },
});
