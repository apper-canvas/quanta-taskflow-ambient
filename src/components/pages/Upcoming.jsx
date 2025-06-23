import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isThisWeek, isToday, isTomorrow } from 'date-fns';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import TaskInput from '@/components/molecules/TaskInput';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const Upcoming = () => {
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
const [upcomingTasks, categoriesData] = await Promise.all([
        taskService.getUpcoming(),
        categoryService.getAll()
      ]);
      setTasks(upcomingTasks);
      setCategories(categoriesData);
    } catch (err) {
      toast.error('Failed to load upcoming tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      // Set due date to tomorrow if not specified
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
const newTask = await taskService.create({
        ...taskData,
        dueDate: taskData.dueDate || tomorrowStr
      });
      
      // Only add to list if it's actually upcoming
if (newTask.due_date && new Date(newTask.due_date) > new Date()) {
        setTasks(prev => [newTask, ...prev]);
      }
      
      toast.success('Task added!');
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

  // Filter and group tasks
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tasks by time period
  const groupedTasks = filteredTasks.reduce((groups, task) => {
if (!task.due_date) {
      groups.later = groups.later || [];
      groups.later.push(task);
      return groups;
    }

const dueDate = parseISO(task.due_date);
    
    if (isTomorrow(dueDate)) {
      groups.tomorrow = groups.tomorrow || [];
      groups.tomorrow.push(task);
    } else if (isThisWeek(dueDate)) {
      groups.thisWeek = groups.thisWeek || [];
      groups.thisWeek.push(task);
    } else {
      groups.later = groups.later || [];
      groups.later.push(task);
    }
    
    return groups;
  }, {});

  const getGroupTitle = (key) => {
    switch (key) {
      case 'tomorrow': return 'Tomorrow';
      case 'thisWeek': return 'This Week';
      case 'later': return 'Later';
      default: return 'Upcoming';
    }
  };

  const getGroupIcon = (key) => {
    switch (key) {
      case 'tomorrow': return 'Sun';
      case 'thisWeek': return 'Calendar';
      case 'later': return 'Clock';
      default: return 'Clock';
    }
  };

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
            <h1 className="text-2xl font-heading font-bold text-gray-900">Upcoming</h1>
            <p className="text-gray-600">
              {tasks.length} upcoming task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ApperIcon name="Clock" size={32} className="text-primary" />
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search upcoming tasks..."
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Add */}
        <TaskInput
          onAddTask={handleAddTask}
          categories={categories}
          placeholder="Plan something for later..."
        />

        {/* Grouped Tasks */}
        {Object.keys(groupedTasks).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([key, groupTasks]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <ApperIcon name={getGroupIcon(key)} size={20} className="text-primary" />
                  <h2 className="text-lg font-heading font-semibold text-gray-900">
                    {getGroupTitle(key)}
                  </h2>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {groupTasks.length}
                  </span>
                </div>
                
                <TaskList
                  tasks={groupTasks}
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
                y: [0, -10, 0],
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <ApperIcon name="Calendar" className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              No upcoming tasks
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm ? "No tasks match your search" : "All caught up! Plan ahead by adding some future tasks."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Upcoming;