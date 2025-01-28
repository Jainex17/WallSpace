import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { WallpaperProvider } from '@/context/WallpaperContext';
import { PageBottomPanel } from "@/components/PageBottomPanel";

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
      <PageBottomPanel />
    </>
  );
}

export default RootLayoutNav;
