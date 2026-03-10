import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PRIORITY_COLORS } from '../types';
import type { Theme, Priority } from '../types';
import { Plus, X, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '../utils/animations';

interface ThemeManagerProps {
  onClose: () => void;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({ onClose }) => {
  const themes = useStore((state) => state.themes);
  const addTheme = useStore((state) => state.addTheme);
  const updateTheme = useStore((state) => state.updateTheme);
  const deleteTheme = useStore((state) => state.deleteTheme);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [priority, setPriority] = useState<Priority | undefined>(undefined);

  const resetForm = () => {
    setName('');
    setColor('#3B82F6');
    setPriority(undefined);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Check for duplicate names
    const duplicate = themes.find(
      (t) => t.name === name && t.id !== editingId
    );
    if (duplicate) {
      alert('主题名称已存在');
      return;
    }

    if (editingId) {
      updateTheme(editingId, { name, color, associatedPriority: priority });
    } else {
      addTheme({ name, color, associatedPriority: priority });
    }
    resetForm();
  };

  const handleEdit = (theme: Theme) => {
    setName(theme.name);
    setColor(theme.color);
    setPriority(theme.associatedPriority);
    setEditingId(theme.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个主题吗？关联的任务将自动解除绑定。')) {
      deleteTheme(id);
    }
  };

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        <motion.div 
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {isAdding && (
                <button 
                  onClick={resetForm}
                  className="p-1.5 -ml-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-800">{isAdding ? (editingId ? '编辑主题' : '新建主题') : '主题管理'}</h2>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isAdding ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                  {themes.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">暂无自定义主题</p>
                      <p className="text-xs text-gray-300 mt-1">创建主题来分类您的任务</p>
                    </div>
                  )}
                  {themes.map((theme) => (
                    <div key={theme.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: theme.color }}></div>
                        <div>
                          <span className="font-medium text-gray-700">{theme.name}</span>
                          {theme.associatedPriority && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 uppercase tracking-wider">
                              {theme.associatedPriority === 'high' ? 'High' : theme.associatedPriority === 'medium' ? 'Med' : 'Low'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(theme)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(theme.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all font-medium active:scale-[0.98]"
                >
                  <Plus size={20} />
                  新建主题
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">主题名称</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：产品发布"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">颜色标识</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-all shadow-sm ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">关联优先级 (可选)</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(priority === p ? undefined : p)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          priority === p 
                            ? 'bg-gray-800 text-white border-transparent shadow-md' 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[p] }}></span>
                        {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleSubmit} className="w-full py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] font-medium">
                    {editingId ? '保存修改' : '创建主题'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
