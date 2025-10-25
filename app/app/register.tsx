import Logo from '@/components/logo';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  const handleSubmit = () => {
    // Basic validation
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
      return;
    }

    // TODO: Implement register logic
    console.log('Register attempt:', { email, password, confirmPassword });
  };

  const navigateBack = () => {
    router.back();
  };


  return (
    <SafeAreaView className="flex-1 bg-background bg-gradient-to-b from-background to-accent/10">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="p-4"
      >
        <Box className="w-full max-w-md mx-auto space-y-6">
          {/* Logo */}
          <Box className="items-center mb-6">
            <Logo />
          </Box>

          {/* Card/Form */}
          <Card className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <VStack space="lg">
              <VStack space="xs">
                <Heading className="text-2xl font-bold text-card-foreground">
                  Create Account
                </Heading>
                <Text className="text-muted-foreground">
                  Enter your details to start organizing your tasks
                </Text>
              </VStack>

              <VStack space="md">
                {/* Email */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-card-foreground">Email</Text>
                  <Input className="border border-input rounded-md  placeholder:text-white-500' text-white">
                    <InputField
                      className='text-white placeholder:text-white-500'
                      type="text"
                      placeholder="your@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Input>
                </VStack>

                {/* Password */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-card-foreground">Password</Text>
                  <Input className="border border-input rounded-md">
                    <InputField
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <InputSlot onPress={togglePassword} className="pr-3">
                      <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Confirm Password */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-card-foreground">Confirm Password</Text>
                  <Input className="border border-input rounded-md">
                    <InputField
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <InputSlot onPress={toggleConfirmPassword} className="pr-3">
                      <InputIcon as={showConfirmPassword ? EyeOffIcon : EyeIcon} />
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Button */}
                <Button
                  className="mt-2 bg-primary rounded-md"
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <ButtonText className="text-primary-foreground font-medium">
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </ButtonText>
                </Button>
              </VStack>

              {/* Footer Links */}
              <VStack space="xs" className="items-center">
                <Text className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={navigateBack}>
                  <Text className="text-primary font-medium underline">
                    Sign In
                  </Text>
                </Pressable>
              </VStack>
            </VStack>
          </Card>

        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
