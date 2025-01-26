import { useState, useEffect } from "react";
import {
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BottomPanel from "@/components/BottomPanel";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Wallpapers, {
  getCarouselWallPapers,
  WallpaperTypes,
} from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Carousel } from "@/components/Carousel";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";
import { useWallpaper } from "@/context/WallpaperContext";

const { width } = Dimensions.get("window");

const Explore = () => {
  const { currentTheme } = useTheme();
  const oppositeTheme = currentTheme === "dark" ? "light" : "dark";
  
  const [isScrolled, setIsScrolled] = useState(false);

  const { setSelectedWallpaper } = useWallpaper();
    
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);
  
  const carouselWallPapers: WallpaperTypes[] = getCarouselWallPapers();

  useEffect(() => {
    setWallpapers(Wallpapers());
  }, []);
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const carouselHeight = width / 1.5;
    const scrollThreshold = carouselHeight * 0.9;
    setIsScrolled(event.nativeEvent.contentOffset.y > scrollThreshold);
  };

  return (
    <ThemedSafeArea
      style={{ flex: 1, backgroundColor: Colors[currentTheme].background }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ dark: "black", light: "white" }}
        onScroll={handleScroll}
        headerImage={
          <Carousel WallPapers={carouselWallPapers} />
        }
      >
        <WallpapersGrid
          wallpapers={wallpapers}
          setSelectedWallpaper={setSelectedWallpaper}
        />
      </ParallaxScrollView>
     
    </ThemedSafeArea>
  );
};

export default Explore;
