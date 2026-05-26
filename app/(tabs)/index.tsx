import { Redirect } from 'expo-router';
import React, { useState } from 'react';

import HomeScreen from '@/screens/HomeScreen';

// Simple global auth state — set to true after login/create account
// Replace this with your real auth logic later
export let isLoggedIn = false;
export const setLoggedIn = (value: boolean) => {
  isLoggedIn = value;
};

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  if (!loggedIn) {
    return <Redirect href="/login" />;
  }

  return <HomeScreen />;
}
