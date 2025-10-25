// app/_layout.tsx
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css'; 

// RootLayout para Expo + Gluestack + NativeWind
export default function RootLayout() {
  const systemColorScheme = useSystemColorScheme();

  return (
    <GluestackUIProvider mode={"dark"}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={systemColorScheme === 'dark' ? 'light' : 'dark'} />
    </GluestackUIProvider>
  );
}
