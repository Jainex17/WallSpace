import { useState, useEffect } from "react";
import { View } from "react-native";
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
import Carousel from "@/components/Carousel";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";
import { Searchbar } from "react-native-paper";
import { router, useNavigation } from 'expo-router';

const Explore = () => {
  const { currentTheme } = useTheme();

  const [loadingWallpapers, setLoadingWallpapers] = useState(true);
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const carouselWallPapers: WallpaperTypes[] = getCarouselWallPapers();

  useEffect(() => {
    getExploreWallpapers().then((data) => {
      setWallpapers(data);
      setLoadingWallpapers(false);
    });
  }, []);
  const navigation = useNavigation();

  function handleSearch(query: string) {
    if (query === "") {
      return;
    }
    router.push({
      pathname: "/(nobottombar)/SearchPage",
      params: { query }
    });
  }

  return (
    <ThemedSafeArea
      style={{ flex: 1, backgroundColor: Colors[currentTheme].background }}
    >
      <StatusBar
        style={currentTheme === "dark" ? "light" : "dark"}
        backgroundColor={
          currentTheme === "dark"
            ? Colors.dark.background
            : Colors.light.background
        }
        translucent={false}
      />
      {/* search bar */}
      <View
        style={{
          backgroundColor: "transparent",
          marginHorizontal: 5,
          marginVertical: 2,
        }}
      >
        <Searchbar
          placeholder="Search Wallpapers"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          style={{
            backgroundColor: Colors[currentTheme].secondaryBackground,
            borderRadius: 15,
            margin: 10,
            height: 48,
          }}
          inputStyle={{
            color: Colors[currentTheme].text,
            minHeight: 0,
          }}
          placeholderTextColor={Colors[currentTheme].tabIconDefault}
        />
      </View>
      <ParallaxScrollView
        headerBackgroundColor={{
          dark: Colors[currentTheme].background,
          light: Colors[currentTheme].background,
        }}
        headerImage={<Carousel carouselWallPapers={carouselWallPapers} />}
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
