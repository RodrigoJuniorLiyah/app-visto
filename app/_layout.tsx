import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ThemeProvider } from '@/components/ThemeProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="PhotoDetail" options={{ headerShown: true, title: 'Photo Details' }} />
            <Stack.Screen name="PhotoComparison" options={{ headerShown: true, title: 'Compare Photos' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}
