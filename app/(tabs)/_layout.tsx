import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Pressable } from "react-native";

export default function TabLayout() {
  const { theme, currentTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[currentTheme].tint,
        tabBarStyle: {
          backgroundColor: Colors[currentTheme].background,
          borderTopWidth: 0,
          height: 80,
          paddingHorizontal: 30,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          letterSpacing: 0.6,
          paddingTop: 4,
        },
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }} />
        ),
      }}
    >
      <Tabs.Screen
        name="forYou"
        options={{
          title: "For You",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Entypo name="magnifying-glass" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="account-circle" color={color} />
          ),
        }}
      />
      {/* <Slot />  // dont need to use this because of Tabs from expo-router */}
    </Tabs>
  );
}
