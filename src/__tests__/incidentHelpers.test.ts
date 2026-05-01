import type { Incident } from '../types/models';
import {
  createSimulatedIncident,
  formatIncidentTime,
  shouldShowActiveAlert,
  withIncidentStatus,
} from '../utils/incidentHelpers';

describe('shouldShowActiveAlert', () => {
  const pending: Incident = {
    id: '1',
    type: 'Test',
    locationName: 'X',
    distance: '1 mi',
    estimatedArrivalTime: '5 min',
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  it('returns false when volunteer is unavailable', () => {
    expect(shouldShowActiveAlert(false, pending)).toBe(false);
  });

  it('returns false when there is no active alert', () => {
    expect(shouldShowActiveAlert(true, null)).toBe(false);
  });

  it('returns false when alert is not pending', () => {
    const accepted = withIncidentStatus(pending, 'accepted');
    expect(shouldShowActiveAlert(true, accepted)).toBe(false);
  });

  it('returns true when available and alert is pending', () => {
    expect(shouldShowActiveAlert(true, pending)).toBe(true);
  });
});

describe('createSimulatedIncident', () => {
  it('assigns pending status and unique id', () => {
    const base = {
      type: 'Stroke',
      locationName: 'A',
      distance: '2 mi',
      estimatedArrivalTime: '8 min',
    };
    const a = createSimulatedIncident(base);
    const b = createSimulatedIncident(base);
    expect(a.status).toBe('pending');
    expect(b.status).toBe('pending');
    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBeTruthy();
  });

  it('keeps template fields on the generated incident', () => {
    const base = {
      type: 'Cardiac arrest',
      locationName: 'Station Road',
      distance: '0.4 miles',
      estimatedArrivalTime: '2 min',
      incidentLat: 51.5,
      incidentLng: -0.12,
      volunteerLat: 51.51,
      volunteerLng: -0.11,
    };
    const incident = createSimulatedIncident(base);
    expect(incident.type).toBe(base.type);
    expect(incident.locationName).toBe(base.locationName);
    expect(incident.distance).toBe(base.distance);
    expect(incident.estimatedArrivalTime).toBe(base.estimatedArrivalTime);
    expect(incident.incidentLat).toBe(base.incidentLat);
    expect(incident.incidentLng).toBe(base.incidentLng);
    expect(incident.volunteerLat).toBe(base.volunteerLat);
    expect(incident.volunteerLng).toBe(base.volunteerLng);
  });
});

describe('withIncidentStatus', () => {
  it('updates status immutably', () => {
    const inc: Incident = {
      id: 'x',
      type: 'Bleed',
      locationName: 'B',
      distance: '1 mi',
      estimatedArrivalTime: '3 min',
      createdAt: 't',
      status: 'pending',
    };
    const next = withIncidentStatus(inc, 'declined');
    expect(next.status).toBe('declined');
    expect(inc.status).toBe('pending');
  });
});

describe('formatIncidentTime', () => {
  it('formats valid ISO strings', () => {
    const s = formatIncidentTime('2024-01-15T14:30:00.000Z');
    expect(s.length).toBeGreaterThan(4);
  });

  it('returns original value for invalid date input', () => {
    const bad = 'not-a-real-date';
    expect(formatIncidentTime(bad)).toBe('Invalid Date');
  });
});
