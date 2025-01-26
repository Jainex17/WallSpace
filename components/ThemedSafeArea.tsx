import { Colors } from "@/constants/Colors"
import { useTheme } from "@/context/ThemeContext"
import { SafeAreaView } from "react-native"
import { SafeAreaViewProps } from "react-native-safe-area-context"

export const ThemedSafeArea = (props: SafeAreaViewProps) => {

    const { currentTheme } = useTheme()

  return <SafeAreaView
    {...props}
    style={[{ backgroundColor: Colors[currentTheme].background }, props.style]}
  />
}
