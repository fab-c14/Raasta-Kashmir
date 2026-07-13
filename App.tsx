import React, { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TripProvider } from './src/context/TripContext';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
  navigationDarkTheme,
  navigationLightTheme,
  paperDarkTheme,
  paperLightTheme,
} from './src/theme/paperTheme';
import { lightColors, darkColors } from './src/theme/theme';

// Keep the splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { user, loading } = useAuth();
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  const isDark = useColorScheme() === 'dark';
  const [fontsLoaded] = useFonts({
    'Poppins-Light': Poppins_300Light,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <AuthProvider>
        <TripProvider>
          <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
            <NavigationContainer theme={isDark ? navigationDarkTheme : navigationLightTheme}>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </TripProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
