import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X, Trash2, ArrowLeft, Archive, ArchiveRestore } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '../utils/animations';
import { ConfirmDialog } from './ConfirmDialog';

interface CategoryManagerProps {
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onClose }) => {
  const categories = useStore((state) => state.categories);
  const addCategory = useStore((state) => state.addCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);
  const archiveCategory = useStore((state) => state.archiveCategory);
  const unarchiveCategory = useStore((state) => state.unarchiveCategory);

  const [isAdding, setIsAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  // Confirm Dialog State
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setColor('#3B82F6');
    setIsAdding(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Check for duplicate names
    const duplicate = categories.find(
      (c) => c.name === name
    );
    if (duplicate) {
      alert('分类名称已存在');
      return;
    }

    addCategory(name, color);
    resetForm();
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
    }
    setShowConfirm(false);
    setCategoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoryToDelete(null);
  };

  const handleArchive = (id: string) => {
    archiveCategory(id);
  };

  const handleUnarchive = (id: string) => {
    unarchiveCategory(id);
  };

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
    '#6B7280', '#9CA3AF'
  ];

  const activeCategories = categories.filter((cat) => !cat.archived);
  const archivedCategories = categories.filter((cat) => cat.archived);

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
              <h2 className="text-xl font-bold text-gray-800">{isAdding ? '新建分类' : '分类管理'}</h2>
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
                {/* Active Categories */}
                <div className="space-y-3 mb-6 max-h-[240px] overflow-y-auto scrollbar-hide">
                  {activeCategories.length === 0 && archivedCategories.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">暂无分类</p>
                    </div>
                  )}
                  {activeCategories.length === 0 && archivedCategories.length > 0 && !showArchived && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">没有未归档的分类</p>
                      <p className="text-xs text-gray-300 mt-1">点击下方"查看已归档"查看归档分类</p>
                    </div>
                  )}
                  {activeCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                        <span className="font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {!cat.isDefault && (
                          <button
                            onClick={() => handleArchive(cat.id)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                            title="归档"
                          >
                            <Archive size={16} />
                          </button>
                        )}
                        {!cat.isDefault && (
                          <button
                            onClick={() => handleDeleteClick(cat.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="删除"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Archived Categories Section */}
                {archivedCategories.length > 0 && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Archive size={16} />
                      {showArchived ? '隐藏已归档' : `查看已归档 (${archivedCategories.length})`}
                    </button>

                    <AnimatePresence>
                      {showArchived && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2 max-h-[150px] overflow-y-auto scrollbar-hide"
                        >
                          {archivedCategories.map((cat) => (
                            <div
                              key={cat.id}
                              className="flex items-center justify-between p-3 bg-gray-100/50 rounded-xl border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full shadow-sm opacity-50" style={{ backgroundColor: cat.color }}></div>
                                <span className="font-medium text-gray-500 line-through">{cat.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">已归档</span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUnarchive(cat.id)}
                                  className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                  title="取消归档"
                                >
                                  <ArchiveRestore size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(cat.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                  title="删除"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all font-medium active:scale-[0.98]"
                >
                  <Plus size={20} />
                  新建分类
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">分类名称</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：工作"
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

                <div className="pt-4">
                  <button onClick={handleSubmit} className="w-full py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] font-medium">
                    创建分类
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="删除分类"
        message="确定要删除这个分类吗？关联的任务将自动解除分类绑定。"
        confirmText="删除"
        cancelText="取消"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </AnimatePresence>
  );
};
