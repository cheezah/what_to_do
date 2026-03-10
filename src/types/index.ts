export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type RepeatRule = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type ReminderTime = 'none' | '5m' | '15m' | '30m' | '1h' | '1d';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string
  endDate?: string;  // ISO 8601 string
  isAllDay: boolean;
  priority: Priority;
  status: TaskStatus;
  categoryId?: string;
  themeId?: string; // New: Theme Association
  subtasks: SubTask[];
  repeatRule: RepeatRule;
  reminderTime: ReminderTime;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  color: string; // Hex color
  associatedPriority?: Priority;
  categoryId?: string; // Associated category
  createdAt: string;
}

export type SortField = 'createdAt' | 'dueDate' | 'category' | 'theme';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export const PRIORITY_COLORS = {
  high: '#FF4444',
  medium: '#FFA500',
  low: '#4CAF50',
};
