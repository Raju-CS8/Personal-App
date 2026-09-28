export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  statusLabel?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  tag: string;
  category: 'all' | 'high' | 'client' | 'personal' | 'deadlines';
  status: 'todo' | 'in_progress' | 'scheduled' | 'completed' | 'archived';
  durationEstimate?: string;
  dueText?: string;
  dueDate?: string;
  hasReminder?: boolean;
  progress?: {
    current: number;
    total: number;
  };
  subtasks?: Subtask[];
  assignees?: {
    name: string;
    avatar: string;
  }[];
  isPriorityHorizon?: boolean;
  completedAt?: string;
}

export interface AlertItem {
  id: string;
  category: 'due' | 'nudges' | 'milestones';
  badgeType: 'urgent' | 'streak' | 'geo' | 'milestone';
  badgeLabel: string;
  badgeSub?: string;
  title: string;
  description: string;
  streakInfo?: {
    current: number;
    total: number;
    days: number;
    resetText: string;
    taskName: string;
    subtext: string;
  };
  geoInfo?: {
    locationName: string;
    distance: string;
    itemCount: number;
    bgImage: string;
  };
  metrics?: {
    flowHours: string;
    tasksMet: string;
    onTimeRate: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  colorType: 'primary' | 'secondary' | 'tertiary';
  chimeActive: boolean;
}

export type ActiveTab = 'today' | 'tasks' | 'alerts' | 'insights';
export type TimeHorizon = 'week' | 'month' | 'all';
