import Logo from '@/components/logo';
import { Colors } from '@/constants/theme';
import { useRegister } from '@/hooks/use-auth';
import { ApiError } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const current = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const registerMutation = useRegister();

  const handleRegister = async () => {
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await registerMutation.mutateAsync({ email, password, confirmPassword });
      router.replace('/login');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage('Unexpected error. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#1A1A1A]">
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md gap-6">
          <View className="items-center">
            <Logo />
          </View>

          <View
            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#333333] dark:bg-[#242424]"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <Text className="text-3xl font-bold text-[#1A1A1A] dark:text-[#FAFAFA]">Create Account</Text>
            <Text className="mt-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
              Enter your details to start organizing your tasks
            </Text>

            <View className="mt-5 gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={current.icon}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-4 py-3 text-[#1A1A1A] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-[#FAFAFA]"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Password</Text>
                <View className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-4 py-3 dark:border-[#333333] dark:bg-[#1A1A1A]">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={current.icon}
                    secureTextEntry={!showPassword}
                    className="pr-20 text-[#1A1A1A] dark:text-[#FAFAFA]"
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 rounded-md px-2 py-1"
                  >
                    <Text className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3]">
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Confirm Password</Text>
                <View className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-4 py-3 dark:border-[#333333] dark:bg-[#1A1A1A]">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={current.icon}
                    secureTextEntry={!showConfirmPassword}
                    className="pr-20 text-[#1A1A1A] dark:text-[#FAFAFA]"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-3 rounded-md px-2 py-1"
                  >
                    <Text className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3]">
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={handleRegister}
                disabled={registerMutation.isPending}
                className="mt-1 items-center rounded-lg bg-[#F99437] px-4 py-3 disabled:opacity-60"
              >
                <Text className="font-semibold text-white">
                  {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                </Text>
              </Pressable>
            </View>
            {errorMessage ? (
              <Text className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{errorMessage}</Text>
            ) : null}

            <View className="mt-5 flex-row items-center justify-center">
              <Text className="text-sm text-[#737373] dark:text-[#A3A3A3]">Already have an account? </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold text-[#F99437]">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
