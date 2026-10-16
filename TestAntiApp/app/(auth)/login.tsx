import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { colorScheme } = useColorScheme();

  const STORAGE_KEY = '@user_credentials';

  // Load saved credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load credentials from storage:', error);
      }
    };
    loadCredentials();
  }, []);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const setAuth = useAuthStore(state => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Handle "Remember Credentials" storage logic
      try {
        if (rememberMe) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to update credentials storage:', error);
      }

      setAuth(data.data.user, data.data.token);
      router.replace('/home');
    },
    onError: (error: any) => {
      Alert.alert('Login Failed', error.response?.data?.message || error.message || 'An error occurred during login.');
    }
  });

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  const isDark = colorScheme === 'dark';
  const placeholderColor = isDark ? '#a1a1aa' : '#9ca3af';
  const iconColor = isDark ? '#a1a1aa' : '#6b7280';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView contentContainerClassName="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md space-y-6">

          {/* Logo */}
          <View className="items-center mb-6">
            <Link href="/" asChild>
              <Pressable>
                <Logo />
              </Pressable>
            </Link>
          </View>

          {/* Card */}
          <View className="bg-main dark:main-dark rounded-xl p-6 border-none dark:border-border-dark">
            <View className="mb-6 space-y-1">
              <Text className="text-2xl font-bold text-card-foreground dark:text-card-dark-foreground">Sign In</Text>
              <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-1">
                Enter your email and password to access
              </Text>
            </View>

            <View className="space-y-4">

              {/* Email Input */}
              <View className="space-y-2 mb-4">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mb-1">Email</Text>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor={placeholderColor}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="w-full h-12 px-4 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                />
              </View>

              {/* Password Input */}
              <View className="space-y-2 mb-6">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mb-1">Password</Text>
                <View className="w-full h-12 flex-row items-center border border-input dark:border-input-dark rounded-md bg-background dark:bg-background-dark pr-3">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 h-full px-4 text-foreground dark:text-foreground-dark"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} className="p-2">
                    <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={iconColor} />
                  </Pressable>
                </View>
              </View>

              {/* Remember Me Checkbox */}
              <View className="mb-6">
                <Pressable
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center space-x-2"
                >
                  <View className={`w-5 h-5 rounded border items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-input dark:border-input-dark bg-background dark:bg-background-dark'}`}>
                    {rememberMe && <Feather name="check" size={14} color="#fff" />}
                  </View>
                  <Text className="text-sm font-medium text-foreground dark:text-foreground-dark ml-2">Recordar credenciales</Text>
                </Pressable>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={loginMutation.isPending}
                className={`w-full h-12 items-center justify-center rounded-md flex-row ${loginMutation.isPending ? 'bg-primary/70' : 'bg-primary'}`}
              >
                {loginMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-primary-foreground font-medium text-base">Sign In</Text>
                )}
              </Pressable>

            </View>

            {/* Footer */}
            <View className="mt-6 flex-row justify-center items-center">
              <Text className="text-muted-foreground dark:text-muted-dark-foreground text-sm">
                Don't have an account?{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-primary font-medium text-sm">Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
