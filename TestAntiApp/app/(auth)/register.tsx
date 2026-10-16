import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useColorScheme } from 'nativewind';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      Alert.alert('Account Created', 'Your account was created successfully! Please log in.');
      router.replace('/(auth)/login');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Error creating account');
    }
  });

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    registerMutation.mutate({ email, password, confirmPassword });
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
      <ScrollView contentContainerClassName="flex-grow items-center justify-center p-4">
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
              <Text className="text-2xl font-bold text-card-foreground dark:text-card-dark-foreground">Create Account</Text>
              <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-1">
                Enter your details to start organizing your tasks
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
              <View className="space-y-2 mb-4">
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

              {/* Confirm Password Input */}
              <View className="space-y-2 mb-6">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mb-1">Confirm Password</Text>
                <View className="w-full h-12 flex-row items-center border border-input dark:border-input-dark rounded-md bg-background dark:bg-background-dark pr-3">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={placeholderColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 h-full px-4 text-foreground dark:text-foreground-dark"
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-2">
                    <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={iconColor} />
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Pressable 
                onPress={handleSubmit}
                disabled={registerMutation.isPending}
                className={`w-full h-12 items-center justify-center rounded-md flex-row ${registerMutation.isPending ? 'bg-primary/70' : 'bg-primary'}`}
              >
                {registerMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-primary-foreground font-medium text-base">Create Account</Text>
                )}
              </Pressable>

            </View>

            {/* Footer */}
            <View className="mt-6 flex-row justify-center items-center">
              <Text className="text-muted-foreground dark:text-muted-dark-foreground text-sm">
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-primary font-medium text-sm">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
