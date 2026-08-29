import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { YatraProvider, useYatra } from '@/context/YatraContext';
import { BootSplashScreen } from '@/components/BootSplashScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function DestinationGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, selectedDestination } = useYatra();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until AsyncStorage has finished restoring session
    if (isLoading) return;

    // Not logged in → force to auth screen
    if (!user && pathname !== '/auth') {
      router.replace('/auth');
      return;
    }

    if (user) {
      // 1. If Authority Role
      if (user.role === 'authority') {
        if (!selectedDestination && pathname !== '/destination-picker') {
          router.replace('/destination-picker');
          return;
        }
        if (selectedDestination && pathname !== '/authority/dashboard' && pathname !== '/destination-picker') {
          router.replace('/authority/dashboard');
          return;
        }
      }

      // 2. If Pilgrim Role
      if (user.role !== 'authority') {
        // Block pilgrims from authority dashboard
        if (pathname.startsWith('/authority')) {
          router.replace('/(tabs)');
          return;
        }
        // Logged in pilgrim but no destination chosen → force to destination picker
        if (!selectedDestination && pathname !== '/destination-picker') {
          router.replace('/destination-picker');
          return;
        }
      }
    }
  }, [user, isLoading, selectedDestination, pathname]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="place-map" options={{ headerShown: false }} />
      <Stack.Screen name="family-hub" options={{ headerShown: false }} />
      <Stack.Screen name="transport" options={{ headerShown: false }} />
      <Stack.Screen
        name="destination-picker"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="authority/dashboard"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [isBooting, setIsBooting] = React.useState(true);
  const [appReady, setAppReady] = React.useState(false);

  useEffect(() => {
    // Hide native splash once fonts are ready or errored
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Safety fallback: never allow the app to get stuck on native splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      setAppReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!appReady && !fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <YatraProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <DestinationGuard>
                <RootLayoutNav />
              </DestinationGuard>
              {isBooting && (
                <BootSplashScreen onFinish={() => setIsBooting(false)} />
              )}
            </GestureHandlerRootView>
          </YatraProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
