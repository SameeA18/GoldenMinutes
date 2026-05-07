import type { Incident, IncidentStatus } from '../types/models';

function newIncidentId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `inc-${c.randomUUID()}`;
  return `inc-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createSimulatedIncident(
  template: Omit<Incident, 'id' | 'createdAt' | 'status'>
): Incident {
  return {
    ...template,
    id: newIncidentId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
}

export function withIncidentStatus(
  incident: Incident,
  status: IncidentStatus
): Incident {
  return { ...incident, status };
}

export function shouldShowActiveAlert(
  isVolunteerAvailable: boolean,
  activeAlert: Incident | null
): boolean {
  return (
    isVolunteerAvailable &&
    activeAlert !== null &&
    activeAlert.status === 'pending'
  );
}

export function formatIncidentTime(createdAt: string): string {
  const ms = Date.parse(createdAt);
  if (!Number.isFinite(ms)) return 'Invalid Date';
  return new Date(ms).toLocaleString();
}
