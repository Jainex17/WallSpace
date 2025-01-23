import { View, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export function ThemedView(props: ViewProps) {
  const { currentTheme } = useTheme();
  return (
    <View 
      {...props} 
      style={[
        { backgroundColor: Colors[currentTheme].background },
        props.style
      ]} 
    />
  );
}
