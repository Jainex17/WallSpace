import { Tabs } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  
  const { theme, currentTheme } = useTheme();

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[currentTheme].tint,
        tabBarStyle: {
          backgroundColor: Colors[currentTheme].background,
        },
        
      }}
    >
      <Tabs.Screen
        name="forYou"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="home" color={color} />,
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
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="account-circle" color={color} />,
        }}
      />
            {/* <Slot />  // dont need to use this because of Tabs from expo-router */} 
    </Tabs>
  );
}