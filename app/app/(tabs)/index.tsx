import { Text, View, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center h-screen">
        <Text className="text-xl font-bold text-primary">
          Welcome to NativeWind!
        </Text>
      </View>
    </ScrollView>
  );
}
