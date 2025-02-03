import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import WallpapersGrid from "@/components/WallpapersGrid";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import {
  WallpaperTypes,
  getLikedWallpapersDetails,
  getSuggestedWallPapers,
} from "@/hooks/useWallPapers";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedSafeArea } from "@/components/ThemedSafeArea";
import { ThemedText } from "@/components/ThemedText";
import { useWallpaper } from "@/context/WallpaperContext";
import {
  Animated,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { getAIGenratedWallpaper } from "@/hooks/useWallPapers";

const Tab = createMaterialTopTabNavigator();

export default function ForYou() {
  const { currentTheme } = useTheme();

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
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
              backgroundColor: Colors[currentTheme].tabBarIndicator,
              height: 4,
            },
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 16,
            },
          }}
        >
          <Tab.Screen name="Suggested" component={Suggested} />
          <Tab.Screen name="Liked" component={Liked} />
          <Tab.Screen name="AI" component={GenrareWallpaper} />
        </Tab.Navigator>
      </ThemedView>
    </ThemedSafeArea>
  );
}

function Suggested() {
  const categories = [
    "All",
    "Nature",
    "Space",
    "Cars",
    "Animals",
    "Flowers",
    "Minimal",
    "Art",
    "City",
    "Food",
    "Games",
    "Movies",
    "Music",
    "Sports",
    "Technology",
    "Travel",
  ];

  const { currentTheme } = useTheme();
  const [loadingWallpapers, setLoadingWallpapers] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);

  useEffect(() => {
    getSuggestedWallPapers(activeCategory).then((data) => {
      setWallpapers(data);
      setLoadingWallpapers(false);
    });
  }, [activeCategory]);

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <StatusBar
        style={currentTheme === "dark" ? "light" : "dark"}
        backgroundColor={Colors[currentTheme].background}
        translucent={false}
      />
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 15 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 15,
              paddingBottom: 15,
              paddingHorizontal: 15,
              height: 50,
            }}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  backgroundColor:
                    category === activeCategory
                      ? Colors[currentTheme].tint
                      : Colors[currentTheme].secondaryBackground,
                  borderRadius: 12,
                }}
                onPress={() => setActiveCategory(category)}
              >
                <ThemedText
                  type="title"
                  style={{
                    fontSize: 15,
                    color:
                      category === activeCategory
                        ? Colors[currentTheme].background
                        : Colors[currentTheme].text,
                    fontWeight: "500",
                  }}
                >
                  {category}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
          
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <WallpapersGrid
              wallpapers={wallpapers}
              loadingWallpapers={loadingWallpapers}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </ThemedSafeArea>
  );
}

function Liked() {
  const { currentTheme } = useTheme();
  const { triggerRefresh } = useWallpaper();
  const [LikedWallpapers, setLikedWallpapers] = useState<WallpaperTypes[]>([]);
  const [loadingWallpapers, setLoadingWallpapers] = useState(true);
  const scaleAnim = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    getLikedWallpapersDetails().then((data) => {
      setLikedWallpapers(data);
    });
    setLoadingWallpapers(false);
  }, [triggerRefresh]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {!loadingWallpapers && LikedWallpapers.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}
          >
            <WallpapersGrid wallpapers={LikedWallpapers} />
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ThemedText type="subtitle" style={{ fontSize: 18 }}>
              No favorites found
            </ThemedText>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <AntDesign
                name="heart"
                size={80}
                color={Colors[currentTheme].tabBarIndicator}
                style={{ marginVertical: 50 }}
              />
            </Animated.View>

            <ThemedText type="subtitle" style={{ fontSize: 17 }}>
              Wallpapers you "like" will appear here
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedSafeArea>
  );
}

function GenrareWallpaper() {
  const { currentTheme } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedWallpaper, setIsLikeBtnVisible } = useWallpaper();

  const [generatedImage, setGeneratedImage] = useState<WallpaperTypes>();

  async function handleGenrateWallpaperBtn() {
    if (!keyword.trim()) return;
    if (keyword.length < 5)
      return alert("Keyword must be atleast 5 characters long");
    setIsLoading(true);
    setGeneratedImage(undefined);
    try {
      const data = await getAIGenratedWallpaper(keyword);

      if (!data || data.imageuri == "") {
        setIsLoading(false);
        return alert("No wallpaper found for this keyword");
      }

      setGeneratedImage(data);
    } catch (error) {
      console.error("Failed to generate wallpaper:", error);
    }
  }

  return (
    <ThemedSafeArea style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 25,
            color: Colors[currentTheme].text,
          }}
        >
          Generate Wallpaper With AI
        </Text>

        <TextInput
          style={{
            backgroundColor: Colors[currentTheme].secondaryBackground,
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 10,
            marginHorizontal: 20,
            marginTop: 25,
            fontSize: 16,
            color: Colors[currentTheme].text,
          }}
          placeholderTextColor={Colors[currentTheme].tabIconDefault}
          placeholder="Enter a keyword"
          value={keyword}
          onChangeText={setKeyword}
        />

        <Pressable
          style={{
            backgroundColor: Colors[currentTheme].tint,
            padding: 15,
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 20,
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleGenrateWallpaperBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors[currentTheme].background} />
          ) : (
            <>
              <Ionicons
                style={{ alignSelf: "center" }}
                name="sparkles-sharp"
                size={18}
                color={Colors[currentTheme].background}
              />
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 18,
                  textAlign: "center",
                  color: Colors[currentTheme].background,
                }}
              >
                Generate Wallpaper
              </Text>
            </>
          )}
        </Pressable>

        {generatedImage && (
          <Pressable
            onPress={() => {
              setIsLikeBtnVisible(false);
              setSelectedWallpaper({
                id: generatedImage.id,
                imageuri: generatedImage.imageuri,
                title: generatedImage.title,
              });
            }}
            style={{ paddingHorizontal: 20 }}
          >
            <Image
              source={{ uri: generatedImage.imageuri }}
              style={{
                width: "100%",
                height: 400,
                borderRadius: 10,
              }}
              resizeMode="cover"
              onLoadEnd={() => setIsLoading(false)}
            />
          </Pressable>
        )}
      </ScrollView>
    </ThemedSafeArea>
  );
}
