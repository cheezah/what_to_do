import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store
    useStore.setState({
      tasks: [],
      themes: [],
      categories: [],
      sortOption: { field: 'createdAt', direction: 'desc' }
    });
  });

  describe('Theme Management', () => {
    it('should add a theme', () => {
      const { addTheme } = useStore.getState();
      
      addTheme({
        name: 'Test Theme',
        color: '#123456',
        associatedPriority: 'high'
      });

      const themes = useStore.getState().themes;
      expect(themes).toHaveLength(1);
      expect(themes[0].name).toBe('Test Theme');
      expect(themes[0].color).toBe('#123456');
    });

    it('should update a theme', () => {
      const { addTheme } = useStore.getState();
      addTheme({ name: 'Theme 1', color: '#000' });
      const themeId = useStore.getState().themes[0].id;

      const { updateTheme } = useStore.getState();
      updateTheme(themeId, { name: 'Updated Theme' });

      expect(useStore.getState().themes[0].name).toBe('Updated Theme');
    });

    it('should delete a theme and unlink tasks', () => {
      const { addTheme, addTask } = useStore.getState();
      
      addTheme({ name: 'Theme 1', color: '#000' });
      const themeId = useStore.getState().themes[0].id;

      addTask({
        title: 'Task 1',
        startDate: new Date().toISOString(),
        isAllDay: true,
        priority: 'medium',
        status: 'pending',
        themeId: themeId,
        repeatRule: 'none',
        reminderTime: 'none',
        subtasks: []
      });

      expect(useStore.getState().tasks[0].themeId).toBe(themeId);

      const { deleteTheme } = useStore.getState();
      deleteTheme(themeId);

      expect(useStore.getState().themes).toHaveLength(0);
      expect(useStore.getState().tasks[0].themeId).toBeUndefined();
    });
  });

  describe('Sorting', () => {
    it('should update sort option', () => {
      const { setSortOption } = useStore.getState();
      
      setSortOption({ field: 'dueDate', direction: 'asc' });
      
      expect(useStore.getState().sortOption).toEqual({
        field: 'dueDate',
        direction: 'asc'
      });
    });
  });
});
