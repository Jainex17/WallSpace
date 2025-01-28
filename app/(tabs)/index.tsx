import { useState, useEffect } from "react";
import {
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BottomPanel from "@/components/BottomPanel";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  getCarouselWallPapers,
  getExploreWallpapers,
  WallpaperTypes,
} from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Carousel } from "@/components/Carousel";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";


const Explore = () => {
  const { currentTheme } = useTheme();
  

  const [loadingWallpapers, setLoadingWallpapers] = useState(true);
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);
  
  const carouselWallPapers: WallpaperTypes[] = getCarouselWallPapers();

  useEffect(()=> {
    getExploreWallpapers().then((data) => {
      setWallpapers(data);
      setLoadingWallpapers(false);
    });
  }, []);

  return (
    <ThemedSafeArea
      style={{ flex: 1, backgroundColor: Colors[currentTheme].background }}
    >
      <StatusBar 
        style={currentTheme === "dark" ? "light" : "dark"} 
        backgroundColor={"transparent"}
        translucent={false}
      />
      <ParallaxScrollView
        headerBackgroundColor={{ dark: "black", light: "white" }}
        headerImage={
          <Carousel WallPapers={carouselWallPapers} />
        }
      >
        <WallpapersGrid
          wallpapers={wallpapers}
          loadingWallpapers={loadingWallpapers}
        />
      </ParallaxScrollView>
     
    </ThemedSafeArea>
  );
};

export default Explore;
