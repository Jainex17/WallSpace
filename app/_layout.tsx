import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import ThemeStatusBar from "@/components/ThemedStatusBar";
import { WallpaperProvider, useWallpaper } from '@/context/WallpaperContext';
import BottomPanel from "@/components/BottomPanel";

function RootLayoutNav() {
  return (
    <WallpaperProvider>
      <ThemeProvider>
        <GestureHandlerRootView>
          <RootContent />
        </GestureHandlerRootView>
      </ThemeProvider>
    </WallpaperProvider>
  );
}

function RootContent() {
  const { selectedWallpaper, setSelectedWallpaper } = useWallpaper();
  
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(nobottombar)/accountInfo"
          options={{
            headerShown: true,
            headerTitle: "Account Info",
            headerBackTitle: "Go Back",
          }}
        ></Stack.Screen>
      </Stack>
      {selectedWallpaper && (
        <BottomPanel
          selectedWallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        />
      )}
      <ThemeStatusBar />
    </>
  );
}

export default RootLayoutNav;
