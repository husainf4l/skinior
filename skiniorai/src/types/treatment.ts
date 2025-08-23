export interface Treatment {
  id: string;
  title: string;
  name?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  progress?: number;
  type?: string;
  duration?: string;
  createdAt: string;
  startDate?: string;
  description?: string;
  goals?: string[];
  notes?: string;
  currentWeek?: string | number;
  totalWeeks?: string | number;
  nextMilestone?: string;
  durationWeeks?: number;
}