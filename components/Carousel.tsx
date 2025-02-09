import * as React from "react";
import { Dimensions, Platform, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SlideItem } from "./SlideItem";
import { WallpaperTypes } from "@/hooks/useWallPapers";

const window = Dimensions.get("window");

function Index({ carouselWallPapers }: { carouselWallPapers: WallpaperTypes[] }) {
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={window.width}
        height={window.width / 1.5}
        // autoPlay={true}
        // autoPlayInterval={3000}
        data={carouselWallPapers}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ index }) => (
          <SlideItem key={index} index={index} rounded={true} data={carouselWallPapers} />
        )}
      />
    </View>
  );
}

export default Index;
