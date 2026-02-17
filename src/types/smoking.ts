export interface SmokingProfile {
  startMonth: number;
  startYear: number;
  avgPerDay: number;
  brand: string;
  perPack: number;
  nicotineMg: number;
  tarMg: number;
}

export interface SmokeLog {
  id: string;
  timestamp: string;
  count: number;
  location: string;
  triggers: string[];
  moodBefore: string;
  notes: string;
}

export const LOCATIONS = ['Home', 'Workplace', 'Commute', 'Social setting', 'Outdoors', 'Other'] as const;

export const TRIGGERS = ['Work stress', 'Deadline', 'Boredom', 'After meal', 'With tea/coffee', 'Habit', 'Social', 'Conflict', 'Other'] as const;

export const MOODS = [
  { emoji: '😣', label: 'Very Low', value: 'very-low' },
  { emoji: '😟', label: 'Low', value: 'low' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😄', label: 'High', value: 'high' },
] as const;

export const HEALTH_FACTS = [
  'Tobacco use accounts for approximately 1.35 million deaths annually in India. — WHO, 2023',
  'Tar from smoke accumulates in lung tissue and contributes to chronic obstruction. — ICMR',
  'Nicotine reaches the brain within 10 seconds of inhalation. — NHS',
  'Tobacco is the leading preventable cause of cancer in India. — ICMR, 2022',
  'Lung function begins recovering within weeks of cessation. — NHS Stop Smoking',
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
