// app/(main)/_layout.tsx
import Header from '@/components/header';
import { useAppSelector } from '@/store/hooks';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function MainLayout() {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  return (<Stack
    screenOptions={{
      headerShown: true,
      header: () => <Header />,
    }}/>
  );
}
