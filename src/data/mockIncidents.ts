import type { Incident } from '../types/models';

export const incidentTemplates: Omit<
  Incident,
  'id' | 'createdAt' | 'status'
>[] = [
  {
    type: 'Possible cardiac arrest',
    locationName: 'High Street, City Centre',
    distance: '0.8 miles',
    estimatedArrivalTime: '4 min',
    incidentLat: 51.5074,
    incidentLng: -0.1278,
    volunteerLat: 51.508,
    volunteerLng: -0.129,
  },
  {
    type: 'Unresponsive person',
    locationName: 'Riverside Park, East Gate',
    distance: '1.2 miles',
    estimatedArrivalTime: '6 min',
    incidentLat: 51.51,
    incidentLng: -0.12,
    volunteerLat: 51.509,
    volunteerLng: -0.121,
  },
  {
    type: 'Severe bleeding',
    locationName: 'Market Square',
    distance: '0.5 miles',
    estimatedArrivalTime: '3 min',
    incidentLat: 51.505,
    incidentLng: -0.125,
    volunteerLat: 51.506,
    volunteerLng: -0.126,
  },
  {
    type: 'Suspected stroke',
    locationName: 'Oak Avenue, Suburbs',
    distance: '2.1 miles',
    estimatedArrivalTime: '9 min',
    incidentLat: 51.52,
    incidentLng: -0.11,
    volunteerLat: 51.515,
    volunteerLng: -0.115,
  },
];
