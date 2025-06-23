import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const Archive = () => {
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
const [completedTasks, categoriesData] = await Promise.all([
        taskService.getCompleted(),
        categoryService.getAll()
      ]);
      setTasks(completedTasks);
      setCategories(categoriesData);
    } catch (err) {
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.completed) {
      // Task is still completed, update it
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ));
    } else {
      // Task was uncompleted, remove from archive
      setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id));
      toast.success('Task restored!');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearCompleted = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all completed tasks? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete all completed tasks
      await Promise.all(tasks.map(task => taskService.delete(task.Id)));
      setTasks([]);
      toast.success('All completed tasks deleted');
    } catch (err) {
      toast.error('Failed to delete completed tasks');
    }
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tasks by completion date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
const completedDate = format(parseISO(task.created_at), 'yyyy-MM-dd');
const dateKey = format(parseISO(task.created_at), 'MMMM d, yyyy');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    
    return groups;
  }, {});

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
            <h1 className="text-2xl font-heading font-bold text-gray-900">Archive</h1>
            <p className="text-gray-600">
              {tasks.length} completed task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {tasks.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                icon="Trash2"
                onClick={handleClearCompleted}
              >
                Clear All
              </Button>
            )}
            <ApperIcon name="Archive" size={32} className="text-primary" />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search completed tasks..."
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedTasks).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([dateKey, dateTasks]) => (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <ApperIcon name="CheckCircle" size={20} className="text-success" />
                  <h2 className="text-lg font-heading font-semibold text-gray-900">
                    {dateKey}
                  </h2>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {dateTasks.length}
                  </span>
                </div>
                
                <TaskList
                  tasks={dateTasks}
                  onTaskUpdate={handleTaskUpdate}
                  showCompleted={true}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <ApperIcon name="Archive" className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              No completed tasks
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm ? "No completed tasks match your search" : "Complete some tasks to see them here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Archive;