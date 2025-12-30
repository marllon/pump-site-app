export interface CatheterLocation {
  id: string;
  name: string;
  displayName: string;
  zone: 'abdomen' | 'legs' | 'glutes' | 'lumbar';
  side: 'left' | 'right';
}

export interface CatheterRecord {
  id: string;
  locationId: string;
  date: Date;
  notes?: string;
  duration?: number; // em horas
}

export interface CatheterHistory {
  records: CatheterRecord[];
  lastLocationId?: string;
}

export interface SuggestionAlgorithm {
  getNextSuggestion: (history: CatheterRecord[], locations: CatheterLocation[]) => CatheterLocation;
}

export const CATHETER_LOCATIONS: CatheterLocation[] = [
  { id: 'abdomen_left', name: 'abdomen_left', displayName: 'Abdômen Esquerdo', zone: 'abdomen', side: 'left' },
  { id: 'abdomen_right', name: 'abdomen_right', displayName: 'Abdômen Direito', zone: 'abdomen', side: 'right' },
  { id: 'leg_left', name: 'leg_left', displayName: 'Perna Esquerda', zone: 'legs', side: 'left' },
  { id: 'leg_right', name: 'leg_right', displayName: 'Perna Direita', zone: 'legs', side: 'right' },
  { id: 'glute_left', name: 'glute_left', displayName: 'Glúteo Esquerdo', zone: 'glutes', side: 'left' },
  { id: 'glute_right', name: 'glute_right', displayName: 'Glúteo Direito', zone: 'glutes', side: 'right' },
  { id: 'lumbar_left', name: 'lumbar_left', displayName: 'Lombar Esquerdo', zone: 'lumbar', side: 'left' },
  { id: 'lumbar_right', name: 'lumbar_right', displayName: 'Lombar Direito', zone: 'lumbar', side: 'right' },
];