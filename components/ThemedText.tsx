import { Text, type TextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  
  const { currentTheme } = useTheme();
  let color = type === 'default' ? 'text' : type;

  if(type === 'title') {
    color = Colors[currentTheme].text;
  }else if(type === 'subtitle') {
    color = Colors[currentTheme].tabIconDefault;
  }

  return (
    <Text
      style={[
        { color: color },
        style
      ]}
      {...rest}
    />
  );
}

