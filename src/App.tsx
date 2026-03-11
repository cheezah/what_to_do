import { useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar } from './components/Calendar'
import { TaskList } from './components/TaskList'
import { TaskEditModal } from './components/TaskEditModal'
import { ThemeManager } from './components/ThemeManager'
import { CategoryManager } from './components/CategoryManager'
import { useStore } from './store/useStore'
import { Plus, Palette, Folder } from 'lucide-react'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [showThemeManager, setShowThemeManager] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const addTask = useStore((state) => state.addTask)

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      startDate: currentDate.toISOString(),
      isAllDay: true,
      priority: 'medium',
      status: 'pending',
      subtasks: [],
      repeatRule: 'none',
      reminderTime: 'none',
    });

    setNewTaskTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl overflow-hidden relative">
      {/* Fixed Header */}
      <header className="flex-none px-4 py-4 bg-white border-b border-gray-100 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold text-gray-800">
          What To Do
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Folder size={20} />
          </button>
          <button
            onClick={() => setShowThemeManager(true)}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Palette size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-sm font-medium text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
          >
            今天
          </button>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 pb-4">
          <Calendar selectedDate={currentDate} onSelectDate={setCurrentDate} />

          <div className="mt-6 space-y-3">
            <h2 className="font-semibold text-gray-700 ml-1">
              {format(currentDate, 'M月d日 EEEE', { locale: zhCN })}
            </h2>
            <TaskList
              date={currentDate}
              onTaskClick={setEditingTaskId}
            />
          </div>
        </div>
      </main>

      {/* Fixed Quick Add Bar - Bottom */}
      <div className="flex-none p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="快速添加任务..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleAddTask}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTaskId && (
        <TaskEditModal 
          taskId={editingTaskId} 
          onClose={() => setEditingTaskId(null)} 
        />
      )}

      {/* Theme Manager Modal */}
      {showThemeManager && (
        <ThemeManager onClose={() => setShowThemeManager(false)} />
      )}

      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  )
}

export default App
