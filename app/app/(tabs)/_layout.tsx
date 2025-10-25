import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  const token = false;
  
  if (!token) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }} />
  );
}
