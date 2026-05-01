import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppProvider } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { HistoryScreen } from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AlertDetailsStub({
  route,
}: {
  route: { params: RootStackParamList['AlertDetails'] };
}) {
  return <>{`Incident details for ${route.params.incidentId}`}</>;
}

function HistoryHarness() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="AlertDetails" component={AlertDetailsStub} />
    </Stack.Navigator>
  );
}

describe('HistoryScreen integration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('shows empty state when there are no incidents', async () => {
    render(
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="AlertDetails" component={AlertDetailsStub} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    );

    await waitFor(() =>
      expect(screen.getByText('No incidents recorded yet.')).toBeTruthy()
    );
  });

  it('renders hydrated incident history rows', async () => {
    await AsyncStorage.setItem(
      '@goldenminutes/incidents/v1',
      JSON.stringify([
        {
          id: 'inc-old',
          type: 'Older incident',
          locationName: 'Old Street',
          distance: '1.0 miles',
          estimatedArrivalTime: '5 min',
          createdAt: '2024-01-01T10:00:00.000Z',
          status: 'accepted',
        },
        {
          id: 'inc-new',
          type: 'Newer incident',
          locationName: 'New Street',
          distance: '0.4 miles',
          estimatedArrivalTime: '2 min',
          createdAt: '2024-01-01T10:05:00.000Z',
          status: 'accepted',
        },
      ])
    );

    render(
      <AppProvider>
        <NavigationContainer>
          <HistoryHarness />
        </NavigationContainer>
      </AppProvider>
    );

    await waitFor(() => expect(screen.getAllByText('accepted').length).toBe(2));

    expect(screen.getByText('Newer incident')).toBeTruthy();
    expect(screen.getByText('Older incident')).toBeTruthy();

    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2);
  });
});
