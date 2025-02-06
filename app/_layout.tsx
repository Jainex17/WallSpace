import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { WallpaperProvider } from '@/context/WallpaperContext';
import { PageBottomPanel } from "@/components/PageBottomPanel";
import { Colors } from "@/constants/Colors";

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

  const { currentTheme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors[currentTheme].background,
          },
          headerTintColor: Colors[currentTheme].text,
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

        <Stack.Screen
          name="(nobottombar)/SearchPage"
          options={{
            headerShown: false,
            headerTitle: "Search",
            headerBackTitle: "Go Back",
          }}
        ></Stack.Screen>

        
      </Stack>
      <PageBottomPanel />
    </>
  );
}

export default RootLayoutNav;
