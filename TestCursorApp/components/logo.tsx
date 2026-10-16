import { Image } from 'expo-image';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

const darkLargeLogo = require('@/assets/logos/dark-large-logo.png');
const whiteLargeLogo = require('@/assets/logos/white-large-logo.png');

type LogoProps = {
  height?: number;
};

export default function Logo({ height = 32 }: LogoProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View>
      <Image
        source={isDark ? whiteLargeLogo : darkLargeLogo}
        style={{ height, width: height * 3.2 }}
        contentFit="contain"
      />
    </View>
  );
}
