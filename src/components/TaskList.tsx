import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, Circle, Trash2, ArrowUpDown, ChevronUp, ChevronDown, Clock, Repeat, Folder } from 'lucide-react';
import { PRIORITY_COLORS } from '../types';
import type { SortField } from '../types';
import { isTaskVisibleOnDate } from '../utils/taskUtils';
import { formatTimeRange } from '../utils/timeUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { listItemVariants, springLayout } from '../utils/animations';
import { ConfirmDialog } from './ConfirmDialog';

interface TaskListProps {
  date: Date;
  onTaskClick: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ date, onTaskClick }) => {
  const tasks = useStore((state) => state.tasks);
  const themes = useStore((state) => state.themes);
  const categories = useStore((state) => state.categories);
  const sortOption = useStore((state) => state.sortOption);
  const setSortOption = useStore((state) => state.setSortOption);
  const toggleTaskStatus = useStore((state) => state.toggleTaskStatus);
  const deleteTask = useStore((state) => state.deleteTask);

  const [showSortMenu, setShowSortMenu] = useState(false);

  // Confirm Dialog State
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState('');

  const daysTasks = tasks.filter((task) => isTaskVisibleOnDate(task, date));

  // Sorting Logic
  const sortedTasks = [...daysTasks].sort((a, b) => {
    const direction = sortOption.direction === 'asc' ? 1 : -1;
    
    switch (sortOption.field) {
      case 'createdAt':
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
      
      case 'dueDate':
        const dateA = a.endDate ? new Date(a.endDate).getTime() : new Date(a.startDate).getTime();
        const dateB = b.endDate ? new Date(b.endDate).getTime() : new Date(b.startDate).getTime();
        return (dateA - dateB) * direction;
      
      case 'category':
        const catA = categories.find(c => c.id === a.categoryId)?.name || '';
        const catB = categories.find(c => c.id === b.categoryId)?.name || '';
        if (catA !== catB) return catA.localeCompare(catB) * direction;
        // Secondary sort by priority
        const pMap = { high: 3, medium: 2, low: 1 };
        return (pMap[b.priority] - pMap[a.priority]);

      case 'theme':
        const themeA = themes.find(t => t.id === a.themeId)?.name || 'ZZZ'; // Put no theme last
        const themeB = themes.find(t => t.id === b.themeId)?.name || 'ZZZ';
        if (themeA !== themeB) return themeA.localeCompare(themeB) * direction;
        // Secondary sort by due date
        const dA = a.endDate ? new Date(a.endDate).getTime() : new Date(a.startDate).getTime();
        const dB = b.endDate ? new Date(b.endDate).getTime() : new Date(b.startDate).getTime();
        return (dA - dB);

      default:
        return 0;
    }
  });

  const handleSortChange = (field: SortField) => {
    if (sortOption.field === field) {
      setSortOption({ field, direction: sortOption.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortOption({ field, direction: 'desc' });
    }
    setShowSortMenu(false);
  };

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    setTaskToDelete(taskId);
    setTaskToDeleteTitle(taskTitle);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
    }
    setShowConfirm(false);
    setTaskToDelete(null);
    setTaskToDeleteTitle('');
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
    setTaskToDeleteTitle('');
  };

  const getSortLabel = (field: SortField) => {
    switch (field) {
      case 'createdAt': return '默认排序';
      case 'dueDate': return '时间排序';
      case 'category': return '分类排序';
      case 'theme': return '主题排序';
    }
  };

  if (daysTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200"
      >
        <p>今天没有待办事项</p>
        <p className="text-sm mt-1">点击下方 + 号添加</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Sort Control */}
      <div className="flex justify-end relative">
        <button 
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowUpDown size={14} />
          <span>{getSortLabel(sortOption.field)}</span>
          {sortOption.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {showSortMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
            >
              {(['createdAt', 'dueDate', 'category', 'theme'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex justify-between items-center transition-colors ${sortOption.field === field ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                >
                  {getSortLabel(field)}
                  {sortOption.field === field && (
                    sortOption.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => {
            const priorityColor = PRIORITY_COLORS[task.priority];
            const theme = themes.find(t => t.id === task.themeId);
            const category = categories.find(c => c.id === task.categoryId);

            return (
              <motion.div
                key={task.id}
                layout
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={springLayout as any}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                onClick={() => onTaskClick(task.id)}
                style={{
                  borderLeft: `4px solid ${priorityColor}`,
                }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}
                  className={`mr-3 transition-colors ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-300 hover:text-blue-500'}`}
                  style={{ color: task.status === 'completed' ? priorityColor : undefined, opacity: task.status === 'completed' ? 0.5 : 1 }}
                >
                  {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1 min-w-0" style={{ opacity: task.status === 'completed' ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-medium text-gray-800 truncate transition-all ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                    {theme && (
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: theme.color }}
                      >
                        {theme.name}
                      </span>
                    )}
                    {category && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                        <Folder size={8} />
                        {category.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
                     <div className="flex items-center gap-1">
                       <Clock size={12} />
                       <span>{formatTimeRange(task.startDate, task.endDate, task.isAllDay)}</span>
                     </div>
                     {task.repeatRule && task.repeatRule !== 'none' && (
                       <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-1.5 rounded">
                         <Repeat size={10} />
                         <span className="capitalize">{task.repeatRule === 'daily' ? '每天' : task.repeatRule === 'weekly' ? '每周' : task.repeatRule === 'monthly' ? '每月' : '每年'}</span>
                       </div>
                     )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-gray-500 truncate">{task.description}</p>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(task.id, task.title); }}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="删除任务"
        message={`确定要删除任务"${taskToDeleteTitle}"吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
