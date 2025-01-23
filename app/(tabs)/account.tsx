import { Link } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

export default function Account() {
  const { theme, currentTheme, setTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <Text style={[styles.heading, { color: Colors[currentTheme].text }]}>WallX</Text>
        <Text style={[styles.subheading, { color: Colors[currentTheme].text }]}>Sign in to save your data</Text>

        <View style={[ styles.signupcontainer, { backgroundColor: Colors[currentTheme].secondaryBackground } ]}>
          <Pressable
            style={[ styles.signupbutton, { backgroundColor: Colors[currentTheme].secondaryBackground, borderColor: Colors[currentTheme].text } ]}
            onPress={() => console.log("Sign in with Google")}
          >
            <AntDesign
              name="google"
              size={24}
              color={Colors[currentTheme].text}
              style={{ marginRight: 30, position: "absolute", left: 30 }}
            />
            <Text style={[ styles.signupbuttontext, { color: Colors[currentTheme].text} ]}>Sign in</Text>
          </Pressable>
        </View>

        <Text style={[styles.settingsTitle, { color: Colors[currentTheme].text }]}>
          Settings
        </Text>

        <Text style={[styles.sectionTitle, { color: Colors[currentTheme].text }]}>
          Theme
        </Text>

        <View style={styles.themeButtonsContainer}>
          {(['system', 'dark', 'light'] as const).map((themeOption) => (
            <Pressable
              key={themeOption}
              onPress={() => setTheme(themeOption)}
              style={[
                styles.themebtn,
                {
                  backgroundColor: theme === themeOption 
                    ? Colors[currentTheme].tint 
                    : Colors[currentTheme].background,
                  borderColor: Colors[currentTheme].tint
                }
              ]}
            >
              <Text style={[
                styles.themetext,
                { color: theme === themeOption 
                  ? Colors[currentTheme].background 
                  : Colors[currentTheme].text 
                }
              ]}>
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 30,
    paddingHorizontal: 5,
    fontWeight: "900",
  },
  subheading: {
    fontSize: 14,
    paddingHorizontal: 5,
  },
  signupcontainer: {
    marginVertical: 20,
    padding: 30,
    borderRadius: 15,
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
    fontWeight: "bold",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "700",
  },
  themeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
});
