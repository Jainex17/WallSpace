import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash';
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { useWallpaperData } from "@/hooks/useWallPapers";
import WallpapersGrid from "@/components/WallpapersGrid";

export default function SearchPage() {
  const { query: initialQuery }: { query: string } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || "");
  const { data: wallpapers, loading: searchLoading } = useWallpaperData(searchQuery);
  const { currentTheme } = useTheme();

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim() !== "") {
        setSearchQuery(query);
      }
    }, 500),
    []
  );

  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[currentTheme].background }}
    >
      
        <View
          style={{
            backgroundColor: "transparent",
            marginHorizontal: 5,
            marginVertical: 2,
          }}
        >
          <Searchbar
            placeholder="Search Wallpapers"
            onChangeText={(query) => handleSearch(query)}
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
        <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[currentTheme].background,
            marginHorizontal: 15,
            marginBottom: 10,
          }}
        >
          {searchLoading ? (
            <Text>Loading...</Text>
          ) : (
            <WallpapersGrid wallpapers={wallpapers} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
