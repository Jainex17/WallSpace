import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Libary from "../library";
import Liked from "../liked";
import Suggested from "../suggested";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function ForYou() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ThemedView style={{ flex: 1 }}>
    <Tab.Navigator>
      <Tab.Screen name="Suggested" component={Suggested} />
      <Tab.Screen name="Library" component={Libary} />
      <Tab.Screen name="Liked" component={Liked} />
    </Tab.Navigator>
    </ThemedView>
    </SafeAreaView>
  );
}