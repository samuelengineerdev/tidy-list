import { Image } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function Logo() {
  const { colorScheme } = useColorScheme();
  
  // Decide which image to show based on standard system theme
  const source = colorScheme === 'dark' 
    ? require('../../assets/images/white-large-logo.png') 
    : require('../../assets/images/dark-large-logo.png');

  return (
    <Image 
      source={source} 
      className="h-8 w-32" 
      resizeMode="contain" 
    />
  );
}
