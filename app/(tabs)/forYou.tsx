import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import WallpapersGrid from "@/components/WallpapersGrid";
import { ScrollView } from "react-native-gesture-handler";
import Wallpapers, { WallpaperTypes } from "@/hooks/useWallPapers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";
import { ThemedText } from "@/components/ThemedText";
import { useWallpaper } from "@/context/WallpaperContext";
import { Animated } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

const Tab = createMaterialTopTabNavigator();

export default function ForYou() {
  const { currentTheme } = useTheme();

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: Colors[currentTheme].background,
              paddingVertical: 5,
            },
            tabBarActiveTintColor: Colors[currentTheme].tint,
            tabBarInactiveTintColor: Colors[currentTheme].tabIconDefault,
            tabBarIndicatorStyle: {
              backgroundColor: Colors[currentTheme].tabBarIndicator,
              height: 4,
            },
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 16,
            },
          }}
        >
          <Tab.Screen name="Suggested" component={Suggested} />
          <Tab.Screen name="Liked" component={Liked} />
        </Tab.Navigator>
      </ThemedView>
    </ThemedSafeArea>
  );
}

function Suggested() {
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);
  const { setSelectedWallpaper } = useWallpaper();

  useEffect(() => {
    setWallpapers(Wallpapers());
  }, []);

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}
        >
          <WallpapersGrid
            wallpapers={wallpapers}
            setSelectedWallpaper={setSelectedWallpaper}
          />
        </ScrollView>
      </ThemedView>
    </ThemedSafeArea>
  );
}

function Liked() {
  const { currentTheme } = useTheme();
  const scaleAnim = new Animated.Value(1.2);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="subtitle" style={{ fontSize: 18 }}>
          No favorites found
        </ThemedText>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <AntDesign
            name="heart"
            size={80}
            color={Colors[currentTheme].tabBarIndicator}
            style={{ marginVertical: 50 }}
          />
        </Animated.View>

        <ThemedText type="subtitle" style={{ fontSize: 17 }}>
          Wallpapers you "like" will appear here
        </ThemedText>
      </ThemedView>
    </ThemedSafeArea>
  );
}
