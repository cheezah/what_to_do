import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Category, Theme, SortOption } from '../types';

interface State {
  tasks: Task[];
  categories: Category[];
  themes: Theme[];
  sortOption: SortOption;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  archiveCategory: (id: string) => void;
  unarchiveCategory: (id: string) => void;

  addTheme: (theme: Omit<Theme, 'id' | 'createdAt'>) => void;
  updateTheme: (id: string, updates: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
  archiveTheme: (id: string) => void;
  unarchiveTheme: (id: string) => void;

  setSortOption: (option: SortOption) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: '工作', color: '#3B82F6', isDefault: true }, // blue-500
  { id: '2', name: '个人', color: '#10B981', isDefault: true }, // emerald-500
  { id: '3', name: '学习', color: '#F59E0B', isDefault: true }, // amber-500
  { id: '4', name: '重要', color: '#EF4444', isDefault: true }, // red-500
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      tasks: [],
      categories: defaultCategories,
      themes: [],
      sortOption: { field: 'createdAt', direction: 'desc' },

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          id: uuidv4(),
          ...taskData,
          subtasks: taskData.subtasks || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { tasks: [...state.tasks, newTask] };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id 
            ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
            : task
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),

      toggleTaskStatus: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id 
            ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed', updatedAt: new Date().toISOString() } 
            : task
        ),
      })),

      addCategory: (name, color) => set((state) => ({
        categories: [...state.categories, { id: uuidv4(), name, color }],
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id || cat.isDefault),
      })),

      archiveCategory: (id) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, archived: true } : cat
        ),
      })),

      unarchiveCategory: (id) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, archived: false } : cat
        ),
      })),

      addTheme: (themeData) => set((state) => ({
        themes: [...state.themes, { 
          id: uuidv4(), 
          ...themeData, 
          createdAt: new Date().toISOString() 
        }],
      })),

      updateTheme: (id, updates) => set((state) => ({
        themes: state.themes.map((theme) => 
          theme.id === id ? { ...theme, ...updates } : theme
        ),
      })),

      deleteTheme: (id) => set((state) => ({
        themes: state.themes.filter((theme) => theme.id !== id),
        // Unlink tasks from deleted theme
        tasks: state.tasks.map((task) =>
          task.themeId === id ? { ...task, themeId: undefined } : task
        ),
      })),

      archiveTheme: (id) => set((state) => ({
        themes: state.themes.map((theme) =>
          theme.id === id ? { ...theme, archived: true } : theme
        ),
      })),

      unarchiveTheme: (id) => set((state) => ({
        themes: state.themes.map((theme) =>
          theme.id === id ? { ...theme, archived: false } : theme
        ),
      })),

      setSortOption: (option) => set(() => ({
        sortOption: option,
      })),
    }),
    {
      name: 'what-to-do-storage',
    }
  )
);
