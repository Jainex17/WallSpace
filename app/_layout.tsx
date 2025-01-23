import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function Layout() {
  
  return (
    <>
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
        {/* <Slot />  // dont need to use this because of stack from expo-router */}
      </GestureHandlerRootView>
    </>
  );
}
