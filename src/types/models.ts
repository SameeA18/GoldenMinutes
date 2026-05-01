export type TrainingLevel = 'First Aider' | 'Nurse' | 'Doctor' | 'Paramedic';

export type IncidentStatus = 'pending' | 'accepted' | 'declined' | 'missed';

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  trainingLevel: TrainingLevel;
  isAvailable: boolean;
}

export interface Incident {
  id: string;
  type: string;
  locationName: string;
  distance: string;
  estimatedArrivalTime: string;
  createdAt: string;
  status: IncidentStatus;
  volunteerLat?: number;
  volunteerLng?: number;
  incidentLat?: number;
  incidentLng?: number;
}
