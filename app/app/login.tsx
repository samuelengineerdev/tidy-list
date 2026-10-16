import { useLoginMutation } from '@/api/auth-api';
import { useHandleError } from '@/api/handle-error';
import { useLazyGetUserSettingsQuery } from '@/api/user-settings-api';
import Logo from '@/components/logo';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAppToast } from '@/hooks/use-app-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logIn } from '@/store/slices/authSlice';
import { setTheme } from '@/store/slices/user-setting-slice';
import { isValidEmail } from '@/utils/validations';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('smtest1@mail.com');
    const [password, setPassword] = useState('123456');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const toast = useAppToast();
    const handleError = useHandleError();

    const [getuserSettings, { }] = useLazyGetUserSettingsQuery();

    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const [loginMutation, { isLoading }] = useLoginMutation();

    const togglePassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async () => {
        if (!email || !password) {
            toast.info('Please fill in all the fields');
            return;
        }

        if (!isValidEmail(email)) {
            toast.info('Please enter a valid email')
            return;
        }

        try {
            const result = await loginMutation({ email, password }).unwrap();
            toast.success(result.message);
            // toast.success('Test');
            // toast.info('Test');
            // toast.error('Test');

            dispatch(logIn(result.data));

            try {
                const userSettingsResult = await getuserSettings().unwrap();
                dispatch(setTheme(userSettingsResult.data));
            } catch (error) { console.log(error) }

            router.push('/(main)');

        } catch (error) {
            console.log(error)
            // handleError.handleApiError(error);
        }

    };

    const navigateToRegister = () => {
        router.navigate('/register');
    }

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
                                    Sign In
                                </Heading>
                                <Text className="text-textMuted-foreground">
                                    Enter your email and password to access
                                </Text>
                            </VStack>

                            <VStack space="md">
                                {/* Email */}
                                <VStack space="xs">
                                    <Text className="text-sm font-medium text-card-foreground">Email</Text>
                                    <Input className="border border-input rounded-md">
                                        <InputField
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

                                {/* Button */}
                                <Button
                                    className="mt-2 bg-primary rounded-md"
                                    onPress={handleSubmit}
                                    disabled={isLoading}
                                >
                                    <ButtonText className="text-primary-foreground font-medium">
                                        {isLoading ? <Spinner /> : 'Sign In'}
                                    </ButtonText>
                                </Button>
                            </VStack>

                            {/* Footer Links */}
                            <VStack space="xs" className="items-center">
                                <Text className="text-sm text-textMuted-foreground">
                                    Don't have an account?{' '}
                                </Text>
                                <Pressable onPress={navigateToRegister}>
                                    <Text className="text-primary font-medium underline">
                                        Sign Up
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
