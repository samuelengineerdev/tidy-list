// app/_layout.tsx
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { VStack } from '@/components/ui/vstack';
import '@/global.css';
import { useAppSelector } from '@/store/hooks';
import { persistor, store } from '@/store/store';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// RootLayout para Expo + Gluestack + NativeWind
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <VStack className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </VStack>
        }
        persistor={persistor}
      >
        <AppProviders />
      </PersistGate>
    </Provider>
  );
}

function AppProviders() {
  const isDark = useAppSelector((state) => state.userSettings.darkMode);
  const mode = isDark ? 'dark' : 'light';

  return (
    <GluestackUIProvider mode={mode}>
      <Slot
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </GluestackUIProvider>
  );
}
