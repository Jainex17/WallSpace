import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function ThemeStatusBar() {
    const { currentTheme } = useTheme();
    return <>
      <StatusBar
            backgroundColor={Colors[currentTheme].background}
            style={currentTheme === "dark" ? "light" : "dark"}
            translucent={false}
        />
    </>;
  }