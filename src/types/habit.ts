export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequency: 'daily' | 'specific_days';
  specificDays?: string[];
  completed: boolean;
  streak: number;
  createdAt: string;
}

export interface HabitCheckRequest {
  habitId: string;
  completed: boolean;
  date: string;
}

export interface HabitCheckResponse {
  success: boolean;
  habit: Habit;
  message?: string;
}

export interface DashboardResponse {
  habits: Habit[];
  completedCount: number;
  totalCount: number;
  streak: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapResponse {
  data: HeatmapDay[];
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
}

export interface WeeklyProgress {
  day: string;
  completed: number;
  total: number;
}

export interface CreateHabitRequest {
  title: string;
  icon: string;
  frequency: 'daily' | 'specific_days';
  specificDays?: string[];
}
