import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import WallpapersGrid from "@/components/WallpapersGrid";
import { ScrollView } from "react-native-gesture-handler";
import {
  WallpaperTypes,
  getLikedWallpapersDetails,
  getSuggestedWallPapers,
} from "@/hooks/useWallPapers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";
import { ThemedText } from "@/components/ThemedText";
import { useWallpaper } from "@/context/WallpaperContext";
import { Animated, View } from "react-native";
import { StatusBar } from "expo-status-bar";

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
  const [loadingWallpapers, setLoadingWallpapers] = useState(true);
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);

  useEffect(() => {
    getSuggestedWallPapers().then((data) => {
      setWallpapers(data);
      setLoadingWallpapers(false);
    });
  }, []);
  const { currentTheme } = useTheme();

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <StatusBar
        style={currentTheme === "dark" ? "light" : "dark"}
        backgroundColor={Colors[currentTheme].background}
        translucent={false}
      />
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}
        >
          <WallpapersGrid
            wallpapers={wallpapers}
            loadingWallpapers={loadingWallpapers}
          />
        </ScrollView>
      </ThemedView>
    </ThemedSafeArea>
  );
}

function Liked() {
  const { currentTheme } = useTheme();
  const { triggerRefresh } = useWallpaper();
  const scaleAnim = new Animated.Value(1.2);

  const [LikedWallpapers, setLikedWallpapers] = useState<WallpaperTypes[]>([]);
  const [loadingWallpapers, setLoadingWallpapers] = useState(true);

  useEffect(() => {
    getLikedWallpapersDetails().then((data) => {
      setLikedWallpapers(data);
    });
    setLoadingWallpapers(false);
  }, [triggerRefresh]);

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
        {!loadingWallpapers && LikedWallpapers.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}
          >
            <WallpapersGrid wallpapers={LikedWallpapers} />
          </ScrollView>
        ) : (
          <View>
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
          </View>
        )}
      </ThemedView>
    </ThemedSafeArea>
  );
}
