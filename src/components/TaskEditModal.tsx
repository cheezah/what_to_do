import React, { useState, useEffect } from 'react';
import type { Priority, RepeatRule, ReminderTime, SubTask } from '../types';
import { useStore } from '../store/useStore';
import { X, Trash2, Tag, Clock, Repeat, Bell, CheckSquare, Plus, Square, Flag, Folder } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '../utils/animations';
import { formatForInput } from '../utils/timeUtils';

interface TaskEditModalProps {
  taskId: string;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ taskId, onClose }) => {
  const task = useStore((state) => state.tasks.find((t) => t.id === taskId));
  const themes = useStore((state) => state.themes);
  const categories = useStore((state) => state.categories);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const addCategory = useStore((state) => state.addCategory);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [themeId, setThemeId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  
  // New States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeatRule, setRepeatRule] = useState<RepeatRule>('none');
  const [reminderTime, setReminderTime] = useState<ReminderTime>('none');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setThemeId(task.themeId);
      setCategoryId(task.categoryId);
      
      const inputFormat = task.isAllDay ? 'date' : 'datetime';
      setStartDate(formatForInput(task.startDate, inputFormat));
      setEndDate(task.endDate ? formatForInput(task.endDate, inputFormat) : '');
      
      setIsAllDay(task.isAllDay);
      setRepeatRule(task.repeatRule || 'none');
      setReminderTime(task.reminderTime || 'none');
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    updateTask(taskId, {
      title,
      description,
      priority,
      themeId,
      categoryId,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      isAllDay,
      repeatRule,
      reminderTime,
      subtasks,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个任务吗？')) {
      deleteTask(taskId);
      onClose();
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: uuidv4(), title: newSubtaskTitle, completed: false }]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName, '#6366F1'); // Default color
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const priorityColors = {
    low: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    medium: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    high: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };

  const priorityLabels = {
    low: '低优先级',
    medium: '中优先级',
    high: '高优先级',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div 
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-800">编辑事项</h2>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
            
            {/* Title & Description Group */}
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="准备做什么？"
                className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 border-none bg-transparent focus:ring-0 p-0"
              />
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="添加描述..."
                  rows={3}
                  className="w-full text-sm text-gray-600 placeholder-gray-400 bg-gray-50 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>

            {/* Main Settings Group */}
            <div className="space-y-6">
              
              {/* Time Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Clock size={18} className="text-blue-500" />
                    <span>时间设置</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">全天</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAllDay} 
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 ml-1">开始</label>
                    <input
                      type={isAllDay ? "date" : "datetime-local"}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 ml-1">结束</label>
                    <input
                      type={isAllDay ? "date" : "datetime-local"}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Repeat size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      value={repeatRule}
                      onChange={(e) => setRepeatRule(e.target.value as RepeatRule)}
                      className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="none">不重复</option>
                      <option value="daily">每天</option>
                      <option value="weekly">每周</option>
                      <option value="monthly">每月</option>
                      <option value="yearly">每年</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Bell size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value as ReminderTime)}
                      className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="none">无提醒</option>
                      <option value="5m">提前5分钟</option>
                      <option value="15m">提前15分钟</option>
                      <option value="30m">提前30分钟</option>
                      <option value="1h">提前1小时</option>
                      <option value="1d">提前1天</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <CheckSquare size={18} className="text-green-500" />
                    <span>子任务</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {subtasks.filter(t => t.completed).length}/{subtasks.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {subtasks.map((st) => (
                      <motion.div 
                        key={st.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                      >
                        <button 
                          onClick={() => toggleSubtask(st.id)} 
                          className={`flex-shrink-0 transition-colors ${st.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
                        >
                          {st.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                        <span className={`flex-1 text-sm ${st.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {st.title}
                        </span>
                        <button 
                          onClick={() => removeSubtask(st.id)} 
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="text" 
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="添加新步骤..."
                    className="flex-1 h-10 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                  <button 
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-200"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Attributes Section (Priority & Theme & Category) */}
              <div className="grid grid-cols-1 gap-6">
                {/* Priority */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Flag size={18} className="text-orange-500" />
                    <span>优先级</span>
                  </div>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-all ${
                          priority === p 
                            ? `${priorityColors[p]} border-transparent shadow-sm` 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {priorityLabels[p].replace('优先级', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Theme Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Tag size={18} className="text-purple-500" />
                      <span>主题</span>
                    </div>
                    <select
                      value={themeId || ''}
                      onChange={(e) => setThemeId(e.target.value || undefined)}
                      className="w-full h-10 px-3 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="">默认主题</option>
                      {themes.map((theme) => (
                        <option key={theme.id} value={theme.id}>{theme.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Folder size={18} className="text-blue-500" />
                      <span>分类</span>
                    </div>
                    <div className="relative">
                      <select
                        value={categoryId || ''}
                        onChange={(e) => {
                          if (e.target.value === 'new') {
                            setShowAddCategory(true);
                          } else {
                            setCategoryId(e.target.value || undefined);
                          }
                        }}
                        className="w-full h-10 px-3 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        <option value="">未分类</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="new">+ 新建分类...</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add Category Input */}
                <AnimatePresence>
                  {showAddCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="输入新分类名称"
                        className="flex-1 h-10 px-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleCreateCategory}
                        className="h-10 px-4 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => setShowAddCategory(false)}
                        className="h-10 px-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        取消
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 font-medium"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">删除</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
              保存修改
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
