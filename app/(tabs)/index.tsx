import { useState, useMemo, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BottomPanel from "@/components/BottomPanel";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Wallpapers, {
  CarouselWallPapers,
  WallpaperTypes,
} from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

export default function Explore() {

  const { currentTheme } = useTheme();
  const oppositeTheme = currentTheme === "dark" ? "light" : "dark";
  const wallpapers = Wallpapers();
  const carouselWallpapers = CarouselWallPapers();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<WallpaperTypes | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const carouselHeight = width / 1.5;
    const scrollThreshold = carouselHeight * 0.9;
    setIsScrolled(event.nativeEvent.contentOffset.y > scrollThreshold);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={isScrolled ? Colors[currentTheme].background : "transparent"}
        style={isScrolled ? oppositeTheme : "light"}
        translucent={true}
      />
      <ParallaxScrollView
        headerBackgroundColor={{ dark: "black", light: "white" }}
        onScroll={handleScroll}
        headerImage={
          <Carousel
            loop
            width={width}
            height={width / 1.5}
            autoPlay={true}
            data={carouselWallpapers}
            scrollAnimationDuration={1000}
            autoPlayInterval={2000}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: "center",
                }}
                key={index}
              >
                <Image
                  style={{ width, height: width / 1.5 }}
                  source={{ uri: item.imageuri }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    alignItems: "center",
                    width,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 30, fontWeight: "700" }}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
            )}
          />
        }
      >
        <WallpapersGrid
          wallpapers={wallpapers}
          setSelectedWallpaper={setSelectedWallpaper}
        />
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
