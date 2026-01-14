import axios from 'axios';
import type {
  DashboardResponse,
  HabitCheckRequest,
  HabitCheckResponse,
  HeatmapResponse,
  WeeklyProgress,
  CreateHabitRequest,
  Habit,
} from '@/types/habit';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance for easy configuration swap
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ MOCK DATA ============

const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    icon: '🧘',
    frequency: 'daily',
    completed: false,
    streak: 12,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Exercise',
    icon: '💪',
    frequency: 'daily',
    completed: true,
    streak: 8,
    createdAt: '2024-01-05',
  },
  {
    id: '3',
    title: 'Read 30 minutes',
    icon: '📚',
    frequency: 'daily',
    completed: false,
    streak: 5,
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    title: 'Drink 8 glasses of water',
    icon: '💧',
    frequency: 'daily',
    completed: true,
    streak: 21,
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    title: 'Practice coding',
    icon: '💻',
    frequency: 'specific_days',
    specificDays: ['Mon', 'Wed', 'Fri'],
    completed: false,
    streak: 3,
    createdAt: '2024-01-15',
  },
];

const generateHeatmapData = (): HeatmapResponse => {
  const data = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 5);
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level: Math.min(count, 4) as 0 | 1 | 2 | 3 | 4,
    });
  }

  return {
    data,
    totalCompletions: 847,
    longestStreak: 28,
    currentStreak: 12,
  };
};

const generateWeeklyProgress = (): WeeklyProgress[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    completed: Math.floor(Math.random() * 5) + 1,
    total: 5,
  }));
};

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============ API FUNCTIONS ============

/**
 * Get today's habits for the dashboard
 * Real API: GET /dashboard/today
 */
export async function getDashboardToday(): Promise<DashboardResponse> {
  // TODO: Uncomment for real API
  // const response = await apiClient.get<DashboardResponse>('/dashboard/today');
  // return response.data;

  await delay(300);
  const completedCount = mockHabits.filter((h) => h.completed).length;
  return {
    habits: [...mockHabits],
    completedCount,
    totalCount: mockHabits.length,
    streak: 12,
  };
}

/**
 * Toggle habit completion status
 * Real API: POST /habits/check
 */
export async function checkHabit(request: HabitCheckRequest): Promise<HabitCheckResponse> {
  // TODO: Uncomment for real API
  // const response = await apiClient.post<HabitCheckResponse>('/habits/check', request);
  // return response.data;

  await delay(200);
  const habit = mockHabits.find((h) => h.id === request.habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }

  habit.completed = request.completed;
  if (request.completed) {
    habit.streak += 1;
  }

  return {
    success: true,
    habit: { ...habit },
    message: request.completed ? 'Great job! Keep it up! 🎉' : 'Habit unmarked',
  };
}

/**
 * Get heatmap data for analytics
 * Real API: GET /analytics/heatmap
 */
export async function getHeatmapData(): Promise<HeatmapResponse> {
  // TODO: Uncomment for real API
  // const response = await apiClient.get<HeatmapResponse>('/analytics/heatmap');
  // return response.data;

  await delay(400);
  return generateHeatmapData();
}

/**
 * Get weekly progress data
 * Real API: GET /analytics/weekly
 */
export async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  // TODO: Uncomment for real API
  // const response = await apiClient.get<WeeklyProgress[]>('/analytics/weekly');
  // return response.data;

  await delay(300);
  return generateWeeklyProgress();
}

/**
 * Create a new habit
 * Real API: POST /habits
 */
export async function createHabit(request: CreateHabitRequest): Promise<Habit> {
  // TODO: Uncomment for real API
  // const response = await apiClient.post<Habit>('/habits', request);
  // return response.data;

  await delay(300);
  const newHabit: Habit = {
    id: String(mockHabits.length + 1),
    ...request,
    completed: false,
    streak: 0,
    createdAt: new Date().toISOString(),
  };
  mockHabits.push(newHabit);
  return newHabit;
}
