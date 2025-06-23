import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import TaskInput from '@/components/molecules/TaskInput';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
const [todayTasks, categoriesData] = await Promise.all([
        taskService.getToday(),
        categoryService.getAll()
      ]);
      setTasks(todayTasks);
      setCategories(categoriesData);
    } catch (err) {
      toast.error('Failed to load today\'s tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      // Set due date to today
      const today = new Date().toISOString().split('T')[0];
const newTask = await taskService.create({
        ...taskData,
        dueDate: today
      });
      
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task added to today!');
    } catch (err) {
      toast.error('Failed to add task');
      throw err;
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Today</h1>
            <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex items-center gap-4">
            {totalCount > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</div>
                <div className="text-sm text-gray-600">completed</div>
              </div>
            )}
            <motion.div
              animate={{ rotate: completedCount === totalCount && totalCount > 0 ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <ApperIcon 
                name="Calendar" 
                size={32} 
                className={`${
                  completedCount === totalCount && totalCount > 0 
                    ? 'text-success' 
                    : 'text-primary'
                }`}
              />
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search today's tasks..."
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Add */}
        <TaskInput
          onAddTask={handleAddTask}
          categories={categories}
          placeholder="What needs to be done today?"
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onTaskUpdate={handleTaskUpdate}
          showCompleted={true}
          emptyTitle="No tasks for today"
          emptyDescription="Add some tasks to make today productive!"
        />
      </div>
    </motion.div>
  );
};

export default Today;