import { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import WallpapersGrid from "@/components/WallpapersGrid";
import { ScrollView } from "react-native-gesture-handler";
import BottomPanel from "@/components/BottomPanel";
import Wallpapers, { WallpaperTypes } from "@/hooks/useWallPapers";

const Tab = createMaterialTopTabNavigator();

export default function ForYou() {
  const { currentTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              backgroundColor: Colors[currentTheme].tint,
            },
          }}
        >
          <Tab.Screen name="Suggested" component={Suggested} />
          <Tab.Screen name="Library" component={Libary} />
          <Tab.Screen name="Liked" component={Liked} />
        </Tab.Navigator>
      </ThemedView>
    </SafeAreaView>
  );
}

function Suggested() {
  const wallpapers = Wallpapers();
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<WallpaperTypes | null>(null);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
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


function Libary() {
  return (
    <ThemedView>
      <Text> Libary </Text>
    </ThemedView>
  );
}
function Liked() {
  return (
    <ThemedView>
      <Text> Liked </Text>
    </ThemedView>
  );
}
