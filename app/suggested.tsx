import BottomPanel from "@/components/BottomPanel";
import WallpapersGrid from "@/components/WallpapersGrid";
import Wallpapers, { WallpaperTypes } from "@/hooks/useWallPapers";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Suggested() {
  const wallpapers = Wallpapers();
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<WallpaperTypes | null>(null);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}>
          <WallpapersGrid
            wallpapers={wallpapers}
            setSelectedWallpaper={setSelectedWallpaper}
          />
        </ScrollView>
      </SafeAreaView>

      {selectedWallpaper && (
        <BottomPanel
          selectedWallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
        />
      )}
    </>
  );
}
