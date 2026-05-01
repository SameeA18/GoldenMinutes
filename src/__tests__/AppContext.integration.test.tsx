import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('AppContext integration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('hydrates and toggles availability', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.volunteer.isAvailable).toBe(false);

    act(() => {
      result.current.toggleAvailability();
    });

    expect(result.current.volunteer.isAvailable).toBe(true);

    act(() => {
      result.current.toggleAvailability();
    });

    expect(result.current.volunteer.isAvailable).toBe(false);
  });

  it('does not set active alert when unavailable', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.volunteer.isAvailable).toBe(false);

    let res: { ok: boolean; reason?: string } = { ok: true };
    act(() => {
      res = result.current.simulateEmergency();
    });

    expect(res.ok).toBe(false);
    expect(res.reason).toBe('unavailable');
    expect(result.current.activeAlert).toBeNull();
  });

  it('shows alert when available, accept updates history', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.updateVolunteer({ isAvailable: true });
    });
    await waitFor(() => expect(result.current.volunteer.isAvailable).toBe(true));

    act(() => {
      result.current.simulateEmergency();
    });
    await waitFor(() => expect(result.current.activeAlert).not.toBeNull());

    expect(result.current.activeAlert).not.toBeNull();
    expect(result.current.activeAlert?.status).toBe('pending');

    act(() => {
      result.current.acceptActiveAlert();
    });

    expect(result.current.activeAlert).toBeNull();
    expect(result.current.incidents[0]?.status).toBe('accepted');
    expect(result.current.incidents[0]?.id).toBeTruthy();
  });

  it('decline moves alert to history as declined', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.updateVolunteer({ isAvailable: true });
    });
    await waitFor(() => expect(result.current.volunteer.isAvailable).toBe(true));

    act(() => {
      result.current.simulateEmergency();
    });
    await waitFor(() => expect(result.current.activeAlert).not.toBeNull());

    act(() => {
      result.current.declineActiveAlert();
    });

    expect(result.current.activeAlert).toBeNull();
    expect(result.current.incidents[0]?.status).toBe('declined');
  });

  it('marks previous pending alert as missed when a new one is simulated', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.updateVolunteer({ isAvailable: true });
    });
    await waitFor(() => expect(result.current.volunteer.isAvailable).toBe(true));

    act(() => {
      result.current.simulateEmergency();
    });
    await waitFor(() => expect(result.current.activeAlert).not.toBeNull());

    const firstAlertId = result.current.activeAlert?.id ?? null;

    expect(firstAlertId).not.toBeNull();
    expect(result.current.incidents).toHaveLength(0);

    act(() => {
      result.current.simulateEmergency();
    });

    expect(result.current.activeAlert).not.toBeNull();
    expect(result.current.activeAlert?.status).toBe('pending');
    expect(result.current.activeAlert?.id).not.toBe(firstAlertId);
    expect(result.current.incidents[0]?.id).toBe(firstAlertId);
    expect(result.current.incidents[0]?.status).toBe('missed');
  });

  it('sets and clears unavailable simulate message', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.simulateEmergency();
    });

    expect(result.current.lastSimulateMessage).toBeTruthy();

    act(() => {
      result.current.clearSimulateMessage();
    });

    expect(result.current.lastSimulateMessage).toBeNull();
  });
});
