import { WallpaperTypes } from "@/hooks/useWallPapers";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const CAROUSEL_HEIGHT = width / 1.3;

export const Carousel = ({ WallPapers }: { WallPapers: WallpaperTypes[] }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const handleCarouselScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };
  
  // Static carousel data for better clarity
  const carouselData = useMemo(() => WallPapers || [], []);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      if (flatListRef.current && carouselData.length > 0) {
        const nextIndex = activeIndex + 1;
        // Stop autoplay if we reach the end
        if (nextIndex >= carouselData.length) {
          stopAutoplay();
          return;
        }
        flatListRef.current.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
      }
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const renderCarouselItem = useCallback(
    ({ item }: { item: WallpaperTypes }) => (
      <View style={styles.carouselItem}>
        <Image
          source={{ uri: item.imageuri }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,1)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.carouselOverlay}
        >
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </LinearGradient>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (_: any, index: number) => index.toString(),
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    []
  );

  const CarouselIndicator = ({
    total,
    current,
  }: {
    total: number;
    current: number;
  }) => (
    <View style={styles.indicatorContainer}>
      {Array(total)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === current && styles.activeIndicator,
            ]}
            accessibilityLabel={`Slide indicator ${index + 1} of ${total}`}
          />
        ))}
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      {carouselData.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={carouselData}
          renderItem={renderCarouselItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleCarouselScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          onTouchStart={stopAutoplay}
          onTouchEnd={startAutoplay}
          onMomentumScrollEnd={() => {
            startAutoplay();
          }}
        />
      ) : (
        <Text style={styles.noDataText}>No wallpapers available.</Text>
      )}
      <CarouselIndicator total={carouselData.length} current={activeIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    width: width,
  },
  carouselItem: {
    width: width,
    height: CAROUSEL_HEIGHT,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    paddingVertical: 50,
  },
  carouselTitle: {
    color: "white",
    fontSize: 24,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "800",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  noDataText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
