import { Pressable, StyleSheet, Text, ToastAndroid, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";

export default function Account() {
  const { theme, currentTheme, setTheme } = useTheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <ThemedText type="title" style={styles.heading}>
        WallSpace
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subheading}>
          Chnage your home with WallSpace
        </ThemedText>

        <View style={styles.themeButtonsContainer}>
          {(["system", "dark", "light"] as const).map((themeOption) => (
            <Pressable
              key={themeOption}
              onPress={() => setTheme(themeOption)}
              style={[
                styles.themebtn,
                {
                  backgroundColor:
                    theme === themeOption
                      ? Colors[currentTheme].tint
                      : Colors[currentTheme].background,
                  borderColor: Colors[currentTheme].tint,
                },
              ]}
            >
              <Text
                style={[
                  styles.themetext,
                  {
                    color:
                      theme === themeOption
                        ? Colors[currentTheme].background
                        : Colors[currentTheme].text,
                  },
                ]}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 15, flexDirection: "column" }}>
          <Text
            style={[styles.settingsTitle, { color: Colors[currentTheme].text }]}
          >
            About
          </Text>
          <Text
            style={[
              styles.sectionTitle,
              { color: Colors[currentTheme].text, paddingVertical: 15 },
            ]}
          >
            Privacy Policy
          </Text>
          <Text
            style={[
              styles.sectionTitle,
              { color: Colors[currentTheme].text, paddingVertical: 15 },
            ]}
          >
            Terms of Service
          </Text>
          <Text
            style={[
              styles.sectionTitle,
              { color: Colors[currentTheme].text, paddingVertical: 15 },
            ]}
            onPress={() =>
              ToastAndroid.show("WallSpace v1.0.0", ToastAndroid.SHORT)
            }
          >
            Versions
          </Text>
        </View>

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text
            style={{ color: Colors[currentTheme].tabIconDefault, fontSize: 13 }}
          >
            Created by Jainex
          </Text>
          <Text
            style={{ color: Colors[currentTheme].tabIconDefault, fontSize: 13 }}
          >
            WallSpace Wallpapaer Mobile App LLC.
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 90,
  },
  heading: {
    fontSize: 30,
    marginHorizontal: 20,
    paddingTop: 20,
    fontWeight: "900",
  },
  subheading: {
    fontSize: 14,
    marginHorizontal: 20,
  },
  signupcontainer: {
    marginVertical: 20,
    padding: 30,
    borderRadius: 15,
    marginHorizontal: 20,
  },
  signupbutton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
  },
  signupbuttontext: {
    fontSize: 18,
    fontWeight: "bold",
  },
  themebtn: {
    width: "30%",
    backgroundColor: "black",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    borderBlockColor: "black",
    borderWidth: 1,
  },
  themetext: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: "900",
    padding: 10,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontWeight: "700",
  },
  themeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 30,
    marginHorizontal: 20,
  },
});
