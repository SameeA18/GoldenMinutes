import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { incidentTemplates } from '../data/mockIncidents';
import type { Incident, Volunteer } from '../types/models';
import {
  createSimulatedIncident,
  withIncidentStatus,
} from '../utils/incidentHelpers';

const STORAGE_VOLUNTEER = '@goldenminutes/volunteer/v1';
const STORAGE_INCIDENTS = '@goldenminutes/incidents/v1';
const STORAGE_SESSION = '@goldenminutes/demo_session/v1';

const defaultVolunteer: Volunteer = {
  id: 'demo-volunteer-1',
  name: 'Demo Volunteer',
  role: 'Community responder',
  trainingLevel: 'Paramedic',
  isAvailable: false,
};

type AppContextValue = {
  volunteer: Volunteer;
  setVolunteer: (v: Volunteer) => void;
  updateVolunteer: (patch: Partial<Volunteer>) => void;
  incidents: Incident[];
  activeAlert: Incident | null;
  isDemoLoggedIn: boolean;
  isHydrated: boolean;
  loginDemo: () => void;
  logoutDemo: () => void;
  toggleAvailability: () => void;
  simulateEmergency: () => { ok: boolean; reason?: 'unavailable' };
  acceptActiveAlert: () => Incident | null;
  declineActiveAlert: () => void;
  lastSimulateMessage: string | null;
  clearSimulateMessage: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function pickRandomTemplate() {
  const i = Math.floor(Math.random() * incidentTemplates.length);
  return incidentTemplates[i];
}

async function writeIncidents(list: Incident[]) {
  await AsyncStorage.setItem(STORAGE_INCIDENTS, JSON.stringify(list));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [volunteer, setVolunteerState] = useState<Volunteer>(defaultVolunteer);
  const [incidents, setIncidentsState] = useState<Incident[]>([]);
  const [activeAlert, setActiveAlert] = useState<Incident | null>(null);
  const [isDemoLoggedIn, setIsDemoLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSimulateMessage, setLastSimulateMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [vRaw, iRaw, sRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_VOLUNTEER),
          AsyncStorage.getItem(STORAGE_INCIDENTS),
          AsyncStorage.getItem(STORAGE_SESSION),
        ]);
        if (cancelled) return;
        if (vRaw) setVolunteerState(JSON.parse(vRaw) as Volunteer);
        if (iRaw) setIncidentsState(JSON.parse(iRaw) as Incident[]);
        if (sRaw === 'true') setIsDemoLoggedIn(true);
      } catch {
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistVolunteer = useCallback(async (v: Volunteer) => {
    setVolunteerState(v);
    await AsyncStorage.setItem(STORAGE_VOLUNTEER, JSON.stringify(v));
  }, []);

  const setVolunteer = useCallback(
    (v: Volunteer) => {
      void persistVolunteer(v);
    },
    [persistVolunteer]
  );

  const updateVolunteer = useCallback(
    (patch: Partial<Volunteer>) => {
      const next = { ...volunteer, ...patch };
      void persistVolunteer(next);
    },
    [volunteer, persistVolunteer]
  );

  const loginDemo = useCallback(async () => {
    setIsDemoLoggedIn(true);
    await AsyncStorage.setItem(STORAGE_SESSION, 'true');
  }, []);

  const logoutDemo = useCallback(async () => {
    setIsDemoLoggedIn(false);
    setActiveAlert(null);
    await AsyncStorage.setItem(STORAGE_SESSION, 'false');
  }, []);

  const toggleAvailability = useCallback(() => {
    updateVolunteer({ isAvailable: !volunteer.isAvailable });
  }, [volunteer.isAvailable, updateVolunteer]);

  const simulateEmergency = useCallback(() => {
    if (!volunteer.isAvailable) {
      setLastSimulateMessage(
        'You are unavailable — no demo alert will be shown. Toggle Available first.'
      );
      return { ok: false as const, reason: 'unavailable' as const };
    }
    setLastSimulateMessage(null);
    const next = createSimulatedIncident(pickRandomTemplate());

    setActiveAlert((current) => {
      if (current?.status === 'pending') {
        const missed = withIncidentStatus(current, 'missed');
        setIncidentsState((prev) => {
          const merged = [missed, ...prev];
          void writeIncidents(merged);
          return merged;
        });
      }
      return next;
    });

    return { ok: true as const };
  }, [volunteer.isAvailable]);

  const acceptActiveAlert = useCallback((): Incident | null => {
    let accepted: Incident | null = null;
    setActiveAlert((current) => {
      if (!current || current.status !== 'pending') return current;
      accepted = withIncidentStatus(current, 'accepted');
      setIncidentsState((prev) => {
        const merged = [accepted!, ...prev];
        void writeIncidents(merged);
        return merged;
      });
      return null;
    });
    return accepted;
  }, []);

  const declineActiveAlert = useCallback(() => {
    setActiveAlert((current) => {
      if (!current || current.status !== 'pending') return current;
      const declined = withIncidentStatus(current, 'declined');
      setIncidentsState((prev) => {
        const merged = [declined, ...prev];
        void writeIncidents(merged);
        return merged;
      });
      return null;
    });
  }, []);

  const clearSimulateMessage = useCallback(() => {
    setLastSimulateMessage(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      volunteer,
      setVolunteer,
      updateVolunteer,
      incidents,
      activeAlert,
      isDemoLoggedIn,
      isHydrated,
      loginDemo,
      logoutDemo,
      toggleAvailability,
      simulateEmergency,
      acceptActiveAlert,
      declineActiveAlert,
      lastSimulateMessage,
      clearSimulateMessage,
    }),
    [
      volunteer,
      setVolunteer,
      updateVolunteer,
      incidents,
      activeAlert,
      isDemoLoggedIn,
      isHydrated,
      loginDemo,
      logoutDemo,
      toggleAvailability,
      simulateEmergency,
      acceptActiveAlert,
      declineActiveAlert,
      lastSimulateMessage,
      clearSimulateMessage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
