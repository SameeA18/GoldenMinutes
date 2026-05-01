import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import { AppProvider } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeHarness() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'GoldenMinutes' }}
      />
    </Stack.Navigator>
  );
}

describe('HomeScreen flow', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('allows toggling availability from the dashboard', async () => {
    render(
      <AppProvider>
        <NavigationContainer>
          <HomeHarness />
        </NavigationContainer>
      </AppProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText('Set available')).toBeTruthy()
    );

    fireEvent.press(screen.getByText('Set available'));

    await waitFor(() =>
      expect(screen.queryByText('Set unavailable')).toBeTruthy()
    );
  });
});
