import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getExploreWallpapers, WallpaperTypes } from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";

export default function SearchPage() {
  let { query }: { query: string } = useLocalSearchParams();

  const [searchLoding, setSearchLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(query || "");
  const [wallpapers, setWallpapers] = useState<WallpaperTypes[]>([]);
  const { currentTheme } = useTheme();

  function handleSearch(_query: string) {
    if (query === "") {
      return;
    }

    getSearchWallpapers(_query);
  }

  function getSearchWallpapers(query: string) {
    setSearchLoading(true);
    getExploreWallpapers(query).then((data) => {
      setWallpapers(data);
    });
    setSearchLoading(false);
  }

  useEffect(() => {
    getSearchWallpapers(query);
  }, [query]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[currentTheme].background }}
    >
      <ScrollView>
        <View
          style={{
            backgroundColor: "transparent",
            marginHorizontal: 5,
            marginVertical: 2,
          }}
        >
          <Searchbar
            placeholder="Search Wallpapers"
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            style={{
              backgroundColor: Colors[currentTheme].secondaryBackground,
              borderRadius: 15,
              margin: 10,
              height: 48,
            }}
            inputStyle={{
              color: Colors[currentTheme].text,
              minHeight: 0,
            }}
            placeholderTextColor={Colors[currentTheme].tabIconDefault}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[currentTheme].background,
            marginHorizontal: 15,
            marginBottom: 60,
          }}
        >
          {searchLoding ? (
            <Text>Loading...</Text>
          ) : (
            <WallpapersGrid wallpapers={wallpapers} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
