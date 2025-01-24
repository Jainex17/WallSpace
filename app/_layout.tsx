import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import ThemeStatusBar from "@/components/ThemedStatusBar";

export default function Layout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView>
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
        <ThemeStatusBar />
        {/* <Slot />  // dont need to use this because of stack from expo-router */}
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
