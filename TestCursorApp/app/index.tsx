import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9FAFB] dark:bg-[#1A1A1A]">
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={token ? '/tasks' : '/login'} />;
}
