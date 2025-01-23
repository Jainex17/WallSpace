import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}
    >
      <Tabs.Screen
        name="forYou"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <Entypo name="magnifying-glass" size={24} color={color} />,
          }}
        />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
            {/* <Slot />  // dont need to use this because of Tabs from expo-router */} 
    </Tabs>
  );
}